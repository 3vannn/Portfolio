/* ============================================================
   EVAN BENOIT — PORTFOLIO
   Scripts partagés
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav mobile (hamburger) ────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    // Fermer le menu au clic sur un lien
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  /* ── Lien actif dans la nav ────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });

  /* ── Carrousel ─────────────────────────────────────────── */
  document.querySelectorAll('.carousel').forEach(initCarousel);

  function initCarousel(carousel) {
    const track  = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    if (!track || slides.length === 0) return;

    let current = 0;

    // Créer les points
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Swipe tactile
    let touchStart = 0;
    carousel.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend',   e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    // Auto-play
    let autoplay = setInterval(() => goTo(current + 1), 4500);
    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current + 1), 4500); });
  }

  /* ── Accordéon compétences ─────────────────────────────── */
  document.querySelectorAll('.competence-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.competence-item');
      const body = item.querySelector('.competence-body');
      const isOpen = item.classList.contains('open');

      // Fermer tous les autres
      document.querySelectorAll('.competence-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.competence-body').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ── Animation au scroll ───────────────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

});
