import React, { createContext, useContext, useState } from "react";

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [view, setView] = useState("home"); // home | interview | report
  const [candidateInfo, setCandidateInfo] = useState({});
  const [qaHistory, setQaHistory] = useState([]);
  const [evaluationHistory, setEvaluationHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [competenceState, setCompetenceState] = useState({});
  const [answerKey, setAnswerKey] = useState(0);

  const resetInterview = () => {
    setView("home");
    setCandidateInfo({});
    setQaHistory([]);
    setEvaluationHistory([]);
    setCurrentQuestion(null);
    setCompetenceState({});
    setAnswerKey(0);
  };

  return (
    <InterviewContext.Provider
      value={{
        view,
        setView,
        candidateInfo,
        setCandidateInfo,
        qaHistory,
        setQaHistory,
        evaluationHistory,
        setEvaluationHistory,
        currentQuestion,
        setCurrentQuestion,
        competenceState,
        setCompetenceState,
        answerKey,
        setAnswerKey,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) {
    throw new Error("useInterview must be used inside InterviewProvider");
  }
  return ctx;
};
