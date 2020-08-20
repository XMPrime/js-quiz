import styled from "styled-components";

const lightBlue = "#d1eff0";
const skyBlue = "#FF5656";
const green = "#56FFA4";
const red = "#56ccff";

export const Wrapper = styled.div`
  background: ${lightBlue};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  text-align: center;
  margin-bottom: 10px;

  @media screen and (max-width: 600px) {
    padding: 1.2rem;
  }

  p {
    font-size: 1rem;
  }
  .question-card {
    width: 40vw;
    @media only screen and (max-width: 600px) {
      width: auto;
    }
  }
  
  .question,
  .answer-details {
    text-align: left;
  }
  .code-block {
    margin-bottom: 1.5rem;
  }
  .language-javascript {
    border-radius: 10px;
    overflow: auto;
    @media only screen and (max-width: 600px) {
      font-size: .8rem;
    }
  }
  .fa-play {
    margin-left: 1rem;
  }
  .rotate {
    transform: rotate(90deg);
  }
`;

type ButtonWrapperProps = {
  correct: boolean;
  userClicked: boolean;
};

export const ButtonWrapper = styled.div<ButtonWrapperProps>`
  transition: all 0.3s ease;
  :hover {
    opacity: 0.8;
  }
  button {
    cursor: pointer;
    user-select: none;
    font-size: 1rem;
    width: 100%;
    height: 40px;
    margin: 5px 0;
    background: ${({ correct, userClicked }) =>
      correct && userClicked
        ? green
        : !correct && userClicked
        ? skyBlue
        : red};
    box-shadow: 1px 2px 0px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 10px;
    color: #fff;
    text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25);
  }
`;
