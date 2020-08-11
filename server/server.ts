const puppeteer = require('puppeteer');
const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/quiz-questions', async (req, res) => {
    const browser = await puppeteer.launch();
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

    console.log(
      `questions: ${questions.length}, choices: ${choiceSets.length}, answers: ${answers.length}, answerDetails: ${answerDetailSets.length}`
    );
    // console.log(
    //   {questions, choiceSets, answers, answerDetailSets}
    // );
    
    res.send({questions, choiceSets, answers, answerDetailSets});

    await browser.close();
    
})

app.listen(port, () => console.log(`listening on PORT ${port}`));