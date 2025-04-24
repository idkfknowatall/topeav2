// Service Worker for Topea Website

const CACHE_NAME = 'topea-cache-v2';

// Critical assets that should be cached immediately for LCP
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/images/hero-bg-2048.webp',
  '/images/hero-bg-1536.webp',
  '/images/hero-bg-1024.webp',
  '/images/hero-bg-768.webp',
];

// Other assets that can be cached after critical assets
const SECONDARY_ASSETS = [
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/manifest.json',
  '/images/portfolio-1.webp',
  '/images/portfolio-2.webp',
  '/images/portfolio-3.webp',
  '/images/portfolio-4.webp',
  '/images/portfolio-5.webp',
  '/images/portfolio-6.webp',
];

// Combined assets for backward compatibility
const ASSETS_TO_CACHE = [...CRITICAL_ASSETS, ...SECONDARY_ASSETS];

// Install event - cache assets with priority
self.addEventListener('install', (event) => {
  event.waitUntil(
    // First cache critical assets for LCP
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Caching critical assets for LCP');
        await cache.addAll(CRITICAL_ASSETS);

        // Then cache secondary assets
        console.log('Caching secondary assets');
        return cache.addAll(SECONDARY_ASSETS);
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

// Fetch event - serve from cache with priority for critical assets
self.addEventListener('fetch', (event) => {
  // Check if this is a request for a critical asset
  const isCriticalAsset = CRITICAL_ASSETS.some(asset =>
    event.request.url.endsWith(asset) ||
    (asset === '/' && (event.request.url.endsWith('/') || event.request.url.endsWith('/index.html')))
  );

  // Use a faster strategy for critical assets
  if (isCriticalAsset) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Standard strategy for non-critical assets
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
