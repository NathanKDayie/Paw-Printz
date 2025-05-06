import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDu21Pz9KvOQqwqaE4kxsAfu3PZb6EEqFI",
  authDomain: "paw-printz.firebaseapp.com",
  projectId: "paw-printz",
  storageBucket: "paw-printz.firebasestorage.app",
  messagingSenderId: "790246831663",
  appId: "1:790246831663:web:1788c0e63e21be3cae38da",
  measurementId: "G-W3CME8Z3J5"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

export { app, auth };
