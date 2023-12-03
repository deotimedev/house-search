import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { model, ai, logging } from "@house-search/utils";
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

    if (env.LOGGING_URL) {
        const log = `
-----------------
Search: ${search}
Top results: 
${_.join(vectors.map(v => {
            const score = Math.round(matches[v.id].score * 100)
            return ` - ${score}%: ${v.metadata!.text}`
        }), "\n")}
-----------------
        `
        await logging.send(env.LOGGING_URL, {
            content: "```" + log + "```"
        })
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