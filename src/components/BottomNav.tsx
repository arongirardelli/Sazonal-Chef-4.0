import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Utensils, Heart, User } from 'lucide-react'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import './BottomNav.css'

export const BottomNav: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { colors, fontSizes } = useAppPreferences()
  
  const items: { label: string; icon: React.ReactNode; to: string; match: (p: string)=>boolean }[] = [
    { label: 'Início', icon: <Home className="icon" />, to: '/inicio', match: (p) => p === '/' || p.startsWith('/inicio') },
    { label: 'Categorias', icon: <BookOpen className="icon" />, to: '/categorias', match: (p) => p.startsWith('/categorias') },
    { label: 'Cardápio', icon: <Utensils className="icon" />, to: '/menu', match: (p) => p.startsWith('/menu') || p.startsWith('/shopping') },
    { label: 'Salvos', icon: <Heart className="icon" />, to: '/salvos', match: (p) => p.startsWith('/salvos') },
    { label: 'Perfil', icon: <User className="icon" />, to: '/perfil', match: (p) => p.startsWith('/perfil') || p.startsWith('/notifications') || p.startsWith('/preferences') || p.startsWith('/privacy') || p.startsWith('/help') },
  ]

  return (
    <nav 
      className="bottom-nav-modern"
      style={{
        background: `linear-gradient(180deg, ${colors.surface} 0%, ${colors.surface} 100%)`,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${colors.border}`,
        color: colors.text,
        boxShadow: `0 -4px 20px rgba(0, 0, 0, 0.08)`
      }}
    >
      <div className="nav-container">
        {items.map((item, index) => {
          const active = item.match(pathname)
          return (
            <button 
              key={item.label} 
              onClick={() => navigate(item.to)} 
              className={`nav-item${active ? ' active' : ''}`}
              style={{
                color: active ? colors.primary : colors.textSecondary,
                transform: active ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="icon-container" style={{
                background: active ? `${colors.primary}15` : 'transparent',
                borderRadius: '12px',
                padding: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {item.icon}
              </div>
              <div 
                className="nav-label"
                style={{ 
                  fontSize: fontSizes.xs,
                  fontWeight: active ? 600 : 400,
                  opacity: active ? 1 : 0.7,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {item.label}
              </div>
              {active && (
                <div 
                  className="active-indicator"
                  style={{
                    background: colors.primary,
                    borderRadius: '2px',
                    height: '3px',
                    width: '20px',
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}


