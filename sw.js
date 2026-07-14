const CACHE = 'pokoh-v1';
const SHELL = [
  '/',
  '/index.html',
  '/data.js',
  '/manifest.json',
  '/logo.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
// App-shell files that change on every deploy — always go to the network
// first so updates show up immediately, instead of waiting on the SW
// install/activate lifecycle. Cache is only the offline fallback for these.
const NETWORK_FIRST = new Set(['/', '/index.html', '/app.css', '/data.js', '/buluo-ref.js', '/schedule.js', '/manifest.json', '/js/timeline.js', '/js/timeline-overview.js', '/js/map.js', '/js/search.js', '/js/info.js', '/js/detail.js', '/js/dates.js', '/js/event.js', '/js/shell.js']);

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
  if (url.origin === self.location.origin && NETWORK_FIRST.has(url.pathname)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
