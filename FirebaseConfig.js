import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0Q1mPEBZ-_7pHf4Z64AC5TP7gMMmBHVU",
  authDomain: "mediroverauth.firebaseapp.com",
  projectId: "mediroverauth",
  storageBucket: "mediroverauth.firebasestorage.app",
  messagingSenderId: "159174850894",
  appId: "1:159174850894:web:a1aed433cb92ccbe6f061f",
  measurementId: "G-KSWQWPD2RR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
