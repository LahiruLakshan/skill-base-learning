import { useState, useEffect } from "react";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import QUIZDATA from "../../quiz.json";
import { useNavigate } from "react-router-dom";
import { collection, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const QuizComponent = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]); // Store 30 random questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("");

  // Randomly select 30 unique questions from the quiz data
  useEffect(() => {
    const allQuestions = QUIZDATA.questions;
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()); // Shuffle questions
    const selectedQuestions = shuffledQuestions.slice(0, 30); // Select first 30
    setQuestions(selectedQuestions);
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore(score + 10); // Add 10 marks for each correct answer
    }
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer("");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 1500); // Show feedback for 1.5 seconds before moving to the next question

    if (currentQuestionIndex === 4) {
      const newLevel =
        score <= 99 ? "Beginner" : score <= 299 ? "Intermediate" : "Advanced";

      setLevel(newLevel);

      const userRef = doc(db, "users", localStorage?.getItem("uid"));

      await updateDoc(userRef, { level: newLevel }).then(() => {
        navigate("/");

        // Wait 500ms after navigating before reloading
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }
  };

  if (questions.length === 0) {
    return <p className="text-center p-6">Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {currentQuestionIndex < questions.length ? (
        <Card className="mb-4 shadow-lg">
          <CardContent>
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="mb-4"
            />
            <p className="font-semibold text-lg mb-4">
              {currentQuestion.question}
            </p>
            <div className="space-y-2">
              {currentQuestion.options.map((option, i) => (
                <label
                  key={i}
                  className={`block cursor-pointer p-3 rounded-lg transition-colors ${
                    selectedAnswer === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="hidden"
                  />{" "}
                  {option}
                </label>
              ))}
            </div>
            {showFeedback && (
              <div className="mt-4 text-center">
                {selectedAnswer === currentQuestion.answer ? (
                  <p className="text-green-600 font-semibold">
                    Correct! 🎉 +10 Marks
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    Wrong! The correct answer is {currentQuestion.answer}.
                  </p>
                )}
              </div>
            )}
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-6 shadow-lg">
          <CardContent>
            <p className="text-2xl font-semibold mb-4">Quiz Completed! 🎉</p>
            <p className="text-lg">
              Your score is {score} out of {questions.length * 10}.
            </p>
            <p className="text-lg">Current level is {level}.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizComponent;
