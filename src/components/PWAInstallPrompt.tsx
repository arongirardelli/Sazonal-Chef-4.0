import React, { useState, useEffect } from 'react'
import { useAppPreferences } from '../contexts/AppPreferencesContext'

interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PWAInstallPrompt: React.FC = () => {
  const { theme, colors } = useAppPreferences()
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  // Detectar tipo de dispositivo
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent)
  }

  // Verificar se já está instalado
  const checkIfInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://')
  }

  useEffect(() => {
    // Verificar se já está instalado
    if (checkIfInstalled()) {
      setIsInstalled(true)
      return
    }

    // Event listener para beforeinstallprompt (desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as PWAInstallPromptEvent)
      setShowPrompt(true)
    }

    // Para mobile, mostrar prompt imediatamente após carregamento
    if (isMobile() && !checkIfInstalled()) {
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    }
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  const isMobileDevice = isMobile()
  const isIOSDevice = isIOS()
  const isAndroidDevice = isAndroid()

  let instructionText = 'Adicione ao seu dispositivo para acesso rápido'
  
  if (isMobileDevice) {
    if (isIOSDevice) {
      instructionText = 'Toque no botão de compartilhar (📤) e selecione "Adicionar à Tela de Início"'
    } else if (isAndroidDevice) {
      instructionText = 'Toque no menu do navegador (⋮) e selecione "Instalar app" ou "Adicionar à tela inicial"'
    } else {
      instructionText = 'Use o menu do navegador para instalar o app'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        background: 'rgb(205, 133, 63)',
        color: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 4px 12px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: 'none'
      }}
    >
      <div style={{ flex: '1 1 0%', marginRight: '12px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '4px'
        }}>
          <span style={{ fontSize: '20px' }}>📱</span>
          <strong style={{ fontSize: '16px' }}>Instalar Sazonal Chef</strong>
        </div>
        <div style={{ 
          fontSize: '14px', 
          opacity: 0.9,
          lineHeight: '1.4'
        }}>
          {instructionText}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isMobileDevice && deferredPrompt && (
          <button
            onClick={handleInstall}
            style={{
              background: 'white',
              color: 'rgb(205, 133, 63)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              transition: '0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f0f0f0'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white'
            }}
          >
            Instalar
          </button>
        )}
        
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: '0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.borderColor = 'white'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          }}
        >
          {isMobileDevice ? 'Entendi' : 'Depois'}
        </button>
      </div>
    </div>
  )
}
