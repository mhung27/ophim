self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Strategy: Network only (basic SW to pass PWA criteria)
    event.respondWith(fetch(event.request));
});
