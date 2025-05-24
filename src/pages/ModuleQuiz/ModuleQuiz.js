import { useState, useEffect } from "react";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import QUIZDATA from "../../quiz.json";
import { useNavigate } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import axios from "axios";

const ModuleQuiz = () => {
  const location = useLocation();
  const { subModule } = location.state || {};
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]); // Store 30 random questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
const stripHtmlTags = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};
function generateQuizPrompt(moduleName, level, numberOfQuestions, contentParagraph) {
  return `Generate a quiz with exactly ${numberOfQuestions} multiple choice questions for the module '${moduleName}' at the '${level}' level based on the following content:

"${contentParagraph}"

Each question should have four options and one correct answer. If the correct answer is 'All of the above', it must be the fourth option.

Return only the output as a **raw JSON array** (no explanation, no extra wrapping), like this:
[
  {
    "question": "....",
    "options": ["...", "...", "...", "..."],
    "answer": "..."
  },
  ...
]`;
}


  // Randomly select 30 unique questions from the quiz data
  useEffect(() => {
    if (subModule) {
      const fetchingData = async () => {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4",
            messages: [{ role: "user", content: generateQuizPrompt(subModule.module_title, subModule.level, 10, stripHtmlTags(subModule.sub_module_content)) }],
          },
          {
            headers: {
              Authorization: `Bearer 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`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("response : ", JSON.parse(response.data.choices[0].message.content));
         setQuestions(JSON.parse(response.data.choices[0].message.content));
      };
      fetchingData();
    }

    // const uid = localStorage.getItem("uid");
    // console.log("uid : ", uid);

    // const allQuestions = QUIZDATA.questions;
    // const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()); // Shuffle questions
    // const selectedQuestions = shuffledQuestions.slice(0, 5); // Select first 30
   
  }, [subModule]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
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

    if (currentQuestionIndex === 29) {
      console.log("30");
      sessionStorage.setItem("level", "ADVANCED");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  if (questions.length === 0) {
    return (<div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
      </div>);
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async (e) => {
    try {
      const uid = localStorage.getItem("uid");
      await addDoc(collection(db, "module_quiz"), {
        ...subModule,
        score: score,
        uid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/modules");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

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
            <p className="text-3xl font-semibold mb-4">Quiz Completed! 🎉</p>
            <p className="text-lg  mb-4">
              Module Name: {subModule?.module_title}
            </p>
            <p className="text-lg  mb-4">Sub-Module Name:{subModule?.title}</p>
            <p className="text-xl">
              Your score is {score} out of {questions.length * 10}.
            </p>
          </CardContent>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Save Record
          </button>
        </Card>
      )}
    </div>
  );
};

export default ModuleQuiz;
