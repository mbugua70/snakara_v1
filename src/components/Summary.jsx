import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CompltedImage from "../assets/image/completedQuiz.png";
import { updatePlayer } from "./api";

import Cocktail from "/image/cocktail.webp";

const resultsMap = {
  A: "Crisp & Refreshing: Casamigos Paloma (Tequila, grapefruit, lime, soda) – Light, fresh, and effortlessly cool.",
  B: "Fruity & Fun: Passionfruit Margarita (Tequila, passionfruit, lime, agave) – Vibrant and bold, just like you!",
  C: "Smooth & Sophisticated: Coconut Tequila Sour (Tequila, coconut cream, lime, bitters) – Luxurious and indulgent.",
  D: "Adventurous & Unexpected: Spicy Berry Mule (Tequila, berries, ginger beer, chili) – A surprising twist, full of excitement.",
};

const Summary = ({ userAnswers, QUESTIONS }) => {
  const [updateScore, setUpdateScore] = useState({});
  const navigate = useNavigate();

  // Count skipped answers
  const skippedAnswers = userAnswers.filter((answer) => answer === null);
  const skippedAnswerPercent = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );

  // Count the most selected category (A, B, C, or D)
  const choiceCount = { A: 0, B: 0, C: 0, D: 0 };

  const choiceLabels = ["A", "B", "C", "D"];

  userAnswers.forEach((answer, index) => {
    if (answer !== null) {
      const selectedIndex = QUESTIONS[index].answers.findIndex(
        (option) => option === answer
      );

      if (selectedIndex !== -1) {
        const selectedLabel = choiceLabels[selectedIndex];
        console.log(selectedLabel, "selectedLabel");
        choiceCount[selectedLabel]++;
        console.log(choiceCount[selectedLabel], "test");
      }
    }
  });

  const mostChosenCategory = Object.keys(choiceCount).reduce((a, b) =>
    choiceCount[a] > choiceCount[b] ? a : b
  );

  console.log(choiceCount, "choice count");

  const finalRecommendation =
    resultsMap[mostChosenCategory] || "No recommendation available.";

  useEffect(() => {
    async function updateFun() {
      const updateValue = {
        score: mostChosenCategory, // Storing the most chosen category instead of a numeric score
      };
      const updateResult = await updatePlayer(updateValue);
      setUpdateScore(updateResult);
    }

    updateFun();
  }, [mostChosenCategory]);

  setTimeout(() => {
    if (
      updateScore.success !== undefined &&
      updateScore.success === true &&
      userAnswers.length === 5
    ) {
      navigate("/");
      localStorage.removeItem("user");
    }
  }, 6000);

  return (
    <>
      {/* header summary details */}

      <div className='header_summary'>
        <div className='row_one_summary'>
          <div className='rows_one_details'>
            <p className='animate__animated animate__slideInRight'>
              Your matched{" "}
            </p>
            <p className='animate__animated animate__slideInRight'>Cocktail</p>
            <p className='animate__animated animate__slideInLeft'>Results </p>
          </div>
          <div className='row_two_details'>
            <p>{finalRecommendation}</p>
          </div>
        </div>
        <div className='row_two_summary'>
          <img
            src={Cocktail}
            alt='cocktail image'
            style={{ width: "100%", height: "100%" }}
            className='animate__animated animate__rotateIn'
          />
        </div>
      </div>

      {/* summary details */}

      <div className='main_summary'>
        <div id='summary'>
          <div id='summary-stats'>
            <p>
              <span className='text'>Summary</span>
            </p>
          </div>
          <ol>
            {userAnswers.map((answer, index) => {
              let cssClass = "user-answer";
              if (answer === null) {
                cssClass += " skipped";
              }
              return (
                <li key={index}>
                  <h3>{index + 1}</h3>
                  <p className='question'>{QUESTIONS[index].text}</p>
                  <p className={cssClass}>{answer ?? "SKIPPED"}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
};

export default Summary;
