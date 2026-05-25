// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// OPTIONAL: Import other Firebase services you might want to use
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process?.env?.REACT_APP_FIREBASE_API_KEY : undefined) || "AIzaSyDcQ9BMtmrg6FDbt4BhIjHmsMuXkhAb4oQ",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || (typeof process !== 'undefined' ? process?.env?.REACT_APP_FIREBASE_AUTH_DOMAIN : undefined) || "archive-app-e57dc.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || (typeof process !== 'undefined' ? process?.env?.REACT_APP_FIREBASE_PROJECT_ID : undefined) || "archive-app-e57dc",
  storageBucket: import.meta.env?.VITE_FIREBASE_PROJECT_ID 
    ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app` 
    : ((typeof process !== 'undefined' && process?.env?.REACT_APP_FIREBASE_PROJECT_ID) ? `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebasestorage.app` : "archive-app-e57dc.firebasestorage.app"),
  messagingSenderId: "756256551493",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || (typeof process !== 'undefined' ? process?.env?.REACT_APP_FIREBASE_APP_ID : undefined) || "1:756256551493:web:8e92bfd112a57b071ca92c",
  measurementId: "G-Q4KW68HT2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally to ensure compatibility (e.g. with server rendering, testing, or adblockers)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((err) => {
  console.warn("Firebase Analytics is not supported in this environment:", err);
});

// OPTIONAL: Initialize and export other Firebase services
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const rtdb = getDatabase(app);

export { app, analytics };
