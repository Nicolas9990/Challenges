
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA8UeRJHIXSzE0AhLuDd118OpsOYYUOQE",
  authDomain: "parcial2-misiones-57649.firebaseapp.com",
  projectId: "parcial2-misiones-57649",
  storageBucket: "parcial2-misiones-57649.firebasestorage.app",
  messagingSenderId: "70006349611",
  appId: "1:70006349611:web:2d74bad0261a0d11ebaf6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

