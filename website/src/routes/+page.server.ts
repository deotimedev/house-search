import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

export type VectorizeInfo = {
    size: number
}

// export async function load(req: RequestEvent): Promise<VectorizeInfo> {
//     const env = req.platform?.env
//     if (!env) throw error(500, "Environment is not set up.")
//     return {
//         size: (await env.VECTORIZE_INDEX.describe()).vectorsCount
//     }
// }