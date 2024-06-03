// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth,browserLocalPersistence } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKlzj5ZNvAcqZdLyBesed3zQzxPGRMi_Y",
  authDomain: "amirelwassim-blida-db.firebaseapp.com",
  projectId: "amirelwassim-blida-db",
  storageBucket: "amirelwassim-blida-db.appspot.com",
  messagingSenderId: "616828376351",
  appId: "1:616828376351:web:ca06d3d5cd5e27f3a2cc2a",
  measurementId: "G-M3P944NMHT"
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