import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase"; // adjust path if needed
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        id: userCredential.user.uid,
        email: email,
        name: username,
        type: "User", // Hardcoded as Admin for this signup
        level: "None",
        createdAt: new Date(),
      });
      setSuccessMsg("Account created successfully! Redirecting to Sign In...");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
      console.log("User registered:", userCredential.user);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <h1 className="font-titleFont text-xl font-medium">Join us today</h1>
          <p className="text-base">Create an account to get started!</p>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mb-4">
                Sign Up
              </h1>
              {errorMsg && (
                <p className="text-sm text-red-500 font-titleFont font-semibold">
                  {errorMsg}
                </p>
              )}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Username
                  </p>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className="w-full h-8 px-4 text-base font-medium rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Enter username"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Email
                  </p>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full h-8 px-4 text-base font-medium rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full h-8 px-4 text-base font-medium rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Enter password"
                  />
                </div>
                {/* <div className="flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">Role</p>
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                    className="w-full h-8 px-4 text-base font-medium rounded-md border-[1px] border-gray-400 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div> */}
                <button
                  onClick={handleSignUp}
                  className="bg-primeColor hover:bg-black text-gray-200 w-full text-base font-medium h-10 rounded-md duration-300"
                >
                  Sign Up
                </button>
                <p className="text-sm text-center">
                  Already have an Account?{" "}
                  <Link
                    to="/signin"
                    className="hover:text-blue-600 duration-300"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
