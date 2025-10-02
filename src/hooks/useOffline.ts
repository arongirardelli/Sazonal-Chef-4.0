import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase'

interface OfflineData {
  recipes: any[]
  userProfile: any
  savedRecipes: any[]
  shoppingLists: any[]
  lastSync: string
}

interface OfflineState {
  isOnline: boolean
  isOfflineMode: boolean
  pendingActions: any[]
  lastSyncTime: string | null
  syncInProgress: boolean
}

export const useOffline = () => {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isOfflineMode: false,
    pendingActions: [],
    lastSyncTime: null,
    syncInProgress: false
  })

  const [offlineData, setOfflineData] = useState<OfflineData>({
    recipes: [],
    userProfile: null,
    savedRecipes: [],
    shoppingLists: [],
    lastSync: new Date().toISOString()
  })

  // Verificar se há dados offline
  const hasOfflineData = useCallback(() => {
    return offlineData.recipes.length > 0 || 
           offlineData.savedRecipes.length > 0 || 
           offlineData.shoppingLists.length > 0
  }, [offlineData])

  // Salvar dados offline
  const saveOfflineData = useCallback(async (key: keyof OfflineData, data: any) => {
    try {
      const updatedData = { ...offlineData, [key]: data, lastSync: new Date().toISOString() }
      setOfflineData(updatedData)
      
      // Salvar no localStorage como backup
      localStorage.setItem('sazonal-chef-offline-data', JSON.stringify(updatedData))
      
      // Salvar no cache do Service Worker
      if ('caches' in window) {
        const cache = await caches.open('sazonal-chef-offline-v1')
        await cache.put('/offline-data', new Response(JSON.stringify(updatedData)))
      }
      
      return true
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error)
      return false
    }
  }, [offlineData])

  // Carregar dados offline
  const loadOfflineData = useCallback(async () => {
    try {
      // Tentar carregar do cache primeiro
      if ('caches' in window) {
        const cache = await caches.open('sazonal-chef-offline-v1')
        const response = await cache.match('/offline-data')
        if (response) {
          const data = await response.json()
          setOfflineData(data)
          return data
        }
      }
      
      // Fallback para localStorage
      const stored = localStorage.getItem('sazonal-chef-offline-data')
      if (stored) {
        const data = JSON.parse(stored)
        setOfflineData(data)
        return data
      }
      
      return null
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error)
      return null
    }
  }, [])

  // Adicionar ação pendente
  const addPendingAction = useCallback((action: any) => {
    setOfflineState(prev => ({
      ...prev,
      pendingActions: [...prev.pendingActions, { ...action, timestamp: new Date().toISOString() }]
    }))
  }, [])

  // Executar ações pendentes
  const executePendingActions = useCallback(async () => {
    if (offlineState.pendingActions.length === 0 || offlineState.syncInProgress) return

    setOfflineState(prev => ({ ...prev, syncInProgress: true }))

    try {
      const actions = [...offlineState.pendingActions]
      const successfulActions: any[] = []
      const failedActions: any[] = []

      for (const action of actions) {
        try {
          switch (action.type) {
            case 'SAVE_RECIPE':
              await supabase.from('saved_recipes').insert(action.data)
              successfulActions.push(action)
              break
            case 'UPDATE_PROFILE':
              await supabase.from('profiles').update(action.data).eq('id', action.userId)
              successfulActions.push(action)
              break
            case 'CREATE_SHOPPING_LIST':
              await supabase.from('shopping_lists').insert(action.data)
              successfulActions.push(action)
              break
            default:
              console.warn('Tipo de ação não reconhecido:', action.type)
          }
        } catch (error) {
          console.error('Erro ao executar ação:', action, error)
          failedActions.push(action)
        }
      }

      // Remover ações bem-sucedidas
      setOfflineState(prev => ({
        ...prev,
        pendingActions: failedActions,
        lastSyncTime: new Date().toISOString(),
        syncInProgress: false
      }))

      return { successful: successfulActions.length, failed: failedActions.length }
    } catch (error) {
      console.error('Erro na sincronização:', error)
      setOfflineState(prev => ({ ...prev, syncInProgress: false }))
      return { successful: 0, failed: offlineState.pendingActions.length }
    }
  }, [offlineState.pendingActions, offlineState.syncInProgress])

  // Sincronizar dados
  const syncData = useCallback(async () => {
    if (!offlineState.isOnline || offlineState.syncInProgress) return

    try {
      setOfflineState(prev => ({ ...prev, syncInProgress: true }))

      // Sincronizar receitas
      const { data: recipes } = await supabase
        .from('recipes')
        .select('*')
        .limit(50) // Limitar para não sobrecarregar

      if (recipes) {
        await saveOfflineData('recipes', recipes)
      }

      // Sincronizar receitas salvas do usuário
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: savedRecipes } = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id)

        if (savedRecipes) {
          await saveOfflineData('savedRecipes', savedRecipes)
        }

        // Sincronizar perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          await saveOfflineData('userProfile', profile)
        }
      }

      // Executar ações pendentes
      await executePendingActions()

      setOfflineState(prev => ({
        ...prev,
        lastSyncTime: new Date().toISOString(),
        syncInProgress: false
      }))

      return true
    } catch (error) {
      console.error('Erro na sincronização:', error)
      setOfflineState(prev => ({ ...prev, syncInProgress: false }))
      return false
    }
  }, [offlineState.isOnline, offlineState.syncInProgress, saveOfflineData, executePendingActions])

  // Cachear receitas para offline
  const cacheRecipes = useCallback(async (recipes: any[]) => {
    await saveOfflineData('recipes', recipes)
  }, [saveOfflineData])

  // Obter receitas offline
  const getOfflineRecipes = useCallback(() => {
    return offlineData.recipes
  }, [offlineData.recipes])

  // Obter receitas salvas offline
  const getOfflineSavedRecipes = useCallback(() => {
    return offlineData.savedRecipes
  }, [offlineData.savedRecipes])

  // Verificar se uma receita está disponível offline
  const isRecipeAvailableOffline = useCallback((recipeId: string) => {
    return offlineData.recipes.some(recipe => recipe.id === recipeId)
  }, [offlineData.recipes])

  // Limpar dados offline
  const clearOfflineData = useCallback(async () => {
    try {
      setOfflineData({
        recipes: [],
        userProfile: null,
        savedRecipes: [],
        shoppingLists: [],
        lastSync: new Date().toISOString()
      })

      localStorage.removeItem('sazonal-chef-offline-data')

      if ('caches' in window) {
        const cache = await caches.open('sazonal-chef-offline-v1')
        await cache.delete('/offline-data')
      }

      return true
    } catch (error) {
      console.error('Erro ao limpar dados offline:', error)
      return false
    }
  }, [])

  useEffect(() => {
    // Carregar dados offline na inicialização
    loadOfflineData()

    // Listener para mudanças de conectividade
    const handleOnline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: true, isOfflineMode: false }))
      syncData()
    }

    const handleOffline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: false, isOfflineMode: true }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Sincronizar periodicamente quando online
    const syncInterval = setInterval(() => {
      if (navigator.onLine && !offlineState.syncInProgress) {
        syncData()
      }
    }, 5 * 60 * 1000) // 5 minutos

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(syncInterval)
    }
  }, [loadOfflineData, syncData, offlineState.syncInProgress])

  return {
    ...offlineState,
    offlineData,
    hasOfflineData,
    saveOfflineData,
    loadOfflineData,
    addPendingAction,
    executePendingActions,
    syncData,
    cacheRecipes,
    getOfflineRecipes,
    getOfflineSavedRecipes,
    isRecipeAvailableOffline,
    clearOfflineData
  }
}
