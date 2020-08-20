import styled, { createGlobalStyle } from "styled-components";


  const blueSapphire = '#05668dff';
  const paleSpringBud = '#f0f3bdff';


export const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
    }

    body {
        background-color: ${blueSapphire};
        margin: 0;
        padding: 0 20px;
        display: flex;
        justify-content: center;
    }

    * {
        box-sizing: border-box;
        font-family: 'Open Sans', sans-serif;
    }
`;

export const Wrapper = styled.div`
  display: flex;

  @media screen and (max-width: 600px) {
    flex-direction: row;
    justify-content: center;
  }

  > p {
    color: #fff;
    font-size: 2rem;
    margin: 0;
  }

  h1 {
    font-family: 'Alata', sans-serif;
    color: ${paleSpringBud};
    font-weight: 400;
    font-size: 70px;
    text-align: center;
    margin: 20px;
  }
  .start,
  .next, .reveal-answer {
    cursor: pointer;
    background-color: ${paleSpringBud};
    font-size: 1rem;
    border: none;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    height: 40px;
    margin: 20px 0;
    padding: 0 40px;
  }
  .start {
    max-width: 200px;
    
  }
  .bottom-row {
    display: flex;
    justify-content: flex-end;
  }
  .score, .loading {
    color: ${paleSpringBud};
    font-size: 1rem;
  }

  @keyframes fadeIn {
    0% {
      display: none;
      opacity: 0;
    }
    50% {
      display: block;
      opacity: 1;
    }
    100% {
      display: none;
      opacity: 0;
    }
  }
  .loading {
    animation: fadeIn 1.5s linear;
    animation-iteration-count: 3;
  }
  .credits {
    justify-content: center;
  }
  .credits, a, a:visited {
    color: ${paleSpringBud}
  }
`;
