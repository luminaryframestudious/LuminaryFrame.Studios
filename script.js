// script.js (type=module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import {
  getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

/* -----------------------------
   Replace config with provided one
   ----------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyCXsyTLjLDM7wQ7TAcG3d3KSgPzWR-Hty4",
  authDomain: "luminaryframe-c80db.firebaseapp.com",
  projectId: "luminaryframe-c80db",
  storageBucket: "luminaryframe-c80db.firebasestorage.app",
  messagingSenderId: "1075557950621",
  appId: "1:1075557950621:web:30d0d86ceddbb8a2eee074",
  measurementId: "G-E6ZRPKCJSH"
};

const app = initializeApp(firebaseConfig);
try { getAnalytics(app); } catch(e){ /* analytics may fail on some hosts */ }

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

/* Small UI setup */
document.getElementById('year').textContent = new Date().getFullYear();

/* Smooth scroll enhancement for anchor links (if extra) */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href === '#') return;
    const el = document.querySelector(href);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  })
});

/* ---------- Booking form logic ---------- */
const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');

function validateEmail(email){
  // simple regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function uploadFiles(files, bookingId){
  const urls = [];
  for(let i=0;i<files.length;i++){
    const f = files[i];
    const path = `bookings/${bookingId}/${Date.now()}_${f.name}`;
    const ref = storageRef(storage, path);
    const snapshot = await uploadBytes(ref, f);
    const url = await getDownloadURL(snapshot.ref);
    urls.push({name: f.name, url});
  }
  return urls;
}

bookingForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  bookingStatus.textContent = 'Submitting...';
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const appChoice = document.getElementById('app').value;
  const type = document.getElementById('type').value;
  const notes = document.getElementById('notes').value.trim();
  const files = document.getElementById('fileUpload').files;

  if(!name || !email || !phone){ bookingStatus.textContent = 'Please fill name, email and phone.'; return; }
  if(!validateEmail(email)){ bookingStatus.textContent = 'Please provide a valid email.'; return; }

  try {
    // create a booking doc with a temp id (Firestore auto id)
    const docRef = await addDoc(collection(db, 'bookings'), {
      name, email, phone, appChoice, type, notes,
      createdAt: serverTimestamp(),
      status: 'pending',
      files: []
    });

    // upload files and update doc with URLs
    if(files && files.length>0){
      const uploaded = await uploadFiles(files, docRef.id);
      // update the booking doc with file urls
      await addDoc(collection(db, `bookings/${docRef.id}/uploads`), { uploadedAt: serverTimestamp() }); // optional subcollection record
      // write files array on booking (simple approach: delete & re-add)
      // Firestore doesn't have partial array write easily here, so update using a new doc
      await addDoc(collection(db, 'bookingUpdates'), { bookingId: docRef.id, uploaded });
      // Simpler: update document with files field using updateDoc if required (left as exercise)
    }

    bookingStatus.innerHTML = `Booking submitted ✅ Please pay via UPI: <strong>9239529167@fam</strong>. We will contact you soon.`;
    bookingForm.reset();
  } catch(err){
    console.error(err);
    bookingStatus.textContent = 'Error submitting booking — try again.';
  }
});

/* Optional: show current auth state (not required on main page) */
onAuthStateChanged(auth, user=>{
  if(user){
    // logged in
    console.log('Logged in as', user.email);
  } else {
    console.log('Not logged in');
  }
});// --------- PAYMENT & BOOKING HANDLER ---------

// Get elements from your booking form
const bookingForm = document.getElementById('bookingForm');
const editTypeSelect = document.getElementById('editType'); // dropdown for type (Cinematic, VFX etc.)
const payButton = document.getElementById('submitBooking'); // your booking submit button

// Define price list (editable anytime)
const editPrices = {
  cinematic: 50,
  vfx: 80,
  ai: 70,
  transition: 60,
  "3d": 90
};

payButton.addEventListener('click', (e) => {
  e.preventDefault();

  const selectedType = editTypeSelect.value;
  if (!selectedType) {
    alert("Please select an edit type before payment!");
    return;
  }

  const amount = editPrices[selectedType.toLowerCase()] || 100;

  // Create dynamic UPI payment link
  const upiLink = `intent://pay?pa=9239529167@fam&pn=LuminaryFrame%20Studios&am=${amount}&cu=INR#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end;`;

  // Open Google Pay
  window.location.href = upiLink;

  // Wait for user to confirm payment
  setTimeout(() => {
    const confirmPayment = confirm("After completing the payment, press OK to confirm and submit your booking.");
    if (confirmPayment) {
      // Here you can call your Firebase submission function
      submitBookingToFirebase();
    }
  }, 5000); // waits 5 seconds before showing confirmation
});

// Example Firebase submission function
function submitBookingToFirebase() {
  // Add your existing Firebase upload or save logic here
  alert("Payment confirmed ✅ Booking data will now be submitted to Firebase!");
  // Example:
  // addDoc(collection(db, "bookings"), bookingData);
}const payNowBtn = document.getElementById("payNowBtn");
const submitBtn = document.querySelector("button[type='submit']");
const txnInput = document.getElementById("txnId");

submitBtn.disabled = true; // disable until paid

payNowBtn.addEventListener("click", () => {
  // open UPI payment intent link
  window.location.href = "upi://pay?pa=9239529167@fam&pn=LuminaryFrame%20Studios&cu=INR";
});

txnInput.addEventListener("input", () => {
  if (txnInput.value.trim().length > 5) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});const amount = document.getElementById("priceField").value;