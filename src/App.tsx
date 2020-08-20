import React, { useState, useEffect } from "react";
import QuestionCard from "./components/QuestionCard";
import { GlobalStyle, Wrapper } from "./App.styles";
import { randomNumGen } from "./utils";

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

const QUIZ_SIZE = 10;

function App() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionObject[]>([]);
  const [quiz, setQuiz] = useState<QuestionObject[]>([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [showAnswer]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const startTrivia = async () => {
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json; charset=utf-8",
    //     Accept: "application/json",
    //   },
    //   body: JSON.stringify({ size: QUIZ_SIZE }),
    // };

    // const newQuestions = await (
    //   await fetch(
    //     "https://cors-anywhere.herokuapp.com/https://quiz-scraper.netlify.app/.netlify/functions/quiz-scraper",
    //     options
    //   )
    // ).json();
    console.log(QUIZ_SIZE, questions.length);
    const quiz = getRandomQuestions(QUIZ_SIZE, questions.length);

    setGameOver(false);
    setQuiz(quiz);
    setScore(0);
    setUserAnswers([]);
    setQuestionNum(0);
    setLoading(false);
  };

  const restart = () => {
    const quiz = getRandomQuestions(QUIZ_SIZE, questions.length);

    setQuiz(quiz);
    setQuestionNum(0);
    setUserAnswers([]);
    setShowAnswer(false);
    setScore(0);
    setGameOver(true);
  };

  const fetchQuestions = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({ size: QUIZ_SIZE }),
    };

    const questions = await (
      await fetch(
        "https://cors-anywhere.herokuapp.com/https://quiz-scraper.netlify.app/.netlify/functions/quiz-scraper",
        options
      )
    ).json();

    setQuestions(questions);
    setLoading(false);
  };

  const getRandomQuestions = (quizSize: number, totalQuestions: number) => {
    const randomNumbers = randomNumGen(quizSize, totalQuestions);
    const randomQuestions = randomNumbers.map((number) => {
      return {
        question: questions[number].question,
        codeBlock: questions[number].codeBlock,
        choices: questions[number].choices,
        answer: questions[number].answer,
        answerDetails: questions[number].answerDetails,
      };
    });

    return randomQuestions;
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const userAnswer = e.currentTarget.value[0];
      const correctAnswer = quiz[questionNum].answer;
      const correct = userAnswer === correctAnswer;

      if (correct) setScore(score + 1);
      // Saves answer in the array
      const answerObject = {
        question: quiz[questionNum].question,
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
    if (nextQuestion === QUIZ_SIZE) setGameOver(true);
    else setQuestionNum(questionNum + 1);
    setShowAnswer(false);
  };

  // const codeBlock = `const randomValue = 21;

  // function getInfo() {
  //   console.log(typeof randomValue);
  //   const randomValue = 'Lydia Hallie';
  // }

  // getInfo();`;

  // const question = "129. What's the output?";
  // const choices = [
  //   "A: asl;dgfjkalsd",
  //   "B: asl;dgfjkalsd",
  //   "C: asl;dgfjkalsd",
  //   "D: asl;dgfjkalsd",
  // ];
  // const answer = "A";
  // const answerDetails = [
  //   "Answer: D",
  //   "Variables declared with the const keyword are not referencable before their initialization: this is called the temporal dead zone. In the getInfo function, the variable randomValue is scoped in the functional scope of getInfo. On the line where we want to log the value of typeof randomValue, the variable randomValue isn't initialized yet: a ReferenceError gets thrown! The engine didn't go down the scope chain since we declared the variable randomValue in the getInfo function.",
  // ];

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className='App'>
          <h1>JS Quiz</h1>
          {gameOver || userAnswers.length === QUIZ_SIZE ? (
            <button className='start' onClick={startTrivia}>
              Start
            </button>
          ) : null}
          <button className='start' onClick={restart}>
            Restart
          </button>
          {!gameOver ? (
            <h4 className='score'>
              Score: {score} / {QUIZ_SIZE}
            </h4>
          ) : null}
          {/* <h4 className='score'>
            Score: {score} / {QUIZ_SIZE}
          </h4> */}
          {loading ? <p className='loading'>Loading Questions...</p> : null}
          {!loading && !gameOver ? (
            <QuestionCard
              questionNum={questionNum + 1}
              totalQuestions={QUIZ_SIZE}
              question={quiz[questionNum].question}
              codeBlock={quiz[questionNum].codeBlock}
              choices={quiz[questionNum].choices}
              answer={quiz[questionNum].answer}
              answerDetails={quiz[questionNum].answerDetails}
              userAnswer={userAnswers ? userAnswers[questionNum] : undefined}
              showAnswer={showAnswer}
              toggleShowAnswer={toggleShowAnswer}
              checkAnswer={checkAnswer}
            />
          ) : null}
          {/* <QuestionCard
            questionNum={questionNum + 1}
            totalQuestions={QUIZ_SIZE}
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
            questionNum !== QUIZ_SIZE - 1 ? (
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
