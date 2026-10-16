import { initializeTheme } from './themes.js';
import { projects } from './projects.js';

initializeTheme();
const { renderDiagram } = await import(document.documentElement.dataset.theme === 'classic' ? './diagrams.js' : './themes/pixel-diagrams.js');

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (text) => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const email = 'nchowdhury@ncsu.edu';
let toastTimer;
function toast(message) {
  const notification = $('#toast');
  (document.querySelector('dialog[open]') || document.body).append(notification);
  notification.textContent = message;
  notification.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
}
async function copyText(text, success) {
  try {
    await navigator.clipboard.writeText(text);
    toast(success);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
    // A fallback also works when the website is previewed over an ordinary local HTTP connection.
    const host = document.querySelector('dialog[open]') || document.body;
    const previousFocus = document.activeElement;
    host.append(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Show an actionable message below. */ }
    textarea.remove();
    previousFocus?.focus();
    toast(copied ? success : 'Copy unavailable. Select the text or use the download button.');
  }
}

$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
$('#copy-email').addEventListener('click', () => copyText(email, 'Email copied: ' + email));

// The motion preference is optional; storage can be disabled in private browsing.
let storedMotion;
try { storedMotion = localStorage.getItem('naimur-motion'); } catch { /* Use the device preference. */ }
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let paused = motionQuery.matches || storedMotion === 'paused';
function updateMotion() {
  document.documentElement.dataset.motion = paused ? 'paused' : 'running';
  $('#motion-toggle').setAttribute('aria-pressed', String(paused));
  $('#motion-toggle').disabled = motionQuery.matches;
  $('.motion-label').textContent = motionQuery.matches ? 'Reduced motion enabled' : paused ? 'Resume animations' : 'Pause animations';
  $('.motion-icon').innerHTML = paused ? '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="m8 4 12 8-12 8z"/></svg>' : '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M8 5v14M16 5v14"/></svg>';
}
updateMotion();
$('#motion-toggle').addEventListener('click', () => {
  paused = !paused;
  storedMotion = paused ? 'paused' : 'running';
  updateMotion();
  try { localStorage.setItem('naimur-motion', paused ? 'paused' : 'running'); } catch { /* Preference remains for this visit. */ }
});
motionQuery.addEventListener('change', event => {
  paused = event.matches || storedMotion === 'paused';
  updateMotion();
});

// Navigation stays usable with touch, keyboard, and a narrow viewport.
function toggleMenu(open) {
  $('#sidebar').classList.toggle('is-open', open);
  $('#nav-scrim').hidden = !open;
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
  $('#menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('mobile-nav-open', open);
  $('main').inert = open;
  if (open) requestAnimationFrame(() => $('.nav-item').focus());
}
$('#menu-toggle').addEventListener('click', () => toggleMenu($('#menu-toggle').getAttribute('aria-expanded') !== 'true'));
$('#nav-scrim').addEventListener('click', () => toggleMenu(false));
$$('.nav-item').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#sidebar').classList.contains('is-open')) { toggleMenu(false); $('#menu-toggle').focus(); } });
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) toggleMenu(false); });
let scrollQueued = false;
const sections = $$('.section-anchor');
function updateActiveSection() {
  scrollQueued = false;
  const offset = innerWidth <= 760 ? 130 : 160;
  const active = sections.filter(section => section.getBoundingClientRect().top <= offset).at(-1) || sections[0];
  $$('.nav-item').forEach(link => {
    const selected = link.hash === '#' + active.id;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateActiveSection); } }, { passive: true });
updateActiveSection();

function renderProjects(filter = 'all') {
  const selected = projects.filter(project => filter === 'all' || project.category === filter);
  $('#project-grid').innerHTML = selected.map(project => `
    <article class="project-card" style="--card-color:${project.color}">
      <div class="project-visual">
        <div class="project-visual-head"><span class="project-index">PROJECT / ${String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span class="project-type">${escapeHTML(project.status)}</span></div>
        ${renderDiagram(project.id, { idPrefix: 'card-' + project.id })}
      </div>
      <div class="project-body">
        <div class="project-tags">${project.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
        <h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.summary)}</p>
        <div class="project-bottom"><div class="project-metric"><strong>${escapeHTML(project.metric)}</strong> ${escapeHTML(project.metricLabel)}</div><button class="project-open" data-project="${project.id}" aria-label="Explore ${escapeHTML(project.title)}"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></button></div>
      </div>
    </article>`).join('');
  $('#project-count').textContent = `${selected.length} research projects shown`;
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(other => { other.classList.toggle('selected', other === button); other.setAttribute('aria-pressed', String(other === button)); });
  renderProjects(button.dataset.filter);
}));
renderProjects();

