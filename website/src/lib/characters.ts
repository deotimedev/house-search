export default {
    format: (character: string) => character.trim().toUpperCase().replace(/^"(.*)"$/, '$1')
        .replaceAll("13", "THIRTEEN")
        .replaceAll("VOLAKIS", "AMBER")
}