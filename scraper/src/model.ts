export type Entry = {
    id: string, // <SEASON>:<EPISODE>:<ENTRY>
    text: string, // what was said
    character: string, // character who speaks
    responseTo?: number, // entry that this was in response to
    context?: number // context id of this entry
}