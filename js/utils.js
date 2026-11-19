/**
 * ELAFO HAIR BRAIDING - Utility Helpers
 * File: js/utils.js
 * Universal vanilla script (works with defer and file://)
 */

(function (root) {
  'use strict';

  /**
   * Sanitize untrusted strings to prevent XSS
   */
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Debounce function execution
   */
  function debounce(fn, wait = 150) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /**
   * Check if the studio is currently open using Intl in America/New_York timezone
   */
  function getStudioStatus(hoursArray, timezone = "America/New_York") {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });

      const parts = formatter.formatToParts(now);
      const weekdayPart = parts.find(p => p.type === 'weekday')?.value;
      const hourPart = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
      const minutePart = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
      const currentMinutes = hourPart * 60 + minutePart;

      const todaySchedule = hoursArray.find(h => h.day.toLowerCase() === weekdayPart?.toLowerCase());
      if (!todaySchedule || !todaySchedule.open || !todaySchedule.close) {
        return { isOpen: false, text: "Closed today", todaySchedule: null };
      }

      const [openH, openM] = todaySchedule.open.split(':').map(Number);
      const [closeH, closeM] = todaySchedule.close.split(':').map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        return {
          isOpen: true,
          text: `Open now until ${todaySchedule.display.split('–')[1]?.trim() || todaySchedule.close}`,
          todaySchedule
        };
      } else {
        return {
          isOpen: false,
          text: `Closed now • Opens ${todaySchedule.display.split('–')[0]?.trim() || todaySchedule.open}`,
          todaySchedule
        };
      }
    } catch {
      return { isOpen: true, text: "Open today • Call for appointment", todaySchedule: null };
    }
  }

  /**
   * Check if user has Data Saver enabled
   */
  function isDataSaverActive() {
    return !!(navigator.connection && navigator.connection.saveData);
  }

  const utils = {
    escapeHTML,
    debounce,
    getStudioStatus,
    isDataSaverActive
  };

  root.ELAFO_UTILS = utils;
})(typeof window !== 'undefined' ? window : this);
