import { createPlaywrightRouter, playwrightUtils } from 'crawlee';
import { Actor } from 'apify';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ request, page, log, enqueueLinks }) => {

    const title = await page.title();
    log.info(`Processing input URL: ${title}`, { url: request.loadedUrl });

    await playwrightUtils.infiniteScroll(page, { buttonSelector: 'a:has-text("Show more matches")' })

    let matchURLs = []
    let matchesElements = await page.$$("[id^='g_']") || null

    for (let i = 0; i < matchesElements.length; i++) {
        let matchElementId = await matchesElements[i].getAttribute("id")
        let regexForRedundantPartOfId = /.*_/gm
        let matchId = matchElementId.replace(regexForRedundantPartOfId, "")
        matchURLs.push(`https://www.flashscore.com/en/match/${matchId}/#/match-summary/match-summary`)
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

    let regexForRegionExtraction = /\:.*$/

    let results = {
        sport: await page.locator("span.tournamentHeader__sportNav title")?.textContent() || null,
        region: await (await page.locator("span.tournamentHeader__country")?.textContent()).replace(regexForRegionExtraction, "") || null,
        league: await page.locator("span.tournamentHeader__country a")?.textContent() || null,
        matchTime: await page.locator(".duelParticipant__startTime")?.textContent() || null,
        matchState: await page.locator(".detailScore__status")?.first()?.textContent() || null,
        homeTeamName: await page.locator(".duelParticipant__home a.participant__participantName")?.textContent() || null,
        awayTeamName: await page.locator(".duelParticipant__away a.participant__participantName")?.textContent() || null,
        //how to ignore the elements if it's not available e.g. MMA
        homeTeamScore: await page.locator("div.detailScore__matchInfo div.detailScore__wrapper span")?.first()?.textContent() || null,
        awayTeamScore: await page.locator("div.detailScore__matchInfo div.detailScore__wrapper span")?.last()?.textContent() || null,
        URL: request.loadedUrl,

    }
    //todo - can be the following line impoved? 
    if (await page.locator('a:has-text("Stats")').isVisible({ timeout: 2000 }) == true) {

        await page.locator('a:has-text("Stats")').click()

        await page.waitForSelector(".stat__category")
        const statCategories = await page.$$(".stat__categoryName")
        const homeTeamStatValues = await page.$$(".stat__homeValue")
        const awayTeamStatValues = await page.$$(".stat__awayValue")

        //TODO is it save to collect the stats like this? 
        for (let i = 0; i < statCategories.length; i++) {
            results[`${await statCategories[i].textContent()}`] =
            {
                homeTeamValue: await homeTeamStatValues[i].textContent(),
                awayTeamValue: await awayTeamStatValues[i].textContent()
            }
        }
    }

    await Actor.pushData(results)

});






