// import chromium from "chrome-aws-lambda";
import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
// type APIGatewayProxyResult = AWSLambda.APIGatewayProxyResult;
const chromium = require("chrome-aws-lambda");

type textContent = { textContent: string }[];
type nextElementSibling = {
  nextElementSibling: { className: string; children: textContent };
}[];

const createChoiceSets = (array: string[]): string[][] => {
  let choiceSets = [];
  let set = [array[0]];
  for (let i = 1; i < array.length; i++) {
    // Checks if current letter is directly after previous letter i.e. A->B
    if (array[i].charCodeAt(0) - array[i - 1].charCodeAt(0) === 1) {
      set.push(array[i]);
    } else {
      choiceSets.push(set);
      set = [array[i]];
    }
    if (i === array.length - 1) choiceSets.push(set);
  }
  return choiceSets;
};

const createAnswerDetailSets = (array: string[]): string[][] => {
  const regex = /^[0-9]{1,3}\.\s/;
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
};
// exports.handler = async (event) => {
// export const handler = async (
//   event: APIGatewayProxyEvent,
//   context: Context
// ): Promise<APIGatewayProxyResult> => {
exports.handler = async (): Promise<APIGatewayProxyResult> => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto("https://github.com/lydiahallie/javascript-questions/");

  const questions = await page.$$eval("h6", (questions: textContent) =>
    questions.map((question) => question.textContent)
  );

  const codeBlocks = await page.$$eval("h6", (blocks: nextElementSibling) =>
    blocks.map((block) => {
      if (block.nextElementSibling.className.includes("highlight"))
        return block.nextElementSibling.children[0].textContent;
      else return "";
    })
  );

  const choices = await page.$$eval("ul > li", (choices: textContent) =>
    choices
      .map((choice) => {
        if (choice.textContent[1] === ":") return choice.textContent;
        return "";
      })
      .filter((choice) => choice !== "")
  );

  const choiceSets = createChoiceSets(choices);

  const answers = await page.$$eval("details > h4", (answers: textContent) =>
    answers.map((answer) => answer.textContent[answer.textContent.length - 1])
  );

  const answerDetails = await page.$$eval(
    "details > p, h6",
    (details: textContent) =>
      details
        .map((detail) => detail.textContent)
        .filter((detail) => detail.length >= 3)
  );

  const answerDetailSets = createAnswerDetailSets(answerDetails);

  return {
    statusCode: 200,
    body: JSON.stringify({
      questions,
      codeBlocks,
      choiceSets,
      answers,
      answerDetailSets,
    }),
  };
};
