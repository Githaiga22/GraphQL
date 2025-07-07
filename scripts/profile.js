// scripts/profile.js
// This script handles fetching user info, rendering statistics, and logout functionality

// Import SVG graph modules at the top level
import { renderXPLineChart } from './graphs/xpLineChart.js';
import { renderSkillsDonutChart } from './graphs/skillsDonutChart.js';
import { renderAuditBarGraph } from './graphs/auditBarGraph.js';

// Wait for the DOM to load before running the script
window.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('jwt');
        window.location.href = 'login.html';
    });
    fetchUserData();
});

async function fetchUserData() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        window.location.href = 'login.html';
        return;
    }
    const query = `
        query {
            user {
                id
                login
                attrs
                auditRatio
                skills: transactions(where: { type: { _like: "skill_%" } }order_by: [{ amount: desc }]) {
                    type
                    amount
                }
                audits(order_by: {createdAt: desc},where: {closedAt: {_is_null: true} group: {captain: { canAccessPlatform: {_eq: true}}}}) {
                    closedAt
                    group {
                        captain{
                            canAccessPlatform
                        }
                        captainId
                        captainLogin
                        path
                        createdAt
                        updatedAt
                        members {
                            userId
                            userLogin
                        }
                    }
                    private {
                        code
                    }
                }
                events(where: {eventId: {_eq: 75}}) {
                    level
                }
            }
            transaction(where: {_and: [{eventId:{_eq: 75}}]},order_by: { createdAt: desc }) {
                amount
                createdAt
                eventId
                path
                type
                userId
            }
            progress(where: {_and: [{grade: {_is_null: false}},{eventId:{_eq: 75}}]},order_by: {createdAt: desc}){
                id
                createdAt
                eventId
                grade
                path
            }
        }
    `;
    try {
        const response = await fetch('https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const result = await response.json();
        if (result.data && result.data.user.length > 0) {
            updateUI(result);
        } else {
            console.log('GraphQL Response:', result); // Debugging
            document.querySelector('.container').innerHTML = '<p>No user data found.</p>';
        }
    } catch (error) {
        document.querySelector('.container').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function updateUI(userData) {
    const user = userData.data.user[0];
    const transactions = userData.data.transaction;
    const grades = userData.data.progress;
    // XP calculations
    const xpTransactions = transactions.filter(tx => tx.type === 'xp');
    const totalXP = xpTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    // Grade calculations
    const totalGrade = grades.reduce((sum, grade) => sum + grade.grade, 0);
    // Audit ratio
    const auditRatio = user.auditRatio || 0;
    // Level
    const level = user.events && user.events.length > 0 ? user.events[0].level : '';
    // Skills
    const skills = user.skills || [];
    // Top unique skills (by amount)
    const topSkills = getTopUniqueSkills(skills);
    // Update stat cards
    document.getElementById('xp').innerText = opt(totalXP);
    document.getElementById('grade').innerText = totalGrade.toFixed(2);
    document.getElementById('audits').innerText = auditRatio.toFixed(1);
    document.getElementById('level').innerText = level;
    // Render donut chart for skills in #skills-container
    const skillsContainer = document.getElementById('skills-container');
    renderSkillsDonutChart(skillsContainer, topSkills.map(s => ({ name: s.type, value: s.amount })));
    // Render XP progression as a line chart in #xp-graph
    renderXPLineChart(document.getElementById('xp-graph'), xpTransactions.map(tx => ({ date: tx.createdAt.slice(0, 10), xp: tx.amount })));
    // Render Audit Ratio bar graph
    const xpReceived = transactions.filter(tx => tx.type === 'up').reduce((sum, tx) => sum + tx.amount, 0);
    const xpGiven = transactions.filter(tx => tx.type === 'down').reduce((sum, tx) => sum + tx.amount, 0);
    renderAuditBarGraph(document.getElementById('audit-graph'), xpReceived, xpGiven);
    // User dropdown: show name and more info
    const dropdownBtn = document.getElementById('userDropdownBtn');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownLabel = document.getElementById('dropdownLabel');
    const firstName = user.attrs?.firstName || '';
    const lastName = user.attrs?.lastName || '';
    const login = user.login || '';
    dropdownName.textContent = `${firstName} ${lastName}`.trim() || login;
    // Format DOB to YYYY-MM-DD
    let dob = user.attrs?.dateOfBirth || 'N/A';
    if (dob && dob !== 'N/A') {
        dob = dob.split('T')[0];
    }
    dropdownMenu.innerHTML = `
        <div style="padding: 10px 0 5px 0; font-weight: 600; color: #6366f1; text-align: center;">${firstName} ${lastName}</div>
        <div>Login: <b>${login}</b></div>
        <div>Email: <b>${user.attrs?.email || 'N/A'}</b></div>
        <div>Phone: <b>${user.attrs?.phone || 'N/A'}</b></div>
        <div>Gender: <b>${user.attrs?.gender || 'N/A'}</b></div>
        <div>DOB: <b>${dob}</b></div>
    `;
    // Dropdown show/hide logic
    let dropdownOpen = false;
    dropdownBtn.onclick = (e) => {
        e.stopPropagation();
        dropdownOpen = !dropdownOpen;
        dropdownMenu.style.display = dropdownOpen ? 'block' : 'none';
        dropdownLabel.innerHTML = dropdownOpen ? 'Account &#9650;' : 'Account';
    };
    document.addEventListener('click', function hideDropdown(e) {
        if (dropdownOpen) {
            dropdownMenu.style.display = 'none';
            dropdownLabel.innerHTML = 'Account';
            dropdownOpen = false;
        }
    });
    dropdownMenu.onclick = (e) => e.stopPropagation();
}

// Utility: Format XP nicely (e.g., MBs)
function opt(xp) {
    if (xp > 1e6) return (xp / 1e6).toFixed(2) + ' MBs';
    if (xp > 1e3) return (xp / 1e3).toFixed(2) + ' KBs';
    return xp + ' Bs';
}

// Utility: Get top unique skills
function getTopUniqueSkills(skills) {
    const skillMap = new Map();
    skills.forEach(skill => {
        if (!skillMap.has(skill.type)) {
            skillMap.set(skill.type, skill.amount);
        }
    });
    return [...skillMap.entries()]
        .map(([type, amount]) => ({ type, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8);
} 