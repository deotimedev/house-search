// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import {Ai} from "@cloudflare/ai";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Platform {
			env?: {
				AI: Ai,
				VECTORIZE_INDEX: VectorizeIndex
			}
		}
	}
}

export {};
