// booking.js - cleaned for Android/mobile use

// elements (IDs must match index.html)
const bookingForm = document.getElementById("bookingForm");
const editTypeSelect = document.getElementById("editType");
const payNowButton = document.getElementById("payNowButton");
const submitBtn = document.getElementById("submitBooking");
const openGalleryBtn = document.getElementById("openGalleryBtn");
const uploadClips = document.getElementById("uploadClips");
const fileCount = document.getElementById("fileCount");
const txnInput = document.getElementById("txnId");

// price list
const editPrices = {
  cinematic: 50,
  vfx: 80,
  ai: 70,
  transition: 60,
  "3d": 90
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
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Editing Payment")}`;
    // open UPI app
    window.location.href = upiLink;
    // prompt user to paste txn id after payment
    setTimeout(() => {
      const ok = confirm("After completing payment in your UPI app, press OK and paste the UPI transaction ID in the UPI Transaction ID field.");
      if (ok && txnInput) txnInput.focus();
    }, 1500);
  });
}

// enable submit only when txn looks valid (client-side)
if (submitBtn && txnInput) {
  submitBtn.disabled = true;
  txnInput.addEventListener("input", () => {
    submitBtn.disabled = txnInput.value.trim().length < 6;
  });
}

// booking form submit (calls Firebase function if available)
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const bookingData = {
      name: document.getElementById('name')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      appChoice: document.getElementById('app')?.value || '',
      type: editTypeSelect ? editTypeSelect.value : '',
      notes: document.getElementById('notes')?.value || '',
      txnId: txnInput ? txnInput.value.trim() : null,
      status: txnInput && txnInput.value.trim().length > 5 ? "confirmed" : "pending_payment",
      timestamp: new Date().toISOString()
    };
    // If you have submitBookingToFirebase in script.js, call it with files.
    if (typeof submitBookingToFirebase === "function") {
      submitBookingToFirebase(bookingData, uploadClips?.files);
    } else {
      alert("Booking ready to submit (Firebase handler missing). You can test payment & upload UI.");
    }
  });
}