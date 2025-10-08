// Service Worker para Sazonal Chef: Seu App que Transforma Sua Relação com a Comida
const CACHE_NAME = 'sazonal-chef-v2.0.0'
const STATIC_CACHE = 'sazonal-chef-static-v2.0.0'
const DYNAMIC_CACHE = 'sazonal-chef-dynamic-v2.0.0'
const API_CACHE = 'sazonal-chef-api-v2.0.0'

// Recursos estáticos para cache imediato
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-96x96.png',
  '/icons/apple-touch-icon-180x180.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png'
]

// Recursos dinâmicos para cache sob demanda
const DYNAMIC_PATTERNS = [
  /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
  /^https:\/\/.*\.supabase\.co\/storage\/v1\//,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:css|js|woff2?|ttf|eot)$/
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
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
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
    event.respondWith(networkFirst(request, API_CACHE))
    return
  }

  // Estratégia para recursos dinâmicos
  if (DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
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

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => cached)
  
  return cached || fetchPromise
}

// Notificações Push
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event)
  
  if (!event.data) return
  
  let payload
  try {
    payload = event.data.json()
  } catch (error) {
    payload = { title: 'Sazonal Chef', body: event.data.text() }
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

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Implementar lógica de sincronização offline
    console.log('[SW] Executando sincronização em background...')
    
    // Exemplo: sincronizar receitas salvas offline
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    
    for (const request of requests) {
      if (request.url.includes('/api/recipes')) {
        try {
          await fetch(request)
          console.log('[SW] Sincronizado:', request.url)
        } catch (error) {
          console.log('[SW] Falha na sincronização:', request.url)
        }
      }
    }
  } catch (error) {
    console.error('[SW] Erro na sincronização:', error)
  }
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Mensagem recebida:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

console.log('[SW] Service Worker carregado com sucesso')



