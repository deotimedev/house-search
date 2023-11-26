import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import _ from "lodash";

export async function load(req: RequestEvent): Promise<{ ids: string[] }> {
    const env = req.platform?.env
    if (!env) throw error(500, "Environment is not set up.")
    const vectorize = env.VECTORIZE_INDEX
    const count = (await vectorize.describe()).vectorsCount
    const ids = [...Array(count).keys()].map(n => `${n + 1}`)
    for (const chunk of _.chunk(ids, 20)) {
        await vectorize.deleteByIds(chunk)
    }
    return {
        ids
    }
}