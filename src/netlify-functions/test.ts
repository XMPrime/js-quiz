import { createChoiceSets, createAnswerDetailSets } from "./utils";
import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda";
const chromium = require("chrome-aws-lambda");
// const express = require("express");
// const cors = require("cors");
// const serverless = require("serverless-http");
// const app = express();
// const router = express.Router();
// const axios = require("axios");

type textContentArray = { textContent: string }[];
type codeBlockArray = {
  nextElementSibling: {
    className: string;
    children: textContentArray;
  };
}[];

exports.handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  const pageToScrape = "https://github.com/lydiahallie/javascript-questions/";
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(pageToScrape);
  const questions = await page.$$eval("h6", (questions: textContentArray) =>
    questions.map((question) => question.textContent)
  );

  const codeBlocks = await page.$$eval("h6", (blocks: codeBlockArray) =>
    blocks.map((block) => {
      if (block.nextElementSibling.className.includes("highlight"))
        return block.nextElementSibling.children[0].textContent;
      else return "";
    })
  );

  const choices = await page.$$eval("ul > li", (choices: textContentArray) =>
    choices
      .map((choice) => {
        if (choice.textContent[1] === ":") return choice.textContent;
        return "";
      })
      .filter((choice) => choice !== "")
  );

  const choiceSets = createChoiceSets(choices);

  const answers = await page.$$eval(
    "details > h4",
    (answers: textContentArray) =>
      answers.map((answer) => answer.textContent[answer.textContent.length - 1])
  );

  const answerDetails = await page.$$eval(
    "details > p, h6",
    (details: textContentArray) =>
      details
        .map((detail) => detail.textContent)
        .filter((detail) => detail.length >= 3)
  );

  const answerDetailSets = createAnswerDetailSets(answerDetails);

  await browser.close();

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
