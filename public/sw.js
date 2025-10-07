// Empty service worker file to prevent 404 errors
// This file can be safely deleted once browser cache is cleared

self.addEventListener('install', function (event) {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

// No fetch event handler - let all requests pass through normally
