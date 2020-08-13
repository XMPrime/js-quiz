import React, { useState, useEffect } from "react";
import { AnswerObject } from "../App";
import { Wrapper, ButtonWrapper } from "./QuestionCard.styles";

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
  return (
    <Wrapper>
      <div className='question-card'>
        <p className='number'>
          Question: {questionNum} / {totalQuestions}
        </p>
        <p>{question}</p>
        {codeBlock !== "" ? (
          <div className='code-block'>
            <pre>{codeBlock}</pre>
          </div>
        ) : null}
        <div>
          {choices.map((choice) => (
            <ButtonWrapper
              key={choice}
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
        <button className='reveal-answer' onClick={toggleShowAnswer}>
          Reveal Answer{" "}
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
