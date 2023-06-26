// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDgrM37XQbBBegTVkVy9RcSyNWR3M_Uap0",
  authDomain: "fir-course-8745f.firebaseapp.com",
  projectId: "fir-course-8745f",
  storageBucket: "fir-course-8745f.appspot.com",
  messagingSenderId: "222001507213",
  appId: "1:222001507213:web:1163069dce70c73462ebc4",
  measurementId: "G-LLR8LEJWE6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = new getFirestore(app);
export const storage = getStorage(app);
