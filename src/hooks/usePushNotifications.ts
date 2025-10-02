import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

interface PushNotificationState {
  isSupported: boolean
  isSubscribed: boolean
  isBusy: boolean
  permission: NotificationPermission
  subscription: PushSubscription | null
}

interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  requireInteraction?: boolean
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    isBusy: false,
    permission: 'default',
    subscription: null
  })

  // Verificar suporte e status inicial
  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window
      const permission = Notification.permission
      
      setState(prev => ({
        ...prev,
        isSupported: supported,
        permission
      }))

      if (!supported) return

      try {
        const reg = await navigator.serviceWorker.getRegistration()
        const sub = await reg?.pushManager.getSubscription()
        
        setState(prev => ({
          ...prev,
          isSubscribed: !!sub,
          subscription: sub || null
        }))
      } catch (error) {
        console.error('Erro ao verificar subscription:', error)
      }
    }

    checkSupport()
  }, [])

  // Solicitar permissão
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setState(prev => ({ ...prev, permission }))
      return permission === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
      return false
    }
  }, [state.isSupported])

  // Inscrever para notificações push
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported || !VAPID_PUBLIC_KEY) {
      console.warn('Push notifications não suportadas ou VAPID key ausente')
      return false
    }

    setState(prev => ({ ...prev, isBusy: true }))

    try {
      // Solicitar permissão se necessário
      if (state.permission !== 'granted') {
        const granted = await requestPermission()
        if (!granted) {
          setState(prev => ({ ...prev, isBusy: false }))
          return false
        }
      }

      // Registrar Service Worker
      const reg = await navigator.serviceWorker.register('/sw.js')
      await reg.update()

      // Criar subscription
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })

      // Salvar no backend
      const { error } = await supabase.functions.invoke('save-push-subscription', {
        body: { 
          subscription: sub,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      })

      if (error) {
        console.error('Erro ao salvar subscription:', error)
        await sub.unsubscribe()
        setState(prev => ({ ...prev, isBusy: false }))
        return false
      }

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription: sub,
        isBusy: false
      }))

      return true
    } catch (error) {
      console.error('Erro ao inscrever para push notifications:', error)
      setState(prev => ({ ...prev, isBusy: false }))
      return false
    }
  }, [state.isSupported, state.permission, requestPermission])

  // Cancelar inscrição
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) return false

    setState(prev => ({ ...prev, isBusy: true }))

    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = await reg?.pushManager.getSubscription()

      if (sub) {
        await sub.unsubscribe()
        
        // Remover do backend
        try {
          await supabase.functions.invoke('remove-push-subscription', {
            body: { subscription: sub }
          })
        } catch (error) {
          console.warn('Erro ao remover subscription do backend:', error)
        }

        setState(prev => ({
          ...prev,
          isSubscribed: false,
          subscription: null,
          isBusy: false
        }))

        return true
      }

      setState(prev => ({ ...prev, isBusy: false }))
      return false
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error)
      setState(prev => ({ ...prev, isBusy: false }))
      return false
    }
  }, [state.isSupported])

  // Enviar notificação local (para testes)
  const sendLocalNotification = useCallback(async (options: NotificationOptions) => {
    if (!state.isSupported || state.permission !== 'granted') return false

    try {
      const notificationOptions = {
        body: options.body,
        icon: options.icon || '/icons/icon-192.png',
        badge: options.badge || '/icons/icon-96.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction
      }

      const notification = new Notification(options.title, notificationOptions)

      // Auto-close após 5 segundos se não for requireInteraction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      return true
    } catch (error) {
      console.error('Erro ao enviar notificação local:', error)
      return false
    }
  }, [state.isSupported, state.permission])

  // Verificar se pode enviar notificações
  const canSendNotifications = useCallback(() => {
    return state.isSupported && state.permission === 'granted'
  }, [state.isSupported, state.permission])

  // Obter informações da subscription
  const getSubscriptionInfo = useCallback(() => {
    if (!state.subscription) return null

    const endpoint = state.subscription.endpoint
    const keys = state.subscription.getKey('p256dh')
    const auth = state.subscription.getKey('auth')

    return {
      endpoint,
      keys: {
        p256dh: keys ? btoa(String.fromCharCode(...new Uint8Array(keys))) : null,
        auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : null
      }
    }
  }, [state.subscription])

  // Configurar notificações de receitas
  const setupRecipeNotifications = useCallback(async () => {
    if (!state.isSubscribed) return false

    try {
      // Configurar preferências de notificação no backend
      await supabase.functions.invoke('configure-notifications', {
        body: {
          types: ['new_recipes', 'recipe_reminders', 'achievements'],
          frequency: 'daily',
          time: '18:00'
        }
      })

      return true
    } catch (error) {
      console.error('Erro ao configurar notificações de receitas:', error)
      return false
    }
  }, [state.isSubscribed])

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendLocalNotification,
    canSendNotifications,
    getSubscriptionInfo,
    setupRecipeNotifications
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  
  return outputArray
}



