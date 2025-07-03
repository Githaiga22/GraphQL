// scripts/login.js
// This script handles the login form submission, authentication, and error display

// Wait for the DOM to load before attaching event listeners
window.addEventListener('DOMContentLoaded', function() {
    // Get references to the form and error display div
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Listen for form submission
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get user input values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Prepare the Basic Auth header (username:password base64 encoded)
        const credentials = btoa(`${username}:${password}`);

        try {
            // Make a POST request to the signin endpoint
            // NOTE: Domain replaced with actual API endpoint
            const response = await fetch('https://learn.zone01kisumu.ke/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            // If login is successful, extract the JWT
            if (response.ok) {
                const data = await response.json();
                // Store JWT in localStorage for later use
                localStorage.setItem('jwt', data);
                // Redirect to profile page
                window.location.href = 'profile.html';
            } else {
                // If login fails, show an error message
                loginError.textContent = 'Invalid credentials. Please try again.';
            }
        } catch (error) {
            // Handle network or other errors
            loginError.textContent = 'An error occurred. Please try again later.';
        }
    });
}); 