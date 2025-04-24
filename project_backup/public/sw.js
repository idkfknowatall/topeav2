// Service Worker for Topea Website

const CACHE_NAME = 'topea-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/images/hero-bg.webp',
  '/images/hero-bg-2048.webp',
  '/images/hero-bg-1536.webp',
  '/images/hero-bg-1024.webp',
  '/images/hero-bg-768.webp',
  '/images/portfolio-1.webp',
  '/images/portfolio-2.webp',
  '/images/portfolio-3.webp',
  '/images/portfolio-4.webp',
  '/images/portfolio-5.webp',
  '/images/portfolio-6.webp',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Don't cache API requests or external resources
                if (event.request.url.includes('/api/') || 
                    !event.request.url.startsWith(self.location.origin)) {
                  return;
                }
                
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
      .catch(() => {
        // If both cache and network fail, serve offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
