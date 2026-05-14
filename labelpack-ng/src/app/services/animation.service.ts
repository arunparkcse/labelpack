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
      if (count >= 100) {
        clearInterval(timer);
        setTimeout(() => el.classList.add('done'), 200);
      }
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
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();
    const hoverSel = 'a, button, .btn, .card, .industry-card, .product-card, .masonry-item, .nav-link, input, textarea, select';
    document.querySelectorAll(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
  }

  /* ---- Sticky Nav ---- */
  initNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---- Mobile Menu ---- */
  initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle') as HTMLElement;
    const menu = document.querySelector('.nav-menu') as HTMLElement;
    if (!toggle || !menu) return;
    const open = () => { toggle.classList.add('open'); menu.classList.add('open'); document.body.classList.add('menu-open'); };
    const close = () => { toggle.classList.remove('open'); menu.classList.remove('open'); document.body.classList.remove('menu-open'); };
    toggle.addEventListener('click', (e) => { e.stopPropagation(); toggle.classList.contains('open') ? close() : open(); });
    document.addEventListener('click', (e) => { if (!toggle.contains(e.target as Node) && !menu.contains(e.target as Node)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
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
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach(el => el.classList.add('visible'));
    }, 80);
  }

  /* ---- Counter Animation ---- */
  initCounters() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
  }

  private animateCounter(el: HTMLElement) {
    const target = parseInt(el.dataset['target'] || '0', 10);
    const suffix = el.dataset['suffix'] || '';
    const duration = 2000;
    const start = performance.now();
    const update = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ---- Tilt Cards ---- */
  initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const c = card as HTMLElement;
      c.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = c.getBoundingClientRect();
        const rotX = -((e.clientY - rect.top) - rect.height / 2) / (rect.height / 2) * 8;
        const rotY = ((e.clientX - rect.left) - rect.width / 2) / (rect.width / 2) * 8;
        c.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(10px)';
      });
      c.addEventListener('mouseleave', () => { c.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'; c.style.transition = 'transform 0.5s ease'; });
      c.addEventListener('mouseenter', () => { c.style.transition = 'transform 0.1s ease'; });
    });
  }

  /* ---- Gallery Lightbox ---- */
  initGallery() {
    document.querySelectorAll('.masonry-item, .gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img') as HTMLImageElement;
        if (img) this.openLightbox(img.src, img.alt);
      });
    });
  }

  private openLightbox(src: string, alt: string) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:24px;cursor:pointer;';
    const inner = document.createElement('div');
    inner.style.cssText = 'position:relative;max-width:90vw;max-height:90vh;';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:absolute;top:-40px;right:0;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;';
    const img = document.createElement('img');
    img.src = src; img.alt = alt;
    img.style.cssText = 'max-width:100%;max-height:90vh;border-radius:12px;object-fit:contain;display:block;';
    inner.appendChild(closeBtn); inner.appendChild(img); overlay.appendChild(inner);
    document.body.appendChild(overlay); document.body.style.overflow = 'hidden';
    const close = () => { overlay.remove(); document.body.style.overflow = ''; };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } });
  }

  /* ---- Contact Form ---- */
  initContactForm() {
    const form = document.getElementById('contactForm') as HTMLFormElement;
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]') as HTMLButtonElement;
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!';
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; btn.style.background = ''; form.reset(); }, 3000);
    });
  }
}
