import constants from "./constants"
import * as cheerio from "cheerio";
import * as fs from "fs/promises";
// @ts-ignore
import path from "path";
import TagElement = cheerio.TagElement;
import * as utils from "@house-search/utils"

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
    if (!await utils.checkExists(dir)) await fs.mkdir(dir, { recursive: true })
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

async function main() {

    if (!await utils.checkExists(path.join(__dirname, constants.index))) {
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