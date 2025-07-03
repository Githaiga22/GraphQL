// scripts/graphs/xpGraph.js
// This module renders an improved SVG XP progression bar graph

/**
 * Renders an SVG bar graph showing XP progression over time.
 * @param {HTMLElement} container - The DOM element to render the SVG into.
 * @param {Array} xpData - Array of objects: [{ date: 'YYYY-MM-DD', xp: number }]
 */
export function renderXPGraph(container, xpData) {
    // Clear previous content
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
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const barWidth = Math.max(20, (width - margin.left - margin.right) / groupedData.length - 10);
    const maxXP = Math.max(...groupedData.map(d => d.xp));
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    // Draw Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', height - margin.bottom);
    yAxis.setAttribute('stroke', '#333');
    svg.appendChild(yAxis);
    // Draw X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', height - margin.bottom);
    xAxis.setAttribute('x2', width - margin.right);
    xAxis.setAttribute('y2', height - margin.bottom);
    xAxis.setAttribute('stroke', '#333');
    svg.appendChild(xAxis);
    // Draw bars and labels
    groupedData.forEach((d, i) => {
        const barHeight = (d.xp / maxXP) * (height - margin.top - margin.bottom - 10);
        const x = margin.left + i * (barWidth + 10);
        const y = height - margin.bottom - barHeight;
        // Bar
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', '#007bff');
        svg.appendChild(rect);
        // Value label above bar
        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueLabel.setAttribute('x', x + barWidth / 2);
        valueLabel.setAttribute('y', y - 5);
        valueLabel.setAttribute('text-anchor', 'middle');
        valueLabel.setAttribute('font-size', '12');
        valueLabel.textContent = d.xp;
        svg.appendChild(valueLabel);
        // Date label (rotated)
        const dateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dateLabel.setAttribute('x', x + barWidth / 2);
        dateLabel.setAttribute('y', height - margin.bottom + 20);
        dateLabel.setAttribute('text-anchor', 'end');
        dateLabel.setAttribute('font-size', '11');
        dateLabel.setAttribute('transform', `rotate(-40 ${x + barWidth / 2} ${height - margin.bottom + 20})`);
        dateLabel.textContent = d.date.slice(5); // MM-DD
        svg.appendChild(dateLabel);
    });
    // Y-axis label
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', 10);
    yLabel.setAttribute('y', margin.top);
    yLabel.setAttribute('font-size', '13');
    yLabel.textContent = 'XP';
    svg.appendChild(yLabel);
    // Append SVG to container
    container.appendChild(svg);
} 