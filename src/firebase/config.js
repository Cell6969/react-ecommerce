// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase Configuration

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: "eshop-e0002.firebaseapp.com",
    projectId: "eshop-e0002",
    storageBucket: "eshop-e0002.appspot.com",
    messagingSenderId: "1061760880805",
    appId: "1:1061760880805:web:152a18b005de6a4dce7d4c",
    measurementId: "G-49H5NHM4M8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
