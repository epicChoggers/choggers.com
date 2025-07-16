// Service worker intentionally left blank to disable caching and unregister any previous service worker.

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.registration.unregister());
});
