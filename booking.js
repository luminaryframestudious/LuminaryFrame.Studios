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
}