// scripts/graphs/miniSkillPie.js
// This module renders a single skill as a mini SVG pie chart with label and percentage

/**
 * Renders a mini pie chart for a skill.
 * @param {HTMLElement} container - The DOM element to render the SVG into.
 * @param {string} skillName - The name of the skill.
 * @param {number} percent - The percentage value (0-100).
 */
export function renderMiniSkillPie(container, skillName, percent) {
    // SVG dimensions
    const size = 70;
    const radius = 30;
    const center = size / 2;
    const angle = (percent / 100) * 2 * Math.PI;
    // Calculate end point for the arc
    const x = center + radius * Math.sin(angle);
    const y = center - radius * Math.cos(angle);
    const largeArc = percent > 50 ? 1 : 0;
    // Pie path for the filled portion
    const pathData = [
        `M ${center} ${center - radius}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`,
        `L ${center} ${center}`,
        'Z'
    ].join(' ');
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', center);
    bgCircle.setAttribute('cy', center);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', '#222a');
    svg.appendChild(bgCircle);
    // Filled arc
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arc.setAttribute('d', pathData);
    arc.setAttribute('fill', '#5a6dff');
    svg.appendChild(arc);
    // Percentage text in center
    const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    percentText.setAttribute('x', center);
    percentText.setAttribute('y', center + 5);
    percentText.setAttribute('text-anchor', 'middle');
    percentText.setAttribute('font-size', '15');
    percentText.setAttribute('fill', '#fff');
    percentText.textContent = `${percent}%`;
    svg.appendChild(percentText);
    // Label below
    const label = document.createElement('div');
    label.style.textAlign = 'center';
    label.style.fontSize = '13px';
    label.style.marginTop = '2px';
    label.textContent = skillName;
    // Container for pie and label
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.margin = '10px 12px';
    wrapper.appendChild(svg);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
} 