// Conceptual illustrations, built from four-unit pixel sprites and orthogonal paths.
const sprites = {
  bank: ['000110000', '001111000', '011111100', '111111110', '000000000', '011010110', '011010110', '011010110', '011010110', '111111110'],
  person: ['0011100', '0011100', '0001000', '0111110', '1101011', '0001000', '0011100', '0010100', '0110110'],
  box: ['11111111', '10011001', '10011001', '10000001', '10000001', '10000001', '11111111'],
  leaf: ['00001111', '00111111', '01111110', '11111110', '11111100', '01111000', '00110000', '01100000'],
  chart: ['100000000', '100000010', '100010010', '100010010', '101010010', '101010010', '101010010', '111111111'],
  market: ['011111110', '011111110', '110110111', '110110111', '100000001', '101110101', '101110101', '111111111'],
  paper: ['111111110', '100000110', '101110110', '100000010', '101110010', '100000010', '101110010', '100000010', '111111110'],
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
let sequence = 0;
function sprite(name, x, y, size = 4, className = '') {
  const path = sprites[name].flatMap((row, j) => [...row].flatMap((cell, i) => cell === '1' ? [`M${i * size} ${j * size}h${size}v${size}h-${size}z`] : [])).join('');
  return `<path class="px-sprite px-ink ${className}" transform="translate(${x} ${y})" d="${path}"/>`;
}
const text = (value, x, y, className = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${className}">${escape(value)}</text>`;
const line = d => `<path class="px-route" d="${d}"/>`;
function flow(d, delay = 0) {
  return `${line(d)}<rect class="px-packet px-gold" x="-3" y="-3" width="6" height="6" style="offset-path:path('${d}');--delay:${delay}s"/>`;
}
const panel = (x, y, width, height) => `<rect class="px-rule" x="${x}" y="${y}" width="${width}" height="${height}"/>`;
function graphNode(x, y, type, scale = 1) {
  const shape = type === 'N'
    ? '<path class="px-gold" stroke="currentColor" d="M-4-12h8v4h4v4h4v8H8v4H4v4h-8V8h-4V4h-4v-8h4v-4h4z"/>'
    : `<rect x="-11" y="-11" width="22" height="22" class="${type === 'F' ? 'px-ink' : 'px-light'}" stroke="currentColor"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})">${shape}${text(type, 0, 3.5, type === 'F' ? 'px-node-label' : 'px-node-label-dark')}</g>`;
}
function node(x, y, type = 'bank', label = '') {
  return `${sprite(type, x - 18, y - 20)}${label ? text(label, x, y + 37) : ''}`;
}
const diagrams = {
  redistribution: {
    title: 'Relief centers learn to share',
    description: 'Conceptual relief centers share supplies through recurrent multi-agent learning. Their decisions are to serve locally, reserve stock, or transfer. Moving square packets are illustrative, not simulated observations.',
    draw: () => `${text('RELIEF CENTERS / SHARED EQUITY', 20, 20, 'px-kicker', 'start')}
      ${flow('M88 82 H192', -2)}${flow('M224 82 H342', -5)}
      ${node(62, 82, 'bank', 'Center A')}${node(208, 82, 'bank', 'Center B')}${node(366, 82, 'bank', 'Center C')}
      ${line('M62 128 V144 H366 V128')}${line('M208 128 V144')}
      ${panel(79, 158, 282, 31)}${text('SERVE / RESERVE / TRANSFER', 220, 178)}
      ${text('Local histories → recurrent MAPPO', 220, 212, 'px-note')}`,
  },
  substitution: {
    title: 'Three objectives for a better food swap',
    description: 'A conceptual heterogeneous graph has six connected nodes: two foods, two household groups, and two nutrients. Edges represent food similarity, household-food behavior, and food-nutrient evidence. Animated square messages travel along graph edges. Learned representations support three separate targets: behavior affinity, health suitability, and substitution similarity. Nodes, edges, and motion are illustrative, not actual model outputs.',
    height: 288,
    draw: () => `${text('HETEROGENEOUS GRAPH / FOOD SUBSTITUTION', 20, 20, 'px-kicker', 'start')}
      ${panel(20, 40, 270, 172)}
      ${['M50 90 L147 63','M50 90 L159 149','M50 90 L85 175','M85 175 L147 63','M85 175 L159 149','M85 175 L243 181','M50 90 L241 85','M85 175 L241 85'].map(d => `<path class="px-edge" d="${d}"/>`).join('')}
      ${flow('M50 90 L159 149', -1)}${flow('M85 175 L147 63', -4)}${flow('M241 85 L50 90', -7)}
      ${graphNode(50, 90, 'F')}${graphNode(85, 175, 'F')}
      ${graphNode(147, 63, 'H')}${graphNode(241, 85, 'H')}
      ${graphNode(159, 149, 'N')}${graphNode(243, 181, 'N')}
      <path class="px-active-edge" d="M290 126H308M308 80V172M308 80H323M308 126H323M308 172H323"/>
      ${panel(323, 65, 105, 30)}${text('Behavior', 375, 84)}
      ${panel(323, 111, 105, 30)}${text('Health', 375, 130)}
      ${panel(323, 157, 105, 30)}${text('Similarity', 375, 176)}
      ${text('Message passing on typed relations', 155, 229, 'px-note')}
      ${graphNode(30, 251, 'F', .65)}${text('Food', 44, 255, 'px-note', 'start')}
      ${graphNode(103, 251, 'H', .65)}${text('Household', 117, 255, 'px-note', 'start')}
      ${graphNode(210, 251, 'N', .65)}${text('Nutrient', 224, 255, 'px-note', 'start')}
      ${text('3 objectives', 375, 229, 'px-note')}`,
  },
  popup: {
    title: 'Placing markets closer to communities',
    description: 'Conceptual grid map with an existing agency, two modeled pop-up markets, and communities. Routes illustrate access, not measured travel. The study examines expected travel under uncertain donations.',
    draw: () => `${text('LOCATION / ACCESS UNDER UNCERTAINTY', 20, 20, 'px-kicker', 'start')}
      ${[60,100,140,180].map(y => `<path class="px-rule" d="M24 ${y}H416"/>`).join('')}
      ${[60,100,140,180,220,260,300,340,380].map(x => `<path class="px-rule" d="M${x} 40V188"/>`).join('')}
      ${flow('M76 76 H180 V140 H268', -4)}${flow('M76 76 H340 V76', -1)}
      ${node(60, 76, 'bank')}${sprite('market', 252, 120)}${sprite('market', 324, 56)}
      ${sprite('person', 132, 112, 3)}${sprite('person', 198, 56, 3)}${sprite('person', 364, 136, 3)}
      ${text('Existing', 62, 125, 'px-note')}${text('Pop-up 01', 270, 178, 'px-note')}${text('Pop-up 02', 343, 111, 'px-note')}
      ${text('Two modeled markets / expected travel', 220, 212, 'px-note')}`,
  },
  norms: {
    title: 'Different rules create different alliances',
    description: 'Two conceptual networks compare conservative alliances between similar agencies with diversifying alliances between different agencies. Network satisfaction and fairness involve a trade-off; no norm is always best.',
    draw: () => `${text('ALLIANCE NORMS / A FAIRNESS TRADE-OFF', 20, 20, 'px-kicker', 'start')}
      ${panel(20, 40, 190, 145)}${panel(230, 40, 190, 145)}
      ${text('Conservative', 115, 60)}${text('Diversifying', 325, 60)}
      ${flow('M67 100 H158 V148 H67 V100', -1)}${flow('M270 100 H376 V148 H270 V100', -5)}
      ${line('M270 100 V124 H376 V148')}
      ${[[58,91],[149,91],[58,139],[149,139]].map(([x,y]) => `<rect x="${x}" y="${y}" width="18" height="18" class="px-ink"/>`).join('')}
      ${[[261,91],[367,139]].map(([x,y]) => `<rect x="${x}" y="${y}" width="18" height="18" class="px-ink"/>`).join('')}
      ${[[367,91],[261,139]].map(([x,y]) => `<rect x="${x}" y="${y}" width="18" height="18" class="px-gold" stroke="currentColor"/>`).join('')}
      ${text('Similar capability', 115, 174, 'px-note')}${text('Different capability', 325, 174, 'px-note')}
      ${text('Conceptual agencies / illustrative alliances', 220, 212, 'px-note')}`,
  },
  preferences: {
    title: 'Learning priorities from decisions',
    description: 'Historical allocations inform a hierarchical MILP and single-step PPO model of decision-maker preferences. Equity, efficiency, and effectiveness are separate objectives. The weights are model estimates, not surveys.',
    draw: () => `${text('PREFERENCE LEARNING / INVERSE DECISIONS', 20, 20, 'px-kicker', 'start')}
      ${sprite('paper', 40, 66)}${text('Allocations', 58, 130)}
      ${flow('M92 84 H169', -2)}${panel(169, 57, 99, 57)}
      ${text('MILP', 218, 80)}${text('+ PPO', 218, 99)}${flow('M268 84 H324', -6)}
      ${sprite('chart', 341, 64)}${text('Priorities', 359, 130)}
      ${text('EQUITY / EFFICIENCY / EFFECTIVENESS', 220, 175, 'px-kicker')}
      ${text('Estimated from observed allocation choices', 220, 212, 'px-note')}`,
  },
  dissertation: {
    title: 'Food networks built around people',
    description: 'Three overlapping dissertation strands connect access, agency capacity, and preference learning in a food-bank network. This is a conceptual overview of the doctoral work, not three additional publications.',
    draw: () => `${text('DISSERTATION / ONE CONNECTED NETWORK', 20, 20, 'px-kicker', 'start')}
      ${node(68, 79, 'market', 'Access')}${node(220, 79, 'bank', 'Capacity')}${node(372, 79, 'chart', 'Preferences')}
      ${flow('M68 127 V148 H220 V164', -2)}${flow('M372 127 V148 H220 V164', -6)}${line('M220 127 V164')}
      ${panel(140, 164, 160, 29)}${text('Food-bank network', 220, 183)}
      ${text('Location-allocation + multi-agent preferences', 220, 216, 'px-note')}`,
  },
};

export function renderDiagram(kind, options = {}) {
  const diagram = diagrams[kind];
  if (!diagram) throw new Error(`Unknown pixel diagram: ${kind}`);
  const id = `${options.idPrefix || kind}-pixel-${++sequence}`.replace(/[^a-zA-Z0-9_-]/g, '-');
  const height = diagram.height || 232;
  return `<svg class="research-diagram pixel-diagram ${escape(options.className || '')}" viewBox="0 0 440 ${height}" role="img" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg"><title id="${id}-title">${escape(options.title || diagram.title)}</title><desc id="${id}-desc">${escape(options.description || diagram.description)}</desc>${diagram.draw()}${text('CONCEPTUAL ILLUSTRATION', 220, height - 2, 'px-note')}</svg>`;
}
