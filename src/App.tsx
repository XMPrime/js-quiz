import React, { useState } from "react";
import { fetchQuizQuestions, Difficulty, QuestionState } from "./API";
import QuestionCard from "./components/QuestionCard";
import { GlobalStyle, Wrapper } from "./App.styles";
import { randomNumGen } from "./utils";

const axios = require("axios");

export type AnswerObject = {
  question: string;
  userAnswer: string;
  correct: boolean;
  correctAnswer: string;
};

export type QuestionObject = {
  question: string;
  codeBlock: string;
  choices: string[];
  answer: string;
  answerDetails: string[];
};

const TOTAL_QUESTIONS = 10;

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionObject[]>([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);

  // //Questions, Choices, Answers, Answer Details
  // const [questions, setQuestions] = useState([]);
  // const [choiceSets, setChoiceSets] = useState([]);
  // const [answers, setAnswers] = useState([]);
  // const [answerDetailSets, setAnswerDetailSets] = useState([]);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const generateQuestions = async (size: number) => {
    const {
      questions,
      codeBlocks,
      choiceSets,
      answers,
      answerDetailSets,
    } = await (await fetch("http://localhost:4000/quiz-questions")).json();

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

    return randomQuestions;
  };

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await generateQuestions(TOTAL_QUESTIONS);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setQuestionNum(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const userAnswer = e.currentTarget.value[0];
      console.log(userAnswer);
      const correctAnswer = questions[questionNum].answer;
      const correct = userAnswer === correctAnswer;

      if (correct) setScore(score + 1);
      // Saves answer in the array
      const answerObject = {
        question: questions[questionNum].question,
        userAnswer,
        correct,
        correctAnswer,
      };
      setUserAnswers([...userAnswers, answerObject]);
    }
  };
  const nextQuestion = () => {
    const nextQuestion = questionNum + 1;
    if (nextQuestion === TOTAL_QUESTIONS) setGameOver(true);
    else setQuestionNum(questionNum + 1);
  };
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className='App'>
          <h1>JS Quiz</h1>
          {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
            <button className='start' onClick={startTrivia}>
              Start
            </button>
          ) : null}
          {!gameOver ? <p className='score'>Score: {score}</p> : null}
          {loading ? <p>Loading Questions...</p> : null}
          {!loading && !gameOver ? (
            <QuestionCard
              questionNum={questionNum + 1}
              totalQuestions={TOTAL_QUESTIONS}
              question={questions[questionNum].question}
              codeBlock={questions[questionNum].codeBlock}
              choices={questions[questionNum].choices}
              answer={questions[questionNum].answer}
              answerDetails={questions[questionNum].answerDetails}
              userAnswer={userAnswers ? userAnswers[questionNum] : undefined}
              callback={checkAnswer}
            />
          ) : null}
          {!loading &&
          !gameOver &&
          userAnswers.length === questionNum + 1 &&
          questionNum !== TOTAL_QUESTIONS - 1 ? (
            <button className='next' onClick={nextQuestion}>
              Next Question
            </button>
          ) : null}
        </div>
      </Wrapper>
    </>
  );
}

export default App;
