// script.js (type=module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import {
  getFirestore, collection, addDoc, serverTimestamp, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

/* -----------------------------
   Firebase Config (Corrected)
----------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyCXsyTLjLDM7wQ7TAcG3d3KSgPzWR-Hty4",
  authDomain: "luminaryframe-c80db.firebaseapp.com",
  projectId: "luminaryframe-c80db",
  storageBucket: "luminaryframe-c80db.appspot.com",
  messagingSenderId: "1075557950621",
  appId: "1:1075557950621:web:30d0d86ceddbb8a2eee074",
  measurementId: "G-E6ZRPKCJSH"
};

const app = initializeApp(firebaseConfig);
try { getAnalytics(app); } catch (e) { /* analytics optional */ }

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

/* ---------- UI Setup ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- Booking & Payment Logic ---------- */
const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');
const editTypeSelect = document.getElementById('editType');
const payNowButton = document.getElementById('payNowButton');
const submitBookingBtn = document.getElementById('submitBooking');
const txnInput = document.getElementById('txnId');
const uploadInput = document.getElementById('uploadClips');
const fileCount = document.getElementById('fileCount');

/* Show file count when user selects files */
uploadInput?.addEventListener('change', () => {
  const count = uploadInput.files.length;
  fileCount.textContent = count > 0 ? `${count} file(s) selected` : '';
});

/* Disable submit until payment ID entered */
submitBookingBtn.disabled = true;
txnInput?.addEventListener('input', () => {
  submitBookingBtn.disabled = txnInput.value.trim().length <= 5;
});

/* Payment Button (opens UPI intent) */
payNowButton?.addEventListener('click', () => {
  const selectedType = editTypeSelect.value;
  const editPrices = {
    cinematic: 50,
    vfx: 80,
    ai: 70,
    transition: 60,
    "3d edit": 90,
    "intro edit": 50,
    "logo design": 40
  };
  const amount = editPrices[selectedType.toLowerCase()] || 100;

  const upiLink = `intent://pay?pa=9239529167@fam&pn=LuminaryFrame%20Studios&am=${amount}&cu=INR#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end;`;
  window.location.href = upiLink;

  setTimeout(() => {
    alert("After completing payment, please enter your Transaction ID and submit the booking.");
  }, 3000);
});

/* ---------- Submit Booking to Firebase ---------- */
async function submitBookingToFirebase(bookingData, filesList) {
  try {
    bookingStatus.textContent = 'Submitting booking...';

    // Add booking document
    const newDoc = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: serverTimestamp(),
      files: []
    });

    // Upload files (if any)
    if (filesList && filesList.length > 0) {
      const uploaded = [];
      for (let i = 0; i < filesList.length; i++) {
        const f = filesList[i];
        const path = `bookings/${newDoc.id}/${Date.now()}_${f.name}`;
        const ref = storageRef(storage, path);
        const snap = await uploadBytes(ref, f);
        const url = await getDownloadURL(snap.ref);
        uploaded.push({ name: f.name, url });
      }
      // Update document with file URLs
      await updateDoc(doc(db, 'bookings', newDoc.id), { files: uploaded });
    }

    bookingStatus.innerHTML = `✅ Booking submitted successfully! We'll contact you soon.`;
    bookingForm.reset();
    fileCount.textContent = '';
    submitBookingBtn.disabled = true;

  } catch (err) {
    console.error(err);
    bookingStatus.textContent = '❌ Error submitting booking. Try again.';
  }
}

/* Handle booking form submission */
bookingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookingData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    app: document.getElementById('app').value,
    type: editTypeSelect.value,
    notes: document.getElementById('notes').value.trim(),
    txnId: txnInput.value.trim(),
  };

  if (!bookingData.name || !bookingData.email || !bookingData.phone) {
    bookingStatus.textContent = 'Please fill all required fields.';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
    bookingStatus.textContent = 'Please enter a valid email address.';
    return;
  }

  await submitBookingToFirebase(bookingData, uploadInput.files);
});

/* ---------- Auth State Log ---------- */
onAuthStateChanged(auth, user => {
  console.log(user ? `Logged in as ${user.email}` : 'Not logged in');
});