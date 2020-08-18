// const puppeteer = require("puppeteer");
const chromium = require("chrome-aws-lambda");

exports.handler = async (event) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto("https://github.com/lydiahallie/javascript-questions/");
  const questions = await page.$$eval("h6", (questions) =>
    questions.map((question) => question.textContent)
  );
  await browser.close();
  return {
    statusCode: 200,
    body: `${questions[0]}!`,
  };
};
