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
      localStorage.removeItem("authToken")
      localStorage.removeItem("uid")
      navigate("/"); // or navigate to login
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!userData) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>

        <div className="space-y-3 text-left">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>User ID:</strong> {userData.id}</p>
          <p><strong>Type:</strong> {userData.type}</p>
          <p><strong>Level:</strong> {userData.level}</p>
          <p><strong>Joined:</strong> {new Date(userData.createdAt.seconds * 1000).toLocaleString()}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
