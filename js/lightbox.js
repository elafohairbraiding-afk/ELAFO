/**
 * ELAFO HAIR BRAIDING - Accessible Lightbox Modal
 * File: js/lightbox.js
 * Universal vanilla script (works with defer and file://)
 */

(function (root) {
  'use strict';

  function initLightbox() {
    const dialog = document.getElementById('lightbox-dialog');
    const imgEl = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    const counterEl = document.getElementById('lightbox-counter');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const chooseStyleBtn = document.getElementById('lightbox-choose-style-btn');

    if (!dialog || !imgEl) return;

    let galleryItems = [];
    let currentIndex = 0;
    let lastActiveElement = null;

    // Collect all gallery and showcase triggers
    const cards = document.querySelectorAll('.gallery-card, .braider-photo-card');
    galleryItems = Array.from(cards).map(card => ({
      src: card.getAttribute('data-full-src') || card.querySelector('img')?.src || '',
      title: card.getAttribute('data-title') || card.querySelector('h3, .gallery-card-title')?.textContent || 'Artisan Crown',
      category: card.getAttribute('data-category') || '',
      styleName: card.getAttribute('data-style-name') || card.querySelector('h3, .gallery-card-title')?.textContent || 'Custom Style'
    }));

    cards.forEach((card, idx) => {
      const trigger = () => openLightbox(idx, card);
      card.addEventListener('click', trigger);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger();
        }
      });
    });

    function openLightbox(index, triggerElement) {
      lastActiveElement = triggerElement;
      currentIndex = index;
      updateModalContent();
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    }

    function closeLightbox() {
      dialog.close();
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }

    function updateModalContent() {
      const item = galleryItems[currentIndex];
      if (!item) return;

      imgEl.src = item.src;
      imgEl.alt = `${item.title} - Artisan hair braiding at Elafo Hair Lanham MD`;
      if (captionEl) captionEl.textContent = item.title;
      if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

      if (chooseStyleBtn) {
        chooseStyleBtn.setAttribute('data-style-name', item.styleName);
      }

      // Preload next image
      const nextIdx = (currentIndex + 1) % galleryItems.length;
      if (galleryItems[nextIdx] && galleryItems[nextIdx].src) {
        const preloader = new Image();
        preloader.src = galleryItems[nextIdx].src;
      }
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateModalContent();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateModalContent();
    }

    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeLightbox();
    });

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    });

    // Touch swipe
    let touchStartX = 0;
    dialog.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    dialog.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      if (diffX < -50) showNext();
      if (diffX > 50) showPrev();
    }, { passive: true });

    // "Book This Style" button inside lightbox
    if (chooseStyleBtn) {
      chooseStyleBtn.addEventListener('click', () => {
        const chosenStyle = chooseStyleBtn.getAttribute('data-style-name');
        closeLightbox();
        const wizardDialog = document.getElementById('wizard-dialog');
        if (wizardDialog) {
          const matchingRadio = wizardDialog.querySelector(`input[data-name="${chosenStyle}"]`);
          if (matchingRadio) matchingRadio.checked = true;
          wizardDialog.showModal();
        }
      });
    }
  }

  root.ELAFO_LIGHTBOX = { initLightbox };
})(typeof window !== 'undefined' ? window : this);
