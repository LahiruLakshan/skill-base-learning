import { useState, useEffect } from "react";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import QUIZDATA from "../../quiz.json";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import axios from "axios";
import { DEEPSEEK } from "../../constants/config";

const PracticeQuiz = () => {
  const navigate = useNavigate();
  const [showLearn, setShowLearn] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const shuffled = QUIZDATA.questions.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5567)); // You can change 5 to 30 later
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
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer("");
    setSubmitted(false);
  };
  if (questions.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">Loading questions...</p>
    );
  }

  const current = questions[currentQuestionIndex];

  const fetchExplanationFromGPT = async () => {
  const current = questions[currentQuestionIndex];
  const prompt = `I selected the wrong answer "${selectedAnswer}" for the question: "${current.question}". Please explain why this answer is wrong and provide more context to help me learn.`;

  setLoadingAI(true);
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK}`, // Replace with your actual key
        "HTTP-Referer": "<YOUR_SITE_URL>",              // Optional
        "X-Title": "<YOUR_SITE_NAME>",                  // Optional
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ]
      })
    });

    const data = await response.json();

    const aiReply = data.choices?.[0]?.message?.content || "Sorry, no explanation returned.";
    setAiResponse(aiReply);
  } catch (error) {
    console.error("Error fetching explanation:", error);
    setAiResponse("Error fetching explanation. Please try again later.");
  }
  setLoadingAI(false);
};

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

export default PracticeQuiz;
