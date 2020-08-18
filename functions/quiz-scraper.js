const puppeteer = require("puppeteer");

exports.handler = async (event) => {
  const subject = event.queryStringParameters.name || "World";
  const browser = await puppeteer.launch();
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
