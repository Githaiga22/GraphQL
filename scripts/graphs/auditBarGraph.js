// scripts/graphs/auditBarGraph.js
// Renders a bar graph for audit XP received/given and the audit ratio

export function renderAuditBarGraph(container, xpReceived, xpGiven) {
    const auditRatio = xpReceived > 0 ? (xpGiven / xpReceived).toFixed(2) : "N/A";
    const svgWidth = 400;
    const svgHeight = 250;
    const barWidth = 100;
    const maxXP = Math.max(xpReceived, xpGiven, 1);

    const svg = `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <rect x="50" y="${200 - (xpReceived / maxXP) * 150}" width="${barWidth}" height="${(xpReceived / maxXP) * 150}" fill="#6366f1"></rect>
      <text x="100" y="220" text-anchor="middle" fill="white">Received(${opt(xpReceived)})</text>
      <rect x="200" y="${200 - (xpGiven / maxXP) * 150}" width="${barWidth}" height="${(xpGiven / maxXP) * 150}" fill="#6366f1"></rect>
      <text x="250" y="220" text-anchor="middle" fill="white">Given(${opt(xpGiven)})</text>
    </svg>
    <div style="text-align: center; font-size: 18px; margin-top: 10px;">
      <strong>Audit Ratio:</strong> ${auditRatio}
    </div>
    `;
    container.innerHTML = svg;
}

// Helper to format XP
function opt(xp) {
    if (xp > 1e6) return (xp / 1e6).toFixed(2) + ' MBs';
    if (xp > 1e3) return (xp / 1e3).toFixed(2) + ' KBs';
    return xp + ' Bs';
} 