// scripts/graphs/skillsGraph.js
// This module renders an SVG pie chart for user skills

/**
 * Renders an SVG pie chart showing skill distribution.
 * @param {HTMLElement} container - The DOM element to render the SVG into.
 * @param {Array} skillsData - Array of objects: [{ name: string, value: number }]
 */
export function renderSkillsGraph(container, skillsData) {
    // Clear previous content
    container.innerHTML = '';
    if (!skillsData || skillsData.length === 0) {
        container.innerHTML = '<p>No skills data available.</p>';
        return;
    }
    // SVG dimensions
    const width = 300;
    const height = 150;
    const radius = 60;
    const centerX = width / 2;
    const centerY = height / 2;
    const total = skillsData.reduce((sum, s) => sum + s.value, 0);
    let startAngle = 0;
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    // Draw pie slices
    skillsData.forEach((skill, i) => {
        const angle = (skill.value / total) * 2 * Math.PI;
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(startAngle + angle);
        const y2 = centerY + radius * Math.sin(startAngle + angle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', `hsl(${i * 40}, 70%, 60%)`);
        svg.appendChild(path);
        // Add skill label
        const midAngle = startAngle + angle / 2;
        const labelX = centerX + (radius + 20) * Math.cos(midAngle);
        const labelY = centerY + (radius + 20) * Math.sin(midAngle);
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        label.setAttribute('font-size', '12');
        label.setAttribute('text-anchor', 'middle');
        label.textContent = skill.name;
        svg.appendChild(label);
        startAngle += angle;
    });
    // Append SVG to container
    container.appendChild(svg);
} 