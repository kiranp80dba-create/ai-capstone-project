const routes = [
  { key: 'overview', label: 'Overview' },
  { key: 'context', label: '1. Context' },
  { key: 'technology', label: '2. Technology Choice' },
  { key: 'cost', label: '3. Cost Considerations' },
  { key: 'security', label: '4. Security Plan' },
  { key: 'change', label: '5. Change Management' },
  { key: 'scaling', label: '6. Scaling Strategy' },
  { key: 'governance', label: '7. Governance & Compliance' },
  { key: 'kpis', label: '8. KPIs' },
  { key: 'conclusion', label: 'Conclusion' },
  { key: 'pages', label: 'Original Document Pages' }
];

const titleEl = document.getElementById('view-title');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function currentRouteKey() {
  const hash = window.location.hash.replace('#', '');
  return routes.some(r => r.key === hash) ? hash : 'overview';
}

function renderRoute() {
  const key = currentRouteKey();
  const index = routes.findIndex(r => r.key === key);

  document.querySelectorAll('.view').forEach(view => {
    view.classList.toggle('active', view.dataset.view === key);
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.classList.toggle('active', link.dataset.route === key);
  });

  titleEl.textContent = routes[index].label;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === routes.length - 1;

  prevBtn.onclick = () => {
    if (index > 0) window.location.hash = routes[index - 1].key;
  };
  nextBtn.onclick = () => {
    if (index < routes.length - 1) window.location.hash = routes[index + 1].key;
  };

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildPageGallery() {
  const gallery = document.getElementById('pageGallery');
  if (!gallery) return;
  for (let i = 1; i <= 20; i++) {
    const n = String(i).padStart(2, '0');
    const a = document.createElement('a');
    a.href = `assets/pages/page-${n}.png`;
    a.className = 'page-link';
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <img src="assets/thumbs/page-${n}.png" alt="Thumbnail for page ${i}" />
      <span>Open original page ${i}</span>
    `;
    gallery.appendChild(a);
  }
}

buildPageGallery();
window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);
renderRoute();
