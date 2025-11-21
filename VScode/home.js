import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
  getAuth, 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER",
  appId: "YOUR_APP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Redirect to login if not logged in
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location = "login.html";
  }
});

window.logout = function () {
  signOut(auth).then(() => {
    window.location = "login.html";
  });
};

window.goTo = function (page) {
  window.location = page;
};

onAuthStateChanged(auth, user => {
  if (user === null) return;  // wait for Firebase to finish checking
  if (!user) window.location = "login.html";
});
