// Service worker: guarda la app para que funcione sin internet.
const VERSION = '0.4.0';
const CACHE = 'lector-pdf-' + VERSION;
const CORE = ["./FoxitDingbats.pfb","./FoxitFixed.pfb","./FoxitFixedBold.pfb","./FoxitFixedBoldItalic.pfb","./FoxitFixedItalic.pfb","./FoxitSerif.pfb","./FoxitSerifBold.pfb","./FoxitSerifBoldItalic.pfb","./FoxitSerifItalic.pfb","./FoxitSymbol.pfb","./LICENSES.txt","./LiberationSans-Bold.ttf","./LiberationSans-BoldItalic.ttf","./LiberationSans-Italic.ttf","./LiberationSans-Regular.ttf","./app.css","./app.js","./banco-a1.json","./banco-a2-1.json","./banco-a2-2.json","./banco-a2-3.json","./banco-indice.json","./banco-it-a1-1.json","./banco-it-a1-2.json","./banco-it-a2-1.json","./banco-it-a2-2.json","./banco-it-a2-3.json","./banco-it-b1-1.json","./banco-it-b1-2.json","./banco-it-indice.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./icon.svg","./index.html","./jbig2.wasm","./manifest.webmanifest","./openjpeg.wasm","./pdf.worker.js","./qcms_bg.wasm","./"];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('lector-pdf-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('./index.html');
      return fetch(req);
    })
  );
});
