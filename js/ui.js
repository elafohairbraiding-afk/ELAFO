/**
 * ELAFO HAIR BRAIDING - UI Controllers
 * File: js/ui.js
 * Universal vanilla script (works with defer and file://)
 */

(function (root) {
  'use strict';

  function initUI() {
    initHeroMedia();
    initCarousel();
    initPricingTabs();
    initPricingCalculator();
    initVideoGallery();
    initStudioLiveBadge();
    initMapFacade();
    initPoliciesAccordion();
    initTestimonialsCarousel();
    initCustomCursor();
  }

  /**
   * 1. Signature Styles Carousel
   */
  function initCarousel() {
    const track = document.getElementById('signature-carousel-track');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    if (!track) return;
    const scrollAmount = 340;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  /**
   * 2. Pricing Category Tabs & Filter
   */
  function initPricingTabs() {
    const tabButtons = document.querySelectorAll('.filter-tab-btn');
    const pricingCards = document.querySelectorAll('.pricing-item-row');

    if (!tabButtons.length || !pricingCards.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const cat = btn.getAttribute('data-category');
        pricingCards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * 3. Live Pricing Calculator (Base + Length + Add-ons)
   */
  /**
   * 3. Bespoke Atelier Customizer & Live Price Estimator
   */
  function initPricingCalculator() {
    const baseSelect = document.getElementById('customizer-base-select');
    const lengthRadios = document.querySelectorAll('input[name="pricing-length-choice"]');
    const lengthCards = document.querySelectorAll('.length-choice-card');
    const addonCheckboxes = document.querySelectorAll('.pricing-addon-choice');
    const addonCards = document.querySelectorAll('.addon-choice-card');
    const priceDisplay = document.getElementById('calc-summary-total');
    const topPriceDisplay = document.getElementById('customizer-live-top-price');
    const step2Pill = document.getElementById('step2-running-pill');
    const step3Pill = document.getElementById('step3-running-pill');
    
    const pillStyle = document.getElementById('summary-pill-style');
    const pillLength = document.getElementById('summary-pill-length');
    const pillAddons = document.getElementById('summary-pill-addons');

    if (!priceDisplay) return;

    function recalculate() {
      // 1. Base style
      let basePrice = 240;
      let baseName = 'Medium Knotless Box Braids';
      if (baseSelect) {
        const opt = baseSelect.options[baseSelect.selectedIndex];
        if (opt) {
          basePrice = parseInt(opt.getAttribute('data-price') || '240', 10);
          baseName = opt.getAttribute('data-name') || opt.textContent.split('—')[0].trim();
        }
      }
      if (pillStyle) {
        pillStyle.textContent = `${baseName} ($${basePrice})`;
      }

      // 2. Length
      let lengthSurcharge = 0;
      let lengthName = 'Mid-Back 26"';
      lengthRadios.forEach((r, idx) => {
        const card = lengthCards[idx] || r.closest('.length-choice-card');
        if (r.checked) {
          lengthSurcharge = parseInt(r.getAttribute('data-surcharge') || '0', 10);
          const inch = r.parentElement ? r.parentElement.querySelector('.length-card-inch')?.textContent : '';
          const nameOnly = r.getAttribute('data-name') || 'Standard';
          lengthName = `${nameOnly} ${inch ? '(' + inch + ')' : ''}`;
          if (card) card.classList.add('is-selected');
        } else {
          if (card) card.classList.remove('is-selected');
        }
      });
      if (pillLength) {
        const sign = lengthSurcharge > 0 ? `(+$${lengthSurcharge})` : '(+$0)';
        pillLength.textContent = `${lengthName} ${sign}`;
      }

      // 3. Add-ons
      let addonsTotal = 0;
      const selectedAddonNames = [];
      addonCheckboxes.forEach((cb, idx) => {
        const card = addonCards[idx] || cb.closest('.addon-choice-card');
        if (cb.checked) {
          const price = parseInt(cb.getAttribute('data-price') || '0', 10);
          addonsTotal += price;
          const name = cb.getAttribute('data-name') || 'Addon';
          selectedAddonNames.push(name.split('&')[0].trim());
          if (card) card.classList.add('is-selected');
        } else {
          if (card) card.classList.remove('is-selected');
        }
      });
      if (pillAddons) {
        if (selectedAddonNames.length > 0) {
          pillAddons.textContent = `${selectedAddonNames.join(', ')} (+$${addonsTotal})`;
          pillAddons.classList.remove('is-empty');
        } else {
          pillAddons.textContent = 'No Add-ons';
          pillAddons.classList.add('is-empty');
        }
      }

      // 4. Grand Total & Real-time Live Price Synchronization
      const total = basePrice + lengthSurcharge + addonsTotal;
      priceDisplay.textContent = `$${total}`;
      if (topPriceDisplay) {
        topPriceDisplay.textContent = `$${total}`;
      }
      if (step2Pill) {
        step2Pill.textContent = `Selected: ${lengthName} • Total: $${total}`;
      }
      if (step3Pill) {
        step3Pill.textContent = `Add-ons: +$${addonsTotal} • Total: $${total}`;
      }
    }

    if (baseSelect) {
      baseSelect.addEventListener('change', recalculate);
    }
    lengthRadios.forEach(r => r.addEventListener('change', recalculate));
    addonCheckboxes.forEach(cb => cb.addEventListener('change', recalculate));

    // Connect Book buttons on pricing rows to sync with the customizer dropdown
    document.querySelectorAll('.pricing-item-row .btn[data-open-wizard]').forEach(btn => {
      btn.addEventListener('click', () => {
        const styleName = btn.getAttribute('data-style-name');
        if (styleName && baseSelect) {
          for (let i = 0; i < baseSelect.options.length; i++) {
            if (baseSelect.options[i].getAttribute('data-name') === styleName ||
                baseSelect.options[i].textContent.includes(styleName)) {
              baseSelect.selectedIndex = i;
              recalculate();
              break;
            }
          }
        }
      });
    });

    // Connect Top Live Book Button to trigger main customizer booking bridge
    const topBookBtn = document.getElementById('btn-book-from-top-customizer');
    const mainBookBtn = document.getElementById('btn-book-from-customizer');
    if (topBookBtn && mainBookBtn) {
      topBookBtn.addEventListener('click', () => {
        mainBookBtn.click();
      });
    }

    recalculate();
  }

  /**
   * 3B. Hero Live Motion Video & Poster Controller
   */
  function initHeroMedia() {
    const focalVideo = document.getElementById('hero-focal-video') || document.getElementById('hero-video-player');
    const bgVideo = document.querySelector('.hero-bg-video-element');
    const toggleBtn = document.getElementById('hero-motion-toggle-btn');
    if (!focalVideo && !bgVideo) return;

    let isManuallyPaused = false;

    // Respect user reduced-motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (focalVideo) focalVideo.pause();
      if (bgVideo) bgVideo.pause();
      isManuallyPaused = true;
      if (toggleBtn) updateToggleUI(false);
    }

    function updateToggleUI(isPlaying) {
      if (!toggleBtn) return;
      const icon = toggleBtn.querySelector('.motion-icon');
      const text = toggleBtn.querySelector('.motion-text');
      if (isPlaying) {
        if (icon) icon.textContent = '❚❚';
        if (text) text.textContent = 'Pause Motion';
        toggleBtn.setAttribute('aria-label', 'Pause live motion');
      } else {
        if (icon) icon.textContent = '▶';
        if (text) text.textContent = 'Play Live Motion';
        toggleBtn.setAttribute('aria-label', 'Play live motion');
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isPaused = (focalVideo && focalVideo.paused) || (bgVideo && bgVideo.paused);
        if (isPaused) {
          if (focalVideo) focalVideo.play().catch(() => {});
          if (bgVideo) bgVideo.play().catch(() => {});
          isManuallyPaused = false;
          updateToggleUI(true);
        } else {
          if (focalVideo) focalVideo.pause();
          if (bgVideo) bgVideo.pause();
          isManuallyPaused = true;
          updateToggleUI(false);
        }
      });
    }

    // Pause on tab visibility change to preserve CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (focalVideo && !focalVideo.paused) focalVideo.pause();
        if (bgVideo && !bgVideo.paused) bgVideo.pause();
      } else if (!isManuallyPaused) {
        if (focalVideo) focalVideo.play().catch(() => {});
        if (bgVideo) bgVideo.play().catch(() => {});
      }
    });
  }

  /**
   * 4. Video Gallery & Trending Reels Cinema Lightbox Player
   */
  function initVideoGallery() {
    const filterTabs = document.querySelectorAll('.video-filter-btn');
    const videoCards = document.querySelectorAll('.video-reel-card');
    const dialog = document.getElementById('video-lightbox-dialog');
    const player = document.getElementById('video-lightbox-player');
    const webmSource = document.getElementById('video-src-webm');
    const mp4Source = document.getElementById('video-src-mp4');
    const titleEl = document.getElementById('video-lightbox-title');
    const metaEl = document.getElementById('video-lightbox-meta');
    const counterEl = document.getElementById('video-lightbox-counter');
    const muteBtn = document.getElementById('video-lightbox-mute-btn');
    const iconUnmuted = document.getElementById('v-icon-unmuted');
    const iconMuted = document.getElementById('v-icon-muted');
    const bookBtn = document.getElementById('video-lightbox-book-btn');
    const spinner = document.getElementById('video-loading-indicator');
    const errorBox = document.getElementById('video-error-fallback');
    const retryBtn = document.getElementById('video-retry-btn');
    const prevBtn = document.getElementById('video-lightbox-prev-btn');
    const nextBtn = document.getElementById('video-lightbox-next-btn');
    const closeBtn = document.getElementById('video-lightbox-close-btn');
    const theaterStage = document.getElementById('video-theater-stage');

    // Video Category Filtering
    if (filterTabs.length && videoCards.length) {
      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');

          const category = tab.getAttribute('data-video-category');
          videoCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    if (!dialog || !player) return;

    // Build data list from cards or ELAFO_VIDEOS
    const videos = (window.ELAFO_VIDEOS && window.ELAFO_VIDEOS.length) 
      ? window.ELAFO_VIDEOS 
      : Array.from(videoCards).map((card, idx) => ({
          id: `reel-${String(idx + 1).padStart(2, '0')}`,
          title: card.getAttribute('data-title') || card.querySelector('.reel-title')?.textContent || `Reel ${idx + 1}`,
          category: card.getAttribute('data-category') || 'braids',
          duration: card.getAttribute('data-duration') || '0:30',
          videoUrl: card.getAttribute('data-video-mp4') || card.getAttribute('data-video-src') || '',
          webmUrl: card.getAttribute('data-video-webm') || '',
          posterUrl: card.querySelector('img')?.src || '',
          posterJpg: card.getAttribute('data-poster') || '',
          styleName: card.getAttribute('data-style-name') || ''
        }));

    let currentReelIndex = 0;
    let lastActiveTrigger = null;

    function updateMuteIcon(isMuted) {
      if (iconMuted && iconUnmuted) {
        if (isMuted) {
          iconMuted.style.display = 'block';
          iconUnmuted.style.display = 'none';
        } else {
          iconMuted.style.display = 'none';
          iconUnmuted.style.display = 'block';
        }
      }
    }

    function openReel(index, triggerEl) {
      if (triggerEl) lastActiveTrigger = triggerEl;
      currentReelIndex = (index + videos.length) % videos.length;
      const reel = videos[currentReelIndex];
      if (!reel) return;

      if (titleEl) titleEl.textContent = reel.title;
      if (metaEl) metaEl.textContent = `${reel.styleName || reel.title} • ${reel.duration}`;
      if (counterEl) counterEl.textContent = `Reel ${currentReelIndex + 1} of ${videos.length}`;
      if (bookBtn) {
        bookBtn.setAttribute('data-style-name', reel.styleName || reel.title);
      }

      if (errorBox) errorBox.style.display = 'none';
      if (spinner) spinner.style.display = 'flex';

      const poster = reel.posterJpg || reel.posterUrl;
      if (poster) player.poster = poster;

      const webmPath = reel.webmUrl || reel.videoUrl.replace(/\.mp4$/i, '.webm');
      const mp4Path = reel.videoUrl || reel.mp4;

      if (webmSource) webmSource.src = webmPath;
      if (mp4Source) mp4Source.src = mp4Path;
      player.src = mp4Path;

      player.load();
      updateMuteIcon(player.muted);

      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
        document.body.style.overflow = 'hidden';
      }

      // Safe Playback with User Gesture Handling
      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (spinner) spinner.style.display = 'none';
        }).catch(() => {
          // If browser policy blocks unmuted autoplay, fall back to muted
          player.muted = true;
          updateMuteIcon(true);
          player.play().then(() => {
            if (spinner) spinner.style.display = 'none';
          }).catch(() => {
            if (spinner) spinner.style.display = 'none';
          });
        });
      }
    }

    function closeReel() {
      player.pause();
      player.removeAttribute('src');
      if (webmSource) webmSource.removeAttribute('src');
      if (mp4Source) mp4Source.removeAttribute('src');
      player.load();

      if (dialog.open) {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      }
      document.body.style.overflow = '';
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    }

    function nextReel() {
      openReel(currentReelIndex + 1);
    }

    function prevReel() {
      openReel(currentReelIndex - 1);
    }

    // Bind Cards Click & Keyboard
    videoCards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        // If clicking on "Book" button inside the card, open the Booking Wizard instead
        if (e.target.closest('[data-open-wizard]')) return;
        e.preventDefault();
        openReel(idx, card);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('[data-open-wizard]')) return;
          e.preventDefault();
          openReel(idx, card);
        }
      });
    });

    // Modal Controls
    if (closeBtn) closeBtn.addEventListener('click', closeReel);
    if (prevBtn) prevBtn.addEventListener('click', prevReel);
    if (nextBtn) nextBtn.addEventListener('click', nextReel);

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        player.muted = !player.muted;
        updateMuteIcon(player.muted);
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        openReel(currentReelIndex);
      });
    }

    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        const styleName = bookBtn.getAttribute('data-style-name') || '';
        closeReel();
        const wizardDialog = document.getElementById('wizard-dialog');
        if (wizardDialog) {
          if (typeof wizardDialog.showModal === 'function') {
            wizardDialog.showModal();
          } else {
            wizardDialog.setAttribute('open', '');
          }
          // Preselect style in wizard
          const styleInput = document.querySelector(`input[name="wizard-style"][data-style-name="${styleName}"]`) ||
                             document.querySelector('input[name="wizard-style"]:first-of-type');
          if (styleInput) {
            styleInput.checked = true;
            styleInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });
    }

    // Video Lifecycle Events
    player.addEventListener('waiting', () => {
      if (spinner) spinner.style.display = 'flex';
    });
    player.addEventListener('canplay', () => {
      if (spinner) spinner.style.display = 'none';
    });
    player.addEventListener('playing', () => {
      if (spinner) spinner.style.display = 'none';
    });
    player.addEventListener('error', () => {
      if (spinner) spinner.style.display = 'none';
      if (errorBox) errorBox.style.display = 'flex';
    });

    // Backdrop Click to Close
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || (e.target && e.target.id === 'video-lightbox-backdrop')) {
        closeReel();
      }
    });

    // Keyboard Shortcuts (Esc, Arrows, Space, M)
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeReel();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextReel();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevReel();
      } else if (e.key === 'm' || e.key === 'M') {
        player.muted = !player.muted;
        updateMuteIcon(player.muted);
      }
    });

    // Touch Swipe Navigation for Mobile
    if (theaterStage) {
      let touchStartX = 0;
      let touchStartY = 0;

      theaterStage.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].clientX;
          touchStartY = e.changedTouches[0].clientY;
        }
      }, { passive: true });

      theaterStage.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          const deltaY = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX < 0) {
              nextReel();
            } else {
              prevReel();
            }
          }
        }
      }, { passive: true });
    }
  }



  /**
   * 6. Live Studio Open/Closed Badge (America/New_York)
   */
  function initStudioLiveBadge() {
    const badge = document.getElementById('studio-live-badge');
    if (!badge) return;

    const config = window.ELAFO_CONFIG || {};
    const hours = config.hours || [];
    const utils = window.ELAFO_UTILS || {};

    if (utils.getStudioStatus) {
      const status = utils.getStudioStatus(hours, "America/New_York");
      badge.innerHTML = `<span class="status-pulse-dot"></span><span class="status-text">${status.text}</span>`;
      badge.className = `studio-live-indicator ${status.isOpen ? 'is-open' : 'is-closed'}`;
    }
  }

  /**
   * 7. Interactive Map Facade (Loads iframe only upon explicit click)
   */
  function initMapFacade() {
    const container = document.getElementById('map-facade-container');
    const loadBtn = document.getElementById('load-map-btn');

    if (!container || !loadBtn) return;

    loadBtn.addEventListener('click', () => {
      const query = encodeURIComponent("7404 Executive Place, Lanham, MD 20706");
      const iframe = document.createElement('iframe');
      iframe.src = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      iframe.title = "Google Map showing Elafo Hair Braiding Studio location in Lanham, MD";
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "0";
      iframe.allowFullscreen = false;
      iframe.loading = "lazy";

      container.innerHTML = '';
      container.appendChild(iframe);
    });
  }

  
  /**
   * 8. Deposit & Studio Policies Luxury Accordion
   */
  function initPoliciesAccordion() {
    const items = document.querySelectorAll('.policy-card-item');
    if (!items.length) return;

    items.forEach(item => {
      const trigger = item.querySelector('.policy-card-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('is-open');

        // Close other items for single-open accordion behavior
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('is-open');
            const otherTrigger = other.querySelector('.policy-card-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * 9. Testimonials Carousel Controller
   */
  function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonial-prev-btn');
    const nextBtn = document.getElementById('testimonial-next-btn');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    // Generate indicator dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testimonial-dot-btn' + (idx === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (idx + 1));
        dot.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth + 22;
          track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateActiveDot() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.testimonial-dot-btn');
      const cardWidth = cards[0].offsetWidth + 22;
      const activeIdx = Math.round(track.scrollLeft / cardWidth);
      dots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    }

    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveDot);
    }, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 22;
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 22;
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }

    // Gentle Autoplay with hover pause
    let autoPlayTimer = null;
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        const cardWidth = cards[0].offsetWidth + 22;
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 15) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, 5500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }

  /**
   * 10. Footer Interactive Luxury Cursor
   * Active ONLY on actionable elements within .site-footer (links, buttons, social icons).
   * Completely hidden outside the footer and over empty non-interactive space.
   */
  function initCustomCursor() {
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const footer = document.querySelector('.site-footer') || document.getElementById('site-footer');
    if (!dot || !ring || !footer) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isInsideFooterInteractive = false;

    const interactiveFooterSelector = 'a, button, [role="button"], .footer-social-btn, .footer-policy-link, .footer-back-to-top-link, .footer-contact-link, .btn';

    function showCursor() {
      if (!isInsideFooterInteractive) {
        isInsideFooterInteractive = true;
        dot.classList.add('is-active');
        ring.classList.add('is-active');
      }
    }

    function hideCursor() {
      if (isInsideFooterInteractive) {
        isInsideFooterInteractive = false;
        dot.classList.remove('is-active', 'is-clicking');
        ring.classList.remove('is-active', 'is-clicking');
      }
    }

    // Track mouse coordinates ONLY when moving over footer
    footer.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Only show when hovering over an actionable/interactive element in the footer
      const target = e.target;
      if (target && target.closest(interactiveFooterSelector)) {
        showCursor();
      } else {
        hideCursor();
      }
    }, { passive: true });

    // When pointer leaves the footer entirely, immediately deactivate
    footer.addEventListener('mouseleave', () => {
      hideCursor();
      mouseX = -100;
      mouseY = -100;
    });

    // Guard against whole-window departure
    document.addEventListener('mouseleave', () => {
      hideCursor();
    });

    // Click effect when active
    document.addEventListener('mousedown', () => {
      if (isInsideFooterInteractive) {
        ring.classList.add('is-clicking');
      }
    });

    document.addEventListener('mouseup', () => {
      ring.classList.remove('is-clicking');
    });

    // 60fps Smooth animation loop
    function renderCursor() {
      if (isInsideFooterInteractive) {
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;

        dot.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0) translate(-50%, -50%)';
        ring.style.transform = 'translate3d(' + ringX + 'px, ' + ringY + 'px, 0) translate(-50%, -50%)';
      } else {
        ringX = mouseX;
        ringY = mouseY;
      }

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  root.ELAFO_UI = { initUI };
})(typeof window !== 'undefined' ? window : this);
