// scripts/profile.js
// This script handles fetching user info, rendering statistics, and logout functionality

// Wait for the DOM to load before running the script
window.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const userInfoSection = document.getElementById('userInfo');
    const graphsDiv = document.getElementById('graphs');
    const logoutBtn = document.getElementById('logoutBtn');

    // Function to fetch user info from GraphQL API
    async function fetchUserInfo() {
        // Retrieve JWT from localStorage
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            // If not logged in, redirect to login page
            window.location.href = 'login.html';
            return;
        }

        // GraphQL query to get user info, total XP, recent grades, and audit ratio
        const query = `{
            user {
                id
                login
                transactions(where: {type: {_eq: \"xp\"}}) {
                    amount
                }
                progresses(order_by: {createdAt: desc}, limit: 5) {
                    grade
                    createdAt
                    object {
                        name
                    }
                }
                audits: transactions(where: {type: {_eq: \"audit\"}}) {
                    amount
                }
            }
        }`;

        try {
            // NOTE: Domain replaced with actual API endpoint
            const response = await fetch('https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            if (response.ok) {
                const result = await response.json();
                const user = result.data.user[0];

                // Calculate total XP
                const totalXP = user.transactions.reduce((sum, tx) => sum + tx.amount, 0);

                // Prepare recent grades list
                const recentGrades = user.progresses.map(p =>
                    `<li>${p.object ? p.object.name : 'Unknown'}: Grade ${p.grade} (${new Date(p.createdAt).toLocaleDateString()})</li>`
                ).join('');

                // Calculate audit ratio (success/total) if possible, else show audit count
                const auditCount = user.audits.length;
                // If you have more info about audit success/fail, you can calculate ratio here

                // Display user info
                userInfoSection.innerHTML = `
                    <p><strong>User ID:</strong> ${user.id}</p>
                    <p><strong>Login:</strong> ${user.login}</p>
                    <p><strong>Total XP:</strong> ${totalXP}</p>
                    <p><strong>Recent Grades:</strong></p>
                    <ul>${recentGrades}</ul>
                    <p><strong>Audit Count:</strong> ${auditCount}</p>
                `;
                // Call function to render statistics/graphs
                renderStatistics(user);
            } else {
                userInfoSection.innerHTML = '<p style="color:red;">Failed to fetch user info. Please try again.</p>';
            }
        } catch (error) {
            userInfoSection.innerHTML = '<p style="color:red;">An error occurred. Please try again later.</p>';
        }
    }

    // Function to render statistics and SVG graphs (to be implemented)
    function renderStatistics(user) {
        // Placeholder SVG graph example
        graphsDiv.innerHTML = `
            <!-- Example SVG Bar Graph -->
            <svg width="300" height="100">
                <rect x="10" y="40" width="40" height="50" fill="#007bff" />
                <rect x="60" y="20" width="40" height="70" fill="#28a745" />
                <rect x="110" y="60" width="40" height="30" fill="#ffc107" />
            </svg>
            <p style="text-align:center;">(Sample SVG Graph - Replace with real data)</p>
        `;
    }

    // Logout button functionality
    logoutBtn.addEventListener('click', function() {
        // Remove JWT from localStorage and redirect to login
        localStorage.removeItem('jwt');
        window.location.href = 'login.html';
    });

    // Fetch user info on page load
    fetchUserInfo();
}); 