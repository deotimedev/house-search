import type {RequestEvent} from "@sveltejs/kit";

export async function load(req: RequestEvent): Promise<{ thing: string }> {
    console.log(`platform: ${req.platform?.env?.AI}`)
    return {
        thing: req.url.host
    }
}