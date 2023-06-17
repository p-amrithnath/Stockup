import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import {
  getDatabase,
  set,
  ref
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const database = getDatabase(app)
const auth = getAuth(app);

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

const submitButton = document.getElementById("submit");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");


const createacct = document.getElementById("create-acct")
const signupusernameIn = document.getElementById("username");
const signupEmailIn = document.getElementById("email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

var username, email, password, signupEmail, signupPassword, signupusername;



createacctbtn.addEventListener("click", function () {
  var isVerified = true;

  signupEmail = signupEmailIn.value;
  signupPassword = signupPasswordIn.value;
  signupusername = signupusernameIn.value;
  //var username = document.getElementById('username').value;

  if (signupEmail == null || signupPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }

  if (isVerified) {

    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        // set the username in the users object in the database
        set(ref(database, 'users/' + user.uid), {
          username: signupusername,
          email: signupEmail,
          contactno: '',
          address: '',
          photoUrl: 'https://urmstonpartnership.org.uk/wp-content/uploads/2019/01/dummy-profile-image.png'
        })
        // set the currentUser object in the sessionStorage
        const currentUser = {
          username: signupusername,
          email: signupEmail,

        };
        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
        window.alert("Success! Account created.");
        container.classList.remove('right-panel-active');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert("Error occurred. Try again.");
      });


  }
});



submitButton.addEventListener("click", function () {
  email = emailInput.value;
  console.log(email);
  password = passwordInput.value;
  console.log(password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      console.log("Success! Welcome back!");
      window.location = "/dashboard.html";
      // window.alert("Success! Welcome back!");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error occurred. Try again.");
      window.alert("Error occurred. Try again.");
    });
});