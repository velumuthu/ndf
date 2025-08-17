import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDiw_pwLGHMjtTRmhI3bmRhx497XW1l1bY",
  authDomain: "atelier-lumire-y3pcz.firebaseapp.com",
  projectId: "atelier-lumire-y3pcz",
  storageBucket: "atelier-lumire-y3pcz.firebasestorage.app",
  messagingSenderId: "1067978357535",
  appId: "1:1067978357535:web:3d1e593cd3dc740ccd8e2a",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
