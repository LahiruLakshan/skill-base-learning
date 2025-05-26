import { useState, useEffect } from "react";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import QUIZDATA from "../../quiz.json";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const PracticeQuiz = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("");

  useEffect(() => {
    const shuffled = QUIZDATA.questions.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5567)); // You can change 5 to 30 later
  }, []);

  const handleSubmit = () => {
    const isCorrect =
      selectedAnswer === questions[currentQuestionIndex].answer;

    if (isCorrect) {
      setScore(score + 10);
    }
    setSubmitted(true);
  };

  const handleNext = async () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer("");
      setSubmitted(false);
}
  if (questions.length === 0) {
    return <p className="text-center py-10 text-gray-500">Loading questions...</p>;
  }


  const current = questions[currentQuestionIndex];

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-[80vh]">
      <Card className="shadow-lg">
        <CardContent>

          <p className="text-lg font-semibold mb-4">
            Question {currentQuestionIndex + 1}: {current.question}
          </p>

          <div className="space-y-2">
            {current.options.map((option, i) => {
              const isCorrect = option === current.answer;
              const isSelected = selectedAnswer === option;

              let optionStyle = "bg-gray-100 hover:bg-gray-200";
              if (submitted) {
                if (isSelected && isCorrect) {
                  optionStyle = "bg-green-500 text-white";
                } else if (isSelected && !isCorrect) {
                  optionStyle = "bg-red-500 text-white";
                } else if (isCorrect) {
                  optionStyle = "bg-green-100";
                }
              } else if (isSelected) {
                optionStyle = "bg-blue-500 text-white";
              }

              return (
                <label
                  key={i}
                  className={`block cursor-pointer p-3 rounded-lg transition-colors ${optionStyle}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => setSelectedAnswer(option)}
                    className="hidden"
                  />
                  {option}
                </label>
              );
            })}
          </div>

          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="mt-6 w-full bg-gray-700 hover:bg-gray-800 text-white"
            >
              Next Question
            </Button>
          )}
        </CardContent>
      </Card>

      

      {submitted && (
        <div className="text-center mt-4">
          {selectedAnswer === current.answer ? (
            <p className="text-green-600 font-semibold">Correct! 🎉 +10 Marks</p>
          ) : (
            <p className="text-red-600 font-semibold">
              Incorrect! Correct answer: <span className="font-bold">{current.answer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeQuiz;
