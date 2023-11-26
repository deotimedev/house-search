import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

export async function GET(req: RequestEvent) {
    const env = req.platform?.env
    if (!env) throw error(500, "Environment is not set up.")
    return Response.json({
        vectorCount: (await env.VECTORIZE_INDEX.describe()).vectorsCount,
        first: (await env.VECTORIZE_INDEX.getByIds(["0"])).map(v => v.metadata)
    })
}