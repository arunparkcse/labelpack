import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnimationService {

  /* ---- Preloader ---- */
  initPreloader() {
    const el = document.getElementById('preloader');
    const num = document.getElementById('preloader-num');
    const bar = document.getElementById('preloader-bar');
    if (!el || !num) return;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      num.textContent = String(count);
      if (bar) bar.style.width = count + '%';
      if (count >= 100) { clearInterval(timer); setTimeout(() => el.classList.add('done'), 200); }
    }, 14);
  }

  /* ---- Custom Cursor ---- */
  initCursor() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    const animateRing = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
  }

  /* ---- Sticky Nav ---- */
  initNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // apply immediately
  }

  /* ---- Mobile Menu ---- */
  initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle') as HTMLElement;
    const menu = document.querySelector('.nav-menu') as HTMLElement;
    if (!toggle || !menu) return;
    // Clone to remove old listeners
    const newToggle = toggle.cloneNode(true) as HTMLElement;
    toggle.parentNode?.replaceChild(newToggle, toggle);

    const open = () => { newToggle.classList.add('open'); menu.classList.add('open'); document.body.classList.add('menu-open'); newToggle.setAttribute('aria-expanded','true'); };
    const close = () => { newToggle.classList.remove('open'); menu.classList.remove('open'); document.body.classList.remove('menu-open'); newToggle.setAttribute('aria-expanded','false'); };

    newToggle.addEventListener('click', (e) => { e.stopPropagation(); newToggle.classList.contains('open') ? close() : open(); });
    document.addEventListener('click', (e) => { if (!newToggle.contains(e.target as Node) && !menu.contains(e.target as Node)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // Close menu when a nav link is clicked on mobile
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
  }

  /* ---- Touch Dropdown ---- */
  initTouchDropdown() {
    if (window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown');
      if (!dropdown || !link) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('touch-open');
        document.querySelectorAll('.nav-item.touch-open').forEach(i => i.classList.remove('touch-open'));
        if (!isOpen) item.classList.add('touch-open');
      });
    });
  }

  /* ---- Scroll Reveal ---- */
  initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach(el => el.classList.add('visible'));
    }, 100);
  }

  /* ---- Counter Animation ---- */
  initCounters() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { this.animateCounter(entry.target as HTMLElement); observer.unobserve(entry.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
  }
  private animateCounter(el: HTMLElement) {
    const target = parseInt(el.dataset['target'] || '0', 10);
    const suffix = el.dataset['suffix'] || '';
    const start = performance.now();
    const update = (time: number) => {
      const p = Math.min((time - start) / 2000, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ---- Tilt Cards ---- */
  initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const c = card as HTMLElement;
      c.addEventListener('mousemove', (e: MouseEvent) => {
        const r = c.getBoundingClientRect();
        const rx = -((e.clientY - r.top) - r.height / 2) / (r.height / 2) * 8;
        const ry = ((e.clientX - r.left) - r.width / 2) / (r.width / 2) * 8;
        c.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
      });
      c.addEventListener('mouseleave', () => { c.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'; c.style.transition = 'transform 0.5s ease'; });
      c.addEventListener('mouseenter', () => { c.style.transition = 'transform 0.1s ease'; });
    });
  }

  /* ---- Gallery Filter + Lightbox with prev/next ---- */
  private galleryImages: { src: string; alt: string }[] = [];
  private currentLightboxIndex = 0;

  initGallery() {
    const items = Array.from(document.querySelectorAll('.masonry-item, .gallery-item')) as HTMLElement[];

    // Build image list for lightbox navigation
    this.galleryImages = items.map(item => {
      const img = item.querySelector('img') as HTMLImageElement;
      return { src: img?.src || '', alt: img?.alt || '' };
    });

    // Lightbox click
    items.forEach((item, idx) => {
      item.addEventListener('click', () => this.openLightbox(idx));
    });

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = (btn.textContent || '').trim().toLowerCase();
        items.forEach(item => {
          const itemCat = (item.dataset['category'] || '').toLowerCase();
          const show = cat === 'all' || itemCat.includes(cat);
          (item as HTMLElement).style.display = show ? '' : 'none';
          (item as HTMLElement).style.opacity = show ? '1' : '0';
        });
      });
    });
  }

  private openLightbox(index: number) {
    this.currentLightboxIndex = index;
    const existing = document.getElementById('lp-lightbox');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'lp-lightbox';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.94);display:flex;align-items:center;justify-content:center;padding:24px;';

    const inner = document.createElement('div');
    inner.style.cssText = 'position:relative;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;';

    // Close
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&#10005;';
    closeBtn.style.cssText = 'position:absolute;top:-44px;right:0;background:none;border:none;color:#fff;font-size:1.6rem;cursor:pointer;line-height:1;padding:8px;z-index:1;-webkit-tap-highlight-color:transparent;';

    // Image
    const img = document.createElement('img');
    const updateImage = () => {
      const d = this.galleryImages[this.currentLightboxIndex];
      img.src = d.src; img.alt = d.alt;
      counter.textContent = (this.currentLightboxIndex + 1) + ' / ' + this.galleryImages.length;
    };
    img.style.cssText = 'max-width:100%;max-height:80vh;border-radius:10px;object-fit:contain;display:block;user-select:none;';

    // Counter
    const counter = document.createElement('div');
    counter.style.cssText = 'color:rgba(255,255,255,0.6);font-size:0.8rem;margin-top:12px;font-family:Syne,sans-serif;letter-spacing:0.1em;';

    // Prev / Next
    const mkBtn = (label: string, side: 'left'|'right') => {
      const b = document.createElement('button');
      b.innerHTML = side === 'left' ? '&#8592;' : '&#8594;';
      b.style.cssText = `position:fixed;top:50%;${side}:20px;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);color:#fff;width:48px;height:48px;border-radius:50%;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;-webkit-tap-highlight-color:transparent;`;
      b.addEventListener('mouseenter', () => b.style.background = 'rgba(255,255,255,0.25)');
      b.addEventListener('mouseleave', () => b.style.background = 'rgba(255,255,255,0.12)');
      b.setAttribute('aria-label', label);
      return b;
    };
    const prevBtn = mkBtn('Previous', 'left');
    const nextBtn = mkBtn('Next', 'right');

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.galleryImages.length) % this.galleryImages.length; updateImage(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.galleryImages.length; updateImage(); });

    const close = () => { overlay.remove(); document.body.style.overflow = ''; };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });

    // Swipe support
    let touchStartX = 0;
    overlay.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? nextBtn.click() : prevBtn.click();
    });

    updateImage();
    inner.appendChild(closeBtn); inner.appendChild(img); inner.appendChild(counter);
    overlay.appendChild(prevBtn); overlay.appendChild(inner); overlay.appendChild(nextBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  /* ---- Hero Carousel ---- */
  initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!slides.length) return;
    let current = 0;
    let timer: any;
    const go = (n: number) => {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    };
    const autoPlay = () => { timer = setInterval(() => go(current + 1), 5000); };
    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(timer); go(i); autoPlay(); }));
    document.querySelector('.carousel-prev')?.addEventListener('click', () => { clearInterval(timer); go(current - 1); autoPlay(); });
    document.querySelector('.carousel-next')?.addEventListener('click', () => { clearInterval(timer); go(current + 1); autoPlay(); });
    autoPlay();
  }

  /* ---- Contact Form ---- */
  initContactForm() {
    const form = document.getElementById('contactForm') as HTMLFormElement;
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]') as HTMLButtonElement;
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!'; btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; form.reset(); }, 3000);
    });
  }
}
