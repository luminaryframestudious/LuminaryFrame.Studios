// booking.js - cleaned for Android/mobile use (non-module)
// This file relies on window.submitBookingToFirebase being defined by script.js (module).

// elements (IDs must match index.html)
const bookingForm = document.getElementById("bookingForm");
const editTypeSelect = document.getElementById("editType");
const payNowButton = document.getElementById("payNowButton");
const submitBtn = document.getElementById("submitBooking");
const openGalleryBtn = document.getElementById("openGalleryBtn");
const uploadClips = document.getElementById("uploadClips");
const fileCount = document.getElementById("fileCount");
const txnInput = document.getElementById("txnId");
const bookingStatus = document.getElementById("bookingStatus");

// price list
const editPrices = {
  cinematic: 05,
  vfx: 05,
  ai: 05,
  transition: 05,
  "3d": 05,
  "intro edit": 05,
  "logo design": 05
};

// File picker
if (openGalleryBtn && uploadClips) {
  openGalleryBtn.addEventListener("click", () => uploadClips.click());
  uploadClips.addEventListener("change", (e) => {
    const count = e.target.files.length;
    if (fileCount) fileCount.textContent = count > 0 ? `${count} file(s) selected` : "";
  });
}

// UPI payment: opens UPI app on Android
if (payNowButton) {
  payNowButton.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedType = editTypeSelect ? editTypeSelect.value : "";
    if (!selectedType) return alert("Please select an edit type before payment!");
    const amount = (editPrices[selectedType.toLowerCase()] || 50);
    const upiId = "9239529167@fam";
    const name = "LuminaryFrame Studios";
    // UPI intent: both common schemes used - most Android UPI apps support "upi://pay"
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent("Editing Payment")}`;
    // open UPI app
    window.location.href = upiLink;
    // prompt user to paste txn id after payment
    setTimeout(() => {
      const ok = confirm("After completing payment in your UPI app, press OK and paste the UPI transaction ID in the UPI Transaction ID field.");
      if (ok && txnInput) txnInput.focus();
    }, 1200);
  });
}

// enable submit only when txn looks valid (client-side)
if (submitBtn && txnInput) {
  submitBtn.disabled = true;
  txnInput.addEventListener("input", () => {
    submitBtn.disabled = txnInput.value.trim().length < 6;
  });
}

// booking form submit (calls Firebase handler exposed on window)
if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bookingData = {
      name: document.getElementById('name')?.value.trim() || '',
      email: document.getElementById('email')?.value.trim() || '',
      phone: document.getElementById('phone')?.value.trim() || '',
      appChoice: document.getElementById('app')?.value || '',
      type: editTypeSelect ? editTypeSelect.value : '',
      notes: document.getElementById('notes')?.value.trim() || '',
      txnId: txnInput ? txnInput.value.trim() : null,
      status: (txnInput && txnInput.value.trim().length > 5) ? "confirmed" : "pending_payment",
      timestamp: new Date().toISOString()
    };

    // basic client-side validation
    if (!bookingData.name || !bookingData.email || !bookingData.phone) {
      if (bookingStatus) bookingStatus.textContent = 'Please fill all required fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
      if (bookingStatus) bookingStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    // call Firebase handler (it is attached to window by script.js)
    if (typeof window.submitBookingToFirebase === "function") {
      // show a small status
      if (bookingStatus) bookingStatus.textContent = 'Preparing to submit booking...';
      const files = uploadClips ? uploadClips.files : [];
      const res = await window.submitBookingToFirebase(bookingData, files);
      if (!res || !res.success) {
        console.error('Booking failed', res && res.error ? res.error : 'unknown');
      }
    } else {
      // fallback if the module didn't load or function missing
      alert("Booking ready to submit (Firebase handler missing). You can test payment & upload UI.");
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
    }
  });
}