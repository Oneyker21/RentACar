import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXQSMOLI_AVxZR_3jJMpBp-Bx35RaVLUE",
  authDomain: "rentavehiculos-a15b0.firebaseapp.com",
  projectId: "rentavehiculos-a15b0",
  storageBucket: "rentavehiculos-a15b0.firebasestorage.app",
  messagingSenderId: "230713319603",
  appId: "1:230713319603:web:98840fdbf8550647dad0c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };