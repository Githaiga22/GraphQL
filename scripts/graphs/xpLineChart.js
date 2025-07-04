// scripts/graphs/xpLineChart.js
// This module renders a cumulative SVG line chart for XP progression with tooltips and a dark background

/**
 * Renders a cumulative SVG line chart showing XP progression over time, with tooltips.
 * @param {HTMLElement} container - The DOM element to render the SVG into.
 * @param {Array} xpData - Array of objects: [{ date: 'YYYY-MM-DD', xp: number }]
 */
export function renderXPLineChart(container, xpData) {
    container.innerHTML = '';
    if (!xpData || xpData.length === 0) {
        container.innerHTML = '<p>No XP data available.</p>';
        return;
    }
    // Sort XP data by date ascending
    xpData.sort((a, b) => new Date(a.date) - new Date(b.date));
    // Convert to cumulative XP
    let cumulativeXP = 0;
    const points = xpData.map(entry => {
        cumulativeXP += entry.xp;
        return { date: new Date(entry.date), xp: cumulativeXP };
    });
    // SVG settings
    const width = container.clientWidth || 900;
    const height = 500;
    const padding = 60;
    // Get min/max values
    const minXP = 0;
    const maxXP = Math.max(...points.map(p => p.xp));
    const minDate = points[0].date;
    const maxDate = points[points.length - 1].date;
    // Scale functions
    const xScale = date =>
        padding + ((date - minDate) / (maxDate - minDate || 1)) * (width - 2 * padding);
    const yScale = xp =>
        height - padding - ((xp - minXP) / (maxXP - minXP || 1)) * (height - 2 * padding);
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.background = '#1e293b';
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding);
    xAxis.setAttribute('y1', height - padding);
    xAxis.setAttribute('x2', width - padding);
    xAxis.setAttribute('y2', height - padding);
    xAxis.setAttribute('stroke', '#6366f1');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', padding);
    yAxis.setAttribute('y1', height - padding);
    yAxis.setAttribute('x2', padding);
    yAxis.setAttribute('y2', padding);
    yAxis.setAttribute('stroke', '#6366f1');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    // Draw XP progression line
    let pathData = `M ${xScale(points[0].date)},${yScale(points[0].xp)}`;
    points.forEach(point => {
        pathData += ` L ${xScale(point.date)},${yScale(point.xp)}`;
    });
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#6366f1');
    path.setAttribute('stroke-width', '3');
    svg.appendChild(path);
    // Tooltip for XP values
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#6366f1';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '14px';
    tooltip.style.display = 'none';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transform = 'translate(-50%, -30px)';
    container.appendChild(tooltip);
    // Append circles for each point
    points.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xScale(point.date));
        circle.setAttribute('cy', yScale(point.xp));
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#6366f1');
        circle.style.cursor = 'pointer';
        // Tooltip event listeners
        circle.addEventListener('mouseover', event => {
            tooltip.style.display = 'block';
            tooltip.textContent = `XP: ${opt(point.xp)} on ${point.date.toLocaleDateString()}`;
        });
        circle.addEventListener('mousemove', event => {
            tooltip.style.left = `${event.pageX}px`;
            tooltip.style.top = `${event.pageY}px`;
        });
        circle.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
        svg.appendChild(circle);
    });
    // Append the graph to the container
    container.appendChild(svg);
}

// Helper to format XP (MBs, KBs, etc.)
function opt(xp) {
    if (xp > 1e6) return (xp / 1e6).toFixed(2) + ' MBs';
    if (xp > 1e3) return (xp / 1e3).toFixed(2) + ' KBs';
    return xp + ' Bs';
} 