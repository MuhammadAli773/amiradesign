// ── Force scroll to top on page load / refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function resetScrollToTop() {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
}

// Reset immediately when script executes and on DOM load
resetScrollToTop();
document.addEventListener('DOMContentLoaded', resetScrollToTop);

// ── SPLASH SCREEN logic
window.addEventListener('load', () => {
  resetScrollToTop();
  const splash = document.getElementById('splash-screen');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('exit');
      setTimeout(() => {
        splash.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        resetScrollToTop();
      }, 800); // Timing for border flip
    }, 2800); // How long splash stays
  } else {
    document.body.classList.remove('no-scroll');
    resetScrollToTop();
  }
});

// ── NAV scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
});

// ── Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

function closeMobile() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
}

// ── Scroll Reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        e.target.classList.add('visible'); 
        observer.unobserve(e.target); 
      } 
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}

// ── Counter animation
function animateCount(el) {
  const target = +el.dataset.count;
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { 
      current = target; 
      clearInterval(timer); 
    }
    el.textContent = Math.floor(current) + (el.dataset.count === '98' ? '%' : '+');
  }, 20);
}

const stats = document.querySelectorAll('.stat-number[data-count]');
if (stats.length > 0) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        animateCount(e.target); 
        statObserver.unobserve(e.target); 
      } 
    });
  }, { threshold: 0.5 });
  stats.forEach(el => statObserver.observe(el));
}

// ── Testimonials slider
const track = document.getElementById('track');
if (track) {
  const cards = track.children;
  const dotsContainer = document.getElementById('dots');
  let current = 0;
  const visibleCount = () => window.innerWidth < 600 ? 1 : 3;

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = cards.length - visibleCount() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === current ? ' active' : '');
      d.onclick = () => goTo(i);
      dotsContainer.appendChild(d);
    }
  }

  function goTo(idx) {
    const total = cards.length - visibleCount() + 1;
    current = Math.max(0, Math.min(idx, total - 1));
    const cardWidth = cards[0].offsetWidth + 32; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  if (prevBtn) prevBtn.onclick = () => goTo(current - 1);
  if (nextBtn) nextBtn.onclick = () => goTo(current + 1);
  
  buildDots();
  window.addEventListener('resize', () => { 
    current = 0; 
    buildDots(); 
    goTo(0); 
  });
}

// ── Dynamic Sparkles
function createSparkles() {
  const containers = document.querySelectorAll('.sparkle-bg');
  containers.forEach(container => {
    // Clear existing if any
    container.innerHTML = '';
    const isSplash = container.closest('#splash-screen') !== null;
    const count = isSplash ? 12 : 15; // 12 on splash screen, 15 on back pages
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-dot';
      
      // Only customize sizing for the splash screen's 4-pointed stars
      if (isSplash) {
        const size = Math.floor(Math.random() * 10) + 8; // 8px to 17px
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
      }
      
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.left = Math.random() * 100 + '%';
      
      // Timing timing: shorter delay for splash screen so they show in 2.8s
      sparkle.style.animationDelay = isSplash 
        ? (Math.random() * 1.5) + 's' 
        : (Math.random() * 3) + 's';
        
      sparkle.style.animationDuration = isSplash
        ? (Math.random() * 1.5 + 1.5) + 's'
        : (Math.random() * 2 + 2) + 's';
      container.appendChild(sparkle);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createSparkles();

  // ── Collections Filter Tabs logic
  const filterButtons = document.querySelectorAll('.category-tag[data-filter]');
  const collectionCards = document.querySelectorAll('.collection-card[data-category]');

  if (filterButtons.length > 0 && collectionCards.length > 0) {
    function filterCategory(filter) {
      filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      collectionCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = btn.dataset.filter;
        filterCategory(filter);
      });
    });

    // Handle URL param filter, e.g. collections.html?cat=bridal
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      filterCategory(catParam);
    }
  }
});


