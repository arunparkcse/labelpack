/* ================================================
   Label Pack Industries — Shared JavaScript
   Particles, Animations, Navigation
   ================================================ */

/* ---- Particle Canvas ---- */
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.count = 80;
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  init() {
    this.resize();
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const size = Math.random() * 2.5 + 1;
    const colors = ['rgba(13,53,135,', 'rgba(26,77,184,', 'rgba(200,160,70,', 'rgba(204,28,28,', 'rgba(0,0,0,'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size,
      color,
      opacity: Math.random() * 0.25 + 0.08,
      baseX: Math.random() * this.canvas.width,
      baseY: Math.random() * this.canvas.height,
    };
  }

  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `${p.color}${p.opacity})`;
    this.ctx.fill();
  }

  connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(13,53,135,${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  updateParticle(p) {
    // Mouse repulsion
    if (this.mouse.x !== null) {
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }
    }

    // Damping
    p.vx *= 0.98;
    p.vy *= 0.98;

    // Base drift
    p.vx += (Math.random() - 0.5) * 0.02;
    p.vy += (Math.random() - 0.5) * 0.02;

    // Speed limit
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }

    p.x += p.vx;
    p.y += p.vy;

    // Wrap edges
    if (p.x < -10) p.x = this.canvas.width + 10;
    if (p.x > this.canvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = this.canvas.height + 10;
    if (p.y > this.canvas.height + 10) p.y = -10;
  }

  animate() {
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      this.updateParticle(p);
      this.drawParticle(p);
    });
    this.connectParticles();
    requestAnimationFrame(() => this.animate());
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.particles.forEach(p => {
        if (p.x > this.canvas.width) p.x = Math.random() * this.canvas.width;
        if (p.y > this.canvas.height) p.y = Math.random() * this.canvas.height;
      });
    });

    this.canvas.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null; this.mouse.y = null;
    });
  }
}

/* ---- 3D Tilt Effect ---- */
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = -(y - cy) / cy * 8;
      const rotY = (x - cx) / cx * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---- Counter Animation ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
}

/* ---- Sticky Nav ---- */
function initNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mark active nav link
  const current = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === current || (current !== '/' && current.includes(href) && href !== '/')) {
      link.classList.add('active');
    }
  });
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  const openMenu = () => {
    toggle.classList.add('open');
    menu.classList.add('open');
    // iOS body scroll lock: use class instead of overflow style
    document.body.classList.add('menu-open');
  };
  const closeMenu = () => {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    toggle.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on outside tap/click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) closeMenu();
  });

  // Close on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---- Touch Dropdown (iOS has no hover) ---- */
function initTouchDropdown() {
  // Only wire up touch-based dropdown on non-hover devices
  if (window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    if (!dropdown || !link) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = item.classList.contains('touch-open');
      // Close all
      document.querySelectorAll('.nav-item.touch-open').forEach(i => i.classList.remove('touch-open'));
      if (!isOpen) item.classList.add('touch-open');
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.touch-open').forEach(i => i.classList.remove('touch-open'));
    }
  });
}

/* ---- Gallery Lightbox ---- */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = `
        <div class="lightbox-inner">
          <button class="lightbox-close">✕</button>
          <img src="${img.src}" alt="${img.alt}" class="lightbox-img" />
        </div>`;
      overlay.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);
        display:flex;align-items:center;justify-content:center;padding:24px;cursor:pointer;
        animation:fadeIn 0.3s ease;`;
      const inner = overlay.querySelector('.lightbox-inner');
      inner.style.cssText = `position:relative;max-width:90vw;max-height:90vh;`;
      const closeBtn = overlay.querySelector('.lightbox-close');
      closeBtn.style.cssText = `position:absolute;top:-40px;right:0;background:none;border:none;
        color:#fff;font-size:1.5rem;cursor:pointer;opacity:0.8;z-index:1;`;
      const lightImg = overlay.querySelector('.lightbox-img');
      lightImg.style.cssText = `max-width:100%;max-height:90vh;bord