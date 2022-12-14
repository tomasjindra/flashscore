import { createPlaywrightRouter } from 'crawlee';
import { Actor } from 'apify';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ request, page, log, enqueueLinks }) => {
    const title = await page.title();

    log.info(`Processing input URL: ${title}`, { url: request.loadedUrl });

    //TODO - is this right way how dynamic number of Show more matches buttons should be handled?
    while (await page.locator('a:has-text("Show more matches")').isVisible() == true) {
        await page.locator('a:has-text("Show more matches")').click()

        //TODO - this can be improved - last loop need to wait a bit for Show more button to not be in state visible
        await page.waitForTimeout(2000)
    }

    let matchURLs = []
    let matchesElements = await page.$$("[id^='g_']") || null

    for (let index = 0; index < matchesElements.length; index++) {
        let g_MatchId = await matchesElements[index].getAttribute("id")
        let matchId = g_MatchId.slice(4, g_MatchId.length);
        matchURLs.push(`https://www.livesport.com/en/match/${matchId}/#/match-summary/match-summary`)
        //matchURLs.push(`https://www.livesport.com/en/match/${matchId}/#/match-summary/match-statistics/0`)
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
        URL: request.loadedUrl,
        sport: await page.locator("span.tournamentHeader__sportNav title")?.textContent() || null,
        region: await (await page.locator("span.tournamentHeader__country")?.textContent()).replace(/\:.*$/, "") || null,
        league: await page.locator("span.tournamentHeader__country a")?.textContent() || null,
        matchTime: await page.locator(".duelParticipant__startTime")?.textContent() || null,
        matchState: await page.locator(".fixedHeaderDuel__detailStatus")?.first().textContent() || "Not started",
        homeTeamName: await page.locator(".duelParticipant__home a.participant__participantName")?.textContent() || null,
        awayTeamName: await page.locator(".duelParticipant__away a.participant__participantName")?.textContent() || null,
        homeTeamScore: await page.locator("div.detailScore__matchInfo div.detailScore__wrapper span")?.first().textContent() || null,
        awayTeamScore: await page.locator("div.detailScore__matchInfo div.detailScore__wrapper span")?.last().textContent() || null,

    }
    //if (request.loadedUrl.includes("statistics")) {
    if (await page.locator('a:has-text("Stats")').isVisible({ timeout: 2000 }) == true) {
        await page.locator('a:has-text("Stats")').click()
        await page.waitForSelector(".stat__category")

        const statCategories = await page.$$(".stat__categoryName")
        const homeTeamStatValues = await page.$$(".stat__homeValue")
        const awayTeamStatValues = await page.$$(".stat__awayValue")

        const statistics = []
        //TODO is it save to collect the stats like this?
        for (let index = 0; index < statCategories.length; index++) {
            results[`${await statCategories[index].textContent()}`] =
            {
                homeTeamValue: await homeTeamStatValues[index].textContent(),
                awayTeamValue: await awayTeamStatValues[index].textContent()
            }
        }
    }

    await Actor.pushData(results)

});






