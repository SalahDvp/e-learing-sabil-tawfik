import { useEffect, useState } from "react";
import { User as FirebaseUser, signOut as firebaseSignOut, browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import { auth } from "@/firebase/firebase-config"

export async function signIn(email: string, password: string, rememberMe: boolean = false) {
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}
interface ExtendedFirebaseUser extends FirebaseUser {
  role?: string | null |{};
}
export function useUser() {
  const [user, setUser] = useState<ExtendedFirebaseUser | null | false>(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) =>{
      if (user) {
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role || null;
      console.log("role: ",role);
      
      setUser({...user,role})
    } else {
      setUser(null);
    }
    });
      
  }, []);

  return user;
}

