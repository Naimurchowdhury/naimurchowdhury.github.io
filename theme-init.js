// Run before first paint. Change this source setting to 'classic' for a rollback.
(() => {
  const theme = 'typewriter';
  document.documentElement.dataset.theme = theme;
  document.getElementById('typewriter-theme').media = theme === 'typewriter' ? 'all' : 'not all';
})();
