// Service Worker for Shark Console PWA
// Version 1.0.0

const CACHE_NAME = 'shark-console-v1.0.0';
const STATIC_CACHE_NAME = 'shark-console-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'shark-console-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/site.webmanifest',
  '/analytics-dashboard.js',
  '/analytics-tracker.js',
  '/marketplace-data.js',
  '/meta-manager.js',
  '/social-sharing.js',
  '/test-bookmarklets.html',
  '/gooimage/goometa.png',
  '/gooimage/theme.jpg',
  '/gooimage/f-cutout.png',
  '/gooimage/x-cutout.png',
  '/gooimage/y-cutout.png',
  '/tool/console2.js'
];

// Network-first resources (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/share-target\//,
  /\.json$/
];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:css|js)$/,
  /\/gooimage\//
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('shark-console-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except for known CDNs)
  if (url.origin !== location.origin && !isTrustedOrigin(url.origin)) {
    return;
  }
  
  // Handle different caching strategies
  if (isNetworkFirst(request.url)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (isCacheFirst(request.url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'performance-data-sync') {
    event.waitUntil(syncPerformanceData());
  } else if (event.tag === 'script-download-sync') {
    event.waitUntil(syncScriptDownloads());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'New security tools and updates available!',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Tools',
        icon: '/gooimage/goometa.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/gooimage/x-cutout.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'Shark Console';
  }
  
  event.waitUntil(
    self.registration.showNotification('Shark Console', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?from=notification')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_PERFORMANCE_DATA') {
    cachePerformanceData(event.data.data);
  } else if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    });
  }
});

// Caching strategies
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache and network failed for:', request.url);
    throw error;
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    console.log('[SW] Network failed for:', request.url);
  });
  
  return cachedResponse || fetchPromise;
}

// Helper functions
function isNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url));
}

function isCacheFirst(url) {
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url));
}

function isTrustedOrigin(origin) {
  const trustedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com',
    'https://cdn.jsdelivr.net'
  ];
  
  return trustedOrigins.includes(origin);
}

// Background sync functions
async function syncPerformanceData() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const performanceData = await cache.match('/performance-data');
    
    if (performanceData) {
      const data = await performanceData.json();
      
      // Send performance data to analytics endpoint
      await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      // Remove from cache after successful sync
      await cache.delete('/performance-data');
    }
  } catch (error) {
    console.log('[SW] Performance data sync failed:', error);
  }
}

async function syncScriptDownloads() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const downloadQueue = await cache.match('/download-queue');
    
    if (downloadQueue) {
      const queue = await downloadQueue.json();
      
      for (const item of queue) {
        try {
          // Process download
          await fetch(`/api/download/${item.scriptId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
          });
        } catch (error) {
          console.log('[SW] Failed to sync download:', item.scriptId, error);
        }
      }
      
      // Clear queue after processing
      await cache.delete('/download-queue');
    }
  } catch (error) {
    console.log('[SW] Script download sync failed:', error);
  }
}

// Cache management functions
async function cachePerformanceData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put('/performance-data', response);
  } catch (error) {
    console.log('[SW] Failed to cache performance data:', error);
  }
}

async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      if (cacheName.startsWith('shark-console-')) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.log('[SW] Failed to calculate cache size:', error);
    return 0;
  }
}

// Periodic cache cleanup
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    
    // Remove old entries (older than 7 days)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader && new Date(dateHeader).getTime() < oneWeekAgo) {
          await cache.delete(request);
        }
      }
    }
  } catch (error) {
    console.log('[SW] Cache cleanup failed:', error);
  }
}, 24 * 60 * 60 * 1000); // Run daily