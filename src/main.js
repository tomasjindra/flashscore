// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { Actor } from 'apify';
import { router } from './routes.js';
import { updateInputUrls } from './utilities/functions/updateInputUrls.js'

await Actor.init();

const { inputURL } = await Actor.getInput();
console.log(inputURL);
updateInputUrls(inputURL)

const startUrls = [...inputURL];

const crawler = new PlaywrightCrawler({
    //maxConcurrency:1,
    headless: false,
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
});

await crawler.run(startUrls);

await Actor.exit();