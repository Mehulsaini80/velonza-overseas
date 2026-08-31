/* =============================================
   VELONZA OVERSEAS – script.js  (Advanced)
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     HERO SLIDER – AUTO + MANUAL + DOTS + PROGRESS
     ============================================ */
  var slides       = document.querySelectorAll('.hero-slide');
  var dots         = document.querySelectorAll('.dot');
  var progressBar  = document.getElementById('heroProgressBar');
  var heroPrev     = document.getElementById('heroPrev');
  var heroNext     = document.getElementById('heroNext');

  // Per-slide text content
  var slideData = [
    { tag:'PREMIUM INTERIOR SOLUTIONS', title:'Curated Corners',       sub:'Where every detail tells a story of elegance' },
    { tag:'GLOBAL DESIGN EXCELLENCE',   title:'Timeless Spaces',       sub:'Crafted with passion across continents'        },
    { tag:'LUXURY LIVING REDEFINED',    title:'Elegant Interiors',     sub:'Experience the finest materials worldwide'     },
    { tag:'ARCHITECTURAL MASTERY',      title:'Bold Visions',          sub:'Transforming spaces into masterpieces'         },
    { tag:'CURATED FOR YOU',            title:'Refined Comfort',       sub:'Your dream space, beautifully realised'        }
  ];

  var heroTag   = document.getElementById('heroTag');
  var heroTitle = document.getElementById('heroTitle');
  var heroSub   = document.getElementById('heroSub');
  var btnLook   = document.querySelector('.btn-look');

  var current     = 0;
  var total       = slides.length;
  var interval    = null;
  var SLIDE_DELAY = 5000; // ms

  function showSlide(index) {
    // Remove active from all
    slides.forEach(function(s) { s.classList.remove('active'); });
    dots.forEach(function(d)   { d.classList.remove('active'); });

    current = (index + total) % total;

    slides[current].classList.add('active');
    dots[current].classList.add('active');

    // Animate text out then in
    [heroTag, heroTitle, heroSub, btnLook].forEach(function(el) {
      if (el) { el.classList.remove('show'); }
    });

    setTimeout(function() {
      if (heroTag)   heroTag.textContent   = slideData[current].tag;
      if (heroTitle) heroTitle.textContent = slideData[current].title;
      if (heroSub)   heroSub.textContent   = slideData[current].sub;
      [heroTag, heroTitle, heroSub, btnLook].forEach(function(el) {
        if (el) el.classList.add('show');
      });
    }, 200);

    // Progress bar restart
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width      = '0%';
      setTimeout(function() {
        progressBar.style.transition = 'width ' + SLIDE_DELAY + 'ms linear';
        progressBar.style.width      = '100%';
      }, 50);
    }
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  function startAuto() {
    clearInterval(interval);
    interval = setInterval(nextSlide, SLIDE_DELAY);
  }

  // Dot click
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      showSlide(parseInt(dot.getAttribute('data-index'), 10));
      startAuto();
    });
  });

  // Arrow click
  if (heroPrev) heroPrev.addEventListener('click', function() { prevSlide(); startAuto(); });
  if (heroNext) heroNext.addEventListener('click', function() { nextSlide(); startAuto(); });

  // Touch / swipe support
  var touchStartX = 0;
  var heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive:true });
    heroEl.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); startAuto(); }
    });
  }

  // Init
  showSlide(0);
  startAuto();

  /* ============================================
     NAVBAR – ACTIVE LINK + SHADOW ON SCROLL
     ============================================ */
  var navbar   = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    var scrollY = window.pageYOffset;
    navbar.style.boxShadow = scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.12)'
      : '0 1px 8px rgba(0,0,0,0.08)';

    sections.forEach(function(section) {
      var top    = section.offsetTop - 80;
      var height = section.offsetHeight;
      var id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ============================================
     HAMBURGER MENU
     ============================================ */
  var hamburger = document.getElementById('hamburger');
  var navMenu   = document.getElementById('navLinks');

  hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('open');
    var spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      navMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(function(s) {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });

  /* ============================================
     PROJECTS SLIDER – PREV / NEXT
     ============================================ */
  var projSlider  = document.getElementById('projectsSlider');
  var prevBtn     = document.getElementById('prevBtn');
  var nextBtn     = document.getElementById('nextBtn');
  var projSlides  = projSlider ? projSlider.querySelectorAll('.project-slide') : [];
  var totalProj   = projSlides.length;
  var projIndex   = 0;

  function visibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
  }

  function updateProjSlider() {
    if (!projSlider) return;
    var slideW = projSlider.parentElement.offsetWidth / visibleCount();
    projSlider.style.transform = 'translateX(-' + (projIndex * slideW) + 'px)';
  }

  if (nextBtn) nextBtn.addEventListener('click', function() {
    var max = totalProj - visibleCount();
    projIndex = projIndex < max ? projIndex + 1 : 0;
    updateProjSlider();
  });
  if (prevBtn) prevBtn.addEventListener('click', function() {
    var max = totalProj - visibleCount();
    projIndex = projIndex > 0 ? projIndex - 1 : max;
    updateProjSlider();
  });
  window.addEventListener('resize', function() { projIndex = 0; updateProjSlider(); });

  /* ============================================
     SERVICE CARD – CLICK ACTIVE
     ============================================ */
  var serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(function(card) {
    card.addEventListener('click', function() {
      serviceCards.forEach(function(c) { c.classList.remove('active-card'); });
      card.classList.add('active-card');
    });
  });

  /* ============================================
     CONTACT FORM
     ============================================ */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.btn-submit');
      btn.textContent      = 'MESSAGE SENT ✓';
      btn.style.background = '#4caf50';
      setTimeout(function() {
        btn.textContent      = 'SEND MESSAGE →';
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ============================================
     SCROLL REVEAL – IntersectionObserver
     ============================================ */
  var animEls = document.querySelectorAll('.anim-up, .anim-left, .anim-right');
  var headings = document.querySelectorAll('.reveal-heading');

  var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animEls.forEach(function(el) { revealObs.observe(el); });
  headings.forEach(function(el) { revealObs.observe(el); });

  /* ============================================
     COUNTER ANIMATION (About stats)
     ============================================ */
  var counters = document.querySelectorAll('.stat-num');
  var counted  = false;

  function animateCounters() {
    counters.forEach(function(counter) {
      var target   = parseInt(counter.getAttribute('data-target'), 10);
      var duration = 1800;
      var step     = target / (duration / 16);
      var current  = 0;
      var timer    = setInterval(function() {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        counter.textContent = Math.floor(current);
      }, 16);
    });
  }

  var statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    var counterObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          animateCounters();
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObs.observe(statsSection);
  }

  /* ============================================
     PARALLAX on section watermarks
     ============================================ */
  var watermarks = document.querySelectorAll('.section-watermark');
  window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset;
    watermarks.forEach(function(wm) {
      var rect = wm.parentElement.getBoundingClientRect();
      var offset = rect.top * 0.25;
      wm.style.transform = 'translateY(' + offset + 'px)';
    });
  });

  /* ============================================
     CURSOR GLOW EFFECT
     ============================================ */
  var glow = document.createElement('div');
  glow.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'width:300px', 'height:300px',
    'border-radius:50%', 'pointer-events:none', 'z-index:9999',
    'background:radial-gradient(circle,rgba(184,147,90,0.08) 0%,transparent 70%)',
    'transform:translate(-50%,-50%)', 'transition:transform 0.08s linear',
    'mix-blend-mode:multiply'
  ].join(';');
  document.body.appendChild(glow);

  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

});
