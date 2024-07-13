// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpEaKmH9zSmzTrpJ7PF5UGexQuBsV87Fo",
  authDomain: "charter-f5944.firebaseapp.com",
  projectId: "charter-f5944",
  storageBucket: "charter-f5944.appspot.com",
  messagingSenderId: "137960458872",
  appId: "1:137960458872:web:c015212ee1eeed015d3b8d",
  measurementId: "G-CCQR42WRNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, storage };