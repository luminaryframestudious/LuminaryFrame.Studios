// =============================
// LuminaryFrame Studios | AUTH
// =============================

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyCXsyTLjLDM7wQ7TAcG3d3KSgPzWR-Hty4",
  authDomain: "luminaryframe-c80db.firebaseapp.com",
  projectId: "luminaryframe-c80db",
  storageBucket: "luminaryframe-c80db.firebasestorage.app",
  messagingSenderId: "1075557950621",
  appId: "1:1075557950621:web:30d0d86ceddbb8a2eee074",
  measurementId: "G-E6ZRPKCJSH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ====== Form Switch Logic ======
const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");

document.getElementById("showSignup").addEventListener("click", () => {
  loginContainer.style.display = "none";
  signupContainer.style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", () => {
  signupContainer.style.display = "none";
  loginContainer.style.display = "block";
});

// ====== Login Function ======
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      if (user.email === "luminaryframestudios@gmail.com") {
        // Redirect Admin
        alert("Welcome Admin!");
        window.location.href = "admin.html";
      } else {
        // Redirect Client
        alert("Login successful!");
        window.location.href = "booking.html";
      }
    })
    .catch(error => {
      console.error("Login Error:", error.message);
      alert(error.message);
    });
});

// ====== Signup Function ======
document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Account created successfully! Please log in.");
      signupContainer.style.display = "none";
      loginContainer.style.display = "block";
    })
    .catch(error => {
      console.error("Signup Error:", error.message);
      alert(error.message);
    });
});

// ====== Auth State Listener ======
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("User logged out");
  }
});