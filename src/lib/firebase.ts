// Import the functions you need from the SDKs you need
import { initializeApp,getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB38iGkot-rHpKEu5l2xCoEcZvomXUI4_Y",
  authDomain: "ailaweb-next-blog.firebaseapp.com",
  projectId: "ailaweb-next-blog",
  storageBucket: "ailaweb-next-blog.firebasestorage.app",
  messagingSenderId: "520520228307",
  appId: "1:520520228307:web:9f35b8ebc9f23b1119e326",
  measurementId: "G-M9R21VCVV3"
};

// Initialize Firebase
const app = getApps().length === 0? initializeApp(firebaseConfig) : getApps()[0];
const analytics = getAnalytics(app);
export {app};