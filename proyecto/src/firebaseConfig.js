import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBPMXwvHOHlSA9a6BuRYHY0Vy4bDMYCxKE",
  authDomain: "rickapi-be4c0.firebaseapp.com",
  projectId: "rickapi-be4c0",
  storageBucket: "rickapi-be4c0.firebasestorage.app",
  messagingSenderId: "701047065662",
  appId: "1:701047065662:web:182f9ee9f700928c02d56f"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };