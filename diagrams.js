/**
 * Responsive, dependency-free research illustrations.
 * renderDiagram(kind, { className, idPrefix, title, description }) → SVG string.
 * Import diagrams.css once. All motion respects reduced motion and
 * html[data-motion="paused"]. Drawings illustrate methods, not observed data.
 */

const C = {
  ink: '#242424',
  paper: '#fafaf8',
  gold: '#e4c45b',
  blue: '#d7d7d3',
  sage: '#bdbdb7',
  rust: '#a6a6a0',
  white: '#ffffff',
};

let sequence = 0;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const icons = {
  bank: '<path d="M3 9 12 3l9 6M5 9v11h14V9M3 21h18M9 21v-7h6v7M8 10h1m6 0h1"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.4"/>',
  box: '<path d="m3 7 9-4 9 4v11l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v11M7.5 5l9 4v4"/>',
  network: '<circle cx="5" cy="5" r="3"/><circle cx="19" cy="7" r="3"/><circle cx="10" cy="19" r="3"/><path d="m8 5.5 8 1M6 8l3 8m8-6-5 7"/>',
  people: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-3a6 6 0 0 1 12 0v3m1-7a4.5 4.5 0 0 1 7 4v3"/>',
  market: '<path d="M3 10h18l-2-6H5l-2 6Zm1 0v10h16V10M2 21h20M9 21v-7h6v7M7 4l-1 6m6-6v6m5-6 1 6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  sliders: '<path d="M3 6h5m5 0h8M3 12h11m5 0h2M3 18h3m5 0h10"/><circle cx="10.5" cy="6" r="2.5"/><circle cx="16.5" cy="12" r="2.5"/><circle cx="8.5" cy="18" r="2.5"/>',
};

function icon(name, x, y, size = 24) {
  return `<g class="rd-icon" transform="translate(${x} ${y}) scale(${size / 24})">${icons[name] || icons.network}</g>`;
}

function label(value, x, y, className = 'rd-label', anchor = 'middle') {
  return `<text class="${className}" x="${x}" y="${y}" text-anchor="${anchor}">${escape(value)}</text>`;
}

function box(x, y, width, height, fill = C.white, radius = 9) {
  return `<rect x="${x + 3}" y="${y + 3}" width="${width}" height="${height}" rx="${radius}" fill="${C.ink}"/><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${C.ink}" stroke-width="1.8"/>`;
}

function route(path, id, { color = C.ink, delay = 0, arrow = true, dashed = false } = {}) {
  return `<path class="rd-route${dashed ? ' rd-route--dashed' : ''}" d="${path}" stroke="${color}"${arrow ? ` marker-end="url(#${id}-arrow)"` : ''}/><circle class="rd-flow" r="3.3" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.2" style="offset-path:path('${path}');--rd-delay:${delay}s"/>`;
}

function agency(x, y, radius, color) {
  return `<circle cx="${x + 2}" cy="${y + 2}" r="${radius}" fill="${C.ink}"/><circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="${C.ink}" stroke-width="1.8"/>`;
}

function bank(x, title, color, heights) {
  return `${box(x, 55, 100, 64, color)}${icon('bank', x + 10, 67, 16)}${label(title, x + 61, 79, 'rd-label rd-label--small')}<path d="M${x + 21} 107h59" stroke="${C.ink}" stroke-width="1.4"/>${heights.map((height, index) => `<rect class="rd-stock" x="${x + 25 + index * 18}" y="${105 - height}" width="11" height="${height}" rx="2" fill="${C.ink}" style="--rd-delay:${index * -0.7 - x / 200}s"/>`).join('')}`;
}

