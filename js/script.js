// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Highlight the nav link of the section in view
const navAnchors = [...navLinks.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navAnchors.forEach(a => {
  const section = document.querySelector(a.getAttribute('href'));
  if (section) sectionObserver.observe(section);
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Project record tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      const selected = t === tab;
      t.classList.toggle('active', selected);
      t.setAttribute('aria-selected', selected);
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
  });
});

// Service cards collapse into a tap-to-open list on phones
const phoneQuery = window.matchMedia('(max-width: 640px)');
document.querySelectorAll('.service-card').forEach(card => {
  const toggle = () => {
    if (!phoneQuery.matches) return;
    const open = card.classList.toggle('open');
    card.setAttribute('aria-expanded', open);
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});
const syncCards = () => document.querySelectorAll('.service-card').forEach(card => {
  if (phoneQuery.matches) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', card.classList.contains('open'));
  } else {
    card.removeAttribute('role');
    card.removeAttribute('tabindex');
    card.removeAttribute('aria-expanded');
  }
});
phoneQuery.addEventListener('change', syncCards);
syncCards();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form: validates, then opens the visitor's email app with the enquiry pre-filled
const CONTACT_EMAIL = 'gmengineering955@gmail.com';
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.value.trim() !== '' && field.checkValidity();
    field.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.style.color = '';
    status.textContent = 'Please fill in all required fields with valid details.';
    return;
  }
  const data = new FormData(form);
  const subject = `Project Enquiry: ${data.get('service')} - ${data.get('name')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Company: ${data.get('company') || '-'}`,
    `Phone: ${data.get('phone')}`,
    `Email: ${data.get('email')}`,
    `Service: ${data.get('service')}`,
    '',
    'Project Requirement:',
    data.get('requirement')
  ].join('\n');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.style.color = '#1f9e4e';
  status.textContent = 'Your email app has opened with your enquiry. Please press Send to submit it.';
});
