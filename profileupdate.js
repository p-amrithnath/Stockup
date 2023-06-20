

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const firebaseConfig = {
  // add your Firebase config here
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
const storage = getStorage(app);
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

//const updateProfileButton = document.getElementById('update-profile-btn');
const updateProfileButton = document.querySelector(".button");


updateProfileButton.addEventListener('click', () => {
  const newUsername = document.getElementById('new-username').value;
  const newContactno = document.getElementById('new-contactno').value;
  const newAddress = document.getElementById('new-address').value;
  const fileInput = document.getElementById('new-photo');
  
  if (!currentUser) {
    window.alert('User is not logged in!');
    console.error('User is not logged in!');
    return;
  }

  const file = fileInput.files[0];

  if (!file || !newUsername || !newContactno || !newAddress ) {
    updateProfileButton.classList.remove("button--loading");
    window.alert('All Fields are Mandatory!');
    console.error('field is missing!');
    return;
  }
  
  
  //updateProfileButton.classList.add("button--loading");
  // Generate a unique filename or use the existing file name
  const filename = `${Date.now()}_${file.name}`;

  // Create a reference to the storage location
  const storageFileRef = storageRef(storage, filename);

  // Upload the file to Firebase Storage
  uploadBytes(storageFileRef, file)
    .then(() => {
      
      // Get the download URL of the uploaded file
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(filename)}?alt=media&token=${firebaseConfig.access_token}`;

      // Use the download URL for storing in the database or displaying the image
      console.log(downloadURL);

      // Update the user data in the database
      const userRef = ref(database, `users/${currentUser.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            userData.username = newUsername || userData.username;
            userData.contactno = newContactno || userData.contactno;
            userData.address = newAddress || userData.address;
            userData.photoUrl = downloadURL || userData.photoUrl;

            set(userRef, userData)
              .then(() => {
                console.log('Profile updated successfully!');
                window.location.href = "/dashboard.html";
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            console.log("User data not found in the database!");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
    //updateProfileButton.classList.remove("button--loading");
});


const theButton = document.querySelector(".button");

theButton.addEventListener("click", () => {
    
});
