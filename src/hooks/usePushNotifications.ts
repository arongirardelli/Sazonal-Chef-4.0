import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window
    setIsSupported(supported)
    if (!supported) return
    ;(async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        const sub = await reg?.pushManager.getSubscription()
        setIsSubscribed(!!sub)
      } catch {}
    })()
  }, [])

  const subscribe = useCallback(async () => {
    if (!isSupported) return false
    if (!VAPID_PUBLIC_KEY) {
      console.warn('VITE_VAPID_PUBLIC_KEY ausente')
      return false
    }
    setIsBusy(true)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setIsBusy(false); return false }
      const reg = await navigator.serviceWorker.register('/sw.js')
      await reg.update()
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })
      // envia para o backend
      const { error } = await supabase.functions.invoke('save-push-subscription', {
        body: { subscription: sub }
      })
      if (error) throw error
      setIsSubscribed(true)
      return true
    } catch (e) {
      console.error('Falha ao ativar push', e)
      return false
    } finally {
      setIsBusy(false)
    }
  }, [isSupported])

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return false
    setIsBusy(true)
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = await reg?.pushManager.getSubscription()
      if (sub) {
        await sub.unsubscribe()
        setIsSubscribed(false)
        return true
      }
      return false
    } catch (e) {
      console.error('Falha ao desativar push', e)
      return false
    } finally {
      setIsBusy(false)
    }
  }, [isSupported])

  return { isSupported, isSubscribed, isBusy, subscribe, unsubscribe }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}



