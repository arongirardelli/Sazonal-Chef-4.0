import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase'
import { getUserProfile, type UserProfileRow } from '@/services/userService'
import { BottomNav } from '@/components/BottomNav'
import { useUserStats } from '@/hooks/useUserStats'
import { GamificationCard, getLevelNumber } from '@/components/GamificationCard'
import { BadgeLevelIcon } from '@/components/BadgeLevelIcon'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { 
  Bell, 
  Settings, 
  Shield, 
  HelpCircle, 
  CreditCard, 
  LogOut, 
  User, 
  ChevronRight,
  Crown
} from 'lucide-react'


export const Profile: React.FC = () => {
  const { colors, fontSizes, theme } = useAppPreferences()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfileRow | null>(null)
  const { stats } = useUserStats()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id || null;
      if (uid) {
        const profileData = await getUserProfile(uid);
        setProfile(profileData);
      }
    };
    fetchData();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  const userName = profile?.display_name || profile?.full_name || profile?.email?.split('@')[0] || 'Chef'
  const avatarLetter = (userName || 'C').charAt(0).toUpperCase()
  const status = profile?.subscription_status ? `Membro ${profile.subscription_status}` : 'Membro Sazonal Chef: O App de Receita Que Transforma Sua Relação com a Comida'

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .slide-in {
            animation: slideIn 0.6s ease-out;
          }
        `}
      </style>
      
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent} 100%)`,
        fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif' 
      }}>
        {/* Header moderno com gradiente */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1a4d1f 100%)`,
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            maxWidth: 1080, 
            margin: '0 auto', 
            padding: '20px 16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Elementos decorativos flutuantes */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '20px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              animation: 'float 4s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              animation: 'float 5s ease-in-out infinite reverse'
            }} />
            
            <h1 style={{ 
              margin: 0, 
              color: 'white', 
              fontSize: fontSizes['2xl'],
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Meu Perfil
            </h1>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ 
            maxWidth: 1080, 
            margin: '0 auto', 
            padding: '20px 16px', 
            display: 'grid', 
            gap: 20, 
            paddingBottom: '100px' 
          }}>
            
            {/* Card de Informações do Usuário - Inspirado no 21dev */}
            <div style={{
              padding: '40px',
              background: 'linear-gradient(135deg, rgb(255, 255, 255) 0%, rgba(243, 244, 246, 0.02) 100%)',
              borderRadius: '20px',
              marginBottom: '20px',
              border: '1px solid rgb(229, 231, 235)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
            }}>
              {/* Elementos decorativos aprimorados */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '4px',
                height: '4px',
                background: colors.primary,
                borderRadius: '50%',
                opacity: 0.4,
                boxShadow: `0 0 8px ${colors.primary}40`,
              }} />
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '2px',
                height: '2px',
                background: colors.secondary,
                borderRadius: '50%',
                opacity: 0.3,
              }} />
              <div style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                right: '0px',
                height: '3px',
                background: `linear-gradient(90deg, ${colors.primary}30 0%, ${colors.secondary}20 50%, ${colors.primary}30 100%)`,
              }} />
              
              {/* Layout Simplificado */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                {/* Badge Container */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent',
                    overflow: 'visible',
                  }}>
                    <BadgeLevelIcon 
                      level={getLevelNumber(stats?.total_points || 0)} 
                      userInitial={avatarLetter}
                      size={120}
                    />
                    {/* Efeito de brilho para níveis altos */}
                    {getLevelNumber(stats?.total_points || 0) >= 10 && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        right: '-10px',
                        bottom: '-10px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
                        zIndex: 0,
                        animation: 'pulse-glow 2s ease-in-out infinite',
                      }} />
                    )}
                  </div>
                </div>
                
                {/* Informações do usuário */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  marginLeft: '24px',
                }}>
                  {/* Nível com badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      background: theme === 'dark' 
                        ? `linear-gradient(135deg, rgba(44, 85, 48, 0.9), rgba(17, 94, 89, 0.9))`
                        : `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                      color: theme === 'dark' ? "rgb(205, 133, 63)" : "#8B4513",
                      fontSize: fontSizes.xs,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: theme === 'dark' 
                        ? '1px solid rgba(205, 133, 63, 0.4)'
                        : `1px solid ${colors.primary}30`,
                      boxShadow: theme === 'dark' 
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                        : 'none',
                    }}>
                      Nível {getLevelNumber(stats?.total_points || 0)}
                    </div>
                  </div>
                  
                  {/* Nome do usuário */}
                  <div style={{ 
                    color: '#2C5530', 
                    fontWeight: 800, 
                    fontSize: fontSizes.lg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: '2px',
                  }}>
                    <User size={18} />
                    Chef {userName}
                  </div>
                  
                  {/* Status do membro */}
                  <div style={{ 
                    color: colors.textSecondary, 
                    fontSize: fontSizes.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <Crown size={14} />
                    {status}
                  </div>
                </div>
              </div>
              
              {/* Animações CSS */}
              <style>
                {`
                  @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.05); }
                  }
                `}
              </style>
            </div>

            {/* Gamificação */}
            <div className="slide-in">
              <GamificationCard
                totalPoints={stats?.total_points}
                recipesViewed={stats?.recipes_viewed}
                recipesSavedCount={stats?.recipes_saved_count}
                cookingDays={stats?.cooking_days}
              />
            </div>

            {/* Seções de navegação modernas */}
            <div style={{ 
              background: theme === 'dark' ? '#2d2d2d' : 'white',
              borderRadius: 20, 
              padding: 16, 
              border: theme === 'dark' ? '1px solid #374151' : '1px solid rgba(44,85,48,0.1)',
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(55, 65, 81, 0.125)' : '0 8px 32px rgba(0,0,0,0.08)',
              display: 'grid', 
              gap: 12
            }}>
              <NavItem 
                icon={<Bell size={20} />} 
                title="Notificações" 
                subtitle="Receitas e lembretes" 
                onClick={()=>navigate('/notifications')} 
                colors={colors} 
                fontSizes={fontSizes} 
                theme={theme}
              />
              <NavItem 
                icon={<Settings size={20} />} 
                title="Configurações" 
                subtitle="Preferências do app" 
                onClick={()=>navigate('/preferences')} 
                colors={colors} 
                fontSizes={fontSizes} 
                theme={theme}
              />
              <NavItem 
                icon={<Shield size={20} />} 
                title="Privacidade" 
                subtitle="Dados e segurança" 
                onClick={()=>navigate('/privacy')} 
                colors={colors} 
                fontSizes={fontSizes} 
                theme={theme}
              />
              <NavItem 
                icon={<HelpCircle size={20} />} 
                title="Ajuda e Suporte" 
                subtitle="Central de ajuda" 
                onClick={()=>navigate('/help')} 
                colors={colors} 
                fontSizes={fontSizes} 
                theme={theme}
              />
            </div>

            {/* Ações de conta modernas */}
            <div style={{ display: 'grid', gap: 12, marginBottom: '30px' }}>
              <button 
                onClick={()=>alert('Gerenciar assinatura (em breve)')} 
                style={{ 
                  padding: '16px 20px', 
                  borderRadius: 16, 
                  border: `2px solid #2C5530`, 
                  background: 'white',
                  color: '#2C5530', 
                  cursor: 'pointer', 
                  fontSize: fontSizes.base,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(44,85,48,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2C5530';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,85,48,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#2C5530';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,85,48,0.1)';
                }}
              >
                <CreditCard size={20} />
                Gerenciar Assinatura
              </button>
              
              <button 
                onClick={signOut} 
                style={{ 
                  padding: '16px 20px', 
                  borderRadius: 16, 
                  border: '2px solid #dc2626', 
                  background: 'white',
                  color: '#dc2626', 
                  cursor: 'pointer', 
                  fontSize: fontSizes.base,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(220,38,38,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,38,38,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.1)';
                }}
              >
                <LogOut size={20} />
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  )
}

