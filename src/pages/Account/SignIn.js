import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
    setErrorMsg("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
    setErrorMsg("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrEmail("Please enter your email.");
      return;
    }

    if (!password) {
      setErrPassword("Please enter your password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setSuccessMsg("✅ Login successful! Redirecting to Home Page...");
      localStorage.setItem("authToken", user.accessToken);
      localStorage.setItem("uid", user.uid);

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMsg("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {successMsg ? (
          <div className="text-center">
            <p className="text-green-600 text-lg font-semibold mb-4">{successMsg}</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSignIn}>
            <h1 className="text-3xl font-bold text-blue-700 text-center">🔐 Sign In to Quiz Portal</h1>
            {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={handleEmail}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
              />
              {errEmail && <p className="text-sm text-red-500 mt-1">{errEmail}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePassword}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
              {errPassword && <p className="text-sm text-red-500 mt-1">{errPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              Sign In
            </button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
