import constants from "./constants"
import * as cheerio from "cheerio";
import * as fs from "fs/promises";
import * as fs_sync from "fs";
// @ts-ignore
import path from "path";
import * as utils from "@house-search/utils"
import {PathLike} from "fs";
import {Entry} from "./model";
import * as progress from "cli-progress"
import * as inquirer from "@inquirer/prompts"
// @ts-ignore
import chalk from "chalk"
import TagElement = cheerio.TagElement;
import * as rl from "readline"

async function checkExists(path: PathLike): Promise<boolean> {
    return fs.access(path)
        .then(() => true)
        .catch(() => false)
}

async function indexEpisode(season: number, episode: number, link: string) {
    const page = await fetch(link)
    const $ = cheerio.load(await page.text())
    const lines = $(constants.selectors.transcript)
        .contents()
        .toArray()
        .filter((e) => e.type == "text")
        .map((e) => e.data)
        .filter((e): e is string => e !== undefined)
        .slice(4) // cut off the first 4 intro lines we dont need

    const specialCased = constants.specialCasedEps.some(([s, e]) => season === s && episode === e)
    while (lines[0] == " " || lines[0] === ")" || lines[0] === " )" || (!specialCased && constants.excludedStartingLines.some((s) => lines[0].toLowerCase().includes(s)))) lines.shift()

    const transcript = lines.join("\n")
    console.log(`${episode}: ${lines[0]}`)
    const dir = path.join(__dirname, constants.index, `${season}`)
    if (!await checkExists(dir)) await fs.mkdir(dir, {recursive: true})
    const p = path.join(dir, `${episode}`)
    await fs.writeFile(p, transcript)
}

async function indexSeason(season: number, data: cheerio.TagElement) {
    const $ = cheerio.load(data)
    console.log()
    console.log(`Season ${season}:`)
    console.log("-----------------------------")
    for (const [b, a] of utils.zip($("b").toArray(), $("a").toArray())) {
        const episode = Number((b as TagElement).firstChild!.data!.split(".")[1])
        const link = (a as TagElement).attribs["href"]
        await indexEpisode(season, episode, link)
    }
    console.log("---------------js che--------------")
}

function createBar(
    name: string,
    total: number,
    fps = 10,
    etaBuffer = 10
): progress.Bar {
    const bar = new progress.Bar({
        format: `${chalk.yellow.bold(name)} | ${chalk.blue("{bar}")} | {percentage}% || {value}/{total} completed | Time remaining: ${chalk.cyan("{eta_formatted}")}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        etaAsynchronousUpdate: true,
        fps,
        etaBuffer,
        gracefulExit: true
    })
    bar.start(total, 0)
    return bar
}

async function exportIndexesToVectors() {
    const indexes = path.join(__dirname, constants.index)
    const vectors = path.join(__dirname, "../", config.vectorOutput)

    const numerical = (a: string, b: string) => Number(a) - Number(b)
    const entries: Entry[] = []
    const parseBar = createBar("Parsing Indexes", constants.knownEntryAmount)
    for (const season of (await fs.readdir(indexes)).sort(numerical)) {
        for (const episode of (await fs.readdir(path.join(indexes, season))).sort(numerical)) {
            const lines = (await fs.readFile(path.join(indexes, season, episode))).toString().split("\n")
            let context: string | undefined = undefined
            let i = 0
            for (let line of lines) {
                if (constants.parseIgnore.some(i => line.startsWith(i))) continue
                if (line.startsWith("[") && line.endsWith("]")) {
                    context = line
                    continue
                }

                let character = line.split(":")[0] ?? "Unknown"

                // some eps have inconsistent character naming (`GREG HOUSE` instead of `House`)
                const names = character.split(" ")
                if (names.length == 2 && utils.isUppercase(character) && isNaN(Number(names[1]))) {
                    const newName = utils.capitalize(names[1].toLowerCase())
                    line = line.replace(character, newName)
                    character = newName
                }
                const entry: Entry = {
                    text: line,
                    ep: {
                        season: Number(season),
                        number: Number(episode)
                    },
                    character,
                    responseTo: i == 0 ? undefined : entries.length - 1,
                    context
                }
                entries.push(entry)
                i++
                parseBar.increment()
            }
        }
    }
    parseBar.stop()
    const embedBar = createBar("Creating Vectors", entries.length, 1, 100)
    await fs.writeFile(vectors, "")
    let id = 0
    for (const chunk of utils.chunked(entries, constants.embeddingBatchSize)) {
        const embeddings = await utils.ai.createEmbedding(chunk.map(e => e.text), {
            model: config.model,
            cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
            cloudflareApiKey: process.env.CLOUDFLARE_API_KEY!
        })
        const data = utils.zip(chunk, embeddings)
            .map(([entry, values], i) => JSON.stringify({
                id: `${id + i}`,
                values,
                metadata: entry,
                namespace: `${entry.ep.season}:${entry.ep.number}`
            }))
        const joined = data.join("\n")
        // append to a file in order to avoid OOM error
        await fs.appendFile(vectors, id === 0 ? joined : `\n${joined}`)
        id += chunk.length
        embedBar.update(id)
    }
    embedBar.stop()
    console.log(chalk.green.bold("Successfully exported vectors."))
    await uploadVectors(vectors)
}

async function uploadVectors(path: string) {
    const stream = fs_sync.createReadStream(path)
    const reader = rl.createInterface({ input: stream })

    async function* batches() {
        let batch: string[] = []
        for await (const line of reader) {
            if (batch.push(line) >= constants.uploadBatchSize) {
                yield batch
                batch = []
            }
        }
        yield batch
    }

    const bar = createBar("Uploading Vectors", constants.knownEntryAmount, 1, 3)
    for await (const batch of batches()) {
        let tries = 0
        const formData = new FormData()
        const blob = new Blob([batch.join("\n")], {
            type: "application/x-ndjson"
        })
        formData.append("vectors", blob, "vectors.ndjson")
        async function request(): Promise<boolean> {
            const response =  await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes/${constants.indexName}/upsert`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}` },
                body: formData
            })
            const json = await response.json()
            if (json.success === false) {
                if (tries >= constants.maxUploadRetry) {
                    console.log(chalk.red("\nReached upload retry limit, stopping uploads."))
                    return false
                } else {
                    console.log(chalk.bgYellow(`\nFailed to upload vectors: ${JSON.stringify(json)}`))
                    return await request()
                }
            } else {
                bar.increment(batch.length)
                return true
            }
        }
        if (!await request()) break
    }
    bar.stop()
    console.log(chalk.green.bold("Successfully uploaded vectors."))
}

async function main() {

    if (!await checkExists(path.join(__dirname, constants.index))) {
        console.log("Indexes not already made, creating them now...")
        const page = await fetch(constants.webIndex)
        const $ = cheerio.load(await page.text())
        $(constants.selectors.seasons)
            .toArray()
            .slice(0, -1)
            .map((e, i) => indexSeason(i + 1, e as TagElement))
    }
    await exportIndexesToVectors()

}

require("dotenv").config()

type Config = {
    vectorOutput: string,
    model: string
}

let config: Config
(async () => {
    config = {
        vectorOutput: await inquirer.input({
            message: "Vector output file",
            default: "vectors.ndjson"
        }),
        model: await inquirer.input({
            message: "Embedding model",
            default: "@cf/baai/bge-base-en-v1.5"
        })
    }
    await main()
})()
