import { useState } from "react";
import { Button, Card, CardContent, Progress } from "../../components/ui";


const PreQuizComponent = ({ setUserLevel }) => {
  const [answers, setAnswers] = useState(Array(30).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const beginnerScore = answers.slice(0, 10).filter((a) => a).length;
    const intermediateScore = answers.slice(10, 20).filter((a) => a).length;
    const advancedScore = answers.slice(20, 30).filter((a) => a).length;
    
    if (advancedScore > 7) setUserLevel("Advanced");
    else if (intermediateScore > 7) setUserLevel("Intermediate");
    else setUserLevel("Beginner");

    setSubmitted(true);
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold">Skill Assessment Quiz</h2>
        {answers.map((_, index) => (
          <div key={index} className="my-2">
            <p>Question {index + 1}</p>
            <Button onClick={() => setAnswers([...answers.slice(0, index), true, ...answers.slice(index + 1)])}>Yes</Button>
            <Button onClick={() => setAnswers([...answers.slice(0, index), false, ...answers.slice(index + 1)])}>No</Button>
          </div>
        ))}
        <Button onClick={handleSubmit} disabled={submitted} className="mt-4">Submit</Button>
      </CardContent>
    </Card>
  );
};

const DashboardComponent = ({ userLevel }) => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold">Welcome to Your Learning Path</h2>
        <p>Your current level: <span className="font-bold">{userLevel}</span></p>
        <Progress value={userLevel === "Beginner" ? 10 : userLevel === "Intermediate" ? 50 : 100} />
      </CardContent>
    </Card>
  );
};

const LearningPathApp = () => {
  const [userLevel, setUserLevel] = useState(null);
  
  return (
    <div className="p-6">
      {!userLevel ? <PreQuizComponent setUserLevel={setUserLevel} /> : <DashboardComponent userLevel={userLevel} />}
    </div>
  );
};

export default LearningPathApp;
