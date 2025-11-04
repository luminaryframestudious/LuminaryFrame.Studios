// auth.js (type=module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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

const googleBtn = document.getElementById('googleBtn');
const authMsg = document.getElementById('authMsg');

googleBtn.addEventListener('click', async ()=>{
  const provider = new GoogleAuthProvider();
  try{
    const res = await signInWithPopup(auth, provider);
    authMsg.textContent = 'Signed in: ' + res.user.email;
    location.href = '/'; // redirect to homepage
  }catch(e){
    authMsg.textContent = 'Sign in failed';
    console.error(e);
  }
});

document.getElementById('signupForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('suEmail').value;
  const pass = document.getElementById('suPass').value;
  try{
    await createUserWithEmailAndPassword(auth, email, pass);
    authMsg.textContent = 'Account created. Redirecting...';
    setTimeout(()=>location.href='/',800);
  }catch(e){
    console.error(e);
    authMsg.textContent = 'Error creating account: ' + (e.message || e.code);
  }
});

document.getElementById('signinForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('inEmail').value;
  const pass = document.getElementById('inPass').value;
  try{
    await signInWithEmailAndPassword(auth, email, pass);
    authMsg.textContent = 'Signed in. Redirecting...';
    setTimeout(()=>location.href='/',800);
  }catch(e){
    console.error(e);
    authMsg.textContent = 'Sign in failed: ' + (e.message || e.code);
  }
});