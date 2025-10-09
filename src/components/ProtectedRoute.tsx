import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSubscription?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSubscription = true 
}) => {
  const { user, loading, subscriptionStatus } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F0E5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5530] mx-auto mb-4"></div>
          <p className="text-[#2C5530] text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não há usuário, redirecionar para login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Detectar se é PWA (instalado)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true ||
                document.referrer.includes('android-app://')

  // Temporariamente desabilitado redirecionamento para assinatura
  // A página de assinatura será configurada posteriormente
  // if (requireSubscription && subscriptionStatus === 'inactive' && !isPWA) {
  //   return <Navigate to="/assinatura" state={{ from: location }} replace />
  // }

  return <>{children}</>
}
