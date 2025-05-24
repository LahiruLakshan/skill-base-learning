import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";
import { logoLight } from "../../assets/images";
import { BACKEND_URL } from "../../constants/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; // adjust path if needed
import { doc, setDoc } from 'firebase/firestore';

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
    setErrEmail("Enter your email");
    return;
  }

  if (!password) {
    setErrPassword("Enter your password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("user : ", user.uid);
    
    setSuccessMsg("Login successful! Redirecting...");
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
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <h1 className="font-titleFont text-xl font-medium">Stay signed in for more</h1>
          <p className="text-base">When you sign in, you are with us!</p>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">{successMsg}</p>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mb-4">
                Sign in
              </h1>
              {errorMsg && (
                <p className="text-sm text-red-500 font-titleFont font-semibold">{errorMsg}</p>
              )}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">Work Email</p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-8 px-4 text-base font-medium rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="john@workemail.com"
                  />
                  {errEmail && <p className="text-sm text-red-500">{errEmail}</p>}
                </div>

                <div className="flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">Password</p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 px-4 text-base font-medium rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Enter password"
                  />
                  {errPassword && <p className="text-sm text-red-500">{errPassword}</p>}
                </div>

                <button
                  onClick={handleSignIn}
                  className="bg-primeColor hover:bg-black text-gray-200 w-full text-base font-medium h-10 rounded-md duration-300"
                >
                  Sign In
                </button>
                <p className="text-sm text-center">
                  Don't have an Account?{" "}
                  <Link to="/signup" className="hover:text-blue-600 duration-300">
                    Sign up
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

export default SignIn;
