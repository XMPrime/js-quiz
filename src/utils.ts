export const shuffleArray = (array: any[]) =>
  [...array].sort(() => Math.random() - 0.5);

export const randomNumGen = (num: number, length: number) => {
  let uniqueNumbers = [];

  while(uniqueNumbers.length < num){
    let r = Math.floor(Math.random() * length) + 1;
    if(uniqueNumbers.indexOf(r) === -1) uniqueNumbers.push(r);
}

  return uniqueNumbers;
}

export const createChoiceSets = (array: string[]) => {
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

export const createAnswerDetailSets = (array: string[]) => {
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
}