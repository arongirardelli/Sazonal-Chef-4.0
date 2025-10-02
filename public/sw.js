self.addEventListener('push', function (event) {
  if (!event.data) return
  const payload = event.data.json()
  const title = payload.title || 'Sazonal Chef'
  const options = {
    body: payload.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    data: payload.data || {},
    tag: payload.tag || undefined
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const targetUrl = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clis) => {
      const client = clis.find((c) => 'focus' in c)
      if (client) return (client as any).navigate(targetUrl).then(() => (client as any).focus())
      return clients.openWindow(targetUrl)
    })
  )
})



