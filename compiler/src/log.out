const puppeteer = require('puppeteer');

async function start() {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	async function getText(XPath) {
		await page.waitForXPath(XPath, {timeout:0});
		const [getXpath] = await page.$x(XPath);
		return await page.evaluate(name => name.textContent, getXpath);
	}

	await page.goto('https://www.alpertron.com.ar/DILOG.HTM');
	await page.type('#base', '13');
	await page.type('#mod', '10^18+31');
	for (num of ['2', '3', '5', '7'])
	{
		console.log(num);
		await page.click('#pow', {clickCount: 3});
		await page.type('#pow', num);
		await page.click('#dlog');
		text = await getText('//p[contains(text(), "+ 1")]');;
		console.log(text);
	}
}

exports.start = start;
