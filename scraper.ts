// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const scrapePage = async () => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto("https://github.com/lydiahallie/javascript-questions/");
    // await page.waitForSelector("h6");

    const questions = await page.$$eval("h6", (questions) =>
      questions.map((question) => question.textContent)
    );

    const codeBlocks = await page.$$eval("pre > span", (blocks) =>
      blocks.map((block) => block.textContent)
    );

    const choices = await page.$$eval(
      "ul > li",
      (choices) =>
        choices
          .map((choice) => {
            if (choice.textContent[1] === ":") return choice.textContent;
            return "";
          })
          .filter((choice) => choice !== "")
    );
    function createChoiceSets(array) {
      let choiceSets = [];
      let set = [array[0]];
      for (let i = 1; i < array.length; i++) {
          if (array[i].charCodeAt(0) - array[i - 1].charCodeAt(0) === 1) {
            set.push(array[i]);
          } else {
            choiceSets.push(set);
            set = [array[i]];
          }
          if (i === array.length - 1) choiceSets.push(set);
        }
      return choiceSets;
    }
    const choiceSets = createChoiceSets(choices);

    const answers = await page.$$eval("details > h4", (answers) =>
      answers.map((answer) => answer.textContent)
    );

    const answerDetails = await page.$$eval("details > p, h6", (details) =>
      details
        .map((detail) => detail.textContent)
        .filter((detail) => detail.length >= 3)
    );

    const regex = /^[0-9]{1,3}\.\s/
    function createAnswerDetailSets(array) {
      let answerSets = [];
      let set = [];
      for (let i = 1; i < array.length; i++) {
          if (!regex.test(array[i])) {
            set.push(array[i]);
          } 
          if (regex.test(array[i]) || i === array.length - 1) {
            answerSets.push(set);
            set = [];

          }
        }
      return answerSets;
    }


    const answerDetailSets = createAnswerDetailSets(answerDetails);

    // .map((child) => child.textContent)

    //   const answerDetails = await page.$$eval("details > p", (details) =>
    //   details.map((detail) => detail.textContent)
    // );

    console.log(
      `questions: ${questions.length}, choices: ${choiceSets.length}, answers: ${answers.length}, answerDetails: ${answerDetailSets.length}`
    );

    
    console.log(choices);
  } catch (err) {
    console.log(err);
  }
};

scrapePage();