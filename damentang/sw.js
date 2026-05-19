const CACHE = 'damentang-v0.9.4';

const PRECACHE = [
  '/damentang/',
  '/damentang/index.html',
  '/damentang/css/style.css',
  '/damentang/js/main.js',
  '/damentang/js/engine.js',
  '/damentang/js/data.js',
  '/damentang/js/audio.js',
  '/damentang/js/storage.js',
  '/damentang/js/puzzles.js',
  '/damentang/manifest.json',
  '/damentang/favicon.svg',
  '/damentang/images/og-image.png',
  '/damentang/images/icon-512.svg',
  '/damentang/audio/sfx_click.mp3',
  '/damentang/audio/sfx_collect.mp3',
  '/damentang/audio/sfx_use.mp3',
  '/damentang/audio/sfx_solve.mp3',
  '/damentang/audio/sfx_door_open.mp3',
  '/damentang/audio/sfx_lock_unlock.mp3',
  '/damentang/audio/sfx_mechanism.mp3',
  '/damentang/audio/sfx_seal_break.mp3',
  '/damentang/audio/sfx_reveal.mp3',
  '/damentang/audio/sfx_dark.mp3',
  '/damentang/audio/sfx_ending.mp3',
  '/damentang/audio/sfx_save.mp3',
  '/damentang/audio/amb_village.mp3',
  '/damentang/audio/amb_hall.mp3',
  '/damentang/audio/amb_study.mp3',
  '/damentang/audio/amb_bedroom.mp3',
  '/damentang/audio/amb_passage.mp3',
  '/damentang/audio/amb_seal.mp3',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      // Use addAll but handle individual failures gracefully
      return Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn('SW: failed to cache', url, err.message);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Google Fonts: network-first with cache fallback
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open('damentang-fonts').then(cache =>
        cache.match(event.request).then(cached =>
          fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached || new Response('', { status: 503 }))
        )
      )
    );
    return;
  }

  // Static assets: cache-first (immutable versioned URLs)
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request)
    )
  );
});
