// const puppeteer = require("puppeteer");

export const shuffleArray = (array: any[]) =>
  [...array].sort(() => Math.random() - 0.5);

export const questionRandomizer = (num: number) => {
  let uniqueNumbers = [];

  while (uniqueNumbers.length < num) {
      let randomNum = Math.floor(Math.random()*(1 - num) + 1);
      if (uniqueNumbers.indexOf(randomNum) === -1) uniqueNumbers.push( randomNum );
  }
}