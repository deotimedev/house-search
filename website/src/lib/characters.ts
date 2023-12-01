export default {
    format: (character: string) => character.trim().replace(/^"(.*)"$/, '$1').replaceAll("13", "THIRTEEN")
}