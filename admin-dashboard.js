// ---------- ADMIN DASHBOARD.JS ----------
// Runs only after login success (on admin.html)

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { app } from "./script.js";

const db = getFirestore(app);

// Example: fetch all bookings
async function loadBookings() {
  const list = document.getElementById("bookingList");
  if (!list) return;

  list.innerHTML = "<p>Loading bookings...</p>";
  const snapshot = await getDocs(collection(db, "bookings"));

  let html = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    html += `
      <div class="booking-card">
        <h3>${data.name || "Unnamed"}</h3>
        <p>Email: ${data.email}</p>
        <p>Type: ${data.type}</p>
        <p>Status: ${data.status}</p>
        <button onclick="deleteBooking('${docSnap.id}')">🗑️ Delete</button>
      </div>`;
  });

  list.innerHTML = html || "<p>No bookings yet.</p>";
}

// delete booking
window.deleteBooking = async (id) => {
  if (confirm("Delete this booking?")) {
    await deleteDoc(doc(db, "bookings", id));
    alert("Deleted!");
    loadBookings();
  }
};

// Run on page load
document.addEventListener("DOMContentLoaded", loadBookings);