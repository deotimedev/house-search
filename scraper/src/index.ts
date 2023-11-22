import constants from "./constants"
import * as cheerio from "cheerio";
import * as fs from "fs/promises";
// @ts-ignore
import path from "path";
import * as utils from "@house-search/utils"
import {PathLike} from "fs";
import {Entry} from "./model";
import TagElement = cheerio.TagElement;

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
    console.log("-----------------------------")
}

async function exportIndexesToVectors() {
    const indexes = path.join(__dirname, constants.index)
    const vectors = path.join(__dirname, constants.vectors)
    const numerical = (a: string, b: string) => Number(a) - Number(b)
    const entries: Entry[] = []
    for (const season of (await fs.readdir(indexes)).sort(numerical)) {
        for (const episode of (await fs.readdir(path.join(indexes, season))).sort(numerical)) {
            const lines = (await fs.readFile(path.join(indexes, season, episode))).toString().split("\n")
            let context: string | undefined = undefined
            let i = 0
            for (const line of lines) {
                if (line.includes("[") && line.includes("]")) {
                    context = line
                    continue
                }

                const character = line.split(":")[0] ?? "Unknown"
                const entry: Entry = {
                    text: line,
                    character,
                    responseTo: i == 0 ? undefined : entries.length,
                    context
                }
                entries.push(entry)
                i++
            }
        }
    }
    const data: string[] = []
    let id = 1
    for (const chunk of utils.chunked(entries, constants.embeddingBatchSize)) {
        const embeddings = await utils.ai.createEmbedding(chunk.map(e => e.text), {
            cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
            cloudflareApiKey: process.env.CLOUDFLARE_API_KEY!
        })
        data.push(...utils.zip(chunk, embeddings)
            .map(([entry, values], i) => JSON.stringify({
                id: `${id + i}`,
                values,
                metadata: entry
            })))
        id += chunk.length
        if (id > 300) break
    }
    await fs.writeFile(vectors, data.join("\n"))
}

async function main() {

    await exportIndexesToVectors()
    return
    if (!await checkExists(path.join(__dirname, constants.index))) {
        console.log("Building indexes...")
        const page = await fetch(constants.webIndex)
        const $ = cheerio.load(await page.text())
        $(constants.selectors.seasons)
            .toArray()
            .slice(0, -1)
            .map((e, i) => indexSeason(i + 1, e as TagElement))
    }


}

require("dotenv").config()
void main()