import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import * as utils from "@house-search/utils"
import _ from "lodash";

export async function GET(req: RequestEvent) {
    const env = req.platform?.env
    if (!env) throw error(500, "Environment is not set up.")
    const search = req.url.searchParams.get("q")
    if (!search) throw error(400, "Missing search query")
    const namespace = req.url.searchParams.get("namespace") ?? undefined
    const embedding = await utils.ai.createEmbedding(search, {
        cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
        cloudflareApiKey: env.CLOUDFLARE_API_KEY
    })
    const matches = _.keyBy((await env.VECTORIZE_INDEX.query(embedding, {
        topK: 3,
        namespace
    })).matches, (m) => m.vectorId)
    if (!matches) return Response.json("No matches found")
    const vectors = await env.VECTORIZE_INDEX.getByIds(Object.keys(matches))
    const ranked = _.sortBy(vectors, (v) => matches[v.id].score).reverse()
    {
        console.log("-----------------")
        console.log(`Search: ${search}`)
        console.log("Top results: ")
        ranked.forEach(v => {
            const score = Math.round(matches[v.id].score * 100)
            console.log(` - ${score}%: ${v.metadata!.text}`)
        })
        console.log("-----------------")
    }
    return Response.json(ranked.map(v => v.metadata))
}