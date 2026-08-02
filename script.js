/* =========================================
   PORTFOLIO JAVASCRIPT
   T.S. Shri Varsha | CS Student Portfolio
   ========================================= */

// --- Loading Screen ---
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});

// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function getTheme() { return localStorage.getItem('portfolio-theme') || 'light'; }
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

setTheme(getTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}

// --- Navbar Scroll Effect ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  updateBackToTop();
});

// --- Active Nav Link ---
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
  });
}
setActiveNav();

// --- Mobile Menu ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// --- Typing Animation ---
const typingEl = document.querySelector('.typing-text');
const phrases = [
  'Full Stack Developer',
  'CS Undergrad @ TechVista',
  'Open Source Enthusiast',
  'Problem Solver',
  'UI/UX Explorer'
];

let phraseIndex = 0, charIndex = 0, isDeleting = false;

function type() {
  if (!typingEl) return;
  const current = phrases[phraseIndex];
  const display = isDeleting ? current.substring(0, charIndex - 1) : current.substring(0, charIndex + 1);
  typingEl.textContent = display;
  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; type(); }, 1600);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
  setTimeout(type, isDeleting ? 55 : );
}
type();

// --- Scroll Reveal ---
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// --- Skill Bar Animations ---
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const pct = fill.getAttribute('data-pct');
        setTimeout(() => { fill.style.width = pct + '%'; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(fill => observer.observe(fill));
}
animateSkillBars();

// --- Back to Top ---
const backToTop = document.getElementById('back-to-top');

function updateBackToTop() {
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// --- Contact Form Validation ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  function validateField(input) {
    const errEl = input.parentElement.querySelector('.error-msg');
    let valid = true;

    if (input.type === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = re.test(input.value.trim());
      if (errEl) errEl.textContent = 'Please enter a valid email address.';
    } else if (input.name === 'phone') {
      const re = /^[\d\s\+\-\(\)]{7,15}$/;
      valid = re.test(input.value.trim()) || input.value.trim() === '';
      if (errEl) errEl.textContent = 'Please enter a valid 83004025.';
    } else {
      valid = input.value.trim().length >= (input.tagName === 'TEXTAREA' ? 10 : 2);
      if (errEl) errEl.textContent = input.tagName === 'TEXTAREA'
        ? 'Message must be at least 10 characters.'
        : 'This field is required.';
    }

    input.classList.toggle('error', !valid);
    if (errEl) errEl.classList.toggle('visible', !valid);
    return valid;
  }

  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let allValid = true;
    inputs.forEach(input => { if (!validateField(input)) allValid = false; });

    if (allValid) {
      const toast = document.getElementById('success-toast');
      if (toast) toast.classList.add('visible');
      contactForm.reset();
      setTimeout(() => { if (toast) toast.classList.remove('visible'); }, 5000);
    }
  });
}

// --- Project Filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const show = cat === 'all' || card.getAttribute('data-category') === cat;
        card.style.display = show ? 'flex' : 'none';
        card.style.flexDirection = show ? 'column' : undefined;
      });
    });
  });
}

// --- Animated Counter ---
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const steps = 50;
        const increment = target / steps;
        let current = 0;
        const isFloat = String(target).includes('.');

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isFloat ? current.toFixed(1) + suffix : Math.round(current) + suffix;
        }, duration / steps);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
animateCounters();
