export type Entry = {
    text: string, // what was said
    character: string, // character who speaks
    responseTo?: number, // entry that this was in response to
    context?: string // context of this entry
}