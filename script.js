/**
 * ============================================================================
 * Project: GadgetHub Authentication Engine
 * Architecture: Vite + Firebase + Vanilla JS
 * * Engineered by: [Hasham Ahmed / "Razer"]
 * GitHub: https://github.com/Hasham1210
 * LinkedIn: https://www.linkedin.com/in/hasham-ahmed-a5a5942a3/
 * Date: June 2026
 * ============================================================================
 */

import { initializeApp } from "firebase/app";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    //Importing send pass REset for forget password functionality!
    sendPasswordResetEmail ,
    GoogleAuthProvider,   
    signInWithPopup      

} from "firebase/auth";


//Configuration of firebase
const firebaseConfig = {
    apiKey: "AIzaSyBe2KPdQ3pCgDtC8kKYBM-MhTLBpQViDcE",
    authDomain: "signin-signup-page-9d6d1.firebaseapp.com",
    projectId: "signin-signup-page-9d6d1",
    storageBucket: "signin-signup-page-9d6d1.firebasestorage.app",
    messagingSenderId: "999626827331",
    appId: "1:999626827331:web:c4356d1ef4245016c756f6"
  };

//Firebae Initialization
  const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Google Sign-In Provider
const googleProvider = new GoogleAuthProvider(); 


// --- Form Switching Logic ---
function switchForm(formType) {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const btnSignin = document.getElementById('btn-signin');
    const btnSignup = document.getElementById('btn-signup');
    const slider = document.querySelector('.toggle-slider');

    if (formType === 'signup') {
        // Move slider to the right
        slider.style.transform = 'translateX(100%)';
        
        // Update Buttons
        btnSignup.classList.add('active');
        btnSignin.classList.remove('active');

        // Swap Forms
        signinForm.classList.remove('active-form');
        signinForm.classList.add('hidden-form');
        
        // Timeout to allow smooth transition before showing new form
        setTimeout(() => {
            signupForm.classList.remove('hidden-form');
            signupForm.classList.add('active-form');
        }, 100);

    } else {
        // Move slider to the left
        slider.style.transform = 'translateX(0)';
        
        // Update Buttons
        btnSignin.classList.add('active');
        btnSignup.classList.remove('active');

        // Swap Forms
        signupForm.classList.remove('active-form');
        signupForm.classList.add('hidden-form');
        
        setTimeout(() => {
            signinForm.classList.remove('hidden-form');
            signinForm.classList.add('active-form');
        }, 100);
    }
}

// --- Password Show/Hide Toggle ---
function togglePassword(icon) {
    // Find the input field relative to the clicked icon
    const input = icon.previousElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        icon.style.color = '#00f3ff'; // Highlight color when visible
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        icon.style.color = '#a0a0a0'; // Revert to muted
    }
}

 const forms = document.querySelectorAll('.auth-form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        //Just a demo form no acctaul submission of the form as ther data storage is not defined yet!
        e.preventDefault(); // Prevent actual submission for demo
        
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                isValid = false;
                input.classList.add('shake');
                
                // Remove class after animation ends so it can shake again
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 400);
            }
        });

        if (isValid) {

            const btn = form.querySelector('.submit-btn');
        
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        
          // ---------------- SIGN UP ----------------
if (form.id === "signup-form") {
    
    const email = form.querySelector('input[type="email"]').value;
    
    // Grab ALL password fields in the signup form (Index 0 is Password, Index 1 is Confirm)
    const passwordFields = form.querySelectorAll('input[type="password"]');
    const password = passwordFields[0].value;
    const confirmPassword = passwordFields[1].value;

    // 🛑 BOSS-LEVEL CHECK: Do the passwords match?
    if (password !== confirmPassword) {
        // Show our custom red error toast!
        showToast("Passwords do not match! Please try again.", "error");
        
        // Reset the button text
        btn.innerHTML = 'Sign Up';
        
        // Premium UX: Shake the confirm password field to show them exactly where the error is
        passwordFields[1].classList.add('shake');
        setTimeout(() => {
            passwordFields[1].classList.remove('shake');
        }, 400);
        
        return; // STOP the function right here. Do not send data to Firebase!
    }

    // ✅ If they match, proceed to Firebase!
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showToast("Account Created Successfully!", "success");
            console.log(userCredential.user);
            btn.innerHTML = 'Sign Up';
        })
        .catch((error) => {
            showToast(error.message, "error");
            btn.innerHTML = 'Sign Up';
        });
}
        
            // ---------------- SIGN IN ----------------
            else if (form.id === "signin-form") {
        
                const email = form.querySelector('input[type="email"]').value;
        
                const password = form.querySelector('input[type="password"]').value;
        
                signInWithEmailAndPassword(auth, email, password)
        
                    .then((userCredential) => {
        
                        showToast("Login Successful!");
        
                        console.log(userCredential.user);
        
                        btn.innerHTML = 'Sign In';
        
                    })
        
                    .catch((error) => {
        
                        showToast(error.message);
        
                        btn.innerHTML = 'Sign In';
        
                    });
            }
        }
    });
});


// Expose functions to the global window object so HTML inline 'onclick' can see them
window.switchForm = switchForm;
window.togglePassword = togglePassword;


// --- Forgot Password Logic ---
const forgotPwdLink = document.querySelector('.forgot-pwd');

forgotPwdLink.addEventListener('click', (e) => {
    e.preventDefault(); // Stop the link from refreshing the page

    // Grab the email address the user typed into the Sign In form
    const emailInput = document.querySelector('#signin-form input[type="email"]').value;

    // Check if the field is empty
    if (emailInput.trim() === '') {
        showToast("Please enter your email address in the field first.");
        return;
    }

    // Tell Firebase to send the reset email
    sendPasswordResetEmail(auth, emailInput)
        .then(() => {
            showToast("Password reset email sent! Please check your inbox. (Usually chek spam folder :)");
        })
        .catch((error) => {
            showToast("Error: " + error.message);
        });
});



// --- Google Sign-In Logic ---
const googleBtn = document.getElementById('google-login-btn');

googleBtn.addEventListener('click', () => {
    // Trigger the official Google Login Popup
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            // Success! Grab the user's details
            const user = result.user;
            
            // Show a success message using the user's actual Google Name!
            showToast("Bismillah! Login Successful. Welcome, " + user.displayName + "!");
            console.log("Logged in user data: ", user);
            
            // Here is where you would normally redirect them to your dashboard
            // window.location.href = "dashboard.html"; 
        })
        .catch((error) => {
            // Uh-oh, something went wrong or the user closed the popup
            showToast("Google Sign-In Failed: " + error.message);
        });
});



// Js for the showToasts... authentication!!


// --- Custom Toast Notification System ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');

    // 1. Create the toast div
    const toast = document.createElement('div');
    
    // 2. Add the base class and the type class (success or error)
    toast.classList.add('custom-toast', type);

    // 3. Set the icon (Checkmark for success, showToast for error)
    // Assuming you still have Font Awesome linked in your HTML!
    const icon = type === 'success' 
        ? '<i class="fa-solid fa-circle-check" style="color: var(--primary-cyan); font-size: 18px;"></i>' 
        : '<i class="fa-solid fa-circle-exclamation" style="color: #ff3366; font-size: 18px;"></i>';

    // 4. Inject the HTML into the toast
    toast.innerHTML = `${icon} <span>${message}</span>`;

    // 5. Add it to the screen
    container.appendChild(toast);

    // 6. Trigger the slide-in animation (Tiny delay needed for CSS to catch up)
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // 7. Remove it automatically after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show'); // Slide out
        
        // Wait for the slide-out animation to finish before deleting the element
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}