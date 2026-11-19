/**
 * ELAFO HAIR BRAIDING - Booking Request Wizard
 * File: js/booking.js
 * 4-Step Client-Side Flow, Live Price Calculator, Fluid Directional Transitions & Card Visuals
 * 100% offline & file:// compatible
 */

(function (root) {
  'use strict';

  function initBookingWizard() {
    const dialog = document.getElementById('wizard-dialog');
    const openButtons = document.querySelectorAll('[data-open-wizard]');
    const closeBtn = document.getElementById('wizard-close-btn');

    if (!dialog) return;

    const escapeHTML = (window.ELAFO_UTILS && window.ELAFO_UTILS.escapeHTML) || ((s) => s || '');
    const config = window.ELAFO_CONFIG || {};

    // Wizard State
    let currentStep = 1;
    const totalSteps = 4;
    let wizardData = {
      styleId: 'medium-knotless',
      styleName: 'Medium Knotless Box Braids',
      basePrice: 240,
      lengthId: 'midback',
      lengthName: 'Mid-Back (Standard)',
      lengthPrice: 0,
      addons: [],
      addonsTotal: 0,
      date: '',
      timeSlot: '8:30 AM',
      clientName: '',
      clientPhone: '',
      clientNotes: '',
      formStartTime: Date.now()
    };

    try {
      const saved = sessionStorage.getItem('elafo_wizard_state');
      if (saved) {
        wizardData = { ...wizardData, ...JSON.parse(saved) };
      }
    } catch (_) {}

    function saveState() {
      try {
        sessionStorage.setItem('elafo_wizard_state', JSON.stringify(wizardData));
      } catch (_) {}
    }

    // Synchronize Card `.is-checked` classes across all choice cards
    function syncCardCheckedStates() {
      dialog.querySelectorAll('.wizard-choice-card').forEach(card => {
        const input = card.querySelector('input');
        if (input && input.checked) {
          card.classList.add('is-checked');
        } else {
          card.classList.remove('is-checked');
        }
      });
    }

    // Open / Close handlers
    openButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const preselectedStyle = btn.getAttribute('data-style-name');
        if (preselectedStyle) {
          wizardData.styleName = preselectedStyle;
          // Synchronize radio button in Step 1
          const matchingRadio = dialog.querySelector(`input[name="wizard-style-choice"][data-name="${preselectedStyle}"]`);
          if (matchingRadio) {
            matchingRadio.checked = true;
            wizardData.styleId = matchingRadio.value;
            wizardData.basePrice = parseInt(matchingRadio.getAttribute('data-price') || '240', 10);
          }
        }
        wizardData.formStartTime = Date.now();
        syncCardCheckedStates();
        showStep(1);
        dialog.showModal();
        dialog.focus();
      });
    });

    // Customizer Atelier "Book This Exact Estimate" Bridge
    const bookFromCustomizerBtn = document.getElementById('btn-book-from-customizer');
    if (bookFromCustomizerBtn) {
      bookFromCustomizerBtn.addEventListener('click', () => {
        const baseSelect = document.getElementById('customizer-base-select');
        let selectedStyleName = 'Medium Knotless Box Braids';
        let selectedBasePrice = 240;
        let selectedStyleId = 'medium-knotless';

        if (baseSelect) {
          const opt = baseSelect.options[baseSelect.selectedIndex];
          if (opt) {
            selectedBasePrice = parseInt(opt.getAttribute('data-price') || '240', 10);
            selectedStyleName = opt.getAttribute('data-name') || 'Medium Knotless Box Braids';
            selectedStyleId = opt.value;
          }
        }

        const activeLength = document.querySelector('input[name="pricing-length-choice"]:checked');
        const lengthId = activeLength ? activeLength.value : 'midback';
        const lengthName = activeLength ? activeLength.getAttribute('data-name') : 'Mid-Back (Standard)';
        const lengthPrice = activeLength ? parseInt(activeLength.getAttribute('data-surcharge') || '0', 10) : 0;

        const activeAddons = [];
        let addonsSum = 0;
        document.querySelectorAll('.pricing-addon-choice:checked').forEach(cb => {
          const price = parseInt(cb.getAttribute('data-price') || '0', 10);
          activeAddons.push({
            id: cb.value,
            name: cb.getAttribute('data-name'),
            price: price
          });
          addonsSum += price;
        });

        wizardData.styleId = selectedStyleId;
        wizardData.styleName = selectedStyleName;
        wizardData.basePrice = selectedBasePrice;
        wizardData.lengthId = lengthId;
        wizardData.lengthName = lengthName;
        wizardData.lengthPrice = lengthPrice;
        wizardData.addons = activeAddons;
        wizardData.addonsTotal = addonsSum;
        wizardData.formStartTime = Date.now();

        // Synchronize radio and checkbox controls inside wizard dialog
        const wizardStyleRadio = dialog.querySelector(`input[name="wizard-style-choice"][value="${selectedStyleId}"]`) ||
                                 dialog.querySelector(`input[name="wizard-style-choice"][data-name="${selectedStyleName}"]`);
        if (wizardStyleRadio) {
          wizardStyleRadio.checked = true;
        }

        const wizardLengthRadio = dialog.querySelector(`input[name="wizard-length-choice"][value="${lengthId}"]`);
        if (wizardLengthRadio) {
          wizardLengthRadio.checked = true;
        }

        dialog.querySelectorAll('input[name="wizard-addon-choice"]').forEach(cb => {
          cb.checked = activeAddons.some(a => a.id === cb.value);
        });

        syncCardCheckedStates();
        updateLiveEstimate();
        // Jump directly to Step 3 (Date & Time) since Style & Length are already chosen!
        showStep(3, 'next');
        dialog.showModal();
        dialog.focus();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) dialog.close();
    });

    // Initialize Date constraints
    const dateInput = document.getElementById('wizard-date-select');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
      if (!dateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
      wizardData.date = dateInput.value;
      dateInput.addEventListener('change', () => {
        wizardData.date = dateInput.value;
        saveState();
      });
    }

    // Time Slot Pills Interactive Selection
    const timePills = dialog.querySelectorAll('.wizard-time-pill');
    const timeSelect = document.getElementById('wizard-time-select');
    timePills.forEach(pill => {
      pill.addEventListener('click', () => {
        timePills.forEach(p => p.classList.remove('is-selected'));
        pill.classList.add('is-selected');
        const chosenTime = pill.getAttribute('data-time') || '8:30 AM';
        wizardData.timeSlot = chosenTime;
        if (timeSelect) {
          timeSelect.value = chosenTime;
        }
        saveState();
      });
    });

    if (timeSelect) {
      timeSelect.addEventListener('change', () => {
        wizardData.timeSlot = timeSelect.value;
        timePills.forEach(pill => {
          if (pill.getAttribute('data-time') === timeSelect.value) {
            pill.classList.add('is-selected');
          } else {
            pill.classList.remove('is-selected');
          }
        });
        saveState();
      });
    }

    // Real-Time Input Change Listeners for Style, Length & Add-ons
    dialog.querySelectorAll('input[name="wizard-style-choice"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          wizardData.styleId = radio.value;
          wizardData.styleName = radio.getAttribute('data-name');
          wizardData.basePrice = parseInt(radio.getAttribute('data-price') || '240', 10);
          syncCardCheckedStates();
          updateLiveEstimate();
          saveState();
        }
      });
    });

    dialog.querySelectorAll('input[name="wizard-length-choice"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          wizardData.lengthId = radio.value;
          wizardData.lengthName = radio.getAttribute('data-name');
          wizardData.lengthPrice = parseInt(radio.getAttribute('data-price') || '0', 10);
          syncCardCheckedStates();
          updateLiveEstimate();
          saveState();
        }
      });
    });

    dialog.querySelectorAll('input[name="wizard-addon-choice"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const selectedAddons = [];
        let sum = 0;
        dialog.querySelectorAll('input[name="wizard-addon-choice"]:checked').forEach(c => {
          const price = parseInt(c.getAttribute('data-price') || '0', 10);
          selectedAddons.push({
            id: c.value,
            name: c.getAttribute('data-name'),
            price: price
          });
          sum += price;
        });
        wizardData.addons = selectedAddons;
        wizardData.addonsTotal = sum;
        syncCardCheckedStates();
        updateLiveEstimate();
        saveState();
      });
    });

    // Step Navigation (Next & Prev)
    dialog.querySelectorAll('[data-wizard-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          showStep(currentStep + 1, 'next');
        }
      });
    });

    dialog.querySelectorAll('[data-wizard-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        showStep(currentStep - 1, 'prev');
      });
    });

    /**
     * Show Step with Fluid Directional Transitions
     */
    function showStep(stepNumber, direction = 'next') {
      currentStep = Math.max(1, Math.min(totalSteps + 1, stepNumber));

      const panes = dialog.querySelectorAll('.wizard-step-pane');
      panes.forEach((pane, idx) => {
        const stepIdx = idx + 1;
        if (stepIdx === currentStep) {
          pane.style.display = 'block';
          pane.classList.remove('slide-in-right', 'slide-in-left');
          // Force layout reflow to trigger animation restart cleanly
          void pane.offsetWidth;
          if (direction === 'next') {
            pane.classList.add('slide-in-right');
          } else if (direction === 'prev') {
            pane.classList.add('slide-in-left');
          }
        } else {
          pane.style.display = 'none';
          pane.classList.remove('slide-in-right', 'slide-in-left');
        }
      });

      // Update Stepper Indicators & Labels
      const stepItems = dialog.querySelectorAll('.wizard-step-item');
      stepItems.forEach((item, idx) => {
        const step = idx + 1;
        if (step < currentStep) {
          item.classList.add('is-complete');
          item.classList.remove('is-active');
        } else if (step === currentStep) {
          item.classList.add('is-active');
          item.classList.remove('is-complete');
        } else {
          item.classList.remove('is-active', 'is-complete');
        }
      });

      // Update Progress Track Fill Percentage
      const progressFill = dialog.querySelector('.wizard-progress-fill');
      if (progressFill) {
        let percent = 0;
        if (currentStep === 1) percent = 0;
        else if (currentStep === 2) percent = 33.3;
        else if (currentStep === 3) percent = 66.6;
        else percent = 100;
        progressFill.style.width = `${percent}%`;
      }

      syncCardCheckedStates();
      updateLiveEstimate();
      saveState();

      // Scroll modal card to top if user scrolled down
      const container = dialog.querySelector('.wizard-container');
      if (container) {
        container.scrollTop = 0;
      }
    }

    function validateStep(step) {
      if (step === 1) {
        const selectedRadio = dialog.querySelector('input[name="wizard-style-choice"]:checked');
        if (selectedRadio) {
          wizardData.styleId = selectedRadio.value;
          wizardData.styleName = selectedRadio.getAttribute('data-name');
          wizardData.basePrice = parseInt(selectedRadio.getAttribute('data-price') || '240', 10);
        }
        return true;
      }

      if (step === 2) {
        const selectedLength = dialog.querySelector('input[name="wizard-length-choice"]:checked');
        if (selectedLength) {
          wizardData.lengthId = selectedLength.value;
          wizardData.lengthName = selectedLength.getAttribute('data-name');
          wizardData.lengthPrice = parseInt(selectedLength.getAttribute('data-price') || '0', 10);
        }

        const selectedAddons = [];
        let sum = 0;
        dialog.querySelectorAll('input[name="wizard-addon-choice"]:checked').forEach(cb => {
          const price = parseInt(cb.getAttribute('data-price') || '0', 10);
          selectedAddons.push({
            id: cb.value,
            name: cb.getAttribute('data-name'),
            price: price
          });
          sum += price;
        });
        wizardData.addons = selectedAddons;
        wizardData.addonsTotal = sum;
        return true;
      }

      if (step === 3) {
        const dateEl = document.getElementById('wizard-date-select');
        if (!dateEl || !dateEl.value) {
          alert('Please select your preferred appointment date.');
          if (dateEl) dateEl.focus();
          return false;
        }
        wizardData.date = dateEl.value;

        const timePillActive = dialog.querySelector('.wizard-time-pill.is-selected');
        if (timePillActive) {
          wizardData.timeSlot = timePillActive.getAttribute('data-time') || '8:30 AM';
        } else if (timeSelect) {
          wizardData.timeSlot = timeSelect.value || '8:30 AM';
        }
        return true;
      }

      return true;
    }

    function updateLiveEstimate() {
      const estimateAmountEl = document.getElementById('wizard-live-estimate-amount');
      const depositEl = document.getElementById('wizard-live-deposit');
      if (!estimateAmountEl) return;

      const total = wizardData.basePrice + wizardData.lengthPrice + wizardData.addonsTotal;
      estimateAmountEl.textContent = `$${total}`;
      
      // Trigger price-bump micro-animation
      estimateAmountEl.classList.remove('price-bump');
      void estimateAmountEl.offsetWidth; // Reflow
      estimateAmountEl.classList.add('price-bump');

      if (depositEl) depositEl.textContent = `$${config.policies?.depositAmount || 50}`;
    }

    // Step 4 Final Form Submission
    const finalForm = document.getElementById('wizard-final-form');
    if (finalForm) {
      finalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Honeypot anti-bot
        const hp = document.getElementById('wizard-hp');
        if (hp && hp.value) return;

        const nameInput = document.getElementById('wizard-client-name');
        const phoneInput = document.getElementById('wizard-client-phone');
        const notesInput = document.getElementById('wizard-client-notes');

        wizardData.clientName = nameInput ? nameInput.value.trim() : '';
        wizardData.clientPhone = phoneInput ? phoneInput.value.trim() : '';
        wizardData.clientNotes = notesInput ? notesInput.value.trim() : '';

        renderSummaryScreen();
        showStep(5, 'next');
      });
    }

    function formatUSDate(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month - 1, day);
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const weekday = weekdays[d.getDay()] || '';
        const monthName = months[d.getMonth()] || month;
        const mm = String(month).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return `${weekday}, ${monthName} ${day}, ${year} (${mm}/${dd}/${year})`;
      }
      return dateStr;
    }

    function showToast(message) {
      let toast = document.getElementById('wizard-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'wizard-toast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color: #10B981; flex-shrink: 0;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><span>${escapeHTML(message)}</span>`;
      toast.classList.add('is-visible');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 3500);
    }

    function parseTimeSlotToHours(timeSlot) {
      const match = (timeSlot || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return { startHour: 10, startMin: 0, endHour: 14, endMin: 0 };
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      
      let endH = h + 4;
      let endM = m;
      return {
        startHour: h,
        startMin: m,
        endHour: endH,
        endMin: endM
      };
    }

    function renderSummaryScreen() {
      const summaryPane = document.getElementById('wizard-step-summary');
      if (!summaryPane) return;

      const total = wizardData.basePrice + wizardData.lengthPrice + wizardData.addonsTotal;
      const deposit = config.policies?.depositAmount || 50;
      const balanceDue = total - deposit;
      const phoneDisplay = config.contact?.phoneDisplay || '(202) 924-0837';
      const phoneRaw = config.contact?.phone || '+12029240837';
      const formattedDate = formatUSDate(wizardData.date);

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const smsSep = isIOS ? '&' : '?';

      const addonsList = wizardData.addons.length > 0 
        ? wizardData.addons.map(a => `${a.name} (+$${a.price})`).join(', ') 
        : 'Standard Studio Care (No add-ons)';

      const defaultInsta = 'https:' + '//www.instagram.com/elafobraiding/';
      const instaUrl = (config.socials && config.socials.instagram && config.socials.instagram.url) || defaultInsta;

      const bookingRef = 'ELA-' + Math.floor(1000 + Math.random() * 9000);

      const smsText = `Hello Elafo Hair! I would like to request an appointment:\n\n` +
        `Ref: ${bookingRef}\n` +
        `Style: ${wizardData.styleName}\n` +
        `Length: ${wizardData.lengthName}\n` +
        `Add-ons: ${addonsList}\n` +
        `Date: ${formattedDate} @ ${wizardData.timeSlot}\n` +
        `Studio: 7404 Executive Place, Lanham, MD 20706\n` +
        `Guest: ${wizardData.clientName} (${wizardData.clientPhone})\n` +
        (wizardData.clientNotes ? `Notes: ${wizardData.clientNotes}\n` : '') +
        `Est. Total: $${total} ($${deposit} deposit credited • $${balanceDue} balance due at chair)\n\n` +
        `Please confirm availability. Thank you!`;

      const smsBody = encodeURIComponent(smsText);
      const mailSubject = encodeURIComponent(`Hair Appointment Request: ${wizardData.styleName} (${formattedDate}) [${bookingRef}]`);
      const mailBody = encodeURIComponent(smsText);

      summaryPane.innerHTML = `
        <div class="wizard-summary-header">
          <div class="wizard-summary-icon-wrap">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <span class="wizard-summary-ref-badge">Reservation Ref #${bookingRef}</span>
          <h3 class="wizard-summary-title">Appointment Request Ready</h3>
          <p class="wizard-summary-desc">
            Choose your preferred transmission method below to transmit your booking details directly to our Lanham master braider:
          </p>
        </div>

        <div class="wizard-summary-card">
          <div class="summary-data-row">
            <span class="summary-data-label">Selected Style:</span>
            <span class="summary-data-value highlight">${escapeHTML(wizardData.styleName)}</span>
          </div>
          <div class="summary-data-row">
            <span class="summary-data-label">Finished Length:</span>
            <span class="summary-data-value">${escapeHTML(wizardData.lengthName)}</span>
          </div>
          <div class="summary-data-row">
            <span class="summary-data-label">Salon Add-Ons:</span>
            <span class="summary-data-value">${escapeHTML(addonsList)}</span>
          </div>
          <div class="summary-data-row">
            <span class="summary-data-label">Appointment:</span>
            <span class="summary-data-value">${escapeHTML(formattedDate)} @ ${escapeHTML(wizardData.timeSlot)}</span>
          </div>
          <div class="summary-data-row">
            <span class="summary-data-label">Studio Atelier:</span>
            <span class="summary-data-value">7404 Executive Place, Lanham, MD 20706</span>
          </div>
          <div class="summary-data-row">
            <span class="summary-data-label">Guest Contact:</span>
            <span class="summary-data-value">${escapeHTML(wizardData.clientName)} • ${escapeHTML(wizardData.clientPhone)}</span>
          </div>
          ${wizardData.clientNotes ? `
          <div class="summary-data-row">
            <span class="summary-data-label">Styling Notes:</span>
            <span class="summary-data-value" style="font-style: italic;">"${escapeHTML(wizardData.clientNotes)}"</span>
          </div>
          ` : ''}

          <div class="summary-divider">
            <div class="summary-total-row">
              <span class="summary-total-label">Estimated Total:</span>
              <span class="summary-total-amount">$${total}</span>
            </div>
            <div class="summary-deposit-note">
              $${deposit} non-refundable deposit credited toward service • Remaining balance due at chair: $${balanceDue}
            </div>
          </div>
        </div>

        <!-- Transmission Buttons Grid -->
        <div class="summary-buttons-grid">
          <a href="sms:${phoneRaw}${smsSep}body=${smsBody}" class="btn btn-primary" title="Send pre-filled appointment request via SMS">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="margin-right: 6px;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            Send via SMS
          </a>
          <a href="mailto:${config.contact?.email || 'contact@elafobraiding.com'}?subject=${mailSubject}&body=${mailBody}" class="btn btn-sand" title="Send pre-filled request via Email">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="margin-right: 6px;"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Send via Email
          </a>
        </div>

        <div class="summary-buttons-grid">
          <a href="tel:${phoneRaw}" class="btn btn-outline" title="Call Elafo Hair Studio directly">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="margin-right: 6px;"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            Call Studio ${phoneDisplay}
          </a>
          <button type="button" class="btn btn-secondary" id="download-ics-btn" title="Download iCalendar file (.ics) for Apple/Google Calendar">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="margin-right: 6px;"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
            Add to Calendar (.ics)
          </button>
        </div>

        <div class="summary-buttons-grid">
          <button type="button" class="btn btn-sand" id="copy-summary-btn" title="Copy full booking message to clipboard">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="margin-right: 6px;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            Copy Booking Details
          </button>
          <a href="${instaUrl}" target="_blank" rel="noopener" class="btn btn-outline" title="Open Instagram to DM @elafobraiding">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="margin-right: 6px;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            DM on Instagram
          </a>
        </div>

        <button type="button" class="summary-close-link" id="summary-dismiss-btn">
          &larr; Start a New Request or Close Window
        </button>
      `;

      // 1. Download ICS Calendar Event
      const icsBtn = document.getElementById('download-ics-btn');
      if (icsBtn) {
        icsBtn.addEventListener('click', () => {
          downloadCalendarInvite(wizardData);
        });
      }

      // 2. Copy to Clipboard with Toast Notification
      const copyBtn = document.getElementById('copy-summary-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(smsText).then(() => {
              showToast('Booking details copied! Ready to paste into SMS or Instagram DM.');
            }).catch(() => {
              fallbackCopy(smsText);
            });
          } else {
            fallbackCopy(smsText);
          }
        });
      }

      function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast('Booking details copied to clipboard!');
        } catch (_) {
          alert('Could not copy automatically. Please use the SMS or Email buttons.');
        }
        document.body.removeChild(ta);
      }

      // 3. Dismiss / Close modal
      const dismissBtn = document.getElementById('summary-dismiss-btn');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          dialog.close();
          setTimeout(() => showStep(1), 300);
        });
      }
    }

    function downloadCalendarInvite(data) {
      const dateClean = (data.date || '').replace(/-/g, '');
      const times = parseTimeSlotToHours(data.timeSlot);
      const startStr = String(times.startHour).padStart(2, '0') + String(times.startMin).padStart(2, '0') + '00';
      const endStr = String(times.endHour).padStart(2, '0') + String(times.endMin).padStart(2, '0') + '00';

      const addonsStr = data.addons.length > 0 ? data.addons.map(a => a.name).join(', ') : 'None';
      const total = data.basePrice + data.lengthPrice + data.addonsTotal;
      const deposit = config.policies?.depositAmount || 50;

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ELAFO HAIR BRAIDING//Lanham MD//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:ELAFO-${Date.now()}@elafobraiding.com`,
        `DTSTAMP:${dateClean}T000000Z`,
        `DTSTART:${dateClean}T${startStr}`,
        `DTEND:${dateClean}T${endStr}`,
        `SUMMARY:Hair Appointment: ${data.styleName} - Elafo Hair`,
        `DESCRIPTION:Luxury protective hair braiding appointment at Elafo Hair Braiding.\\nStyle: ${data.styleName}\\nLength: ${data.lengthName}\\nAdd-ons: ${addonsStr}\\nEst. Total: $${total} ($${deposit} deposit credited)\\nClient: ${data.clientName} (${data.clientPhone})\\nLocation: 7404 Executive Place, Lanham, MD 20706`,
        'LOCATION:7404 Executive Place, Lanham, MD 20706, USA',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `elafo-appointment-${data.date || 'booking'}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  root.ELAFO_BOOKING = { initBookingWizard };
})(typeof window !== 'undefined' ? window : this);
