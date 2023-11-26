export type Entry = {
    text: string, // what was said
    ep: Episode,
    character: string, // character who speaks
    responseTo?: number, // entry that this was in response to
    context?: string // context of this entry
}

export type Episode = {
    season: number,
    number: number
}