export default {
    index: "../index/",
    webIndex: "https://clinic-duty.livejournal.com/12225.html",
    vectors: "../vectors.ndjson",
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
    specialCasedEps: [
        [1, 22],
        [5, 15]
    ],
    selectors: {
        seasons: "html > body > div.pageblock >  div.bodyblock > table > tbody > tr > td:nth-child(2) > div.entryHolder > table > tbody > tr > td:nth-child(2) > div.entryText > table > tbody > tr:nth-child(2) > td",
        transcript: "html > body > div.pageblock > div.bodyblock > table > tbody > tr > td:nth-child(2) > div.entryHolder > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.entryText"
    }
} as const