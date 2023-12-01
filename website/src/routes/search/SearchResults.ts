import type {model} from "@house-search/utils"

export type ScoredEntry = {
    id: string,
    score: number,
    replyingTo?: model.Entry
} & model.Entry