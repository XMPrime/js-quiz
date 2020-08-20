import React, { useEffect } from "react";
import { AnswerObject } from "../App";
import { Wrapper, ButtonWrapper } from "./QuestionCard.styles";
import Prism from "prismjs";
import "../prism.css";

type QuestionProps = {
  question: string;
  codeBlock: string;
  choices: string[];
  answer: string;
  answerDetails: string[];
  toggleShowAnswer: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showAnswer: boolean;
  checkAnswer: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNum: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<QuestionProps> = ({
  question,
  codeBlock,
  choices,
  answer,
  answerDetails,
  toggleShowAnswer,
  checkAnswer,
  showAnswer,
  userAnswer,
  questionNum,
  totalQuestions,
}) => {
  useEffect(() => {
    Prism.highlightAll();
  });

  console.log(choices);
  console.log(userAnswer);

  return (
    <Wrapper>
      <div className='question-card'>
        <h4 className='number'>
          Question: {questionNum} / {totalQuestions}
        </h4>
        <h3 className='question'>{question}</h3>
        {codeBlock !== "" ? (
          <div className='code-block'>
            <pre>
              <code className='language-javascript'>{`${codeBlock}`}</code>
            </pre>
          </div>
        ) : null}
        <div>
          {choices.map((choice) => (
            <ButtonWrapper
              key={choice}
              // checks the userAnswer against the 1st letter of the choice
              correct={userAnswer?.correctAnswer === choice[0]}
              userClicked={userAnswer?.userAnswer[0] === choice[0]}
            >
              <button
                disabled={!!userAnswer}
                onClick={checkAnswer}
                value={choice}
              >
                <span>{choice}</span>
              </button>
            </ButtonWrapper>
          ))}
        </div>
        <button
          className='reveal-answer'
          onClick={toggleShowAnswer}
          value='wrong'
        >
          <span className='reveal-answer--button-text'>Reveal Answer</span>
          <i className={`fas fa-play ${showAnswer && "rotate"}`}></i>
        </button>
        {showAnswer ? (
          <div className='answer-details'>
            <p>Answer: {answer}</p>
            {answerDetails.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        ) : null}
      </div>
    </Wrapper>
  );
};

export default QuestionCard;
