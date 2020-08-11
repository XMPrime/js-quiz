// const puppeteer = require("puppeteer");

export const shuffleArray = (array: any[]) =>
  [...array].sort(() => Math.random() - 0.5);
