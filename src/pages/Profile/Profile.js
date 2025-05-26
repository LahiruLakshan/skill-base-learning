import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase"; // Import your Firebase setup
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data());
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("uid");
      navigate("/"); // or navigate to login
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!userData) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  const formattedDate = new Date(
    userData.createdAt?.seconds * 1000
  ).toLocaleString();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {" "}
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          👤 Your Profile
        </h1>

        <div className="grid grid-cols-2 gap-4 text-left text-gray-700 mb-6">
          <div>
            <p className="font-semibold">Name:</p>
            <p>{userData.name}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{userData.email}</p>
          </div>
          <div>
            <p className="font-semibold">User ID:</p>
            <p>{userData.id}</p>
          </div>
          <div>
            <p className="font-semibold">Type:</p>
            <p>{userData.type}</p>
          </div>
          <div>
            <p className="font-semibold">Level:</p>
            <p className="text-green-600 font-medium">{userData.level}</p>
          </div>
          <div>
            <p className="font-semibold">Joined:</p>
            <p>{formattedDate}</p>
          </div>
        </div>

        <div className="text-left space-y-2 mb-6">
          <h2 className="text-lg font-semibold text-blue-600">
            📌 Quick Links
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>
              <Link to="/dashboard" className="text-blue-500 hover:underline">
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/practice-quiz"
                className="text-blue-500 hover:underline"
              >
                🧠 Practice Quiz
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
