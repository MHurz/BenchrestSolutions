// sw.js

const CACHE_NAME = 'Benchrest Solutions-app-v1';
const PRECACHE_URLS = [
  '/index.html',                        // index.html
  '/Scope Click Calculator.html',
  '/Range Estimator.html',
  '/Angle Compensation.html',
  '/reticle-viewer.html',
  '/style.css',
  '/app.js',                  // if this is your main bundled JS
  '/manifest.json',
  '/apple-touch-icon-120x120.png',      // whatever icons you need for offline
  '/apple-touch-icon-180x180.png',
  '/mylogo5-300px.png',
  '/mylogo5.png',
  '/DBK-10019.png',
  '/Viper HST VMR1 MRAD.png'
  // add any other scripts/images you reference
];

// Install: pre‑cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      if (cachedRes) return cachedRes;
      return fetch(event.request).then(netRes => {
        // Optionally cache new requests:
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, netRes.clone());
          return netRes;
        });
      });
    })
  );
});
