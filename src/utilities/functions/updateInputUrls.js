import { terms } from "../terms.js"


export const updateInputUrls = (inputURL) => {
    for (let i = 0; i < inputURL.length; i++) {
        if (!inputURL[i].url.includes("results")) {
            if (terms.some(term => inputURL[i].url.includes(term))) {
                let regex = /https:\/\/www.livesport.com\/.*?\/.*?\/.*?\/.*?\//
                inputURL[i].url = inputURL[i].url.match(regex) + "results"
            }
            else {
                let regex = /https:\/\/www.livesport.com\/.*?\/.*?\//
                inputURL[i].url = inputURL[i].url.match(regex) + "results"
            }
        }
    }
}