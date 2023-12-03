import type {model} from "@house-search/shared"

export type ScoredEntry = {
    id: string,
    score: number,
    replyingTo?: model.Entry
} & model.Entry