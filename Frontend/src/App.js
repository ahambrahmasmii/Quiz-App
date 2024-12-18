import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const quizState = localStorage.getItem("quizStarted");
    if (quizState === "true") {
      setQuizStarted(true);
    }
  }, []);

  useEffect(() => {
    if (quizStarted) {
      const fetchQuestions = async () => {
        const response = await fetch("http://127.0.0.1:8000/quiz/start-quiz/"); // Replace with your actual API endpoint
        const data = await response.json();
        setQuestions(data.questions);
      };
      fetchQuestions();
    }
  }, [quizStarted]);


  const handleRetakeQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    localStorage.removeItem("quizStarted"); // Clear quiz state from localStorage
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
  

    const response = await fetch("http://127.0.0.1:8000/quiz/submit-quiz/", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        
      },
      body: JSON.stringify({ answers },console.log(answers)),
      
    });
    const result = await response.json();
    console.log(result)
    setResults(result);
    setShowResults(true);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    localStorage.setItem("quizStarted", "true"); // Save quiz state to localStorage
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="card">
          <h1>Welcome to the Quiz</h1>
          <button className="start-button" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="quiz-container">
      <div className="card">
        <p className="loading">Loading questions...</p>
        </div>
      </div>;
  }

  if (showResults) {
    const correctCount = results.correct_count; // Use the correct count from the API response
    const totalQuestions = results.total_questions; // Total number of questions from the API response
  
    return (
      <div className="quiz-container">
        <div className="card-results">
          <div className="results-header">

          <div>
          <h2>Quiz Results</h2>
            </div>
           <div>
          <button className="retake-button" onClick={handleRetakeQuiz}>
            Retake Quiz
          </button>
            </div> 
          </div>
          <p>
            Correct Answers: {correctCount}/{totalQuestions}
          </p>
          <div className="results">
            {results.results.map((result, index) => {
              const { question, user_answer, correct_answer, is_correct } = result;
  
              return (
                <div key={index} className="result-item">
                  <p className="question">
                    <strong>Q{index + 1}:</strong> {question}
                  </p>
                  <p>
                    <strong>Correct Answer:</strong> {correct_answer}
                  </p>
                  <p>
                    <strong>Your Answer:</strong> {user_answer || "Not Answered"}
                  </p>
                  <p
                    className={`answer-status ${
                      is_correct ? "correct-answer" : "incorrect-answer"
                    }`}
                  >
                    {is_correct ? "Correct" : "Incorrect"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="card-questions">
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{currentQuestion.question_text}</p>
        <div className="options">
        {Object.entries(currentQuestion.options).map(([key, option]) => (
    <label key={key}>
      <input
        type="radio"
        name={`question-${currentQuestion.id}`}
        value={key}
        checked={answers[currentQuestion.id] === key}
        onChange={() => handleOptionChange(currentQuestion.id, key)}
      />
      {option}
    </label>
  ))}
        </div>
        <div className="navigation">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
