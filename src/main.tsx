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
import { AuthProvider } from './contexts/AuthContext'

import RecipePage from './pages/RecipePage'

import { MenuPage } from './pages/MenuPage'

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
              <Route path="/" element={<Navigate to="/inicio" replace />} />
              <Route path="/inicio" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/assinatura" element={<AssinaturaPage />} />
              <Route path="/finalizar-cadastro" element={<FinalizeAccountPage />} />
              <Route path="/shopping" element={<ShoppingList />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/salvos" element={<Saved />} />
              <Route path="/receita/:id" element={<RecipePage />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/privacy" element={<PrivacySecurity />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
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