// scripts/graphs/xpLineChart.js
// This module renders an SVG line chart for XP progression

/**
 * Renders an SVG line chart showing XP progression over time.
 * @param {HTMLElement} container - The DOM element to render the SVG into.
 * @param {Array} xpData - Array of objects: [{ date: 'YYYY-MM-DD', xp: number }]
 */
export function renderXPLineChart(container, xpData) {
    container.innerHTML = '';
    if (!xpData || xpData.length === 0) {
        container.innerHTML = '<p>No XP data available.</p>';
        return;
    }
    // Group XP by date (sum XP for each date)
    const grouped = {};
    xpData.forEach(d => {
        grouped[d.date] = (grouped[d.date] || 0) + d.xp;
    });
    const groupedData = Object.entries(grouped).map(([date, xp]) => ({ date, xp }));
    // SVG dimensions
    const width = 500;
    const height = 220;
    const margin = { top: 30, right: 30, bottom: 60, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const maxXP = Math.max(...groupedData.map(d => d.xp));
    // X scale
    const xStep = chartWidth / (groupedData.length - 1 || 1);
    // Y scale
    const yScale = v => chartHeight - (v / maxXP) * chartHeight;
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    // Draw axes
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', height - margin.bottom);
    yAxis.setAttribute('stroke', '#888');
    svg.appendChild(yAxis);
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', height - margin.bottom);
    xAxis.setAttribute('x2', width - margin.right);
    xAxis.setAttribute('y2', height - margin.bottom);
    xAxis.setAttribute('stroke', '#888');
    svg.appendChild(xAxis);
    // Draw line
    let points = '';
    groupedData.forEach((d, i) => {
        const x = margin.left + i * xStep;
        const y = margin.top + yScale(d.xp);
        points += `${x},${y} `;
    });
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points.trim());
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#5a6dff');
    polyline.setAttribute('stroke-width', '3');
    svg.appendChild(polyline);
    // Draw points
    groupedData.forEach((d, i) => {
        const x = margin.left + i * xStep;
        const y = margin.top + yScale(d.xp);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 5);
        circle.setAttribute('fill', '#6366f1');
        svg.appendChild(circle);
        // Value label
        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueLabel.setAttribute('x', x);
        valueLabel.setAttribute('y', y - 10);
        valueLabel.setAttribute('text-anchor', 'middle');
        valueLabel.setAttribute('font-size', '12');
        valueLabel.setAttribute('fill', '#c7d2fe');
        valueLabel.textContent = d.xp;
        svg.appendChild(valueLabel);
        // Date label (rotated)
        const dateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dateLabel.setAttribute('x', x);
        dateLabel.setAttribute('y', height - margin.bottom + 20);
        dateLabel.setAttribute('text-anchor', 'end');
        dateLabel.setAttribute('font-size', '11');
        dateLabel.setAttribute('transform', `rotate(-40 ${x} ${height - margin.bottom + 20})`);
        dateLabel.setAttribute('fill', '#c7d2fe');
        dateLabel.textContent = d.date.slice(5); // MM-DD
        svg.appendChild(dateLabel);
    });
    // Y-axis label
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', 10);
    yLabel.setAttribute('y', margin.top);
    yLabel.setAttribute('font-size', '13');
    yLabel.setAttribute('fill', '#c7d2fe');
    yLabel.textContent = 'XP';
    svg.appendChild(yLabel);
    // Append SVG to container
    container.appendChild(svg);
} 