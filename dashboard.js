import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  get
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUpsyH6UF8gueYcDl23AJO7KXSlqZYbNE",
  authDomain: "authentication-app-fed00.firebaseapp.com",
  databaseURL: "https://authentication-app-fed00-default-rtdb.firebaseio.com",
  projectId: "authentication-app-fed00",
  storageBucket: "authentication-app-fed00.appspot.com",
  messagingSenderId: "225039549671",
  appId: "1:225039549671:web:793068e3b76bbe70b78e42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const logoutButton = document.getElementById('logout-btn');

const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
const userId = currentUser.uid;
const profileImagePath = "users/${userId}/photoUrl";
console.log("User ID:", userId);
console.log("Profile Image Path:", profileImagePath);
console.log(currentUser);

// get the HTML elements to display user data
const usernameElement = document.getElementById('username');
const fullnameElement = document.getElementById('fullname');
const emailElement = document.getElementById('email');
const contactnoElement = document.getElementById('contactno');
const addressElement = document.getElementById('address');
const imgElement = document.getElementById('blah');


window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  loader.classList.add("loader--hidden");

  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});

get(child(ref(database), `users/${currentUser.uid}`)).then((snapshot) => {
  if (snapshot.exists()) {
    const userData = snapshot.val();
    // set the user data to the HTML elements
    usernameElement.innerHTML = userData.username;
    fullnameElement.innerHTML = userData.username;
    emailElement.innerHTML = userData.email;
    contactnoElement.innerHTML = userData.contactno;
    addressElement.innerHTML = userData.address;
    imgElement.src = userData.photoUrl;

  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

logoutButton.addEventListener('click', () => {
  auth.signOut().then(() => {
    // Sign-out successful.
    window.location.href = "/index.html"
  }).catch((error) => {
    // An error happened.
    console.error(error);
  });
});