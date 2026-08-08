
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

const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  if (type === 'warning') {
    toast.style.borderLeftColor = 'var(--danger)';
  } else if (type === 'success') {
    toast.style.borderLeftColor = 'var(--accent-2)';
  }

  const icon = type === 'warning' ? '⚠' : type === 'success' ? '✓' : 'ℹ';
  toast.innerHTML = `
    <span class="toast-icon" style="color: ${type === 'warning' ? 'var(--danger)' : type === 'success' ? 'var(--accent-2)' : 'var(--accent)'}">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  toastContainer.appendChild(toast);
  toast.offsetHeight;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 4000);
}

document.querySelectorAll('a').forEach((link) => {
  const href = link.getAttribute('href');

  if (href === '#') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('A demonstração deste projeto estará disponível em breve!', 'info');
    });
  }
  
  else if (href === 'https://github.com/' || href === 'https://www.linkedin.com/') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (link.classList.contains('contact-link')) {
        showToast('Este link de rede social não foi configurado ainda.', 'warning');
      } else {
        showToast('O repositório deste projeto ainda não foi configurado.', 'warning');
      }
    });
  }

  else if (href && href.endsWith('.pdf')) {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      showToast('Verificando disponibilidade do currículo...', 'info');
      try {
        const response = await fetch(href, { method: 'HEAD' });
        if (response.ok) {
          const tempLink = document.createElement('a');
          tempLink.href = href;
          tempLink.download = '';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          showToast('Download do currículo iniciado!', 'success');
        } else {
          showToast('Arquivo de currículo não encontrado na pasta assets.', 'warning');
        }
      } catch (err) {
        showToast('Não foi possível baixar o currículo no momento.', 'warning');
      }
    });
  }
});
