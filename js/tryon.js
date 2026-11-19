/**
 * ELAFO HAIR BRAIDING - Virtual Hairstyle Try-On Tool
 * File: js/tryon.js
 * 100% on-device HTML5 canvas processing - zero server uploads
 */

(function (root) {
  'use strict';

  function initTryOnTool() {
    const dialog = document.getElementById('tryon-dialog');
    const openButtons = document.querySelectorAll('[data-open-tryon]');
    const closeBtn = document.getElementById('tryon-close-btn');
    const fileInput = document.getElementById('tryon-file-input');
    const canvas = document.getElementById('tryon-canvas');
    const uploadPrompt = document.getElementById('tryon-upload-prompt');

    if (!dialog || !canvas) return;

    const ctx = canvas.getContext('2d');
    let userImg = null;
    let overlayImg = null;

    let overlayState = {
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 0.9,
      flipped: false
    };

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    // Open & Close
    openButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dialog.showModal();
        dialog.focus();
        loadOverlay(document.getElementById('tryon-style-select')?.value || './assets/overlays/knotless-overlay.png');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!inDialog) dialog.close();
    });

    // File Upload Handler
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            userImg = img;
            canvas.width = 800;
            canvas.height = Math.round(800 * img.height / img.width);
            overlayState.x = canvas.width / 2;
            overlayState.y = canvas.height * 0.38;
            overlayState.scale = 0.85;

            uploadPrompt.style.display = 'none';
            canvas.style.display = 'block';
            render();
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // Overlay selector
    const styleSelect = document.getElementById('tryon-style-select');
    if (styleSelect) {
      styleSelect.addEventListener('change', (e) => {
        loadOverlay(e.target.value);
      });
    }

    function loadOverlay(src) {
      const img = new Image();
      img.onload = () => {
        overlayImg = img;
        render();
      };
      img.src = src;
    }

    // Sliders
    const sizeSlider = document.getElementById('tryon-size-slider');
    const rotateSlider = document.getElementById('tryon-rotate-slider');
    const opacitySlider = document.getElementById('tryon-opacity-slider');
    const flipBtn = document.getElementById('tryon-flip-btn');
    const resetBtn = document.getElementById('tryon-reset-btn');
    const exportBtn = document.getElementById('tryon-export-btn');

    if (sizeSlider) sizeSlider.addEventListener('input', (e) => { overlayState.scale = parseFloat(e.target.value); render(); });
    if (rotateSlider) rotateSlider.addEventListener('input', (e) => { overlayState.rotation = parseInt(e.target.value, 10); render(); });
    if (opacitySlider) opacitySlider.addEventListener('input', (e) => { overlayState.opacity = parseFloat(e.target.value); render(); });
    if (flipBtn) flipBtn.addEventListener('click', () => { overlayState.flipped = !overlayState.flipped; render(); });
    if (resetBtn) resetBtn.addEventListener('click', () => {
      overlayState = { x: canvas.width / 2, y: canvas.height * 0.38, scale: 1.0, rotation: 0, opacity: 0.9, flipped: false };
      if (sizeSlider) sizeSlider.value = 1.0;
      if (rotateSlider) rotateSlider.value = 0;
      if (opacitySlider) opacitySlider.value = 0.9;
      render();
    });

    // Pointer Events Dragging
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      dragStart = { x: e.clientX, y: e.clientY };
      overlayState.x += dx;
      overlayState.y += dy;
      render();
    });

    canvas.addEventListener('pointerup', (e) => {
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    });

    function render() {
      if (!userImg) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

      if (overlayImg) {
        ctx.save();
        ctx.globalAlpha = overlayState.opacity;
        ctx.translate(overlayState.x, overlayState.y);
        ctx.rotate((overlayState.rotation * Math.PI) / 180);
        ctx.scale(overlayState.flipped ? -overlayState.scale : overlayState.scale, overlayState.scale);

        const w = 480;
        const h = Math.round(480 * overlayImg.height / overlayImg.width);
        ctx.drawImage(overlayImg, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      // Watermark
      ctx.save();
      ctx.font = '600 13px Montserrat, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText('ELAFO HAIR BRAIDING • LANHAM, MD', 20, canvas.height - 24);
      ctx.restore();
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (!userImg) return;
        const link = document.createElement('a');
        link.download = 'elafo-style-preview.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  root.ELAFO_TRYON = { initTryOnTool };
})(typeof window !== 'undefined' ? window : this);
