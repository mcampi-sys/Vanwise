/* Veinwise service worker — offline shell + reminder notifications */
const CACHE = 'veinwise-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
/* policy PDFs: precached so they open with no signal */
const DOCS = ["./intro.webm", "./intro.mp4", "./policies/BD-120470-powerflow-vs-powerport.pdf", "./policies/M03-03-564-high-alert-meds.pdf", "./policies/M03-10-299-extravasation.pdf", "./policies/M03-10-357-hemodialysis-catheters.pdf", "./policies/M03-10-432-intraosseous.pdf", "./policies/M03-10-448-iv-therapy-general.pdf", "./policies/M03-10-605-midline-adult.pdf", "./policies/M03-10-711-picc-usg-adult.pdf"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(ASSETS).then(() => Promise.all(DOCS.map(d => c.add(d).catch(() => {}))))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // app shell: network first so updates land, cache as the fallback
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  // fonts and other cross-origin: cache first
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow('./');
  }));
});
