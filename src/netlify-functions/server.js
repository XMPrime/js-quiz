const puppeteer = require("puppeteer");
const express = require("express");
// const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();
// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });
// const port = process.env.PORT || 4000;

const createChoiceSets = (array) => {
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
};

const createAnswerDetailSets = (array) => {
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

router.get("/", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://github.com/lydiahallie/javascript-questions/");
  // await page.waitForSelector("h6");

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

  res.send({ questions, codeBlocks, choiceSets, answers, answerDetailSets });

  await browser.close();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/.netlify/functions/server", router);
module.exports = app;

module.exports.handler = serverless(app);
