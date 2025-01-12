import { initializeApp } from "firebase/app";
import { initializeAuth,browserLocalPersistence } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
const firebaseConfig = {
  apiKey: "AIzaSyBjWr7dVrh1RtftojPTufpMY5oN6qiSqKU",
  authDomain: "sabil-tawfik-db.firebaseapp.com",
  projectId: "sabil-tawfik-db",
  storageBucket: "sabil-tawfik-db.appspot.com",
  messagingSenderId: "267925846476",
  appId: "1:267925846476:web:2327524fb6152d9646c569",
  measurementId: "G-WBRY1Z4EQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{ persistence: browserLocalPersistence});
const db = getFirestore(app)
const storage = getStorage(app);
const functions = getFunctions(app);
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);
export {db , storage,functions}
export default app 