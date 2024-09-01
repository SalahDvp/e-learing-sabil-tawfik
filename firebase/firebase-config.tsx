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
  apiKey: "AIzaSyDu3sKjBGBZ_SwrmisasOBzdwcx5NFsqdA",
  authDomain: "fir-db-80290.firebaseapp.com",
  projectId: "fir-db-80290",
  storageBucket: "fir-db-80290.appspot.com",
  messagingSenderId: "637702891679",
  appId: "1:637702891679:web:d10fbf49d2f4771afe9aaa",
  measurementId: "G-CFVF8903WR"
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
