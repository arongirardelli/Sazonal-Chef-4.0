import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import './index.css'
import { HomePage } from './pages/HomePage'
import { Categories } from './pages/Categories'
import { Saved } from './pages/Saved'
import { Profile } from './pages/Profile'
import { NotificationSettings } from './pages/NotificationSettings'

import Preferences from './pages/Preferences'
import { PrivacySecurity } from './pages/PrivacySecurity'
import { HelpSupport } from './pages/HelpSupport'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { UpdatePasswordPage } from './pages/UpdatePasswordPage'
import { AssinaturaPage } from './pages/AssinaturaPage'
import FinalizeAccountPage from './pages/FinalizeAccountPage'
import { ShoppingList } from './pages/ShoppingList'
import { AppPreferencesProvider } from './contexts/AppPreferencesContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import RecipePage from './pages/RecipePage'

import { MenuPage } from './pages/MenuPage'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'

// Componente para redirecionar usuários baseado no status de autenticação
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F5DC 0%, #F0E68C 50%, #D2B48C 100%)',
        fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #CD853F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#2F2F2F', fontSize: '16px', margin: 0 }}>Carregando...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }
  
  // Se usuário está logado, redirecionar para início
  if (user) {
    return <Navigate to="/inicio" replace />
  }
  
  // Se não está logado, redirecionar para login
  return <Navigate to="/login" replace />
}

const App = () => {
  // ============================================================================
  // CORREÇÃO CRÍTICA: REMOÇÃO DA CHAMADA AUTOMÁTICA DE GAMIFICAÇÃO
  // ============================================================================
  // A lógica de gamificação foi removida da inicialização global para evitar
  // travamentos na página de finalização de cadastro. Será reintegrada de forma
  // inteligente na página "Início" em uma implementação futura.
  // ============================================================================
  
  return (
    <AuthProvider>
      <AppPreferencesProvider>
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/inicio" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/assinatura" element={<AssinaturaPage />} />
              <Route path="/finalizar-cadastro" element={<FinalizeAccountPage />} />
              <Route path="/shopping" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
              <Route path="/categorias" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/salvos" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
              <Route path="/receita/:id" element={<ProtectedRoute><RecipePage /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
              <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
              <Route path="/privacy" element={<ProtectedRoute><PrivacySecurity /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
            <PWAInstallPrompt />
            <Toaster 
              position="top-center" 
              offset={16}
              gap={8}
              expand={true}
              richColors={false}
              closeButton={false}
              toastOptions={{
                style: {
                  width: 'auto',
                  maxWidth: '420px',
                  minWidth: '320px',
                  margin: '0 auto',
                  boxSizing: 'border-box',
                  position: 'relative',
                  left: 'auto',
                  right: 'auto',
                  transform: 'none'
                },
                className: 'toast-responsive',
                duration: 4000
              }}
            />
        </BrowserRouter>
      </AppPreferencesProvider>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)