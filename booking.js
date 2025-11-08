// =============================
// LuminaryFrame Studios | BOOKING SYSTEM
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

// Initialize Firebase + EmailJS
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
emailjs.init("24wLt-L5koQCAR4cW");

// ===== Current User =====
let currentUser = null;
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("email").value = user.email;
  } else {
    alert("Please log in first!");
    window.location.href = "auth.html";
  }
});

// ====== Pay Button ======
document.getElementById("payBtn").addEventListener("click", () => {
  alert("Redirecting to your UPI app or show QR Code...");
  // Example: open UPI intent (works on mobile)
  window.location.href =
    "upi://pay?pa=9239529167@fam&pn=LuminaryFrameStudios&am=5&cu=INR";
});

// ====== Booking Form ======
const bookingForm = document.getElementById("bookingForm");
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const editApp = document.getElementById("editApp").value;
  const editType = document.getElementById("editType").value;
  const notes = document.getElementById("notes").value.trim();
  const fileUpload = document.getElementById("fileUpload").files;

  if (!name || !email || !phone || !editApp || !editType) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    // ===== Count User's Previous Orders =====
    const orderSnap = await db.collection("bookings")
      .where("userId", "==", currentUser.uid)
      .get();

    const orderCount = orderSnap.size;
    let paymentRequired = orderCount >= 5;

    // ===== File Upload (Optional) =====
    let fileURLs = [];
    if (fileUpload.length > 0) {
      for (const file of fileUpload) {
        const storageRef = storage.ref(`uploads/${currentUser.uid}/${file.name}`);
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();
        fileURLs.push(url);
      }
    }

    // ===== Save Booking =====
    const bookingData = {
      name,
      email,
      phone,
      editApp,
      editType,
      notes,
      fileURLs,
      userId: currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      paymentRequired,
      status: "Pending"
    };

    await db.collection("bookings").add(bookingData);

    // ===== Send Email Notification (to Admin) =====
    await emailjs.send("service_as09ic9", "template_ba64mye", {
      user_name: name,
      user_email: email,
      edit_app: editApp,
      edit_type: editType,
      message: notes,
      payment_status: paymentRequired ? "Paid / After Trial" : "Free Trial",
    });

    alert(paymentRequired
      ? "Booking submitted! Payment verification pending."
      : "Booking submitted! (Free trial used.)"
    );

    bookingForm.reset();
  } catch (error) {
    console.error("Booking Error:", error);
    alert("Error submitting booking. Please try again.");
  }
}); 