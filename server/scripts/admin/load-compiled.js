const puppeteer = require('puppeteer');

async function start() {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	async function getText(XPath) {
		await page.waitForXPath(XPath, {timeout:0});
		const [getXpath] = await page.$x(XPath);
		return await page.evaluate(name => name.textContent, getXpath);
	}

	await page.goto('google.com');
}

exports.start = start;
