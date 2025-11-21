import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB06m1EWYkTwBYtuCFsoYEvrAJXTWwK9ng",
  authDomain: "studymatching-5fca9.firebaseapp.com",
  projectId: "studymatching-5fca9",
  storageBucket: "studymatching-5fca9.appspot.com",
  messagingSenderId: "758409019844",
  appId: "1:758409019844:web:1ba3cba86a8f345b622491",
  measurementId: "G-789W063SCG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Signup Function
window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location = "home.html";  // redirect here
    })
    .catch(err => alert(err.message));
};

// Login Function
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location = "home.html"; // redirect here
    })
    .catch(err => alert(err.message));
};

// Auto redirect if logged in
onAuthStateChanged(auth, user => {
  if (!user) return; // wait for Firebase to finish checking
});
