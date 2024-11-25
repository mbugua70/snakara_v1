/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, Suspense } from "react";
import "animate.css";
import Question from "./question";
import { redirect } from "react-router-dom";
import Summary from "./Summary";
import Preloader from "./Preloader";
import { defer, Await, useLoaderData } from "react-router-dom";
import { fetchData } from "./api";
import { requireAuth } from "./utilis";
import Scoreboard from "./Scoreboard";

// data (question)

export const quizLoader = async ({ request }) => {
  // await requireAuth(request);
  const pathname = new URL(request.url).pathname;
  const user = await requireAuth();
  console.log(user);
  if (!user) {
    return redirect(`/?message=You must log in first!!&redirectTo=${pathname}`);
  }
  return defer({ allData: fetchData() });
};

const Quiz = () => {
  let allTimer = 160000;

  // const [answerState, setAnswerState] = useState("");
  const [activeQuestion, setActiveQuestion] = useState([]);

  const activeQuestionIndex = activeQuestion.length;
  //   const quizCompleted = activeQuestionIndex === QUESTIONS.length;

  const handleSelectedAnswer = useCallback(
    function handleSelectedAnswer(selectedAnswer) {
      // setAnswerState("answered");
      setActiveQuestion((prevAnswer) => {
        return [...prevAnswer, selectedAnswer];
      });

      // setTimeout(() => {
      //   if (selectedAnswer === QUESTIONS[activeQuestionIndex].answers[0]) {
      //     setAnswerState("correct");
      //   } else {
      //     setAnswerState("wrong");
      //   }

      //     setTimeout(() => {
      //       setAnswerState("");
      //     }, 2000);
      //   }, 1000);
    },
    // [activeQuestionIndex]
    []
  );

  const handleSkipAnswer = useCallback(
    () => handleSelectedAnswer(null),
    [handleSelectedAnswer]
  );

  const questionPromise = useLoaderData();

  return (
    <>
      <div id="quiz" className="">
        <Suspense fallback={<Preloader />}>
          <Await resolve={questionPromise.allData}>
            {(QUESTIONSDATA) => {
              const COLORS = QUESTIONSDATA.colors.colorsData;
              const QUESTIONS = QUESTIONSDATA.questions.allQuestions;

              if (activeQuestionIndex === QUESTIONS.length) {
                return (
                  <Summary userAnswers={activeQuestion} QUESTIONS={QUESTIONS} />
                );
              }
              return (
                <>
                  <div className="header_question">
                    <Scoreboard
                      QUESTIONS={QUESTIONS}
                      userAnswers={activeQuestion}
                      generalTimer={allTimer}
                    />
                  </div>
                  {/* question component */}
                  <Question
                    userAnswers={activeQuestion}
                    key={activeQuestionIndex}
                    index={activeQuestionIndex}
                    QUESTIONS={QUESTIONS}
                    COLORS={COLORS}
                    onSelect={handleSelectedAnswer}
                    onSkipAnswer={handleSkipAnswer}
                  />
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </>
  );
};

export default Quiz;
