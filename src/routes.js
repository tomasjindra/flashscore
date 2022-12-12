import { Dataset, createPlaywrightRouter } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`Enqueueing URLs for chosen sports`);
    await enqueueLinks({
        selector: "a.menuTop__item",
        label: "sport"
    });
});

router.addHandler('sport', async ({ request, page, log, enqueueLinks }) => {

    //testing only soccer or basketball
    if (request.url.includes("basketball") || request.url.includes("soccer")) {

        const title = await page.title();
        log.info(`Collecting leagues from ${title}`, { url: request.loadedUrl });

        await page.waitForSelector("#my-leagues-list")
        let leagueElements = await page.$$("#my-leagues-list a") || null
        let leagueURLs = []

        for (let index = 0; index < leagueElements.length; index++) {
            let leagueHref = await leagueElements[index].getAttribute("href")
            let leagueURL = `https://www.livesport.com/${leagueHref}results`
            leagueURLs.push(leagueURL)
        }

        log.info(`To be crawled URLs of leagues: ${leagueURLs}`);
let _leagueURLs = ["https://www.livesport.com/en/soccer/england/premier-league/results/"]
        await enqueueLinks({
            label: "league",
            urls: _leagueURLs
        });
    }
}
);

router.addHandler('league', async ({ request, page, log, enqueueLinks }) => {

    const title = await page.title();

    //TODO - is this right way how dynamic number of Show more matches buttons should be handled?
    while (await page.locator('a:has-text("Show more matches")').isVisible() == true) {
        await page.locator('a:has-text("Show more matches")').click()

        //TODO - this can be improved - last loop need to wait a bit for Show more button to not be in state visible
        await page.waitForTimeout(2000)
    }

    let matchURLs = []
    let matchesElements = await page.$$("[id^='g_']") || null

    for (let index = 0; index < matchesElements.length; index++) {
        let matchId = await matchesElements[index].getAttribute("id")
        let adjustedMatchId = matchId.slice(4, matchId.length);
        matchURLs.push(`https://www.livesport.com/en/match/${adjustedMatchId}/#/match-summary/match-statistics/0`)
    }

    log.info(`Enqueueing ${matchURLs.length} matches URLs for ${title}`)


    await enqueueLinks({
        label: "match",
        urls: matchURLs
    });
}
);


router.addHandler('match', async ({ request, page, log }) => {

    const title = await page.title();
    log.info(`Collecting info from match: ${title}`, { url: request.loadedUrl });

    let results = {
        URL:request.loadedUrl,
        country: await (await page.locator("span.tournamentHeader__country")?.textContent()).replace(/\:.*$/, "") || null,
        league: await page.locator("span.tournamentHeader__country a")?.textContent() || null,
        matchTime: await page.locator(".duelParticipant__startTime")?.textContent() || null,
        matchState: await page.locator(".fixedHeaderDuel__detailStatus")?.first().textContent() || "Not started",
        homeTeamName: await page.locator(".duelParticipant__home")?.textContent() || null,
        awayTeamName: await page.locator(".duelParticipant__away")?.textContent() || null,
        homeTeamScore: await page.locator("div.detailScore__matchInfo div.detailScore__wrapper span")?.first().textContent() || null,
        awayTeamScore: await page.locator("div.detailScore__matchInfo div.detailScore__wrapper span")?.last().textContent() || null,

    }

    if (request.loadedUrl.includes("statistics")) {
        
        await page.waitForSelector(".stat__category")
         
        const statCategories = await page.$$(".stat__categoryName")
        const homeTeamStatValues = await page.$$(".stat__homeValue")
        const awayTeamStatValues = await page.$$(".stat__awayValue")

        const statistics = []
        //TODO is it save to collect the stats like this?
        for (let index = 0; index < statCategories.length; index++) {
            statistics.push(
                {
                    [`${await statCategories[index].textContent()}`]:
                    {
                        homeTeamValue: await homeTeamStatValues[index].textContent(),
                        awayTeamValue: await awayTeamStatValues[index].textContent()
                    }
                }
            )
        }
        results ={...results, statistics}
    }
   
    await Dataset.pushData(results)
    
});






