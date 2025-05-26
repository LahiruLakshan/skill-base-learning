import { useState, useEffect } from "react";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import QUIZDATA from "../../quiz.json";
import { useNavigate } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";
import { db } from "../../firebase";
import axios from "axios";
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  collection,
  addDoc,
  getDoc,
} from "firebase/firestore";

const ModuleQuiz = () => {
  const location = useLocation();
  const { subModule } = location.state || {};
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };
  function generateQuizPrompt(
    moduleName,
    level,
    numberOfQuestions,
    contentParagraph
  ) {
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
    //   const fetchingData = async () => {
    //     const response = await axios.post(
    //       "https://api.openai.com/v1/chat/completions",
    //       {
    //         model: "gpt-4",
    //         messages: [
    //           {
    //             role: "user",
    //             content: generateQuizPrompt(
    //               subModule.module_title,
    //               subModule.level,
    //               10,
    //               stripHtmlTags(subModule.sub_module_content)
    //             ),
    //           },
    //         ],
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer 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`,
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );

    //     console.log(
    //       "response : ",
    //       JSON.parse(response.data.choices[0].message.content)
    //     );
    //     setQuestions(JSON.parse(response.data.choices[0].message.content));
    //   };
    const fetchingData = async () => {
  try {
    const data = JSON.stringify({
      "input_value": generateQuizPrompt(
        subModule.module_title,
        subModule.level,
        10,
        stripHtmlTags(subModule.sub_module_content)
      ),
      "output_type": "chat",
      "input_type": "chat",
      "tweaks": {
        "ChatInput-fKs21": {},
        "Prompt-eDgZg": {},
        "ChatOutput-j3uHn": {},
        "GoogleGenerativeAIModel-K5A6S": {}
      }
    });

    const config = {
      method: 'post',
      url: 'https://api.langflow.astra.datastax.com/lf/628e491a-ce21-4264-b7a1-cb49a4e75323/api/v1/run/faa4d895-cd01-4ac6-966d-b6af9837391f?stream=false',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer AstraCS:ydELKUJnGNhYFXSNpLWCerBM:1caf8564f69e7eb17e7e6543cf8f9953ef8774a8f14b59b686a65a43267f4512'
      },
      data: data
    };

    const response = await axios(config);
    const quizData = JSON.parse(response.data.output);
    setQuestions(quizData);
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    // Fallback to local questions if API fails
    const allQuestions = QUIZDATA.questions;
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 10);
    setQuestions(selectedQuestions);
  }
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
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer("");
      setSubmitted(false);
      setShowLearn(false);
      setAiResponse("");
    } else {
      setCurrentQuestionIndex(nextIndex);

      const uid = localStorage?.getItem("uid");
      const userRef = doc(db, "users", uid);

      try {
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const subModules = userData.sub_modules || [];

          const existingIndex = subModules.findIndex(
            (entry) => entry.data?.id === subModule.id
          );

          if (existingIndex === -1) {
            // Not attempted before, just add
            await updateDoc(userRef, {
              sub_modules: arrayUnion({
                data: subModule,
                score: score,
              }),
            });
            console.log("Sub-module added to user profile.");
          } else {
            // Already attempted — check if score needs updating
            const existingScore = subModules[existingIndex].score;
            if (score > existingScore) {
              const updatedSubModules = [...subModules];
              updatedSubModules[existingIndex] = {
                ...updatedSubModules[existingIndex],
                score: score,
              };

              await updateDoc(userRef, {
                sub_modules: updatedSubModules,
              });

              console.log("Sub-module score updated.");
            } else {
              console.log(
                "Sub-module already completed with higher or equal score. No update made."
              );
            }
          }
        }
      } catch (error) {
        console.error("Error updating user sub_modules: ", error);
      }
    }
  };

  const handleRecord = async (e) => {
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

  const fetchExplanationFromGPT = async () => {
  const current = questions[currentQuestionIndex];
  const prompt = `I selected the wrong answer "${selectedAnswer}" for the question: "${current.question}". Please explain why this answer is wrong and provide more context to help me learn.`;

  setLoadingAI(true);
  try {
    const data = JSON.stringify({
      "input_value": prompt,
      "output_type": "chat",
      "input_type": "chat",
      "tweaks": {
        "ChatInput-fKs21": {},
        "Prompt-eDgZg": {},
        "ChatOutput-j3uHn": {},
        "GoogleGenerativeAIModel-K5A6S": {}
      }
    });

    const config = {
      method: 'post',
      url: 'https://api.langflow.astra.datastax.com/lf/628e491a-ce21-4264-b7a1-cb49a4e75323/api/v1/run/faa4d895-cd01-4ac6-966d-b6af9837391f?stream=false',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer AstraCS:ydELKUJnGNhYFXSNpLWCerBM:1caf8564f69e7eb17e7e6543cf8f9953ef8774a8f14b59b686a65a43267f4512'
      },
      data: data
    };

    const response = await axios(config);
    setAiResponse(response.data.output || "Sorry, could not fetch explanation.");
  } catch (error) {
    console.error("Error fetching explanation:", error);
    setAiResponse("Error fetching explanation. Please try again later.");
  }
  setLoadingAI(false);
};

//   const fetchExplanationFromGPT = async () => {
//     const current = questions[currentQuestionIndex];
//     const prompt = `I selected the wrong answer "${selectedAnswer}" for the question: "${current.question}". Please explain why this answer is wrong and provide more context to help me learn.`;

//     setLoadingAI(true);
//     try {
//       const response = await fetch(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer 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`, // Replace with your key or use env
//           },
//           body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: prompt }],
//           }),
//         }
//       );

//       const data = await response.json();
//       const message = data?.choices?.[0]?.message?.content;
//       setAiResponse(message || "Sorry, could not fetch explanation.");
//     } catch (error) {
//       setAiResponse("Error fetching explanation.");
//     }
//     setLoadingAI(false);
//   };

  const current = questions[currentQuestionIndex];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {currentQuestionIndex < questions.length ? (
        <>
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
        </>
      ) : (
        <div className="p-6 max-w-xl mx-auto min-h-[60vh] flex items-center justify-center">
          <Card className="text-center shadow-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 rounded-2xl px-6 py-10">
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl">🎉</div>
                <p className="text-3xl font-bold text-blue-700">
                  Quiz Completed!
                </p>

                <p className="text-lg font-medium">
                  Your Score:{" "}
                  <span className="font-bold text-black">
                    {score} / {questions.length * 10} (
                    {Math.round((score / (questions.length * 10)) * 100)}%)
                  </span>
                </p>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-700"
                    style={{
                      width: `${Math.round(
                        (score / (questions.length * 10)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>

                <p className="text-lg font-medium mt-4">
                  Module:{" "}
                  <span className="font-bold text-green-600">
                    {subModule?.module_title}
                  </span>
                </p>
                <p className="text-lg font-medium mb-4">
                  Sub-Module:{" "}
                  <span className="font-bold text-green-600">
                    {subModule?.title}
                  </span>
                </p>

                <p className="text-sm text-gray-500 italic">
                  {score >= questions.length * 10 * 0.7
                    ? "Great job! You're ready for the next sub-module. 🚀"
                    : "Don't worry, keep practicing and try again. 💪"}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      navigate("/modules");
                      setTimeout(() => window.location.reload(), 500);
                    }}
                  >
                    Save Quiz Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModuleQuiz;
