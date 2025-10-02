// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAPdn_Uc9895qKgO2to9qHdSdfgm8DDnRc",
  authDomain: "taskflow-5345e.firebaseapp.com",
  projectId: "taskflow-5345e",
  storageBucket: "taskflow-5345e.appspot.com",
  messagingSenderId: "240515743865",
  appId: "1:21:240515743865:web:1c790593bb9d21030754a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
