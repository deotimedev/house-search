// import type {RequestEvent} from "@sveltejs/kit";
// import {error, redirect} from "@sveltejs/kit";
// import _ from "lodash";

// // this is the funniest function ever
// // actually makes me sad for this to exist because so much damn context gets lost due to stupid things that i fixed
// // i MIGHT re-upload eventually if i find a good reason to but for now like half of all context gets lost
// export async function GET(req: RequestEvent) {
//     const current = Number(req.url.searchParams.get("i") ?? "30480")
//     const env = req.platform?.env
//     if (!env) throw error(500, "Environment is not set up.")
//     const vectorize = env.VECTORIZE_INDEX
//     const count = 79721
//     const ids = [...Array(count).keys()].map(n => `${n + 1}`).slice(current)
//     let searched = current
//     for (const [chunk, i] of _.chunk(ids, 20).map((c, i) => [c, i] as const)) {
//         const vectors = await vectorize.getByIds(chunk)
//         const invalid =
//             vectors
//                 .filter(v => v.metadata!.text === v.metadata!.character)
//         const invalidIds = invalid.map(v => v.id)
//         await vectorize.deleteByIds(invalidIds)
//         searched += chunk.length
//         console.log(`(${searched}) deleted [${invalid.map(v => "\"" + v.metadata!.text + "\"")}]`)
//         if (i >= 100) throw redirect(302, `/fix?i=${searched}`)
//     }
//     return Response.json(`Fixed ${searched} vectors`)
// }