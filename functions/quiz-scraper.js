import {
  createChoiceSets,
  createAnswerDetailSets,
  randomNumGen,
} from "../src/utils";
const chromium = require("chrome-aws-lambda");

exports.handler = async (event) => {
  const size = JSON.parse(event.body).size;
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

  const codeBlocks = await page.$$eval("h6", (blocks) =>
    blocks.map((block) => {
      if (block.nextElementSibling.className.includes("highlight"))
        return block.nextElementSibling.children[0].textContent;
      else return "";
    })
  );

  const choices = await page.$$eval("ul > li", (choices) =>
    choices
      .map((choice) => {
        if (choice.textContent[1] === ":") return choice.textContent;
        return "";
      })
      .filter((choice) => choice !== "")
  );

  const choiceSets = createChoiceSets(choices);

  const answers = await page.$$eval("details > h4", (answers) =>
    answers.map((answer) => answer.textContent[answer.textContent.length - 1])
  );

  const answerDetails = await page.$$eval("details > p, h6", (details) =>
    details
      .map((detail) => detail.textContent)
      .filter((detail) => detail.length >= 3)
  );

  const answerDetailSets = createAnswerDetailSets(answerDetails);

  const randomNumbers = randomNumGen(size, questions.length);

  const randomQuestions = randomNumbers.map((number) => {
    return {
      question: questions[number],
      codeBlock: codeBlocks[number],
      choices: choiceSets[number],
      answer: answers[number],
      answerDetails: answerDetailSets[number],
    };
  });
  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(randomQuestions),
  };
};
