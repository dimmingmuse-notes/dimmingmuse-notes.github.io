// HOW UPDATES REACH INSTALLED COPIES
// Pages are always served from this cache, so a changed encrypt.html is only
// picked up when this file changes. With every release, change CACHE_NAME
// (encrypt-v5, encrypt-v6, ...). Browsers check this file each time the app is
// opened; the new version is downloaded then and shown the next time it opens.
const CACHE_NAME = 'encrypt-v5';
const ASSETS = [
  'encrypt.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Install - cache assets. cache: 'reload' fetches straight from the server:
// otherwise the browser's own HTTP cache (GitHub Pages allows 10 minutes)
// could hand back the previous version of a file.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' })))
    )
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
