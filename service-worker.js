self.addEventListener('install', event => {
  console.log('[Service Worker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activated');
});

self.addEventListener('fetch', event => {
  // Basic fetch handler for offline support
  event.respondWith(
    fetch(event.request).catch(() => new Response("You're offline."))
  );
});
