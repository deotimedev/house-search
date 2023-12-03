export default {

    // ideally this would be done in the parsing phase but it takes a lot of effort
    // to regenerate all the embeddings and reupload so just doing it here
    format: (character: string) => character.trim().toUpperCase().replace(/^"(.*)"$/, '$1')
        .replaceAll("13", "THIRTEEN")
        .replaceAll("HADLEY", "THIRTEEN")
        .replaceAll("VOLAKIS", "AMBER")
        .replaceAll("WARNER", "STACY")

}