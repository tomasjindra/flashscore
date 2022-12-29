import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { Actor } from 'apify';
import { router } from './routes.js';
import { updateInputUrls } from './utilities/functions/updateInputUrls.js'

await Actor.init();

const { inputURL, proxyConfiguration } = await Actor.getInput();
console.log(inputURL);
updateInputUrls(inputURL)

const startUrls = [...inputURL];

const crawler = new PlaywrightCrawler({
    headless: false,
    proxyConfiguration: await Actor.createProxyConfiguration(proxyConfiguration),
    requestHandler: router,
});

await crawler.run(startUrls);

await Actor.exit();