const diagrams = {
  redistribution: {
    title: 'Relief centers learn to share scarce supplies',
    description: 'An illustration of three decentralized relief centers sharing supplies. Local observation histories inform recurrent MAPPO policies, which choose whether to serve, reserve, or transfer resources with a shared equity objective. Inventory bars are illustrative.',
    draw: (id) => `
      ${label('DECENTRALIZED RELIEF · SHARED EQUITY', 22, 27, 'rd-kicker', 'start')}
      ${route('M124 87 L169 87', id, { delay: -1 })}
      ${route('M273 87 L316 87', id, { delay: -2 })}
      ${route('M72 120 L72 133 Q72 139 79 139 L209 139 Q220 139 220 148', id, { delay: -0.5, arrow: false })}
      ${route('M368 120 L368 133 Q368 139 361 139 L231 139 Q220 139 220 148', id, { delay: -2, arrow: false })}
      ${route('M220 120 L220 148', id, { delay: -1.2 })}
      ${route('M220 194 L220 205 L92 205 L92 216', id, { delay: -2 })}
      ${route('M220 194 L220 216', id, { delay: -1 })}
      ${route('M220 194 L220 205 L348 205 L348 216', id, { delay: -0.3 })}
      ${bank(22, 'Center A', C.sage, [18, 14, 20])}
      ${bank(170, 'Center B', C.blue, [9, 14, 8])}
      ${bank(318, 'Center C', C.gold, [17, 8, 13])}
      ${box(142, 149, 156, 44, C.ink)}
      ${label('Recurrent MAPPO', 220, 168, 'rd-label rd-label--light')}
      ${label('local histories → shared policy', 220, 184, 'rd-small rd-small--light')}
      ${box(40, 217, 104, 25, C.sage, 6)}${label('Serve', 92, 234, 'rd-label rd-label--small')}
      ${box(168, 217, 104, 25, C.blue, 6)}${label('Reserve', 220, 234, 'rd-label rd-label--small')}
      ${box(296, 217, 104, 25, C.gold, 6)}${label('Transfer', 348, 234, 'rd-label rd-label--small')}
    `,
  },
  substitution: {
    title: 'A food graph makes smarter substitutions',
    description: 'Household groups, foods, nutrients, and food categories connect in a heterogeneous graph neural network. Separate behavior affinity, health suitability, and substitution similarity objectives inform ranked food substitutes. This is a conceptual illustration.',
    draw: (id) => `
      ${label('BEYOND SIMILARITY', 22, 27, 'rd-kicker', 'start')}
      ${[69, 111, 153, 195].map((y, index) => route(`M111 ${y} L122 ${y} Q130 ${y} 130 132 L140 132`, id, { delay: index * -0.65, arrow: false })).join('')}
      ${route('M230 132 C242 132 241 85 253 85', id, { delay: -0.6 })}
      ${route('M230 132 L253 132', id, { delay: -1.6 })}
      ${route('M230 132 C242 132 241 179 253 179', id, { delay: -2.4 })}
      ${[85, 132, 179].map((y, index) => route(`M353 ${y} L383 ${y}`, id, { delay: index * -0.75 })).join('')}
      ${[['Households', 55, C.sage], ['Foods', 97, C.gold], ['Nutrients', 139, C.blue], ['Categories', 181, C.rust]].map(([name, y, color]) => `${box(20, y, 91, 28, color, 6)}${label(name, 65.5, y + 18, 'rd-label rd-label--small')}`).join('')}
      <circle class="rd-pulse" cx="185" cy="132" r="49" fill="${C.gold}" opacity="0.15"/>
      ${box(140, 99, 90, 66, C.ink, 12)}${icon('network', 173, 107, 24).replace('class="rd-icon"', 'class="rd-icon rd-icon--light"')}
      ${label('HeteroGNN', 185, 151, 'rd-label rd-label--light rd-label--small')}
      ${[['Behavior', 'affinity', 68, C.gold], ['Health', 'suitability', 115, C.sage], ['Substitution', 'similarity', 162, C.blue]].map(([name, subtitle, y, color]) => `${box(254, y, 99, 34, color, 6)}${label(name, 303.5, y + 14, 'rd-label rd-label--small')}${label(subtitle, 303.5, y + 27, 'rd-small')}`).join('')}
      ${[85, 132, 179].map((y, index) => `${agency(396, y, 13, index === 0 ? C.gold : C.white)}${label(`0${index + 1}`, 396, y + 4, 'rd-small rd-small--bold')}`).join('')}
      ${label('Ranked', 395, 210, 'rd-small rd-small--bold')}${label('substitutes', 395, 223, 'rd-small')}
      ${label('FOUR NODE TYPES. THREE DISTINCT OBJECTIVES.', 22, 243, 'rd-footer', 'start')}
    `,
  },
  popup: {
    title: 'Bring food closer with optimized pop-up markets',
    description: 'Uncertain donations and pantry opening schedules enter a two-stage stochastic mixed-integer model. The model locates pop-up food markets to improve accessibility for dispersed communities. The routes and locations shown are illustrative.',
    draw: (id) => `
      ${label('BRINGING FOOD CLOSER', 22, 27, 'rd-kicker', 'start')}
      ${label('COMMUNITIES', 376, 48, 'rd-footer')}
      ${route('M111 93 L133 93 L133 119 L148 119', id, { delay: -1 })}
      ${route('M111 168 L133 168 L133 141 L148 141', id, { delay: -2 })}
      ${route('M232 130 C249 130 244 82 260 82', id, { delay: -1.5 })}
      ${route('M232 130 C249 130 244 183 260 183', id, { delay: -0.2 })}
      ${route('M319 82 L355 82', id, { delay: -2.2 })}
      ${route('M319 82 C346 82 338 132 355 132', id, { delay: -1.2 })}
      ${route('M319 183 L355 183', id, { delay: -0.2 })}
      ${route('M319 183 C346 183 338 132 355 132', id, { delay: -2.2 })}
      ${box(21, 67, 90, 51, C.sage, 8)}${icon('box', 32, 80, 22)}${label('Uncertain', 78, 89, 'rd-small rd-small--bold')}${label('donations', 78, 104, 'rd-small')}
      ${box(21, 143, 90, 51, C.blue, 8)}${icon('bank', 32, 156, 22)}${label('Pantry', 78, 166, 'rd-small rd-small--bold')}${label('schedules', 78, 181, 'rd-small')}
      ${box(148, 99, 84, 62, C.ink, 10)}${icon('target', 180, 106, 20).replace('class="rd-icon"', 'class="rd-icon rd-icon--light"')}${label('Stochastic', 190, 139, 'rd-small rd-small--light rd-small--bold')}${label('MILP', 190, 152, 'rd-small rd-small--light')}
      ${label('2-stage model', 190, 181, 'rd-small')}
      ${[55, 156].map((y, index) => `${box(261, y, 58, 54, index === 0 ? C.gold : C.rust, 8)}${icon('market', 277, y + 7, 25)}${label('Pop-up', 290, y + 46, 'rd-small rd-small--bold')}`).join('')}
      ${[82, 132, 183].map((y, index) => `<circle cx="377" cy="${y}" r="20" fill="${index === 1 ? C.sage : C.paper}" stroke="${C.ink}" stroke-width="1.5"/>${icon('people', 365, y - 12, 24)}`).join('')}
      ${box(127, 220, 190, 24, C.gold, 6)}${label('Shorter expected travel', 222, 237, 'rd-label rd-label--small')}
    `,
  },
  norms: {
    title: 'Partnership norms change who benefits',
    description: 'A conceptual comparison from an agent-based simulation of humanitarian food agencies. Conservative norms connect agencies with similar capabilities and yield higher overall satisfaction. Diversifying norms favor complementary capabilities and reduce the satisfaction gap between strong and weak agencies. Node sizes illustrate different capabilities, not measured data.',
    draw: (id) => `
      ${label('HOW SHOULD AGENCIES CHOOSE PARTNERS?', 22, 27, 'rd-kicker', 'start')}
      ${box(20, 51, 190, 149, C.white, 10)}${box(230, 51, 190, 149, C.white, 10)}
      ${label('Conservative', 115, 77, 'rd-label')}${label('Similar capabilities', 115, 95, 'rd-small')}
      ${label('Diversifying', 325, 77, 'rd-label')}${label('Complementary capabilities', 325, 95, 'rd-small')}
      ${route('M49 129 L96 129 L73 169 Z', id, { arrow: false, delay: -1.3 })}
      ${route('M151 132 L184 132 L168 165 Z', id, { arrow: false, delay: -0.5 })}
      ${route('M269 136 L326 118 L382 153 L328 174 Z', id, { arrow: false, delay: -0.8 })}
      ${route('M269 136 L382 153', id, { arrow: false, delay: -1.8, dashed: true })}
      ${route('M326 118 L328 174', id, { arrow: false, delay: -2.4, dashed: true })}
      ${agency(49, 129, 12, C.blue)}${agency(96, 129, 12, C.blue)}${agency(73, 169, 12, C.blue)}
      ${agency(151, 132, 7, C.gold)}${agency(184, 132, 7, C.gold)}${agency(168, 165, 7, C.gold)}
      ${agency(269, 136, 16, C.sage)}${agency(326, 118, 11, C.blue)}${agency(382, 153, 7, C.gold)}${agency(328, 174, 11, C.blue)}
      ${label('Higher overall satisfaction', 115, 222, 'rd-small rd-small--bold')}
      ${label('Smaller strong–weak gap', 325, 222, 'rd-small rd-small--bold')}
      ${label('A SIMULATED TRADE-OFF BETWEEN AGGREGATE OUTCOMES AND EQUITY', 22, 246, 'rd-footer rd-footer--tiny', 'start')}
    `,
  },
  preferences: {
    title: 'Learning the priorities behind food allocation',
    description: 'Historical food allocations feed single-step PPO preference learning. Learned equity, effectiveness, and efficiency priorities inform a hierarchical MILP for hub and branch decisions. This conceptual diagram illustrates inverse preference learning, not measured objective weights.',
    draw: (id) => `
      ${label('WHAT DO ALLOCATION DECISIONS REVEAL?', 22, 27, 'rd-kicker', 'start')}
      ${route('M137 100 L167 100', id, { delay: -0.8 })}
      ${route('M278 100 L309 100', id, { delay: -1.6 })}
      ${box(20, 61, 117, 79, C.blue)}${icon('box', 65, 73, 26)}
      ${label('Observed', 78, 113, 'rd-label')}${label('allocations', 78, 131, 'rd-small')}
      ${box(167, 61, 111, 79, C.ink)}${icon('sliders', 209, 73, 26).replace('class="rd-icon"', 'class="rd-icon rd-icon--light"')}
      ${label('Learn priorities', 222, 113, 'rd-label rd-label--light rd-label--small')}${label('Single-step PPO', 222, 131, 'rd-small rd-small--light')}
      ${box(309, 61, 111, 79, C.gold)}${icon('bank', 350, 73, 26)}
      ${label('Hub + branches', 364, 113, 'rd-label rd-label--small')}${label('Hierarchical MILP', 364, 131, 'rd-small')}
      ${route('M222 141 L222 170', id, { delay: -2.2 })}
      ${box(24, 174, 122, 42, C.sage)}${label('Equity', 85, 200, 'rd-label')}
      ${box(159, 174, 122, 42, C.blue)}${label('Effectiveness', 220, 200, 'rd-label rd-label--small')}
      ${box(294, 174, 122, 42, C.rust)}${label('Efficiency', 355, 200, 'rd-label')}
      ${label('INFER LOCAL TRADE-OFFS FROM HISTORICAL DECISIONS', 22, 246, 'rd-footer', 'start')}
    `,
  },
  dissertation: {
    title: 'Three perspectives on better food-bank decisions',
    description: 'The dissertation connects three research strands: improving access by locating pop-up markets, estimating local service capacity, and learning stakeholder preferences. The strands support location and allocation decisions in a food-bank network.',
    draw: (id) => `
      ${label('FOOD NETWORKS, DESIGNED AROUND PEOPLE', 22, 27, 'rd-kicker', 'start')}
      ${route('M80 168 L80 180 Q80 190 90 190 L210 190 Q220 190 220 204', id, { delay: -0.9 })}
      ${route('M220 168 L220 204', id, { delay: -1.6 })}
      ${route('M360 168 L360 180 Q360 190 350 190 L230 190 Q220 190 220 204', id, { delay: -2.2 })}
      ${[
        { x: 22, name: 'Access', subtitle: 'Locate markets', icon: 'pin', color: C.gold, number: '01' },
        { x: 162, name: 'Capacity', subtitle: 'Estimate resources', icon: 'box', color: C.sage, number: '02' },
        { x: 302, name: 'Preferences', subtitle: 'Learn priorities', icon: 'sliders', color: C.blue, number: '03' },
      ].map((item) => `${box(item.x, 63, 116, 105, item.color, 10)}${label(item.number, item.x + 15, 81, 'rd-footer', 'start')}${icon(item.icon, item.x + 43, 79, 30)}${label(item.name, item.x + 58, 135, 'rd-label')}${label(item.subtitle, item.x + 58, 155, 'rd-small')}`).join('')}
      ${box(107, 205, 226, 35, C.ink, 8)}${icon('check', 118, 213, 19).replace('class="rd-icon"', 'class="rd-icon rd-icon--light"')}${label('Better food-bank decisions', 231, 228, 'rd-label rd-label--light rd-label--small')}
    `,
  },
};

