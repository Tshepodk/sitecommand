// SiteCommand Service Worker — Offline Daily Intake
const CACHE = 'sc-intake-v1';
const OFFLINE_URLS = [
  './intake.html',
  './config.js',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500&display=swap'
];

// Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache when offline
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Never intercept Supabase API calls — let them fail naturally (app handles offline)
  if (url.includes('supabase.co')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses for offline use
        if (res.ok && (url.includes('intake.html') || url.includes('config.js') || url.includes('fonts.googleapis'))) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || new Response('Offline', { status: 503 })))
  );
});
