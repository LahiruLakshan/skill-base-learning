import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Firebase initialized
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
} from "recharts";

const COLORS = [
  "#4ade80",
  "#60a5fa",
  "#facc15",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
];

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

      // Fetch all submodules
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

      // Check if all submodules for current level are completed
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


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 User Quiz Analysis</h1>
      {canLevelUp && localStorage.getItem("level") !== "Advanced" && (
        <div className="text-center mt-6">
          <button
            onClick={async () => {
              const levelOrder = ["Beginner", "Intermediate", "Advanced"];
              const nextLevelIndex = levelOrder.indexOf(userLevel) + 1;
              const nextLevel = levelOrder[nextLevelIndex] || "Advanced"; // Stay at Advanced if max

              await updateDoc(doc(db, "users", uid), {
                level: nextLevel,
              });

              setUserLevel(nextLevel);
              alert(`🎉 You've been upgraded to ${nextLevel} level!`);
              window.location.reload();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            🚀 Level Up to Next Stage
          </button>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-2">📘 Submodule Progress</h2>
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



      {/* Resources Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Module Resources</h2>
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
