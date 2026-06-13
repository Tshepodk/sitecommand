// SiteCommand Service Worker — v1.0
const CACHE_NAME = 'sc-cache-v1';

// Core assets to cache for offline use
const PRECACHE_ASSETS = [
  './',
  './intake.html',
  './config.js',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&display=swap'
];

// ── Install: pre-cache core assets ─────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Pre-cache partial failure (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ──────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first for API, cache-first for assets ───────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never intercept Supabase API calls — let them fail naturally offline
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // For navigation requests (HTML pages) — network first, fall back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('./intake.html')))
    );
    return;
  }

  // For static assets — cache first, then network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Return nothing for non-essential assets
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
