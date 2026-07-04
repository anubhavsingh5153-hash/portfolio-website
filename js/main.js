/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO MAIN JAVASCRIPT
   Handles: Particles, Typewriter, Scroll Animations, Projects API, Contact Form
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

// ─── Config ─────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

// Category emoji mapping for project placeholders
const CATEGORY_EMOJI = {
  web:    '🌐',
  mobile: '📱',
  ai:     '🤖',
  cli:    '⚡',
  default: '💻'
};

// ─── DOM Ready ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initMobileMenu();
  initTypewriter();
  initScrollAnimations();
  initCounters();
  initSkillBars();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  setFooterYear();

  // Load projects from API
  window.portfolio = { loadProjects };
  loadProjects('all');
});

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLE SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrameId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.size  = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color  = Math.random() > 0.5 ? '124, 58, 237' : '6, 182, 212';
      this.pulse  = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      const o = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${o})`;
      ctx.fill();
    }
  }

  function initParticlesList() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(animate);
  }

  resize();
  initParticlesList();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticlesList();
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR — Scroll Effect & Active Link
   ═══════════════════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled style
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active nav link highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggle(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggle(!mobileMenu.classList.contains('open')));
  mobileLinks.forEach(link => link.addEventListener('click', () => toggle(false)));
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'stunning web apps.',
    'responsive websites.',
    'clean & robust APIs.',
    'solutions that matter.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        isDeleting = true;
        delay = 2200; // pause at end
      } else {
        delay = 80 + Math.random() * 60;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 400;
      } else {
        delay = 40;
      }
    }
    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED REVEAL ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED COUNTERS
   ═══════════════════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL BAR ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = bar.dataset.width + '%';
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS — API Loading & Filter
   ═══════════════════════════════════════════════════════════════════════════ */
let allProjects = [];
let currentFilter = 'all';

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.dataset.filter;
      renderProjects(allProjects, currentFilter);
    });
  });
}

async function loadProjects(filter = 'all') {
  const grid    = document.getElementById('projects-grid');
  const loading = document.getElementById('projects-loading');
  const errBox  = document.getElementById('projects-error');

  if (!grid) return;

  // Show loading
  grid.innerHTML = '';
  errBox.classList.add('hidden');
  loading.style.display = 'flex';
  grid.appendChild(loading);

  try {
    const res  = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    allProjects = json.data || [];
    loading.style.display = 'none';
    renderProjects(allProjects, currentFilter);
  } catch (err) {
    console.warn('API unavailable, using fallback data:', err.message);
    allProjects = getFallbackProjects();
    loading.style.display = 'none';
    renderProjects(allProjects, currentFilter);
  }
}

function renderProjects(projects, filter) {
  const grid   = document.getElementById('projects-grid');
  const errBox = document.getElementById('projects-error');
  if (!grid) return;

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  // Clear existing cards (but keep the loading/error elements)
  Array.from(grid.children).forEach(child => {
    if (!child.id?.includes('loading') && !child.id?.includes('error')) child.remove();
  });

  if (filtered.length === 0) {
    errBox.classList.remove('hidden');
    document.getElementById('projects-error-msg').textContent = `No ${filter} projects found.`;
    return;
  }

  errBox.classList.add('hidden');

  filtered.forEach((project, i) => {
    const card = createProjectCard(project, i);
    grid.appendChild(card);
    // Stagger fade-in
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  });
}

function createProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = `project-card${project.featured ? ' featured' : ''}`;
  card.id = `project-card-${project.id || index}`;
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

  const emoji = CATEGORY_EMOJI[project.category] || CATEGORY_EMOJI.default;
  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];

  const techTags = techStack.slice(0, 4).map(tech =>
    `<span class="tech-tag">${escapeHtml(tech)}</span>`
  ).join('');

  const codeBtn = project.github_url
    ? `<a href="${escapeHtml(project.github_url)}" class="overlay-btn overlay-btn-code" target="_blank" rel="noopener" id="project-github-${project.id || index}">
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
         Code
       </a>`
    : '';

  const liveBtn = project.live_url
    ? `<a href="${escapeHtml(project.live_url)}" class="overlay-btn overlay-btn-live" target="_blank" rel="noopener" id="project-live-${project.id || index}">
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
         Live
       </a>`
    : '';

  card.innerHTML = `
    <div class="project-image">
      <div class="project-image-placeholder">${emoji}</div>
      <div class="project-overlay">
        ${codeBtn}
        ${liveBtn}
      </div>
    </div>
    <div class="project-body">
      <p class="project-category">${escapeHtml(project.category || 'project')}</p>
      <h3 class="project-title">${escapeHtml(project.title)}</h3>
      <p class="project-desc">${escapeHtml(project.description)}</p>
      <div class="project-tech">${techTags}</div>
    </div>
  `;

  return card;
}

// Fallback data when API is unavailable (e.g., viewing frontend directly)
function getFallbackProjects() {
  return [
    {
      id: 1,
      title: 'BloodCare Management System',
      description: 'A comprehensive web application for managing blood donations, tracking blood inventory in real-time, and coordinating between blood banks, donors, and hospitals.',
      tech_stack: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
      github_url: 'https://github.com/anubhavsingh5153',
      live_url: null,
      category: 'web',
      featured: true
    },
    {
      id: 2,
      title: 'AURA E-commerce Website',
      description: 'A modern, fully responsive e-commerce web platform featuring product catalog display, user cart management, secure checkout flow, and custom animations.',
      tech_stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express', 'MongoDB'],
      github_url: 'https://github.com/anubhavsingh5153',
      live_url: null,
      category: 'web',
      featured: true
    },
    {
      id: 3,
      title: 'Personal Portfolio Website',
      description: 'A premium, interactive developer portfolio website featuring dark glassmorphism design, custom particle animations, a real-time contact form API, and dynamic database loading.',
      tech_stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express', 'JSON DB'],
      github_url: 'https://github.com/anubhavsingh5153',
      live_url: 'http://localhost:5000',
      category: 'web',
      featured: true
    }
  ];
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearFormErrors();

    const nameEl    = document.getElementById('contact-name');
    const emailEl   = document.getElementById('contact-email-input');
    const subjectEl = document.getElementById('contact-subject');
    const msgEl     = document.getElementById('contact-message');

    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const subject = subjectEl.value.trim();
    const message = msgEl.value.trim();

    // Client-side validation
    let valid = true;
    if (name.length < 2) {
      showFieldError('name-error', nameEl, 'Name must be at least 2 characters.');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('email-error', emailEl, 'Please enter a valid email address.');
      valid = false;
    }
    if (message.length < 10) {
      showFieldError('message-error', msgEl, 'Message must be at least 10 characters.');
      valid = false;
    }
    if (!valid) return;

    // Submit
    setSubmitting(true);
    document.getElementById('form-success').classList.add('hidden');
    document.getElementById('form-fail').classList.add('hidden');

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        document.getElementById('form-success').classList.remove('hidden');
        form.reset();
      } else {
        const msg = data.errors?.join(' ') || data.error || 'Something went wrong.';
        document.getElementById('form-fail-msg').textContent = msg;
        document.getElementById('form-fail').classList.remove('hidden');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      document.getElementById('form-fail-msg').textContent =
        'Could not connect to server. Please email me directly.';
      document.getElementById('form-fail').classList.remove('hidden');
    } finally {
      setSubmitting(false);
    }
  });

  // Live validation feedback
  ['contact-name', 'contact-email-input', 'contact-message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', clearFormErrors);
  });
}

function showFieldError(errorId, inputEl, message) {
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = message;
  if (inputEl) inputEl.classList.add('error');
}

function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
}

function setSubmitting(loading) {
  const btn    = document.getElementById('contact-submit-btn');
  const text   = document.getElementById('submit-btn-text');
  const loader = document.getElementById('submit-btn-loading');
  if (!btn) return;
  btn.disabled = loading;
  text.classList.toggle('hidden', loading);
  loader.classList.toggle('hidden', !loading);
}

/* ═══════════════════════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
   ═══════════════════════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
