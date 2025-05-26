import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = [
  "#4ade80",
  "#60a5fa",
  "#facc15",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
];
const LEVEL_COLORS = {
  Beginner: "#facc15",
  Intermediate: "#a78bfa",
  Advanced: "#f472b6",
};

export default function UserDashboard() {
  const [quizData, setQuizData] = useState([]);
  const [userLevel, setUserLevel] = useState("");
  const [completedSubModules, setCompletedSubModules] = useState([]);
  const [allSubModules, setAllSubModules] = useState([]);
  const [canLevelUp, setCanLevelUp] = useState(false);

  const uid = localStorage.getItem("uid");

  const isCompleted = (subId) => {
    return completedSubModules.some((sm) => sm?.data?.id === subId);
  };

  useEffect(() => {
    const fetchData = async () => {
      const quizQ = query(
        collection(db, "module_quiz"),
        where("uid", "==", uid)
      );
      const quizSnap = await getDocs(quizQ);
      const quizData = quizSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizData(quizData);

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      if (userSnap.exists()) {
        setUserLevel(userData.level);
        setCompletedSubModules(userData.sub_modules || []);
      }

      const subModulesSnap = await getDocs(collection(db, "sub_modules"));
      const allSubs = subModulesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredSubs = allSubs.filter((mod) =>
        localStorage.getItem("level") === "Beginner"
          ? mod.level === "Beginner"
          : localStorage.getItem("level") === "Intermediate"
          ? mod.level === "Beginner" || mod.level === "Intermediate"
          : mod.level === "Beginner" ||
            mod.level === "Intermediate" ||
            mod.level === "Advanced"
      );
      setAllSubModules(filteredSubs);

      const levelSubs = filteredSubs.filter(
        (mod) => mod.level === userData.level
      );
      const completedIds = (userData.sub_modules || []).map(
        (sm) => sm?.data?.id
      );
      const allLevelSubsCompleted = levelSubs.every((sub) =>
        completedIds.includes(sub.id)
      );
      setCanLevelUp(allLevelSubsCompleted);
    };

    fetchData();
  }, [uid]);

  const quizScores = quizData.map((item) => ({
    name:
      item.title.length > 20
        ? item.title
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
        : item.title,
    score: item.score,
  }));

  const pieChartData = [
    { name: "Completed", value: completedSubModules.length },
    {
      name: "Remaining",
      value: allSubModules.length - completedSubModules.length,
    },
  ];

  const levelCompletionCount = completedSubModules.reduce((acc, sub) => {
    const level = sub?.data?.level || "Unknown";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const levelPieData = Object.entries(levelCompletionCount).map(
    ([level, count]) => ({
      name: level,
      value: count,
      fill: LEVEL_COLORS[level] || "#ccc",
    })
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 User Quiz Dashboard</h1>

      {canLevelUp && localStorage.getItem("level") !== "Advanced" && (
        <div className="text-center mt-4">
          <button
            onClick={async () => {
              const levelOrder = ["Beginner", "Intermediate", "Advanced"];
              const nextLevelIndex = levelOrder.indexOf(userLevel) + 1;
              const nextLevel = levelOrder[nextLevelIndex] || "Advanced";

              await updateDoc(doc(db, "users", uid), {
                level: nextLevel,
              });

              setUserLevel(nextLevel);
              alert(`🎉 You've been upgraded to ${nextLevel} level!`);
              window.location.reload();
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow"
          >
            🚀 Level Up to Next Stage
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">📘 Submodule Progress</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Module</th>
              <th className="p-2 text-left">Submodule</th>
              <th className="p-2 text-left">Level</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {allSubModules.map((mod, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{mod.module_title}</td>
                <td className="p-2">{mod.title}</td>
                <td className="p-2">{mod.level}</td>
                <td className="p-2">
                  {isCompleted(mod.id) ? (
                    <span className="text-green-600 font-semibold">
                      ✅ Completed
                    </span>
                  ) : (
                    <span className="text-gray-500">❌ Not Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">
            🧠 Completed Submodules by Level
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={levelPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {levelPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Completion Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">📈 Module Scores</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quizScores}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">🎥 Module Resources</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Module</th>
              <th className="p-2 text-left">PDF</th>
              <th className="p-2 text-left">Video</th>
            </tr>
          </thead>
          <tbody>
            {quizData.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{item.module_title}</td>
                <td className="p-2 text-blue-600 underline">
                  <a
                    href={item.pdf_note}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PDF
                  </a>
                </td>
                <td className="p-2 text-blue-600 underline">
                  <a
                    href={item.watch_videos}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Video
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
