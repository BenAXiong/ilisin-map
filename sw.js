const CACHE = 'ilisin-v22';
const SHELL = [
  '/',
  '/index.html',
  '/data.js',
  '/manifest.json',
  '/logo.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

globalThis.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => globalThis.skipWaiting())
  );
});

globalThis.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => globalThis.clients.claim())
  );
});

globalThis.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Pass through map tiles and font requests — don't cache them
  if (
    url.hostname.includes('carto') ||
    url.hostname.includes('openstreetmap') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic')
  ) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
