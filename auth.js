// ---------- AUTH.JS ----------

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { app } from "./script.js"; // import initialized firebase app

const auth = getAuth(app);

// SIGNIN form
const signinForm = document.getElementById("signinForm");
if (signinForm) {
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("inEmail").value;
    const password = document.getElementById("inPass").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
      window.location.href = "admin.html";
    } catch (err) {
      alert("❌ Login failed: " + err.message);
    }
  });
}

// SIGNUP form
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("suEmail").value;
    const password = document.getElementById("suPass").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created successfully!");
    } catch (err) {
      alert("❌ Signup failed: " + err.message);
    }
  });
}