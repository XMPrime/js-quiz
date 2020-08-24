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

export type allQuestionsObject = {
  questions: string[];
  codeBlocks: string[];
  choiceSets: string[][];
  answers: string[];
  answerDetailSets: string[][];
};

const QUIZ_SIZE = 10;

function App() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<allQuestionsObject>();
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

  const startTrivia = async (allQuestions: allQuestionsObject) => {
    const quiz = getRandomQuestions(QUIZ_SIZE, allQuestions);

    setGameOver(false);
    setQuiz(quiz);
    setScore(0);
    setUserAnswers([]);
    setQuestionNum(0);
    setLoading(false);
  };

  const restart = () => {
    setQuestionNum(0);
    setUserAnswers([]);
    setShowAnswer(false);
    setScore(0);
    setGameOver(true);
  };

  const fetchQuestions = async () => {
    // const questions = await (
    //   await fetch(
    //     "https://quiz-scraper.netlify.app/.netlify/functions/quiz-scraper"
    //   )
    // ).json();

    fetch("https://quiz-scraper.netlify.app/.netlify/functions/quiz-scraper")
      .then((res) => res.text())
      .then((text) => console.log(text));

    // setQuestions(questions);
    // setLoading(false);
  };

  const getRandomQuestions = (
    quizSize: number,
    quizObject: allQuestionsObject
  ): QuestionObject[] => {
    const randomNumbers = randomNumGen(quizSize, quizObject.questions.length);
    const randomQuestions = randomNumbers.map((number) => {
      return {
        question: quizObject.questions[number],
        codeBlock: quizObject.codeBlocks[number],
        choices: quizObject.choiceSets[number],
        answer: quizObject.answers[number],
        answerDetails: quizObject.answerDetailSets[number],
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

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className='App'>
          <h1>JS Quiz</h1>
          {gameOver || userAnswers.length === QUIZ_SIZE ? (
            !loading && questions ? (
              <button
                className='start'
                onClick={() => questions && startTrivia(questions)}
              >
                Start
              </button>
            ) : null
          ) : null}
          {!loading && !gameOver ? (
            <button className='start' onClick={restart}>
              Restart
            </button>
          ) : null}

          {!gameOver ? (
            <h4 className='score'>
              Score: {score} / {QUIZ_SIZE}
            </h4>
          ) : null}
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
          <div className='bottom-row'>
            {!loading &&
            !gameOver &&
            userAnswers.length === questionNum + 1 &&
            questionNum !== QUIZ_SIZE - 1 ? (
              <button className='next' onClick={nextQuestion}>
                Next Question
              </button>
            ) : null}
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
