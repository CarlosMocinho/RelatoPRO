import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDAUed0B2SGSFeOP3eseylQEAVb_Dif61g",
    authDomain: "relatopro-49f28.firebaseapp.com",
    projectId: "relatopro-49f28",
    storageBucket: "relatopro-49f28.firebasestorage.app",
    messagingSenderId: "210356013900",
    appId: "1:210356013900:web:7264c04753935b74991de9",
    measurementId: "G-70YCGRJEQ9"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const Googleauth = new GoogleAuthProvider(app);
export const db = getFirestore(app);