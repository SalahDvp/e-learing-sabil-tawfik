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
  apiKey: "AIzaSyDq7u5DHQX6Pi2JRWoqQi9aXRSmxRBxtR4",
  authDomain: "metidja-plus-f684b.firebaseapp.com",
  projectId: "metidja-plus-f684b",
  storageBucket: "metidja-plus-f684b.appspot.com",
  messagingSenderId: "208923814622",
  appId: "1:208923814622:web:d66f403bc72db29009704f",
  measurementId: "G-77DC2VHF8X"
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