/** Supported kinds: redistribution, substitution, popup, norms, preferences, dissertation. */
export function renderDiagram(kind, options = {}) {
  if (!Object.prototype.hasOwnProperty.call(diagrams, kind)) {
    throw new RangeError(`Unknown research diagram: ${kind}`);
  }

  const diagram = diagrams[kind];
  const prefix = String(options.idPrefix || 'research').replace(/[^a-zA-Z0-9_-]/g, '-') || 'research';
  const id = `rd-${prefix}-${kind}-${++sequence}`;
  const className = ['research-diagram', options.className].filter(Boolean).join(' ');

  return `<svg xmlns="http://www.w3.org/2000/svg" class="${escape(className)}" data-diagram="${kind}" viewBox="0 0 440 258" width="440" height="258" role="img" aria-labelledby="${id}-title ${id}-desc" focusable="false">
    <title id="${id}-title">${escape(options.title || diagram.title)}</title>
    <desc id="${id}-desc">${escape(options.description || diagram.description)}</desc>
    <defs>
      <pattern id="${id}-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="${C.ink}" opacity="0.085"/></pattern>
      <marker id="${id}-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 7 4 1 7" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></marker>
    </defs>
    <rect width="440" height="258" fill="${C.paper}"/>
    <rect width="440" height="258" fill="url(#${id}-dots)"/>
    ${diagram.draw(id)}
  </svg>`;
}
