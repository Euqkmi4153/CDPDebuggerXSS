import puppeteer from 'puppeteer';
const browser=await puppeteer.launch();
const page=(await browser.pages())[0];
const client=await page.target().createCDPSession();