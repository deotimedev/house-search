import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { model, ai } from "@house-search/utils";
import _ from "lodash";
import type { ScoredEntry } from "./SearchResults"

export async function GET(req: RequestEvent) {
    const env = req.platform?.env
    if (!env) throw error(500, "Environment is not set up.")
    const search = req.url.searchParams.get("q")
    if (!search) throw error(400, "Missing search query")
    const vectorize = env.VECTORIZE_INDEX
    const namespace = req.url.searchParams.get("namespace") ?? undefined
    const embedding = await ai.createEmbedding(search, {
        cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
        cloudflareApiKey: env.CLOUDFLARE_API_KEY
    })
    const matches = _.keyBy((await vectorize.query(embedding, {
        topK: 10,
        namespace
    })).matches, (m) => m.vectorId)
    if (!matches) return Response.json("No matches found")
    const vectors = await vectorize.getByIds(Object.keys(matches))
    const previousQuotes = _(await vectorize.getByIds(_(vectors)
        .map(v => v.metadata!.responseTo as string | undefined)
        .compact()
        .value()))
        .keyBy(v => v.id)
        .value()

    {
        console.log("-----------------")
        console.log(`Search: ${search}`)
        console.log("Top results: ")
        vectors.forEach(v => {
            const score = Math.round(matches[v.id].score * 100)
            console.log(` - ${score}%: ${v.metadata!.text}`)
        })
        console.log("-----------------")
    }

    return Response.json(
        vectors.map(v => {
            const entry = v.metadata as model.Entry
            const replyingTo = entry.responseTo ? previousQuotes[entry.responseTo] : undefined
            return {
                id: v.id,
                score: matches[v.id].score,
                replyingTo: replyingTo?.metadata as model.Entry | undefined,
                ...entry
            }
        }) satisfies ScoredEntry[]
    )
}