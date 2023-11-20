import constants from "./constants"
import { zip } from "./utils"
import * as cheerio from "cheerio";
import TagElement = cheerio.TagElement;

async function processEpisode(season: number, episode: number, link: string) {
   const page = await fetch(link)
   const $ = cheerio.load(await page.text())
   const transcript = $(constants.selectors.transcript)
       .contents()
       .toArray()
       .filter((e) => e.type == "text")
       .map((e) => e.data)
       .slice(4)
       .join("\n")
   console.log(`Transcript: \n${transcript}`)
}

// async function processSeason(season: number, data: cheerio.TagElement) {
//    const $ = cheerio.load(data)
//    console.log()
//    console.log(`Season ${season}:`)
//    console.log("-----------------------------")
//    for (const [b, a] of zip($("b").toArray(), $("a").toArray())) {
//       const episode = Number((b as TagElement).firstChild!.data!.split(".")[1])
//       const link = (a as TagElement).attribs["href"]
//       await processEpisode(season, episode, link)
//       break
//    }
//    console.log("-----------------------------")
// }
//
// async function main() {
//    const page = await fetch(constants.index)
//    const $ = cheerio.load(await page.text())
//    $(constants.selectors.seasons)
//        .toArray()
//        .slice(0, -1)
//        .slice(0, 1)
//        .map((e, i) => processSeason(i + 1, e as TagElement))
// }

async function main() {
   await processEpisode(1, 1, "https://clinic-duty.livejournal.com/385.html")
}

void main()