import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDKyAB59eJ_DLq5J_6bgF11CVvmvD14Z3Y",
  authDomain: "thespian-arts-2.firebaseapp.com",
  projectId: "thespian-arts-2",
  storageBucket: "thespian-arts-2.firebasestorage.app",
  messagingSenderId: "45417031949",
  appId: "1:45417031949:web:5e41906e661dd1991f6844",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { db, auth, storage, functions };
