// admin-dashboard.js (type=module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const adminList = document.getElementById('adminList');
const adminInfo = document.getElementById('adminInfo');
const refreshBtn = document.getElementById('refreshBtn');

const ADMIN_EMAIL = "mallikabdurrahman37@gmail.com"; // change if needed

onAuthStateChanged(auth, user=>{
  if(user){
    adminInfo.textContent = 'Signed in as ' + user.email;
    if(user.email !== ADMIN_EMAIL){
      adminInfo.innerHTML += ' — You are not the admin. Limited view.';
    }
    loadBookings();
  } else {
    adminInfo.textContent = 'Not signed in. Please sign in at Login page.';
  }
});

async function loadBookings(){
  adminList.innerHTML = 'Loading bookings...';
  try{
    const q = query(collection(db, 'bookings'), orderBy('createdAt','desc'));
    const snap = await getDocs(q);
    if(snap.empty){ adminList.innerHTML = '<div class="muted">No bookings yet.</div>'; return; }
    adminList.innerHTML = '';
    snap.forEach(docSnap=>{
      const b = docSnap.data();
      const id = docSnap.id;
      const el = document.createElement('div');
      el.className = 'card-col';
      el.style.marginBottom = '12px';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>${b.name || '—'}</strong> — <span class="muted">${b.email || ''}</span></div>
          <div><small class="muted">Status: ${b.status || 'pending'}</small></div>
        </div>
        <div class="muted">${b.appChoice || ''} • ${b.type || ''}</div>
        <p style="margin-top:8px">${b.notes || ''}</p>
        <div style="margin-top:10px">
          <button class="btn" data-id="${id}" data-action="accept">Accept</button>
          <button class="btn" data-id="${id}" data-action="complete" style="margin-left:8px">Complete</button>
          <button class="btn btn-outline" data-id="${id}" data-action="cancel" style="margin-left:8px">Cancel</button>
        </div>
      `;
      adminList.appendChild(el);
    });

    // hook buttons
    adminList.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const newStatus = action === 'accept' ? 'accepted' : action === 'complete' ? 'completed' : 'cancelled';
        // permission check: only admin can update
        const user = auth.currentUser;
        if(!user || user.email !== ADMIN_EMAIL){
          alert('Only admin can update bookings. Sign in with admin account.');
          return;
        }
        const docRef = doc(db, 'bookings', id);
        try{
          await updateDoc(docRef, { status: newStatus });
          alert('Status updated: ' + newStatus);
          loadBookings();
        }catch(e){
          console.error(e);
          alert('Update failed');
        }
      });
    });

  }catch(e){
    console.error(e);
    adminList.innerHTML = '<div class="muted">Error loading bookings.</div>';
  }
}

refreshBtn?.addEventListener('click', loadBookings);