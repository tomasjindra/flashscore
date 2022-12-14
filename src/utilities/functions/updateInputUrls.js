import { terms } from "../terms.js"


export const updateInputUrls = (inputURL) => {
    for (let i = 0; i < inputURL.length; i++) {
        if (!inputURL[i].includes("results")) {
            if (terms.some(element => inputURL[i].includes(element))) {
                let regex = /https:\/\/www.livesport.com\/.*?\/.*?\/.*?\/.*?\//
                inputURL[i] = inputURL[i].match(regex) + "results"
            }
            else {
                let regex = /https:\/\/www.livesport.com\/.*?\/.*?\//
                inputURL[i] = inputURL[i].match(regex) + "results"
            }
        }
    }
}