const CACHE_NAME = "wejuman-v01";
const ASSETS = [
"./",
"./index.html",
"./manifest.json",
"./sw.js",
"./icons/icon-192.png",
"./icons/icon-512.png",
"./icons/apple-touch-icon.png"
];

// Install: cache shell
self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
);
});

// Activate: cleanup old
self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
.then(() => self.clients.claim())
);
});

// Fetch: cache-first for shell, network for others
self.addEventListener("fetch", (event) => {
const req = event.request;
const url = new URL(req.url);

// Only handle same-origin
if (url.origin !== location.origin) return;

event.respondWith(
caches.match(req).then((cached) => cached || fetch(req).catch(() => caches.match("./index.html")))
);
});
