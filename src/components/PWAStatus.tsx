import React, { useState } from 'react'
import { usePWA } from '@/hooks/usePWA'
import { useOffline } from '@/hooks/useOffline'
import { usePushNotifications } from '@/hooks/usePushNotifications'

interface PWAStatusProps {
  showDetails?: boolean
  className?: string
}

export const PWAStatus: React.FC<PWAStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const pwa = usePWA()
  const offline = useOffline()
  const push = usePushNotifications()

  const getStatusColor = () => {
    if (!pwa.isOnline) return 'text-red-500'
    if (offline.syncInProgress) return 'text-yellow-500'
    if (pwa.isInstalled) return 'text-green-500'
    return 'text-blue-500'
  }

  const getStatusText = () => {
    if (!pwa.isOnline) return 'Offline'
    if (offline.syncInProgress) return 'Sincronizando...'
    if (pwa.isInstalled) return 'PWA Instalado'
    if (pwa.isInstallable) return 'Pode Instalar'
    return 'Online'
  }

  const getStatusIcon = () => {
    if (!pwa.isOnline) return '📡'
    if (offline.syncInProgress) return '🔄'
    if (pwa.isInstalled) return '📱'
    if (pwa.isInstallable) return '⬇️'
    return '🌐'
  }

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-lg">{getStatusIcon()}</span>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <span className="text-gray-400">
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {/* Status PWA */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Instalado:</span>
              <span className={`ml-2 ${pwa.isInstalled ? 'text-green-500' : 'text-gray-400'}`}>
                {pwa.isInstalled ? 'Sim' : 'Não'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Instalável:</span>
              <span className={`ml-2 ${pwa.isInstallable ? 'text-green-500' : 'text-gray-400'}`}>
                {pwa.isInstallable ? 'Sim' : 'Não'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Online:</span>
              <span className={`ml-2 ${pwa.isOnline ? 'text-green-500' : 'text-red-500'}`}>
                {pwa.isOnline ? 'Sim' : 'Não'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Atualização:</span>
              <span className={`ml-2 ${pwa.isUpdateAvailable ? 'text-yellow-500' : 'text-gray-400'}`}>
                {pwa.isUpdateAvailable ? 'Disponível' : 'Atualizado'}
              </span>
            </div>
          </div>

          {/* Status Offline */}
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-800 mb-2">Dados Offline</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Receitas:</span>
                <span className="ml-2 text-blue-500">
                  {offline.offlineData.recipes.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Salvas:</span>
                <span className="ml-2 text-blue-500">
                  {offline.offlineData.savedRecipes.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Ações Pendentes:</span>
                <span className="ml-2 text-orange-500">
                  {offline.pendingActions.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Última Sincronização:</span>
                <span className="ml-2 text-gray-500">
                  {offline.lastSyncTime ? 
                    new Date(offline.lastSyncTime).toLocaleTimeString() : 
                    'Nunca'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Status Notificações */}
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-800 mb-2">Notificações</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Suportadas:</span>
                <span className={`ml-2 ${push.isSupported ? 'text-green-500' : 'text-gray-400'}`}>
                  {push.isSupported ? 'Sim' : 'Não'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Ativas:</span>
                <span className={`ml-2 ${push.isSubscribed ? 'text-green-500' : 'text-gray-400'}`}>
                  {push.isSubscribed ? 'Sim' : 'Não'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Permissão:</span>
                <span className={`ml-2 ${
                  push.permission === 'granted' ? 'text-green-500' : 
                  push.permission === 'denied' ? 'text-red-500' : 
                  'text-yellow-500'
                }`}>
                  {push.permission === 'granted' ? 'Concedida' : 
                   push.permission === 'denied' ? 'Negada' : 
                   'Pendente'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 ${push.isBusy ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {push.isBusy ? 'Processando...' : 'Pronto'}
                </span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-800 mb-2">Ações</h4>
            <div className="flex flex-wrap gap-2">
              {pwa.isInstallable && (
                <button
                  onClick={pwa.installPWA}
                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                >
                  Instalar PWA
                </button>
              )}
              
              {pwa.isUpdateAvailable && (
                <button
                  onClick={pwa.updateApp}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                >
                  Atualizar App
                </button>
              )}
              
              {pwa.isOnline && !offline.syncInProgress && (
                <button
                  onClick={offline.syncData}
                  className="px-3 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors"
                >
                  Sincronizar
                </button>
              )}
              
              {push.isSupported && !push.isSubscribed && (
                <button
                  onClick={push.subscribe}
                  disabled={push.isBusy}
                  className="px-3 py-1 bg-orange-500 text-white text-xs rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  Ativar Notificações
                </button>
              )}
              
              {push.isSubscribed && (
                <button
                  onClick={push.unsubscribe}
                  disabled={push.isBusy}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Desativar Notificações
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
