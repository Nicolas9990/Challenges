// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyB_hUn4zCM6TGQ05Fw_96g4u6im5fzlyGg",
  authDomain: "tareitas-uao.firebaseapp.com",
  databaseURL: "https://tareitas-uao-default-rtdb.firebaseio.com",
  projectId: "tareitas-uao",
  storageBucket: "tareitas-uao.firebasestorage.app",
  messagingSenderId: "547084304859",
  appId: "1:547084304859:web:fecdedd7d583afd2b967fe",
  measurementId: "G-18G6TEB50R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseStorage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

const database = getDatabase(app);

export { app, analytics, auth, firebaseStorage, db };