interface NavItemProps { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  onClick: ()=>void;
  colors: any;
  fontSizes: any;
  theme: 'light' | 'dark';
}
const NavItem: React.FC<NavItemProps> = ({ icon, title, subtitle, onClick, colors, fontSizes, theme }) => {
  return (
    <button 
      onClick={onClick} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%', 
        background: theme === 'dark' ? '#1a1a1a' : 'white',
        border: theme === 'dark' ? '1px solid #374151' : '1px solid rgba(44,85,48,0.1)', 
        borderRadius: 16, 
        padding: '16px 20px', 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: theme === 'dark' ? '0 2px 8px rgba(55, 65, 81, 0.125)' : '0 2px 8px rgba(0,0,0,0.04)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme === 'dark' ? '#2d2d2d' : colors.accent;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme === 'dark' ? '0 8px 24px rgba(55, 65, 81, 0.25)' : '0 8px 24px rgba(44,85,48,0.15)';
        e.currentTarget.style.borderColor = colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = theme === 'dark' ? '#1a1a1a' : 'white';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme === 'dark' ? '0 2px 8px rgba(55, 65, 81, 0.125)' : '0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = theme === 'dark' ? '#374151' : 'rgba(44,85,48,0.1)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ 
          width: 44, 
          height: 44, 
          borderRadius: '50%', 
          background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
          color: colors.primary, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: `2px solid ${colors.primary}20`
        }}>
          {icon}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ 
            color: theme === 'dark' ? '#CD853F' : colors.text, 
            fontWeight: 700, 
            fontSize: fontSizes.base,
            marginBottom: 2
          }}>
            {title}
          </div>
          <div style={{ 
            color: theme === 'dark' ? '#f9fafb' : colors.textSecondary, 
            fontSize: fontSizes.sm 
          }}>
            {subtitle}
          </div>
        </div>
      </div>
      <ChevronRight size={20} color={theme === 'dark' ? '#d1d5db' : colors.textSecondary} />
    </button>
  )
}