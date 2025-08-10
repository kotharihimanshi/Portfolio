// Loading overlay fade out on page fully loaded
window.addEventListener('load', () => {
  const loader = document.getElementById('loadingOverlay');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);
  }
});

// Theme toggle and icon update
const themeToggle = document.getElementById('themeToggle');
function updateThemeIcon(theme) {
  if (theme === 'light') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    themeToggle.title = 'Switch to dark mode';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
    themeToggle.title = 'Switch to light mode';
  }
}
function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  } else {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  }
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}
const savedTheme = localStorage.getItem('theme');
if (savedTheme) setTheme(savedTheme);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
else setTheme('light');

themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

// Init AOS with smooth easing and offset
AOS.init({ duration: 900, once: true, easing: 'ease-in-out-cubic', offset: 120 });

// Header scroll effect for glow and background
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 90) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// Parallax tilt effect on project cards
document.querySelectorAll('.project-card[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `rotateY(${x / 29}deg) rotateX(${-y / 28}deg) scale(1.05)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Animate counters for stats
function animateCountPlus(el, targetStr, duration = 1400) {
  const target = parseInt(targetStr);
  if (isNaN(target)) {
    el.textContent = targetStr;
    return;
  }
  let start = 0,
    range = target,
    increment = target > start ? 1 : -1;
  let stepTime = Math.abs(Math.floor(duration / range)),
    current = start;
  function timer() {
    current += increment;
    el.textContent = current + "+";
    if (current !== target) {
      setTimeout(timer, stepTime);
    }
  }
  timer();
}

let statsAnimated = false;
const counterSection = document.getElementById('stats');
if (counterSection) {
  new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting && !statsAnimated) {
      document.querySelectorAll('.counter').forEach(counter =>
        animateCountPlus(counter, counter.getAttribute('data-target'))
      );
      statsAnimated = true;
      obs.disconnect();
    }
  }, { threshold: 0.2 }).observe(counterSection);
}

// AJAX contact form submission
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const errorMsg = document.getElementById('formError');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          successMsg.style.display = 'block';
          form.reset();
        } else {
          errorMsg.style.display = 'block';
        }
      })
      .catch(() => errorMsg.style.display = 'block');
  });
}

// Download vCard
const vcardBtn = document.getElementById('vcardBtn');
if (vcardBtn) {
  const vcardData = `BEGIN:VCARD
VERSION:3.0
N:Kothari;Himanshi;;;
FN:Himanshi Kothari
ORG:Software Engineer
EMAIL;TYPE=work:himanshikothari9@gmail.com
TEL;TYPE=cell:+91 9016971989
ADR;TYPE=work:;;Bengaluru;Karnataka;India;;
URL;TYPE=LinkedIn:https://linkedin.com/in/himanshi-kothari-19528b25b
URL;TYPE=GitHub:https://github.com/kotharihimanshi
END:VCARD`;
  vcardBtn.onclick = () => {
    const blob = new Blob([vcardData], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Himanshi_Kothari.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}

// Certifications carousel controls
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? 'block' : 'none';
  });
}

prevBtn?.addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
});

nextBtn?.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
});

if (slides.length) showSlide(0);

// Soft animated background bubbles
const c = document.getElementById('bgParticles'), ctx = c.getContext('2d');

function resizeParticles() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}
window.addEventListener('resize', resizeParticles);
resizeParticles();

const bubbles = [...Array(13)].map(() => ({
  x: Math.random() * c.width,
  y: Math.random() * c.height,
  r: 11 + Math.random() * 16,
  dx: 0.09 + 0.5 * Math.random(),
  dy: 0.15 + 0.57 * Math.random(),
  op: 0.09 + 0.10 * Math.random()
}));

function animateBubbles() {
  ctx.clearRect(0, 0, c.width, c.height);
  for (const b of bubbles) {
    b.y += b.dy;
    b.x += b.dx;
    if (b.y > c.height) b.y = -22;
    if (b.x > c.width) b.x = -22;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(168,137,252,${b.op})`;
    ctx.shadowColor = "#a889fc";
    ctx.shadowBlur = 7;
    ctx.fill();
  }
  requestAnimationFrame(animateBubbles);
}
animateBubbles();

// Scroll progress bar update
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('scrollProgressBar');
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  if (progressBar && docHeight > 0) {
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
  }
});

// Smooth nav scrolling and active highlight
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const section = document.querySelector(href);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const navLinks = document.querySelectorAll('.nav-link');
function highlightActiveNav() {
  let currentSection = "";
  ['about', 'projects', 'experience', 'skills', 'certifications', 'contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY + 120 >= el.offsetTop) currentSection = id;
  });
  navLinks.forEach(link => {
    if (link.getAttribute('href') === '#' + currentSection) link.classList.add('active');
    else link.classList.remove('active');
  });
}
window.addEventListener('scroll', highlightActiveNav);
highlightActiveNav();
