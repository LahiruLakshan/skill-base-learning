import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Firebase initialized
import { collection, query, where, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f472b6", "#a78bfa", "#fb923c"];

export default function UserDashboard() {
  const [quizData, setQuizData] = useState([]);
    const uid = localStorage.getItem("uid");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "module_quiz"), where("uid", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizData(data);
    };
    fetchData();
  }, [uid]);

  // Prepare data
  const scoreByModule = quizData.map(d => ({
    name: d.module_title,
    score: d.score
  }));

  const levelDistribution = Object.values(
    quizData.reduce((acc, cur) => {
      acc[cur.level] = acc[cur.level] || { name: cur.level, value: 0 };
      acc[cur.level].value += 1;
      return acc;
    }, {})
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 User Quiz Analysis</h1>

      {/* Score per Module - Bar Chart */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Module Scores</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreByModule}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Level Distribution - Pie Chart */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Level Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={levelDistribution}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {levelDistribution.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
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
                  <a href={item.pdf_note} target="_blank" rel="noopener noreferrer">PDF</a>
                </td>
                <td className="p-2 text-blue-600 underline">
                  <a href={item.watch_videos} target="_blank" rel="noopener noreferrer">Video</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
