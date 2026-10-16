export function initializeTheme() {
  const theme = document.documentElement.dataset.theme || 'typewriter';
  const themeLinks = [...document.querySelectorAll('[data-theme-choice]')];
  themeLinks.forEach(link => {
    if (link.dataset.themeChoice === theme) link.setAttribute('aria-current', 'true');
  });
  function updateThemeLinks() {
    themeLinks.forEach(link => {
      // Prepare normal links before touch/click navigation, including section URLs.
      link.href = `?theme=${link.dataset.themeChoice}${location.hash}`;
    });
  }
  updateThemeLinks();
  window.addEventListener('hashchange', updateThemeLinks);
  if (theme !== 'typewriter') return;
  document.body.classList.add('theme-typewriter');
  document.querySelector('meta[name="theme-color"]').content = '#f1f0df';
  document.querySelector('#hero-heading').innerHTML = 'Naimur Rahman<br>Chowdhury<span class="name-dot">.</span>';
  document.querySelector('.hero-description').textContent = 'I study how we make decisions — and how we can make them better. My work brings together operations research and machine learning, with a focus on people and the systems that serve them.';
  const about = document.querySelector('.hero-text-link');
  about.firstChild.textContent = 'A little about me ';
  document.querySelector('.profile-top .tiny-label').textContent = 'PORTRAIT / 01';
  document.querySelector('.sidebar-note p').innerHTML = 'Better decisions.<br>Human impact.';
  document.querySelector('.sidebar-note > span').textContent = 'Notes from research & practice.';
  document.querySelector('.brand-caption').textContent = 'RESEARCH & PRACTICE';
  document.querySelector('.nav-label').textContent = 'CONTENTS';
  document.querySelector('.topbar > div').lastChild.textContent = 'RESEARCH & PRACTICE';
}
