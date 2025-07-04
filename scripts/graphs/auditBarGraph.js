// scripts/graphs/auditBarGraph.js
// Renders a polished bar graph for audit XP received/given and the audit ratio

export function renderAuditBarGraph(container, xpReceived, xpGiven) {
    const auditRatio = xpReceived > 0 ? (xpGiven / xpReceived).toFixed(2) : "N/A";
    const svgWidth = 420;
    const svgHeight = 260;
    const barWidth = 110;
    const maxXP = Math.max(xpReceived, xpGiven, 1);
    const barColor = 'url(#barGradient)';
    container.innerHTML = '';
    // SVG with gradient and axis
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
    // Gradient definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'barGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#6366f1');
    stop1.setAttribute('stop-opacity', '1');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#4f46e5');
    stop2.setAttribute('stop-opacity', '1');
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    // Axis lines
    const axisY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axisY.setAttribute('x1', 70);
    axisY.setAttribute('y1', 30);
    axisY.setAttribute('x2', 70);
    axisY.setAttribute('y2', 200);
    axisY.setAttribute('stroke', '#334155');
    axisY.setAttribute('stroke-width', '2');
    svg.appendChild(axisY);
    const axisX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axisX.setAttribute('x1', 70);
    axisX.setAttribute('y1', 200);
    axisX.setAttribute('x2', 350);
    axisX.setAttribute('y2', 200);
    axisX.setAttribute('stroke', '#334155');
    axisX.setAttribute('stroke-width', '2');
    svg.appendChild(axisX);
    // Bars
    const bar1Height = (xpReceived / maxXP) * 150;
    const bar2Height = (xpGiven / maxXP) * 150;
    // XP Received Bar
    const bar1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bar1.setAttribute('x', 100);
    bar1.setAttribute('y', 200 - bar1Height);
    bar1.setAttribute('width', barWidth);
    bar1.setAttribute('height', bar1Height);
    bar1.setAttribute('fill', barColor);
    bar1.setAttribute('rx', '10');
    svg.appendChild(bar1);
    // XP Given Bar
    const bar2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bar2.setAttribute('x', 240);
    bar2.setAttribute('y', 200 - bar2Height);
    bar2.setAttribute('width', barWidth);
    bar2.setAttribute('height', bar2Height);
    bar2.setAttribute('fill', barColor);
    bar2.setAttribute('rx', '10');
    svg.appendChild(bar2);
    // Value labels above bars
    const label1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label1.setAttribute('x', 100 + barWidth / 2);
    label1.setAttribute('y', 200 - bar1Height - 12);
    label1.setAttribute('text-anchor', 'middle');
    label1.setAttribute('font-size', '16');
    label1.setAttribute('fill', '#fff');
    label1.textContent = opt(xpReceived);
    svg.appendChild(label1);
    const label2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label2.setAttribute('x', 240 + barWidth / 2);
    label2.setAttribute('y', 200 - bar2Height - 12);
    label2.setAttribute('text-anchor', 'middle');
    label2.setAttribute('font-size', '16');
    label2.setAttribute('fill', '#fff');
    label2.textContent = opt(xpGiven);
    svg.appendChild(label2);
    // X-axis labels
    const xLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel1.setAttribute('x', 100 + barWidth / 2);
    xLabel1.setAttribute('y', 225);
    xLabel1.setAttribute('text-anchor', 'middle');
    xLabel1.setAttribute('font-size', '15');
    xLabel1.setAttribute('fill', '#c7d2fe');
    xLabel1.textContent = 'Received';
    svg.appendChild(xLabel1);
    const xLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel2.setAttribute('x', 240 + barWidth / 2);
    xLabel2.setAttribute('y', 225);
    xLabel2.setAttribute('text-anchor', 'middle');
    xLabel2.setAttribute('font-size', '15');
    xLabel2.setAttribute('fill', '#c7d2fe');
    xLabel2.textContent = 'Given';
    svg.appendChild(xLabel2);
    // Append SVG to container
    container.appendChild(svg);
    // Audit Ratio display
    const ratioDiv = document.createElement('div');
    ratioDiv.style.textAlign = 'center';
    ratioDiv.style.fontSize = '22px';
    ratioDiv.style.fontWeight = 'bold';
    ratioDiv.style.marginTop = '18px';
    ratioDiv.style.color = '#6366f1';
    ratioDiv.innerHTML = `<span style="font-size: 1.2em;">Audit Ratio:</span> <span style="font-size: 1.4em;">${auditRatio}</span> <span title="Audit Ratio = Given / Received" style="font-size: 1em; color: #c7d2fe; cursor: help;">&#9432;</span>`;
    container.appendChild(ratioDiv);
}

// Helper to format XP
function opt(xp) {
    if (xp > 1e6) return (xp / 1e6).toFixed(2) + ' MBs';
    if (xp > 1e3) return (xp / 1e3).toFixed(2) + ' KBs';
    return xp + ' Bs';
} 