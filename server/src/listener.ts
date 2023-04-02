import http = require('http');
import {insertScript, insertUser} from "./database";
import puppeteer from "puppeteer";


const PORT = 3001;

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        console.log("GOT REQUEST")
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end',    () => {
            runTempAlgos()
            res.end('GET READY BABY');
        });
    } else {
        res.end();
    }
});

insertUser("admin");

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const sleep = async (time:number) => {
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

const runTempAlgos = (async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://developers.google.com/web/');
    await sleep(1000)
    // Type into search box.
    await page.type('.devsite-search-field', 'Headless Chrome');
    await sleep(1000)
    // Wait for suggest overlay to appear and click "show all results".
    const allResultsSelector = '.devsite-suggest-all-results';
    await page.waitForSelector(allResultsSelector);
    await page.click(allResultsSelector);
    await sleep(1000)
    // Wait for the results page to load and display the results.
    const resultsSelector = '.gsc-table-result a.gs-title[href]';
    await page.waitForSelector(resultsSelector);
    await sleep(2000)
    // Extract the results from the page.
    const links = await page.evaluate(resultsSelector => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));
        return anchors.map(anchor => {
            const title = anchor.textContent.split('|')[0].trim();
            // @ts-ignore
            return `${title} - ${anchor.href}`;
        });
    }, resultsSelector);
    console.log(links.join('\n'));
    await sleep(100000)
    await browser.close();
})