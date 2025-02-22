export default {
    index: "../index/",
    webIndex: "https://clinic-duty.livejournal.com/12225.html",
    embeddingBatchSize: 100,
    uploadBatchSize: 1000,
    knownEntryAmount: 79721,
    maxUploadRetry: 3,
    indexName: "transcripts-index2",
    excludedStartingLines: [
        "transcribed",
        "disclaimer",
        "betaed by:",
        "beta'ed by",
        "thank you to",
        "spanish translations",
        ") & ",
        ") and ",
        "& jenna",
        "fade in",
        "house, md",
        "3x15", // wtf
        "just to recap",
        "ext. -",
        "recap.",
        "to all jewish house-fans", // ??
        "number name sex description",
        "------"
    ],
    parseIgnore: [
        "OPENING CREDITS",
        "[OPENING CREDITS]",
        "CUT TO",
        "ROLL CREDITS",
        "(ROLL CREDITS)",
        "CREDIT ROLLS",
        "CUE MUSIC",
        "TA DA",
        "NEW CREDIT ROLLS",
        "[ACT ",
        "[END OF ACT ",
        "[END]",
        "[END OF TEASER]",
        "__________________________DOB____",
        "BACK TO SCENE",
        "INT. -",
        "DOC - B & W",
        "SERIES OF SHOTS",
        "OR CONTROL ROOM",
        "♪♫"
    ],
    specialCasedEps: [
        [1, 22],
        [5, 15]
    ],
    selectors: {
        seasons: "html > body > div.pageblock >  div.bodyblock > table > tbody > tr > td:nth-child(2) > div.entryHolder > table > tbody > tr > td:nth-child(2) > div.entryText > table > tbody > tr:nth-child(2) > td",
        transcript: "html > body > div.pageblock > div.bodyblock > table > tbody > tr > td:nth-child(2) > div.entryHolder > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.entryText"
    }
} as const