import { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const Auth = () => {
  const [user, loading, error] = useAuthState(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.displayName);
  console.log(auth?.currentUser?.email);

  const createAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signIn = async () => {
    try {
      signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {}, []);

  return (
    <div>
      {loading ? (
        //auth is loading
        <h1>Loading</h1>
      ) : user ? (
        //user logged in
        <>
          <h1>Welcome {user.email}</h1>
          <button onClick={logout}> Logout </button>
        </>
      ) : (
        //not logged in
        <>
          <input
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password..."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={createAccount}>Create Account</button>

          <button onClick={signIn}>Sign In</button>

          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
      )}
    </div>
  );
};
