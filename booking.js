// booking.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCXsyTLjLDM7wQ7TAcG3d3KSgPzWR-Hty4",
  authDomain: "luminaryframe-c80db.firebaseapp.com",
  projectId: "luminaryframe-c80db",
  storageBucket: "luminaryframe-c80db.appspot.com",
  messagingSenderId: "1075557950621",
  appId: "1:1075557950621:web:30d0d86ceddbb8a2eee074",
  measurementId: "G-E6ZRPKCJSH"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Initialize EmailJS
(function() {
  emailjs.init("24wLt-L5koQCAR4cW"); // your EmailJS public key
})();

// ✅ Handle booking form submission
const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = bookingForm["name"].value;
    const email = bookingForm["email"].value;
    const category = bookingForm["category"].value;
    const style = bookingForm["style"].value;
    const message = bookingForm["message"].value;
    const clipLink = bookingForm["clipLink"].value;

    try {
      // 🔹 Save booking data to Firestore
      await addDoc(collection(db, "bookings"), {
        name,
        email,
        category,
        style,
        message,
        clipLink,
        createdAt: serverTimestamp()
      });

      // 🔹 Send booking info via EmailJS
      const templateParams = { name, email, category, style, message, clipLink };
      await emailjs.send("service_as09ic9", "template_ba64mye", templateParams);

      // 🔹 Show success popup
      alert("🎬 Your booking has been submitted successfully! We'll contact you soon.");
      bookingForm.reset();

    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("❌ Failed to submit booking. Please try again.");
    }
  });
}

// ✅ Pay button (UPI redirect)
const payBtn = document.querySelector(".pay-btn");
if (payBtn) {
  payBtn.addEventListener("click", () => {
    const upiLink = "upi://pay?pa=9239529167@fam&pn=LuminaryFrame%20Studios&cu=INR&am=50";
    window.location.href = upiLink;
  });
}

// ✅ File upload button (choose from gallery)
const uploadBtn = document.querySelector(".upload-btn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    document.getElementById("clipUpload").click();
  });
}