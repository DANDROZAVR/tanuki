const puppeteer = require('puppeteer');

exports.start = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://developers.google.com/web/');
  await page.type('.devsite-search-field', 'Headless Chrome');
  await page.keyboard.press('Enter');

//   await browser.close();
}