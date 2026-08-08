
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    loader.remove();
    document.body.classList.remove('is-loading');
    return;
  }

  const logEl = document.getElementById('loader-log');
  const barEl = document.getElementById('loader-bar');
  const pctEl = document.getElementById('loader-pct');

  const steps = [
    'inicializando sistema...',
    'conectando ao banco de dados...',
    'carregando datasets...',
    'compilando dashboards...',
    'pronto.'
  ];

  let pct = 0;

  function tick() {
    pct += Math.random() * 14 + 7;
    if (pct > 100) pct = 100;

    barEl.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';

    const stepIndex = Math.min(
      Math.floor((pct / 100) * steps.length),
      steps.length - 1
    );
    logEl.textContent = steps[stepIndex];

    if (pct < 100) {
      setTimeout(tick, 110 + Math.random() * 140);
    } else {
      setTimeout(finish, 450);
    }
  }

  function finish() {
    loader.classList.add('hide');
    document.body.classList.remove('is-loading');
    setTimeout(() => loader.remove(), 600);
  }

  const safety = setTimeout(finish, 6000);

  tick();
  loader.addEventListener('transitionend', () => clearTimeout(safety));
})();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
