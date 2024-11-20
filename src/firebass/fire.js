// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDiiKdjSLv34Q-bW7pz8I1mOkGLpT6p7tQ",
  authDomain: "reactapp-9ecae.firebaseapp.com",
  projectId: "reactapp-9ecae",
  storageBucket: "reactapp-9ecae.appspot.com",
  messagingSenderId: "421130057144",
  appId: "1:421130057144:web:6c5bcae0bc8f834f9b8b4d",
  measurementId: "G-R8XZMVFS4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);