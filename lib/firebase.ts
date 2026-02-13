import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyDisM8JIHgumXtdz_yiAUaYA1nz6cTc6Io",
    authDomain: "reventory-66edd.firebaseapp.com",
    projectId: "reventory-66edd",
    storageBucket: "reventory-66edd.firebasestorage.app",
    messagingSenderId: "447195418565",
    appId: "1:447195418565:web:6824abd9a819e166ac05ac",
    measurementId: "G-C8QWXHMWB6"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { app, analytics, db, auth, functions };
