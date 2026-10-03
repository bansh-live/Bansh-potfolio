/**
 * ==============================================================================
 * PORTFOLIO MASTER JAVASCRIPT
 * Vanilla JavaScript implementation for interactive portfolio features.
 * Easily customizable for beginners.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  if (document.querySelector('.hero-home')) {
    const pageLoader = document.createElement('div');
    const loaderStartedAt = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minimumLoaderDuration = reducedMotion ? 250 : 1700;

    pageLoader.className = 'page-loader';
    pageLoader.setAttribute('aria-hidden', 'true');
    pageLoader.innerHTML = '<span class="page-loader__brand">BANSH<span>.</span></span><span class="page-loader__caption">Web design &amp; development</span><span class="page-loader__track"><span></span></span>';
    document.body.appendChild(pageLoader);

    const dismissPageLoader = function () {
      const remainingDuration = Math.max(0, minimumLoaderDuration - (performance.now() - loaderStartedAt));

      window.setTimeout(function () {
        pageLoader.classList.add('is-hidden');
        window.setTimeout(function () {
          pageLoader.remove();
        }, 650);
      }, remainingDuration);
    };

    if (document.readyState === 'complete') {
      dismissPageLoader();
    } else {
      window.addEventListener('load', dismissPageLoader, { once: true });
    }
  }

  document.querySelectorAll('main > section').forEach(function (section) {
    section.classList.add('reveal-on-scroll');

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.querySelectorAll('.service-box, .project-card, .feature-pillar, .process-step-card, .stat-item').forEach(function (item, index) {
        item.classList.add('reveal-stagger-item');
        item.style.setProperty('--reveal-delay', Math.min(index, 5) * 90 + 'ms');
      });
    }
  });

  // ----------------------------------------------------------------------------
  // 1. NAVBAR SCROLL EFFECT & STICKY HEADER
  // ----------------------------------------------------------------------------
  const navbar = document.querySelector('.site-navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  function handleScroll() {
    const scrollPos = window.scrollY || window.pageYOffset;

    // Add border and background when scrolled down
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Toggle Back To Top Button
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // Back To Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 2. MOBILE MENU AUTO-CLOSE ON LINK CLICK
  // ----------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ----------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  // ----------------------------------------------------------------------------
  // 4. ANIMATED NUMBER COUNTERS (Home Page)
  // ----------------------------------------------------------------------------
  const counterElements = document.querySelectorAll('.stat-counter');

  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    let countersStarted = false;

    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counterElements.forEach(function (counter) {
              const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
              const duration = 1800; // ms
              const frameRate = 1000 / 60;
              const totalFrames = Math.round(duration / frameRate);
              let frame = 0;

              const counterInterval = setInterval(function () {
                frame++;
                const progress = frame / totalFrames;
                // ease-out cubic
                const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));
                counter.innerText = currentCount;

                if (frame >= totalFrames) {
                  counter.innerText = target;
                  clearInterval(counterInterval);
                }
              }, frameRate);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    const statsSection = document.querySelector('.stats-strip');
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  }

  // ----------------------------------------------------------------------------
  // 5. ANIMATE SKILL BARS (About Page)
  // ----------------------------------------------------------------------------
  const skillBars = document.querySelectorAll('.skill-fill');

  if (skillBars.length > 0 && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            skillBars.forEach(function (bar) {
              const percentage = bar.getAttribute('data-width') || '0%';
              bar.style.width = percentage;
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    const skillsSection = document.querySelector('#skills-section');
    if (skillsSection) {
      skillObserver.observe(skillsSection);
    }
  } else if (skillBars.length > 0) {
    skillBars.forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-width') || '0%';
    });
  }

  // ----------------------------------------------------------------------------
  // 6. PORTFOLIO FILTERING (Vanilla JS)
  // ----------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Toggle active button
        filterButtons.forEach(function (b) {
          b.classList.remove('active');
        });
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        portfolioItems.forEach(function (item) {
          const itemCategory = item.getAttribute('data-category');

          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(function () {
              item.style.display = 'block';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 150);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(function () {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 7. PROJECT DETAILS MODAL DYNAMIC DATA POPULATION
  // ----------------------------------------------------------------------------
  const projectModal = document.getElementById('projectDetailsModal');

  if (projectModal) {
    projectModal.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      if (!button) return;

      const title = button.getAttribute('data-title') || 'Project Details';
      const category = button.getAttribute('data-category') || 'Web & Graphic Design';
      const imageSrc = button.getAttribute('data-image') || 'assets/images/project-01.jpg';
      const overview = button.getAttribute('data-overview') || 'A custom crafted project highlighting clean code, user experience and modern aesthetic.';
      const role = button.getAttribute('data-role') || 'Lead Web Developer & UI Designer';
      const tech = button.getAttribute('data-tech') || 'HTML5, CSS3, JavaScript, Bootstrap 5';
      const features = button.getAttribute('data-features') || 'Responsive Layout, Custom UI Components, Fast Performance';
      const liveUrl = button.getAttribute('data-live') || '#';

      // Populate elements inside modal
      const modalTitle = projectModal.querySelector('#modalProjectTitle');
      const modalCategory = projectModal.querySelector('#modalProjectCategory');
      const modalImage = projectModal.querySelector('#modalProjectImage');
      const modalOverview = projectModal.querySelector('#modalProjectOverview');
      const modalRole = projectModal.querySelector('#modalProjectRole');
      const modalTech = projectModal.querySelector('#modalProjectTech');
      const modalFeatures = projectModal.querySelector('#modalProjectFeatures');
      const modalLiveBtn = projectModal.querySelector('#modalProjectLiveBtn');

      if (modalTitle) modalTitle.innerText = title;
      if (modalCategory) modalCategory.innerText = category;
      if (modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = title;
      }
      if (modalOverview) modalOverview.innerText = overview;
      if (modalRole) modalRole.innerText = role;
      if (modalTech) modalTech.innerText = tech;
      if (modalFeatures) modalFeatures.innerText = features;
      if (modalLiveBtn) modalLiveBtn.href = liveUrl;
    });
  }

  // ----------------------------------------------------------------------------
  // 8. CONTACT FORM CLIENT-SIDE VALIDATION & SUBMISSION SIMULATION
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      // Full Name Validation
      const nameInput = document.getElementById('fullName');
      const nameFeedback = document.getElementById('nameFeedback');
      if (nameInput) {
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          nameFeedback.classList.add('error');
          nameInput.classList.add('is-invalid');
          isValid = false;
        } else {
          nameFeedback.classList.remove('error');
          nameInput.classList.remove('is-invalid');
        }
      }

      // Email Validation
      const emailInput = document.getElementById('emailAddress');
      const emailFeedback = document.getElementById('emailFeedback');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput) {
        if (!emailPattern.test(emailInput.value.trim())) {
          emailFeedback.classList.add('error');
          emailInput.classList.add('is-invalid');
          isValid = false;
        } else {
          emailFeedback.classList.remove('error');
          emailInput.classList.remove('is-invalid');
        }
      }

      // Service Select Validation
      const serviceSelect = document.getElementById('serviceSelect');
      const serviceFeedback = document.getElementById('serviceFeedback');
      if (serviceSelect) {
        if (!serviceSelect.value) {
          serviceFeedback.classList.add('error');
          serviceSelect.classList.add('is-invalid');
          isValid = false;
        } else {
          serviceFeedback.classList.remove('error');
          serviceSelect.classList.remove('is-invalid');
        }
      }

      // Message / Description Validation
      const messageInput = document.getElementById('projectDescription');
      const messageFeedback = document.getElementById('messageFeedback');
      if (messageInput) {
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
          messageFeedback.classList.add('error');
          messageInput.classList.add('is-invalid');
          isValid = false;
        } else {
          messageFeedback.classList.remove('error');
          messageInput.classList.remove('is-invalid');
        }
      }

      // If valid, show success message & reset
      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin-icon"></i> Sending Inquiry...';
        }

        setTimeout(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Project Inquiry <i class="bi bi-arrow-right"></i>';
          }
          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'block';
            formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          contactForm.reset();
        }, 1200);
      }
    });

    // Clear validation feedback on input
    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('is-invalid');
        const feedback = this.parentElement.querySelector('.form-feedback');
        if (feedback) feedback.classList.remove('error');
      });
    });

    // Auto-select service from URL parameter (e.g. ?service=wordpress-dev)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && serviceSelect) {
      const matchingOption = serviceSelect.querySelector('option[value="' + serviceParam + '"]');
      if (matchingOption) {
        serviceSelect.value = serviceParam;
      }
    }
  }
});
