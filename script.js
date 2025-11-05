// script.js (Firebase v9.22.2)
<script>
document.getElementById("submitBooking").addEventListener("click", function(e) {
  e.preventDefault();

  // Get values from form fields
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const category = document.getElementById("category").value;
  const style = document.getElementById("style").value;

  if (!name || !email) {
    Swal.fire({
      icon: "error",
      title: "Missing Info",
      text: "Please fill all required fields before submitting."
    });
    return;
  }

  // Prepare EmailJS params
  const params = {
    name: name,
    email: email,
    category: category,
    style: style,
    to_email: "luminaryframestudios@gmail.com" // your admin email
  };
<script>
document.getElementById("submitBooking").addEventListener("click", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const category = document.getElementById("category").value;
  const style = document.getElementById("style").value;

  if (!name || !email || !category || !style) {
    Swal.fire({
      icon: "error",
      title: "Missing Information",
      text: "Please fill all the required fields before submitting your booking."
    });
    return;
  }

  const params = {
    name: name,
    email: email,
    category: category,
    style: style
  };

  emailjs.send("service_as09ic9", "template_ba64mye" params)
    .then(function(response) {
      Swal.fire({
        icon: "success",
        title: "Booking Sent Successfully!",
        text: "Thank you! Your booking has been received. We'll contact you soon.",
        confirmButtonColor: "#ff007f"
      });
    }, function(error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send Booking",
        text: "Please check your internet connection or try again later."
      });
    });
});
</script>
  // Send booking email to admin
  emailjs.send("service_as09ic9", "template_ba64mye", params)
    .then(function(response) {
      console.log("SUCCESS!", response.status, response.text);
      Swal.fire({
        icon: "success",
        title: "Booking Submitted!",
        text: "Thank you! We’ve received your order. Our team will contact you soon.",
        showConfirmButton: true,
        confirmButtonColor: "#ff007f"
      });
    }, function(error) {
      console.log("FAILED...", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Send",
        text: "There was a problem submitting your booking. Please try again later."
</script>
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 🔹 Your Firebase configuration (unchanged)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// 🔹 Image upload handler (for booking page)
const fileInput = document.getElementById("clipUpload");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");
let uploadedFileURL = "";

if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    const file = fileInput?.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      const fileRef = storageRef(storage, `uploads/${file.name}`);
      await uploadBytes(fileRef, file);
      uploadedFileURL = await getDownloadURL(fileRef);
      uploadStatus.textContent = "✅ File uploaded successfully!";
    } catch (error) {
      console.error("Upload failed:", error);
      uploadStatus.textContent = "❌ Upload failed. Try again.";
export { app, db, storage, uploadedFileURL };