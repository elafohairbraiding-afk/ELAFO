/**
 * ELAFO HAIR - Service Worker
 * Version: elafo-cache-v1
 * Provides offline navigation fallback and caching for fast loading.
 */

const CACHE_NAME = 'elafo-cache-v1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './privacy/index.html',
  './terms/index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/sections.css',
  './js/main.js',
  './js/ui.js',
  './js/utils.js',
  './js/booking.js',
  './js/tryon.js',
  './js/lightbox.js',
  './config/site.config.js',
  './data/services.json',
  './data/pricing-rules.json',
  './data/gallery.json',
  './data/overlays.json',
  './assets/fonts/marcellus-400-normal.woff2',
  './assets/fonts/montserrat-400-normal.woff2',
  './assets/icons/icon-32.png',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/optimized/logo.webp',
  './assets/optimized/hero-800.webp',
  './assets/optimized/og-banner.jpg'
];

// Install: precache essential shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: cleanup older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: network-first for documents, cache-first for hashed/static assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignore cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Handle HTML document navigations: Network-first -> Cache -> Offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If valid response, clone into cache
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Network failed: check cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to offline page
            return caches.match('./offline.html');
          });
        })
    );
    return;
  }

  // Handle static assets (CSS, JS, Fonts, Images): Cache-first -> Network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache fetched static assets for subsequent visits
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });

        return networkResponse;
      });
    })
  );
});
