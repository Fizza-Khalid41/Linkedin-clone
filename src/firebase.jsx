
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-JFjNcaSD3fSoWVqKW4zRLgtV1TnoAlk",
  authDomain: "linkedin-clone-9d1a3.firebaseapp.com",
  projectId: "linkedin-clone-9d1a3",
  storageBucket: "linkedin-clone-9d1a3.firebasestorage.app",
  messagingSenderId: "619946028096",
  appId: "1:619946028096:web:7242e50da0a51dc46643a5",
  measurementId: "G-TNET04GWBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export both
export{auth , db}