import type {model} from "@house-search/utils"

// idk why i didnt just do this in entry
export type ScoredEntry = {
    id: string,
    score: number,
    replyingTo?: model.Entry
} & model.Entry