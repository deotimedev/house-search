// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import {Ai} from "@cloudflare/ai";
import {VectorizeIndex} from "@cloudflare/workers-types"

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}

		// interface Platform {}
		interface Platform {
			env?: {
				CLOUDFLARE_ACCOUNT_ID: string,
				CLOUDFLARE_API_KEY: string,
				LOGGING_URL: string | undefined,
				AI: Ai,
				VECTORIZE_INDEX: VectorizeIndex
			}
		}
	}
}

export {};
