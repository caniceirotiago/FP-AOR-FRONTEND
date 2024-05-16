// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvkeAIqZWHJb36sow0iylMge0KriupfnU",
  authDomain: "fp---tiago---vasco.firebaseapp.com",
  projectId: "fp---tiago---vasco",
  storageBucket: "fp---tiago---vasco.appspot.com",
  messagingSenderId: "881686504030",
  appId: "1:881686504030:web:8b7e5d22e3c79dd3950acf",
  measurementId: "G-2QSBW4HDTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {storage};