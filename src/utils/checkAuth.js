// src/utils/checkAuth.js or a custom hook
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // adjust the path

export const checkIsLoggedIn = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return (true, user); // logged in
    } else {
      return (false, null); // not logged in
    }
  });
};
