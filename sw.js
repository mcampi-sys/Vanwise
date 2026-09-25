/* Veinwise service worker, v25 (M03 10 112 CVAD policy)
   The page itself is network-first so a new build shows up on the next open
   with signal, and the cached copy keeps it working offline. Everything else
   (policies, intro, icons) is cache-first. Shift data lives in localStorage,
   which this file never touches. */
const CACHE = 'veinwise-v25';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
const EXTRA = ['intro.webm', 'intro.mp4',
  'policies/BD-120470-powerflow-vs-powerport.pdf', 'policies/M03-03-564-high-alert-meds.pdf',
  'policies/M03-10-299-extravasation.pdf', 'policies/M03-10-357-hemodialysis-catheters.pdf',
  'policies/M03-10-432-intraosseous.pdf', 'policies/M03-10-448-iv-therapy-general.pdf',
  'policies/M03-10-605-midline-adult.pdf', 'policies/M03-10-711-picc-usg-adult.pdf'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* one missing file must never block the update */
    await Promise.all(CORE.concat(EXTRA).map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isPage) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'no-store' });
        const c = await caches.open(CACHE);
        c.put('index.html', fresh.clone());
        return fresh;
      } catch (err) {
        return (await caches.match('index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
      return res;
    } catch (err) { return Response.error(); }
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (all.length) return all[0].focus();
    return self.clients.openWindow('./');
  })());
});