let lastDialogTrigger;
function openDialog(dialog, trigger) {
  lastDialogTrigger = trigger;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
}
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); document.body.append($('#toast')); lastDialogTrigger?.focus({ preventScroll: true }); });
});
$('#project-grid').addEventListener('click', event => {
  const trigger = event.target.closest('[data-project]');
  if (!trigger) return;
  const project = projects.find(item => item.id === trigger.dataset.project);
  $('#project-dialog-content').innerHTML = `
    <div class="eyebrow">${escapeHTML(project.status)}</div>
    <h2 class="dialog-title" id="dialog-title">${escapeHTML(project.paperTitle)}</h2>
    <div class="dialog-visual" style="--card-color:${project.color}">${renderDiagram(project.id, { idPrefix: 'dialog-' + project.id })}</div>
    <p class="dialog-summary">${escapeHTML(project.question)}</p>
    <div class="dialog-section"><h3>The approach</h3><ul>${project.approach.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ul></div>
    <div class="dialog-result"><h3>What we learned</h3><p>${escapeHTML(project.finding)}</p></div>
    <div class="dialog-source"><strong>${escapeHTML(project.authors)}</strong><br>${escapeHTML(project.sourceNote)}</div>
    ${project.url ? `<a class="button button-dark" href="${escapeHTML(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel)} <span aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a>` : `<a class="button button-dark" href="mailto:${email}?subject=CoRe-MARL%20manuscript%20request">Ask about this research <span aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a>`}
    <p class="dialog-notice">Animated diagram illustrates the research approach; it is not a live simulation.</p>`;
  openDialog($('#project-dialog'), trigger);
});

let publications = [];
let allPublicationsVisible = false;
let currentCitation = '';
let currentCitationId = '';
function filteredPublications() {
  const query = $('#publication-search').value.trim().toLowerCase();
  const year = $('#publication-year').value;
  return publications.filter(paper => (year === 'all' || String(paper.year) === year) && `${paper.title} ${paper.authors} ${paper.venue} ${paper.type}`.toLowerCase().includes(query));
}
function renderPublications() {
  const filtered = filteredPublications();
  const shown = allPublicationsVisible ? filtered : filtered.slice(0, 5);
  $('#publication-list').innerHTML = shown.map(paper => `
    <article class="publication-row"><span class="publication-year">${paper.year}</span><div class="publication-content"><h3><a href="${escapeHTML(paper.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(paper.title)}</a></h3><p class="publication-authors">${escapeHTML(paper.authors)}</p><div class="publication-meta"><span class="publication-badge">${escapeHTML(paper.type)}</span><span>${escapeHTML(paper.venue)}</span></div></div><button class="citation-button" data-citation="${escapeHTML(paper.id)}" aria-label="Cite ${escapeHTML(paper.title)}"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M4 5h6v7H7c0 3-1 5-3 7M14 5h6v7h-3c0 3-1 5-3 7"/></svg></button></article>`).join('') || '<div class="empty-state"><strong>No papers found.</strong>Try a different topic, author, or year.</div>';
  $('#publication-count').textContent = `Showing ${shown.length} of ${filtered.length} ${filtered.length === 1 ? 'publication' : 'publications'}`;
  $('#publications-more').hidden = filtered.length <= 5;
  $('#publications-more').innerHTML = allPublicationsVisible ? 'Show fewer publications <span aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M12 20V4m-6 6 6-6 6 6"/></svg></span>' : `View all ${filtered.length} publications <span aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></span>`;
}
$('#publication-search').addEventListener('input', () => { allPublicationsVisible = true; renderPublications(); });
$('#publication-year').addEventListener('change', () => { allPublicationsVisible = true; renderPublications(); });
$('#publications-more').addEventListener('click', () => {
  allPublicationsVisible = !allPublicationsVisible;
  renderPublications();
  if (!allPublicationsVisible) $('#publications').scrollIntoView({ behavior: paused ? 'instant' : 'smooth', block: 'start' });
});
function bibEscape(text) { return String(text).replace(/[{}]/g, '').replace(/&/g, '\\&').replace(/%/g, '\\%'); }
function bibtex(paper) {
  const type = { 'Journal article': 'article', 'Conference paper': 'inproceedings', 'Dissertation': 'phdthesis', 'Preprint': 'misc' }[paper.type] || 'misc';
  const venueKey = { article: 'journal', inproceedings: 'booktitle', phdthesis: 'school', misc: 'howpublished' }[type];
  const fields = { title: paper.title, author: paper.authors.split(/,\s*/).join(' and '), year: paper.year, [venueKey]: paper.venue, url: paper.url, ...(paper.doi ? { doi: paper.doi } : {}) };
  return `@${type}{${paper.id},\n${Object.entries(fields).map(([key, value]) => `  ${key} = {${bibEscape(value)}}`).join(',\n')}\n}`;
}
$('#publication-list').addEventListener('click', event => {
  const trigger = event.target.closest('[data-citation]');
  if (!trigger) return;
  const paper = publications.find(item => item.id === trigger.dataset.citation);
  currentCitation = bibtex(paper);
  currentCitationId = paper.id;
  $('#citation-text').textContent = currentCitation;
  openDialog($('#citation-dialog'), trigger);
});
$('#copy-citation').addEventListener('click', () => copyText(currentCitation, 'BibTeX citation copied.'));
$('#download-citation').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([currentCitation + '\n'], { type: 'application/x-bibtex;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${currentCitationId}.bib`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
try {
  const response = await fetch('./publications.json');
  if (!response.ok) throw new Error('Publications could not load');
  publications = await response.json();
  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
  $('#publication-year').innerHTML += years.map(year => `<option value="${year}">${year}</option>`).join('');
  renderPublications();
} catch {
  $('#publication-list').innerHTML = '<div class="empty-state"><strong>The publication list couldn’t load.</strong><a class="text-link" href="https://scholar.google.com/citations?user=0Ff3FjoAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Browse the full list on Google Scholar <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></a></div>';
  $('#publication-count').textContent = 'Google Scholar is available via the link above.';
}
