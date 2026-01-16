// Service Worker for ATLVS + GVTEWAY PWA
// Handles caching, offline support, push notifications, and background sync

const CACHE_NAME = 'dragonfly-v1.0.0'
const STATIC_CACHE = 'dragonfly-static-v1.0.0'
const DYNAMIC_CACHE = 'dragonfly-dynamic-v1.0.0'
const API_CACHE = 'dragonfly-api-v1.0.0'

// Resources to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/search',
  '/dashboard',
  '/experiences',
  '/destinations',
  '/about',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// API endpoints to cache for offline access
const API_ENDPOINTS = [
  '/api/search',
  '/api/experiences',
  '/api/destinations',
  '/api/profiles',
  '/api/events',
  '/api/social/follow',
  '/api/social/like',
  '/api/notifications'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event')

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event')

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== API_CACHE &&
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  )
})

// Fetch event - handle requests with different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and external requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle page requests (navigation) with cache-first strategy
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(handlePageRequest(request))
    return
  }

  // Handle static assets with cache-first strategy
  if (STATIC_ASSETS.includes(url.pathname) ||
      url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$/)) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Default strategy - cache first, then network
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response
        }

        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline')
        }
        // Return a basic offline response for other requests
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
      })
  )
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request)

    // Cache successful responses
    if (response.status === 200) {
      const responseClone = response.clone()
      caches.open(API_CACHE).then((cache) => {
        cache.put(request, responseClone)
      })
    }

    return response
  } catch {
    // Fall back to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'You are currently offline. Please check your connection and try again.',
        offline: true
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle page requests with cache-first strategy
async function handlePageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Try network
    const response = await fetch(request)

    // Cache successful HTML responses
    if (response.status === 200 && response.headers.get('content-type').includes('text/html')) {
      const responseClone = response.clone()
      caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, responseClone)
      })
    }

    return response
  } catch {
    // Return offline page
    const offlineResponse = await caches.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }

    // Fallback offline page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - ATLVS + GVTEWAY</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, sans-serif;
              text-align: center;
              padding: 2rem;
              background: #f8fafc;
              color: #334155;
            }
            .container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              padding: 2rem;
              border-radius: 0.75rem;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
            h1 { color: #8B5CF6; margin-bottom: 1rem; }
            .offline-icon { font-size: 4rem; margin: 2rem 0; }
            button {
              background: #8B5CF6;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-weight: 500;
              transition: background-color 0.2s;
            }
            button:hover { background: #7C3AED; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="offline-icon"></div>
            <h1>You're Offline</h1>
            <p>Don't worry! You can still browse cached content and we'll sync your data when you're back online.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    if (response.status === 200) {
      const responseClone = response.clone()
      caches.open(STATIC_CACHE).then((cache) => {
        cache.put(request, responseClone)
      })
    }
    return response
  } catch {
    // For static assets, return a basic error response
    return new Response('Asset not available offline', { status: 503 })
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineActions())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)

  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body || 'You have a new notification',
      icon: '/icon-192x192.png',
      badge: '/icon-96x96.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icon-96x96.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      tag: data.tag || 'general' // Prevent duplicate notifications
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'ATLVS + GVTEWAY', options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event)

  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  }
})

// Periodic background sync to refresh cached data
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag)

  if (event.tag === 'content-sync') {
    event.waitUntil(refreshCachedContent())
  }
})

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' })
  }
})

// Sync offline actions when back online
async function syncOfflineActions() {
  console.log('[SW] Syncing offline actions')

  try {
    // Get stored offline actions from IndexedDB or similar
    const offlineActions = await getOfflineActions()

    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        })
        console.log('[SW] Synced offline action:', action)
      } catch (error) {
        console.error('[SW] Failed to sync action:', action, error)
        // Could implement retry logic here
      }
    }

    // Clear synced actions
    await clearOfflineActions()
  } catch (error) {
    console.error('[SW] Background sync failed:', error)
  }
}

// Refresh cached content periodically
async function refreshCachedContent() {
  console.log('[SW] Refreshing cached content')

  try {
    // Update cached API responses
    for (const endpoint of API_ENDPOINTS) {
      try {
        const response = await fetch(endpoint)
        if (response.status === 200) {
          const cache = await caches.open(API_CACHE)
          await cache.put(endpoint, response)
        }
      } catch (error) {
        console.log('[SW] Failed to refresh:', endpoint, error)
      }
    }
  } catch (error) {
    console.error('[SW] Content refresh failed:', error)
  }
}

// Placeholder functions for offline storage (implement based on your needs)
async function getOfflineActions() {
  // Implement IndexedDB or similar storage for offline actions
  // This would store actions like likes, comments, follows that were performed offline
  return []
}

async function clearOfflineActions() {
  // Implement clearing of synced actions from storage
}
