import { useState, useEffect } from "react";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import QUIZDATA from "../../quiz.json";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const QuizComponent = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("");
  const [showLearn, setShowLearn] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const shuffled = QUIZDATA.questions.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;

    if (isCorrect) {
      setScore(score + 10);
    } else {
      setShowLearn(true);
    }

    setSubmitted(true);
  };

  const handleNext = async () => {
    const nextIndex = currentQuestionIndex + 1;

    console.log("currentQuestionIndex : ", currentQuestionIndex);
    console.log("questions.length : ", questions.length);

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer("");
      setSubmitted(false);
      setShowLearn(false);
      setAiResponse("");
    } else {
      setCurrentQuestionIndex(nextIndex);
      const newLevel =
        score <= 99 ? "Beginner" : score <= 299 ? "Intermediate" : "Advanced";

      setLevel(newLevel);

      const userRef = doc(db, "users", localStorage?.getItem("uid"));
      await updateDoc(userRef, { level: newLevel });
    }
  };

  const fetchExplanationFromGPT = async () => {
    const current = questions[currentQuestionIndex];
    const prompt = `I selected the wrong answer "${selectedAnswer}" for the question: "${current.question}". Please explain why this answer is wrong and provide more context to help me learn.`;

    setLoadingAI(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your key or use env
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      const message = data?.choices?.[0]?.message?.content;
      setAiResponse(message || "Sorry, could not fetch explanation.");
    } catch (error) {
      setAiResponse("Error fetching explanation.");
    }
    setLoadingAI(false);
  };

  if (questions.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">Loading questions...</p>
    );
  }

  const current = questions[currentQuestionIndex];

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="p-6 max-w-2xl mx-auto min-h-[60vh]">
        <Card className="text-center shadow-lg pt-[1000px]">
          <CardContent>
            <p className="text-3xl font-bold text-blue-700 mb-2">
              Quiz Completed! 🎉
            </p>
            <p className="text-lg font-medium mb-2">
              Your Score:{" "}
              <span className="font-bold">
                {score} / {questions.length * 10}
              </span>
            </p>
            <p className="text-lg font-medium mb-6">
              Your Level:{" "}
              <span className="font-bold text-green-600">{level}</span>
            </p>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                navigate("/");
                setTimeout(() => window.location.reload(), 500);
              }}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-[80vh]">
      <Card className="shadow-lg">
        <CardContent>
          <Progress
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            className="mb-6"
          />

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
              {currentQuestionIndex + 1 >= questions.length
                ? "Finished Quiz"
                : "Next Question"}
            </Button>
          )}
        </CardContent>
      </Card>

      {submitted && (
        <div className="text-center mt-4 space-y-3">
          {selectedAnswer === current.answer ? (
            <p className="text-green-600 font-semibold">
              Correct! 🎉 +10 Marks
            </p>
          ) : (
            <>
              <p className="text-red-600 font-semibold">
                Incorrect! Correct answer:{" "}
                <span className="font-bold">{current.answer}</span>
              </p>

              {showLearn && (
                <>
                  <Button
                    onClick={fetchExplanationFromGPT}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                    disabled={loadingAI}
                  >
                    {loadingAI ? "Loading Explanation..." : "Learn More"}
                  </Button>

                  {aiResponse && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-left text-sm text-gray-800 whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
