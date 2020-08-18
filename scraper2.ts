// import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda";
import { createChoiceSets, createAnswerDetailSets } from "./utils";

const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();

//
type textContentArray = { textContent: string }[];
type codeBlockArray = {
  nextElementSibling: {
    className: string;
    children: textContentArray;
  };
}[];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// app.use(cors());

router.get("/.netlify/functions/scraper/", async (req: any, res: any) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://github.com/lydiahallie/javascript-questions/");

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

  res.send({ questions, codeBlocks, choiceSets, answers, answerDetailSets });

  await browser.close();
});
app.use(`/.netlify/functions/test`, router);
module.exports = app;
module.exports.handler = app;