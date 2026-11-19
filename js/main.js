/**
 * ELAFO HAIR BRAIDING - Main Application Bootstrap
 * File: js/main.js
 * Universal vanilla script (works with defer and file://)
 */

(function () {
  'use strict';

  function initApp() {
    // 1. Initialize UI (Carousel, Pricing, Video Gallery, Slider, Status)
    if (window.ELAFO_UI && typeof window.ELAFO_UI.initUI === 'function') {
      window.ELAFO_UI.initUI();
    }

    // 2. Initialize Lightbox
    if (window.ELAFO_LIGHTBOX && typeof window.ELAFO_LIGHTBOX.initLightbox === 'function') {
      window.ELAFO_LIGHTBOX.initLightbox();
    }

    // 3. Initialize Booking Wizard
    if (window.ELAFO_BOOKING && typeof window.ELAFO_BOOKING.initBookingWizard === 'function') {
      window.ELAFO_BOOKING.initBookingWizard();
    }


    // 5. Header Scroll Effects & Sticky Bottom Bar
    setupScrollBehaviors();

    // 6. Mobile Drawer Navigation
    setupMobileDrawer();

    // 7. Scroll Reveal Animations
    setupScrollReveals();

    // 8. Animated Floating Back to Top Button
    setupBackToTop();

    // 9. Service Worker Registration (Safe, only on http/https)
    registerServiceWorker();
  }

  function setupScrollBehaviors() {
    const header = document.querySelector('.site-header');
    const bottomBar = document.querySelector('.sticky-bottom-bar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleScroll() {
      const currentY = window.scrollY;

      // Header smooth sticky docking animation
      if (header) {
        if (currentY > 15) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      // Sticky bottom bar hide on scroll down, show on scroll up
      if (bottomBar) {
        if (currentY > 300 && currentY > lastScrollY + 10) {
          bottomBar.classList.add('is-hidden');
        } else if (currentY < lastScrollY - 10 || currentY <= 300) {
          bottomBar.classList.remove('is-hidden');
        }
      }

      lastScrollY = currentY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    handleScroll();
  }

  function setupMobileDrawer() {
    const burgerBtn = document.getElementById('burger-btn');
    const drawer = document.getElementById('mobile-drawer');

    if (!burgerBtn || !drawer) return;

    function toggleDrawer(open) {
      const isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
      if (isOpen) {
        drawer.classList.add('is-open');
        burgerBtn.classList.add('is-active');
        burgerBtn.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('is-open');
        burgerBtn.classList.remove('is-active');
        burgerBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    burgerBtn.addEventListener('click', () => toggleDrawer());

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });
  }

  function setupScrollReveals() {
    if (!('IntersectionObserver' in window)) return;

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  }

  function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const footerTopLink = document.getElementById('footer-top-link');

    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (footerTopLink) {
      footerTopLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }
  }

  // Trigger when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
