// --------- PAYMENT & BOOKING HANDLER ---------

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
}{
  name,
  email,
  phone,
  app,
  type,
  notes,
  clips,
  txnId: txnInput.value || null,
  status: txnInput.value ? "confirmed" : "pending_payment",
  timestamp: new Date().toISOString()
}// ---------- UPI Payment Redirect ----------
document.addEventListener("DOMContentLoaded", function () {
  const payNowButton = document.getElementById("payNowButton");

  if (payNowButton) {
    payNowButton.addEventListener("click", function () {
      // Replace with your actual UPI details
      const upiId = "9239529167@fam";
      const name = "LuminaryFrame Studios";
      const amount = "50"; // Changeable or dynamic later
      const note = "Editing Payment";

      // Create UPI link
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

      // Redirect to UPI app
      window.location.href = upiLink;
      // Open file picker (gallery)
document.getElementById('openGalleryBtn').addEventListener('click', () => {
  document.getElementById('uploadClips').click();
});

// Show how many files are selected
document.getElementById('uploadClips').addEventListener('change', (e) => {
  const count = e.target.files.length;
  document.getElementById('fileCount').textContent = count > 0 ? `${count} file(s) selected` : '';
  document.addEventListener('DOMContentLoaded', () => {
  const openGalleryBtn = document.getElementById('openGalleryBtn');
  const uploadClips = document.getElementById('uploadClips');
  const fileCount = document.getElementById('fileCount');

  openGalleryBtn.addEventListener('click', () => {
    uploadClips.click();
  });

  uploadClips.addEventListener('change', (e) => {
    const count = e.target.files.length;
    fileCount.textContent = count > 0 ? `${count} file(s) selected` : '';
});
    });
  }
});