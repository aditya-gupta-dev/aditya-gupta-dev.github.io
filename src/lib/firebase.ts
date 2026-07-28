import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB76xUX6GkkzLI1ML3KxYhqlwS2ch4JZl8",
  authDomain: "ctoadi.firebaseapp.com",
  projectId: "ctoadi",
  storageBucket: "ctoadi.firebasestorage.app",
  messagingSenderId: "191506183455",
  appId: "1:191506183455:web:27a0b1881a6fc50c72ec2a",
  measurementId: "G-95ZXXCT68Y"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
