import constants from "./constants"
import {checkExists, zip} from "./utils"
import * as cheerio from "cheerio";
import * as fs from "fs/promises";
import path from "path";
import TagElement = cheerio.TagElement;

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
    if (!await checkExists(dir)) await fs.mkdir(dir, { recursive: true })
    const p = path.join(dir, `${episode}`)
    await fs.writeFile(p, transcript)
}

async function indexSeason(season: number, data: cheerio.TagElement) {
    const $ = cheerio.load(data)
    console.log()
    console.log(`Season ${season}:`)
    console.log("-----------------------------")
    for (const [b, a] of zip($("b").toArray(), $("a").toArray())) {
        const episode = Number((b as TagElement).firstChild!.data!.split(".")[1])
        const link = (a as TagElement).attribs["href"]
        await indexEpisode(season, episode, link)
    }
    console.log("-----------------------------")
}

async function createEmbedding(text: string): Promise<number[]> {
    const model = "@cf/baai/bge-small-en-v1.5"
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`, {
        method: "POST",
        headers: {Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`},
        body: JSON.stringify({text})
    })
    const vectors = (await response.json()).result.data[0] as number[]
    return vectors
    // const data = JSON.stringify({
    //     id: "1",
    //     values: vectors,
    //     metadata: {
    //         hello: "world"
    //     }
    // })
    // const dir = path.join(__dirname, "data")
    // await fs.mkdir(dir, { recursive: true })
    // await fs.writeFile(path.join(dir, "vectors.ndjson"), data)
}

async function main() {

    // await createEmbedding("hello there fellows")
    if (!await checkExists(path.join(__dirname, constants.index))) {
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