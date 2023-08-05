import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, set, onValue, get, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  // add your Firebase config here
  // ...
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

// DOM elements
let commentsContainer;
let commentInput;
let submitBtn;

document.addEventListener('DOMContentLoaded', () => {
  commentsContainer = document.getElementById('comments-container');
  commentInput = document.getElementById('comment-input');
  submitBtn = document.getElementById('submit-btn');

  // Listen for the submit button click event
  submitBtn.addEventListener('click', submitComment);

  // Listen for real-time updates on comments in the Realtime Database
  const commentsRef = ref(database, 'comments');
  onValue(commentsRef, (snapshot) => {
    commentsContainer.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const commentId = childSnapshot.key; // Get the comment ID
      const comment = childSnapshot.val().text;
      const timestamp = childSnapshot.val().timestamp;
      const username = childSnapshot.val().username;
      const commentElement = document.createElement('div');

      // Format the timestamp
      const timestampStr = new Date(timestamp).toLocaleString();

      // Display the comment with timestamp and username
      commentElement.innerHTML = `
        <div class="comment-box">
          <span class="comment-username">${username}</span>
          <div class="comment-text">${comment}</div>
          <div class="comment-info">
            <span class="comment-timestamp">${timestampStr}</span>
            <button class="delete-button" data-comment-id="${commentId}">Delete</button>
          </div>
        </div>
      `;

      commentsContainer.appendChild(commentElement);
    });

    // Add event listeners to the delete buttons
    const deleteButtons = document.getElementsByClassName('delete-button');
    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', handleDeleteComment);
    }
  });
});

// Function to submit a new comment
async function submitComment() {
  const comment = commentInput.value;
  if (comment.trim() !== '') {
    // Get the currently logged-in user
    const user = auth.currentUser;
    if (user) {
      // Access the user properties
      const uid = user.uid;

      try {
        // Fetch the user details from the database using uid
        const userSnapshot = await get(ref(database, `users/${uid}`));
        if (userSnapshot.exists()) {
          const userDetails = userSnapshot.val();
          const displayName = userDetails.username;
          const email = userDetails.email;
          
          console.log('Display Name:', displayName);
          console.log('Email:', email);
          

          // Save the comment in the Realtime Database
          const commentsRef = ref(database, 'comments');
          const newCommentRef = push(commentsRef);
          set(newCommentRef, {
            text: comment,
            timestamp: new Date().getTime(),
            username: displayName,
            email: email
          })
            .then(() => {
              // Clear the input field after successful submission
              commentInput.value = '';
            })
            .catch((error) => {
              console.error('Error submitting comment:', error);
            });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    } else {
      // User is not logged in
      console.log('No user logged in.');
    }
  }
}

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  loader.classList.add("loader--hidden");

  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});

// Function to handle the delete comment event
function handleDeleteComment(event) {
  const commentId = event.target.dataset.commentId;
  deleteComment(commentId);
}

// Function to delete a comment
function deleteComment(commentId) {
  
    const user = auth.currentUser;
    if (user) {
      const commentRef = ref(database, `comments/${commentId}`);
      const userRef = ref(database, `users/${user.uid}`);

      // Check if the logged-in user is the author of the comment
      get(commentRef)
        .then((snapshot) => 
        {
          const comment = snapshot.val();
          if (comment && comment.email == user.email) {
            if (confirm("Are you sure you want to delete this comment?")) 
            {
            // Delete the comment
            remove(commentRef)
              .then(() => {
                console.log("Comment deleted successfully");
              })
              .catch((error) => {
                console.error("Error deleting comment:", error);
              });
          }
         } else {
            console.log("You are not authorized to delete this comment.");
            window.alert("You are not authorized to delete this comment.");
          }
        })
        .catch((error) => {
          console.error("Error retrieving comment:", error);
        });
    } else {
      console.log("No user logged in.");
    }
  
}










