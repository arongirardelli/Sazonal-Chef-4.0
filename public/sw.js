// Service Worker para Sazonal Chef: Seu App que Transforma Sua Relação com a Comida
const CACHE_NAME = 'sazonal-chef-v3.0.0'
const STATIC_CACHE = 'sazonal-chef-static-v3.0.0'
const DYNAMIC_CACHE = 'sazonal-chef-dynamic-v3.0.0'

// Recursos estáticos para cache imediato
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-96x96.png',
  '/icons/apple-touch-icon-180x180.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png'
]

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cacheando recursos estáticos...')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Recursos estáticos cacheados com sucesso')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Erro ao cachear recursos estáticos:', error)
      })
  )
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Removendo cache antigo:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Service Worker ativado')
        return self.clients.claim()
      })
  )
})

// Estratégia de cache para requisições
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) return

  // Estratégia para recursos estáticos
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Estratégia para APIs do Supabase
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }

  // Estratégia padrão: Network First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE))
})

// Estratégia Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)
    
    if (cached) {
      console.log('[SW] Cache hit:', request.url)
      return cached
    }

    const response = await fetch(request)
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('[SW] Erro em cacheFirst:', error)
    return new Response('Recurso não disponível offline', { status: 503 })
  }
}

// Estratégia Network First
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    
    if (response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('[SW] Network falhou, tentando cache:', request.url)
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }
    
    // Fallback para páginas
    if (request.mode === 'navigate') {
      return caches.match('/index.html')
    }
    
    return new Response('Recurso não disponível offline', { status: 503 })
  }
}

// Notificações Push
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event)
  
  if (!event.data) return
  
  let payload
  try {
    payload = event.data.json()
  } catch (error) {
    payload = { title: 'Sazonal Chef: Seu App que Transforma Sua Relação com a Comida', body: event.data.text() }
  }
  
  const title = payload.title || 'Sazonal Chef: Seu App que Transforma Sua Relação com a Comida'
  const options = {
    body: payload.body || 'Nova notificação do Sazonal Chef: Seu App que Transforma Sua Relação com a Comida',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    data: payload.data || {},
    tag: payload.tag || 'sazonal-chef-notification',
    requireInteraction: payload.requireInteraction || false,
    actions: payload.actions || [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-96x96.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clique em notificação:', event)
  
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  const targetUrl = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Procurar por uma janela existente
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Abrir nova janela se não encontrar
        if (clients.openWindow) {
          return clients.openWindow(targetUrl)
        }
      })
  )
})

console.log('[SW] Service Worker carregado com sucesso')