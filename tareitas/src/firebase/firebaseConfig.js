// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB_hUn4zCM6TGQ05Fw_96g4u6im5fzlyGg",
  authDomain: "tareitas-uao.firebaseapp.com",
  projectId: "tareitas-uao",
  storageBucket: "tareitas-uao.firebasestorage.app",
  messagingSenderId: "547084304859",
  appId: "1:547084304859:web:fecdedd7d583afd2b967fe",
  measurementId: "G-18G6TEB50R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();

export { app, analytics, auth };