// ---------- AUTH.JS ----------
// Only handles login/signup, no admin code

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { app } from "./script.js"; // import initialized firebase app

const auth = getAuth(app);

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
      // redirect to admin dashboard
      window.location.href = "admin.html"; // <-- no slash!
    } catch (err) {
      alert("❌ Login failed: " + err.message);
    }
  });
}

// SIGNUP (optional)
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created successfully!");
    } catch (err) {
      alert("❌ Signup failed: " + err.message);
    }
  });
}