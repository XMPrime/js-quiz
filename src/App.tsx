import React, { useState, useEffect } from "react";
import QuestionCard from "./components/QuestionCard";
import { GlobalStyle, Wrapper } from "./App.styles";

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
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [showAnswer]);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({ size: TOTAL_QUESTIONS }),
    };

    const newQuestions = await (
      await fetch(
        "https://cors-anywhere.herokuapp.com/https://quiz-scraper.netlify.app/.netlify/functions/quiz-scraper",
        options
      )
    ).json();

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setQuestionNum(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const userAnswer = e.currentTarget.value[0];
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

      // Prevents the user from submitting more than 1 answer via Reveal Answer button
      if (userAnswers.length !== questionNum + 1)
        setUserAnswers([...userAnswers, answerObject]);
    }
  };

  const toggleShowAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowAnswer(!showAnswer);
    checkAnswer(e);
  };

  const nextQuestion = () => {
    const nextQuestion = questionNum + 1;
    if (nextQuestion === TOTAL_QUESTIONS) setGameOver(true);
    else setQuestionNum(questionNum + 1);
    setShowAnswer(false);
  };

  const codeBlock = `const randomValue = 21;

  function getInfo() {
    console.log(typeof randomValue);
    const randomValue = 'Lydia Hallie';
  }
  
  getInfo();`;

  const question = "129. What's the output?";
  const choices = [
    "A: asl;dgfjkalsd",
    "B: asl;dgfjkalsd",
    "C: asl;dgfjkalsd",
    "D: asl;dgfjkalsd",
  ];
  const answer = "A";
  const answerDetails = [
    "Answer: D",
    "Variables declared with the const keyword are not referencable before their initialization: this is called the temporal dead zone. In the getInfo function, the variable randomValue is scoped in the functional scope of getInfo. On the line where we want to log the value of typeof randomValue, the variable randomValue isn't initialized yet: a ReferenceError gets thrown! The engine didn't go down the scope chain since we declared the variable randomValue in the getInfo function.",
  ];

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
          {!gameOver ? (
            <h4 className='score'>
              Score: {score} / {TOTAL_QUESTIONS}
            </h4>
          ) : null}
          {/* <h4 className='score'>
            Score: {score} / {TOTAL_QUESTIONS}
          </h4> */}
          {loading ? (
            <p className='loading'>
              Loading Questions
              <span className='ellipsis1'>.</span>
              <span className='ellipsis2'>.</span>
              <span className='ellipsis3'>.</span>
            </p>
          ) : null}
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
              showAnswer={showAnswer}
              toggleShowAnswer={toggleShowAnswer}
              checkAnswer={checkAnswer}
            />
          ) : null}
          {/* <QuestionCard
            questionNum={questionNum + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={question}
            codeBlock={codeBlock}
            choices={choices}
            answer={answer}
            answerDetails={answerDetails}
            userAnswer={userAnswers ? userAnswers[questionNum] : undefined}
            showAnswer={showAnswer}
            toggleShowAnswer={toggleShowAnswer}
            checkAnswer={checkAnswer}
          /> */}
          <div className='bottom-row'>
            {!loading &&
            !gameOver &&
            userAnswers.length === questionNum + 1 &&
            questionNum !== TOTAL_QUESTIONS - 1 ? (
              <button className='next' onClick={nextQuestion}>
                Next Question
              </button>
            ) : null}
            {/* <button className='next' onClick={nextQuestion}>
              Next Question
            </button> */}
          </div>
          <footer className='credits'>
            <h3>
              App created by{" "}
              <a href='https://github.com/XMPrime/js-quiz'>Jason Chen</a>
            </h3>
            <h3>
              Questions created by{" "}
              <a href='https://github.com/lydiahallie/javascript-questions'>
                Lydia Hallie
              </a>
            </h3>
          </footer>
        </div>
      </Wrapper>
    </>
  );
}

export default App;
