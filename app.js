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
  { key: 'pages', label: 'Visual Appendix' }
];

const titleEl = document.getElementById('view-title');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const galleryImages = [];
let currentModalIndex = 0;

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

function openModal(index) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const item = galleryImages[index];
  if (!item) return;
  currentModalIndex = index;
  modalImage.style.backgroundImage = `url('${item.src}')`;
  modalCaption.textContent = item.caption;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function stepModal(direction) {
  const nextIndex = (currentModalIndex + direction + galleryImages.length) % galleryImages.length;
  openModal(nextIndex);
}

function buildPageGallery() {
  const gallery = document.getElementById('pageGallery');
  if (!gallery) return;
  for (let i = 1; i <= 20; i++) {
    const n = String(i).padStart(2, '0');
    const src = `assets/pages/page-${n}.png`;
    const caption = `Page ${i}`;
    galleryImages.push({ src, caption });

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-card';
    button.setAttribute('aria-label', `Open page ${i} preview`);
    button.innerHTML = `
      <span class="page-thumb" style="background-image: url('assets/thumbs/page-${n}.png')"></span>
      <span class="page-card-label">Page ${i}</span>
    `;
    button.addEventListener('click', () => openModal(i - 1));
    gallery.appendChild(button);
  }
}

function hardenMediaInteractions() {
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.setAttribute('loading', 'lazy');
  });

  document.addEventListener('contextmenu', (event) => {
    if (event.target.closest('img, .page-thumb, .modal-image, .hero-image-wrap, .figure-card')) {
      event.preventDefault();
    }
  });

  document.addEventListener('dragstart', (event) => {
    if (event.target.closest('img, .page-thumb, .modal-image')) {
      event.preventDefault();
    }
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const blockedCombo = (event.ctrlKey || event.metaKey) && ['s', 'u', 'p'].includes(key);
    const blockedDevtools = key === 'f12' || ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key));
    if (blockedCombo || blockedDevtools) {
      event.preventDefault();
    }

    const modalOpen = document.getElementById('imageModal').classList.contains('open');
    if (!modalOpen) return;
    if (key === 'escape') closeModal();
    if (key === 'arrowleft') stepModal(-1);
    if (key === 'arrowright') stepModal(1);
  });
}

function bindModalEvents() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalPrev').addEventListener('click', () => stepModal(-1));
  document.getElementById('modalNext').addEventListener('click', () => stepModal(1));
  document.getElementById('imageModal').addEventListener('click', (event) => {
    if (event.target.id === 'imageModal') closeModal();
  });
}

buildPageGallery();
bindModalEvents();
hardenMediaInteractions();
window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);
renderRoute();
