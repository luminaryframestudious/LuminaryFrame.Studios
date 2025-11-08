// ============================
// LuminaryFrame Studios Script
// ============================

// ===== Firebase Initialization =====
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

// ===== EmailJS Initialization =====
(function() {
  emailjs.init("24wLt-L5koQCAR4cW"); // your public key
})();

// ===== Button Navigation Functions =====
function goToBooking() {
  window.location.href = "auth.html"; // Client Login / Booking Page
}

function goToGallery() {
  window.location.href = "booking.html"; // Gallery / Track Orders (for logged-in users)
}

// ===== Optional: Preloader or Animation (Future Use) =====
// You can add a loader or fade-in effect later if you want.