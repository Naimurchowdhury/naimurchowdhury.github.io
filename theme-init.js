// Run before first paint. Explicit links override the saved preference.
(() => {
  const valid = value => value === 'classic' || value === 'typewriter';
  const requested = new URLSearchParams(location.search).get('theme');
  let saved;
  try { saved = localStorage.getItem('naimur-theme'); } catch { /* Storage is optional. */ }
  const theme = valid(requested) ? requested : valid(saved) ? saved : 'typewriter';
  document.documentElement.dataset.theme = theme;
  document.getElementById('typewriter-theme').media = theme === 'typewriter' ? 'all' : 'not all';
  if (valid(requested)) {
    try { localStorage.setItem('naimur-theme', theme); } catch { /* Explicit links still work. */ }
  }
})();
