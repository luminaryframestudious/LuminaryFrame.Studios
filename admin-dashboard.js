// =============================
// LuminaryFrame Studios | ADMIN DASHBOARD
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

// ===== Initialize Firebase =====
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ===== Check Admin Authentication =====
auth.onAuthStateChanged((user) => {
  if (!user || user.email !== "luminaryframestudios@gmail.com") {
    alert("Access denied. Only admin can access this page.");
    window.location.href = "auth.html";
  } else {
    loadOrders();
  }
});

// ===== Logout =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "auth.html";
  });
});

// ===== Load Orders =====
async function loadOrders() {
  const tbody = document.getElementById("ordersBody");
  tbody.innerHTML = "<tr><td colspan='8'>Loading orders...</td></tr>";

  try {
    const snapshot = await db.collection("bookings").orderBy("timestamp", "desc").get();
    tbody.innerHTML = "";

    if (snapshot.empty) {
      tbody.innerHTML = "<tr><td colspan='8'>No bookings yet.</td></tr>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.editApp}</td>
        <td>${data.editType}</td>
        <td>${data.paymentRequired ? "After Trial" : "Free Trial"}</td>
        <td>${data.status}</td>
        <td>
          ${data.fileURLs && data.fileURLs.length
            ? `<a href="${data.fileURLs[0]}" target="_blank">View</a>`
            : "No file"}
        </td>
        <td>
          <button class="btn" onclick="updateStatus('${id}', 'Approved')">Approve</button>
          <button class="btn" onclick="updateStatus('${id}', 'Rejected')">Reject</button>
          <button class="btn primary" onclick="uploadSample('${id}')">Upload Sample</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading orders:", err);
    tbody.innerHTML = "<tr><td colspan='8'>Error loading data.</td></tr>";
  }
}

// ===== Update Order Status =====
async function updateStatus(orderId, newStatus) {
  try {
    await db.collection("bookings").doc(orderId).update({
      status: newStatus,
    });
    alert(`Order marked as ${newStatus}`);
    loadOrders();
  } catch (err) {
    console.error("Error updating status:", err);
  }
}

// ===== Upload Final Sample =====
async function uploadSample(orderId) {
  const sampleURL = prompt("Enter the final sample video link (Google Drive / YouTube):");
  if (!sampleURL) return;

  try {
    await db.collection("bookings").doc(orderId).update({
      sampleLink: sampleURL,
      status: "Completed",
    });
    alert("Sample uploaded successfully!");
    loadOrders();
  } catch (err) {
    console.error("Error uploading sample:", err);
  }
}