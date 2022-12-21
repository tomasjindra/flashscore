import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { Actor } from 'apify';
import { router } from './routes.js';
import { updateInputUrls } from './utilities/functions/updateInputUrls.js'

await Actor.init();

const { inputURL } = await Actor.getInput();
console.log(inputURL);
updateInputUrls(inputURL)

const startUrls = [...inputURL];
const proxyConfiguration = await Actor.createProxyConfiguration();


const crawler = new PlaywrightCrawler({
    headless: false,
    //how to set proxies for public actor if there is no IP blocking, etc.?
    //proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    proxyConfiguration,
    requestHandler: router,
});

await crawler.run(startUrls);

await Actor.exit();