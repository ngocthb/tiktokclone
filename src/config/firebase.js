import { GoogleAuthProvider } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqL1HGx3KJJMZT4rwG2VlcGknhPv4oFT0",
  authDomain: "f-salon-51786.firebaseapp.com",
  projectId: "f-salon-51786",
  storageBucket: "f-salon-51786.appspot.com",
  messagingSenderId: "16647386828",
  appId: "1:16647386828:web:d2b80eaaec25aaf3027469",
  measurementId: "G-R2LN3PYGSZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

const storage = getStorage(app);
export { storage };

export { googleProvider };
