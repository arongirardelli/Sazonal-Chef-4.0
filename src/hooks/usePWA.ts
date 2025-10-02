import { useState, useEffect, useCallback } from 'react'

interface PWAState {
  isInstalled: boolean
  isInstallable: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
  installPrompt: any
}

interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null
  })

  // Verificar se o app está instalado
  const checkIfInstalled = useCallback(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInApp = (window.navigator as any).standalone === true
    return isStandalone || isInApp
  }, [])

  // Verificar atualizações do Service Worker
  const checkForUpdates = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setPwaState(prev => ({ ...prev, isUpdateAvailable: true }))
                }
              })
            }
          })
        }
      })
    }
  }, [])

  // Instalar PWA
  const installPWA = useCallback(async () => {
    if (pwaState.installPrompt) {
      await pwaState.installPrompt.prompt()
      const choiceResult = await pwaState.installPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setPwaState(prev => ({ ...prev, isInstalled: true, isInstallable: false }))
      }
      
      setPwaState(prev => ({ ...prev, installPrompt: null }))
    }
  }, [pwaState.installPrompt])

  // Atualizar app
  const updateApp = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      })
    }
  }, [])

  // Sincronizar dados offline
  const syncOfflineData = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      if ('sync' in registration) {
        await (registration as any).sync.register('background-sync')
      }
    }
  }, [])

  // Cachear dados para uso offline
  const cacheData = useCallback(async (key: string, data: any) => {
    if ('caches' in window) {
      const cache = await caches.open('sazonal-chef-offline-v1')
      await cache.put(`/offline-data/${key}`, new Response(JSON.stringify(data)))
    }
  }, [])

  // Recuperar dados do cache
  const getCachedData = useCallback(async (key: string) => {
    if ('caches' in window) {
      const cache = await caches.open('sazonal-chef-offline-v1')
      const response = await cache.match(`/offline-data/${key}`)
      if (response) {
        return await response.json()
      }
    }
    return null
  }, [])

  // Limpar cache
  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
  }, [])

  // Verificar tamanho do cache
  const getCacheSize = useCallback(async () => {
    if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
        percentage: estimate.quota ? (estimate.usage || 0) / estimate.quota * 100 : 0
      }
    }
    return { used: 0, available: 0, percentage: 0 }
  }, [])

  useEffect(() => {
    // Verificar status inicial
    setPwaState(prev => ({
      ...prev,
      isInstalled: checkIfInstalled()
    }))

    // Listener para beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e as PWAInstallPromptEvent
      }))
    }

    // Listener para appinstalled
    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }))
    }

    // Listener para status online/offline
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }))
      syncOfflineData()
    }

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }))
    }

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verificar atualizações
    checkForUpdates()

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [checkIfInstalled, checkForUpdates, syncOfflineData])

  return {
    ...pwaState,
    installPWA,
    updateApp,
    syncOfflineData,
    cacheData,
    getCachedData,
    clearCache,
    getCacheSize
  }
}
