// scripts/graphs/skillsDonutChart.js
// Renders a donut chart for each skill, each with its own percentage and label

/**
 * Renders a donut chart for each skill.
 * @param {HTMLElement} container - The DOM element to render the SVGs into.
 * @param {Array} skillsData - Array of objects: [{ name: string, value: number }]
 */
export function renderSkillsDonutChart(container, skillsData) {
    container.innerHTML = '';
    if (!skillsData || skillsData.length === 0) {
        container.innerHTML = '<p>No skills data available.</p>';
        return;
    }
    // Find the max value for percentage calculation
    const maxValue = Math.max(...skillsData.map(s => s.value));
    // Flex row for all donuts
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexWrap = 'wrap';
    row.style.justifyContent = 'center';
    row.style.gap = '32px';
    skillsData.forEach((skill, i) => {
        const percent = Math.round((skill.value / maxValue) * 100);
        // SVG settings
        const size = 110;
        const radius = 48;
        const innerRadius = 34;
        const center = size / 2;
        const angle = (percent / 100) * 2 * Math.PI;
        // Outer arc end
        const x2 = center + radius * Math.sin(angle);
        const y2 = center - radius * Math.cos(angle);
        // Path for the filled arc
        const largeArc = percent > 50 ? 1 : 0;
        const pathData = [
            `M ${center} ${center - radius}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
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
        arc.setAttribute('fill', `hsl(${i * 360 / skillsData.length}, 70%, 60%)`);
        svg.appendChild(arc);
        // Inner circle for donut effect
        const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCircle.setAttribute('cx', center);
        innerCircle.setAttribute('cy', center);
        innerCircle.setAttribute('r', innerRadius);
        innerCircle.setAttribute('fill', '#1e293b');
        svg.appendChild(innerCircle);
        // Percentage text in center
        const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        percentText.setAttribute('x', center);
        percentText.setAttribute('y', center + 7);
        percentText.setAttribute('text-anchor', 'middle');
        percentText.setAttribute('font-size', '20');
        percentText.setAttribute('fill', '#fff');
        percentText.textContent = `${percent}%`;
        svg.appendChild(percentText);
        // Label below
        const label = document.createElement('div');
        label.style.textAlign = 'center';
        label.style.fontSize = '15px';
        label.style.color = '#c7d2fe';
        label.style.marginTop = '7px';
        label.textContent = skill.name;
        // Wrapper for donut and label
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.appendChild(svg);
        wrapper.appendChild(label);
        row.appendChild(wrapper);
    });
    container.appendChild(row);
} 