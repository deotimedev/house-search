export default {
    index: "https://clinic-duty.livejournal.com/12225.html",
    selectors: {
        seasons: "html > body > div.pageblock >  div.bodyblock > table > tbody > tr > td:nth-child(2) > div.entryHolder > table > tbody > tr > td:nth-child(2) > div.entryText > table > tbody > tr:nth-child(2) > td",
        transcript: "html > body > div.pageblock > div.bodyblock > table > tbody > tr > td:nth-child(2) > div.entryHolder > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.entryText"
    }
} as const