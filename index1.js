import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUpsyH6UF8gueYcDl23AJO7KXSlqZYbNE",
  authDomain: "authentication-app-fed00.firebaseapp.com",
  databaseURL: "https://authentication-app-fed00-default-rtdb.firebaseio.com",
  projectId: "authentication-app-fed00",
  storageBucket: "authentication-app-fed00.appspot.com",
  messagingSenderId: "225039549671",
  appId: "1:225039549671:web:793068e3b76bbe70b78e42"
};

try {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
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
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const numberRegex = /[0-9]/;

  createacctbtn.addEventListener("click", function () {
    var isVerified = true;
    function isPasswordStrong(password) {
      const hasUppercase = uppercaseRegex.test(password);
      const hasLowercase = lowercaseRegex.test(password);
      const hasSpecialChar = specialCharRegex.test(password);
      const hasNumber = numberRegex.test(password);
      const hasMinimumLength = password.length >= 7;
      return hasUppercase && hasLowercase && hasSpecialChar && hasNumber && hasMinimumLength;
    }
    const signupEmail = signupEmailIn.value;
    const signupPassword = signupPasswordIn.value;
    const signupusername = signupusernameIn.value;

    if (signupusername == "" || signupEmail == "" || signupPassword == "") {
      window.alert("All fields are mandatory");
      isVerified = false;
    }
    if(signupPassword && signupusername && signupEmail)
      { const isStrong = isPasswordStrong(signupPassword);
        if (!isStrong) {   
          window.alert("Password must contain at least one uppercase letter [A-Z], one lowercase letter [a-z], one number [0-9], and one special character [!@#$%^&*(),.?:{}|<>]");
          isVerified = false;
        }
      } 
    
    

    if (isVerified) {
      createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(database, 'users/' + user.uid), {
            username: signupusername,
            email: signupEmail,
            contactno: '',
            address: '',
            photoUrl: 'https://urmstonpartnership.org.uk/wp-content/uploads/2019/01/dummy-profile-image.png'
          });
          const currentUser = {
            username: signupusername,
            email: signupEmail,
          };
          sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
          window.alert("Success! Account created.");
          container.classList.remove('right-panel-active');
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
          window.alert("Error occurred during sign up. Try again.");
        });
    }
  });

  submitButton.addEventListener("click", function () {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        console.log("Success! Welcome back!");
        window.location = "/dashboard.html";
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        window.alert("Error occurred during sign in. Try again.");
      });
  });
} catch (error) {
  console.log("Error occurred during Firebase initialization:", error);
  window.alert("Error occurred during Firebase initialization. Try again.");
}
