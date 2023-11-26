import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

export async function GET(req: RequestEvent) {
    async function attempt() {
        const env = req.platform?.env
        if (!env) return {
            success: false,
            message: "Environment not set up."
        }
        try {
            const details = await env.VECTORIZE_INDEX.describe()
            return {
                success: true,
                details
            }
        } catch (error) {
            return {
                success: false,
                error
            }
        }
    }
    return Response.json(await attempt())
}