import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase'
import { BottomNav } from '@/components/BottomNav'
import { ArrowLeft, Bell, Sparkles, Shield, Clock, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useAppPreferences } from '../contexts/AppPreferencesContext'

export const NotificationSettings: React.FC = () => {
  const { colors } = useAppPreferences()
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  // Hook com funções de push notifications
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications()
  
  useEffect(() => {
    loadUserSettings()
  }, [])

  const loadUserSettings = async () => {
    try {
      const { data } = await supabase.auth.getSession()
      const uid = data.session?.user?.id
      setUserId(uid || null)
      
      if (uid) {
        let { data: userSettings, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', uid)
          .single()
        
        // Se não existe configuração, criar uma nova
        if (error && error.code === 'PGRST116') {
          console.log('Criando configurações iniciais para o usuário')
          const { data: newSettings, error: createError } = await supabase
            .from('user_settings')
            .insert({
              user_id: uid,
              email: data.session?.user?.email,
              seasonal_alerts_enabled: true,
              daily_recipes_enabled: false,
              cooking_reminders_enabled: false
            })
            .select('*')
            .single()
          
          if (createError) {
            console.error('Erro ao criar configurações:', createError)
            toast.error('Erro ao criar configurações iniciais')
          } else {
            userSettings = newSettings
          }
        } else if (error) {
          console.error('Erro ao carregar configurações:', error)
          // Se for erro de conexão, não mostrar toast de erro
          if (!error.message?.includes('Failed to fetch') && !error.message?.includes('ERR_CONNECTION_CLOSED')) {
            toast.error('Erro ao carregar configurações')
          }
        }
        
        if (userSettings) {
          setSettings(userSettings)
          
          // Definir se as notificações estão habilitadas globalmente
          const hasAnyEnabled = userSettings?.seasonal_alerts_enabled || 
                               userSettings?.daily_recipes_enabled || 
                               userSettings?.cooking_reminders_enabled
          setNotificationsEnabled(hasAnyEnabled || false)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      // Se for erro de conexão, não mostrar toast de erro
      if (!error.message?.includes('Failed to fetch') && !error.message?.includes('ERR_CONNECTION_CLOSED')) {
        toast.error('Erro ao carregar configurações')
      }
    }
    setLoading(false)
  }

  const updateSetting = async (key: string, value: any) => {
    if (!userId) return
    
    // Se o mestre está desativado, não permitir mudanças individuais
    if (!notificationsEnabled && value === true) {
      toast.warning('Ative as notificações push primeiro para configurar notificações individuais')
      return
    }
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
      
      if (error) throw error
      
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)
      
      // Atualizar estado global das notificações apenas se não for o mestre
      if (key !== 'master_enabled') {
        const hasAnyEnabled = newSettings?.seasonal_alerts_enabled || 
                             newSettings?.daily_recipes_enabled || 
                             newSettings?.cooking_reminders_enabled
        setNotificationsEnabled(hasAnyEnabled || false)
      }
      
      toast.success('Configuração atualizada!')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error('Erro ao salvar configuração')
    }
  }

  const handleMasterToggle = async () => {
    if (!userId) {
      toast.error('Você precisa estar logado para configurar notificações')
      return
    }

    try {
      if (notificationsEnabled) {
        // Desativar todas as notificações
        const updates = [
          supabase.from('user_settings').update({ seasonal_alerts_enabled: false, updated_at: new Date().toISOString() }).eq('user_id', userId),
          supabase.from('user_settings').update({ daily_recipes_enabled: false, updated_at: new Date().toISOString() }).eq('user_id', userId),
          supabase.from('user_settings').update({ cooking_reminders_enabled: false, updated_at: new Date().toISOString() }).eq('user_id', userId)
        ]
        
        await Promise.all(updates)
        
        // Atualizar estado local
        const newSettings = { ...settings, seasonal_alerts_enabled: false, daily_recipes_enabled: false, cooking_reminders_enabled: false }
        setSettings(newSettings)
        setNotificationsEnabled(false)
        
        // Desativar push notifications se estiver ativo
        if (isSubscribed) {
          await unsubscribe()
        }
        
        toast.success('Todas as notificações foram desativadas!')
      } else {
        // Ativar todas as notificações
        const updates = [
          supabase.from('user_settings').update({ seasonal_alerts_enabled: true, updated_at: new Date().toISOString() }).eq('user_id', userId),
          supabase.from('user_settings').update({ daily_recipes_enabled: true, updated_at: new Date().toISOString() }).eq('user_id', userId),
          supabase.from('user_settings').update({ cooking_reminders_enabled: true, updated_at: new Date().toISOString() }).eq('user_id', userId)
        ]
        
        await Promise.all(updates)
        
        // Atualizar estado local
        const newSettings = { ...settings, seasonal_alerts_enabled: true, daily_recipes_enabled: true, cooking_reminders_enabled: true }
        setSettings(newSettings)
        setNotificationsEnabled(true)
        
        // Tentar ativar push notifications se suportado
        if (isSupported && !isSubscribed) {
          const success = await subscribe()
          if (!success) {
            toast.warning('Notificações ativadas, mas push notifications falharam. Verifique as permissões.')
          }
        }
        
        toast.success('Todas as notificações foram ativadas! Agora você pode escolher quais receber.')
      }
    } catch (error) {
      console.error('Erro ao gerenciar notificações:', error)
      toast.error('Erro ao configurar notificações')
    }
  }

  const testPushNotification = async (type: 'seasonal' | 'daily' | 'cooking') => {
    // Verificar suporte básico de notificações
    if (!('Notification' in window)) {
      toast.error('Este navegador não suporta notificações')
      return
    }

    try {
      // Simular diferentes tipos de notificações
      const notifications = {
        seasonal: {
          title: '🍃 Nova Receita Sazonal!',
          body: 'Descubra receitas deliciosas com ingredientes da estação atual',
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-96.png',
          tag: 'seasonal-alert',
          data: { type: 'seasonal', url: '/categorias' }
        },
        daily: {
          title: '📅 Receita do Dia',
          body: 'Que tal experimentar uma nova receita hoje? Temos uma sugestão especial para você!',
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-96.png',
          tag: 'daily-recipe',
          data: { type: 'daily', url: '/home' }
        },
        cooking: {
          title: '⏰ Hora de Cozinhar!',
          body: 'Você tem receitas salvas esperando para serem preparadas. Que tal cozinhar algo hoje?',
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-96.png',
          tag: 'cooking-reminder',
          data: { type: 'cooking', url: '/perfil' }
        }
      }

      const notification = notifications[type]
      
      // Verificar permissão de notificações
      if (Notification.permission === 'granted') {
        // Criar e exibir a notificação
        const notif = new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon,
          badge: notification.badge,
          tag: notification.tag,
          data: notification.data
        })

        // Adicionar evento de clique
        notif.onclick = () => {
          window.focus()
          if (notification.data?.url) {
            navigate(notification.data.url)
          }
          notif.close()
        }

        toast.success(`Notificação de teste enviada: ${notification.title}`)
      } else if (Notification.permission === 'denied') {
        toast.error('Permissão para notificações foi negada. Ative nas configurações do navegador.')
      } else {
        // Solicitar permissão
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          // Tentar novamente após conceder permissão
          setTimeout(() => testPushNotification(type), 100)
        } else {
          toast.error('Permissão para notificações não foi concedida')
        }
      }
    } catch (error) {
      console.error('Erro ao testar notificação:', error)
      toast.error('Erro ao enviar notificação de teste')
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 16, backgroundColor: colors.background, minHeight: '100vh' }}>
        <div style={{ background: colors.surface, padding: 12, borderRadius: 8, color: colors.text, border: `1px solid ${colors.border}` }}>
          Carregando configurações...
        </div>
      </div>
    )
  }

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
            display: 'flex',
            alignItems: 'center',
            gap: 16,
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
            
            <button 
              onClick={() => navigate('/perfil')}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                padding: 12, 
                borderRadius: 12, 
                cursor: 'pointer', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ArrowLeft size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Bell size={24} color="white" />
              <h1 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '24px',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Notificações
              </h1>
            </div>
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
            
            {/* Card principal de configurações */}
            <div style={{ 
              background: 'white',
              borderRadius: 20, 
              padding: 24, 
              border: '1px solid rgba(44,85,48,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Elemento decorativo */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 24,
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary}, #1a4d1f)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(44,85,48,0.3)'
                }}>
                  <Bell size={24} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: colors.primary, 
                    fontSize: '20px',
                    fontWeight: 700
                  }}>
                    Configurações de Notificação
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    fontSize: '14px' 
                  }}>
                    Personalize como você recebe notificações
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: 20 }}>
                {/* Notificações Push - Controla todas as outras */}
                <NotificationToggle
                  icon={<Bell size={20} />}
                  title="Notificações Push"
                  description="Ativar ou desativar todas as notificações"
                  enabled={notificationsEnabled}
                  onToggle={handleMasterToggle}
                  colors={colors}
                />

                {/* Alertas Sazonais */}
                <NotificationToggle
                  icon={<Sparkles size={20} />}
                  title="Alertas Sazonais"
                  description="Receitas baseadas em ingredientes da estação"
                  enabled={settings?.seasonal_alerts_enabled || false}
                  onToggle={() => updateSetting('seasonal_alerts_enabled', !settings?.seasonal_alerts_enabled)}
                  disabled={!notificationsEnabled}
                  colors={colors}
                />

                {/* Receitas Diárias */}
                <NotificationToggle
                  icon={<Calendar size={20} />}
                  title="Receitas Diárias"
                  description="Receber sugestões diárias de receitas"
                  enabled={settings?.daily_recipes_enabled || false}
                  onToggle={() => updateSetting('daily_recipes_enabled', !settings?.daily_recipes_enabled)}
                  disabled={!notificationsEnabled}
                  colors={colors}
                />

                {/* Lembrete de Cozimento */}
                <NotificationToggle
                  icon={<Clock size={20} />}
                  title="Lembrete de Cozimento"
                  description="Lembrete para usar suas receitas salvas"
                  enabled={settings?.cooking_reminders_enabled || false}
                  onToggle={() => updateSetting('cooking_reminders_enabled', !settings?.cooking_reminders_enabled)}
                  disabled={!notificationsEnabled}
                  colors={colors}
                />
              </div>

              {/* Seção de Teste de Notificações */}
              {true && (
                <div style={{ 
                  background: colors.surface, 
                  borderRadius: 16, 
                  padding: 24, 
                  border: `1px solid ${colors.border}`, 
                  boxShadow: `0 2px 8px ${colors.border}20`,
                  marginTop: 20
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    marginBottom: 20
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.primary}, #1a4d1f)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: colors.primary, 
                        fontSize: '18px',
                        fontWeight: 700
                      }}>
                        Testar Notificações
                      </h3>
                      <p style={{ 
                        margin: 0, 
                        color: colors.textSecondary, 
                        fontSize: '14px' 
                      }}>
                        Simule notificações para verificar se estão funcionando
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 12 }}>
                    <button
                      onClick={() => testPushNotification('seasonal')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1px solid ${colors.primary}`,
                        background: colors.background,
                        color: colors.primary,
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${colors.primary}10`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = colors.background
                      }}
                    >
                      🍃 Testar Alerta Sazonal
                    </button>

                    <button
                      onClick={() => testPushNotification('daily')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1px solid ${colors.primary}`,
                        background: colors.background,
                        color: colors.primary,
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${colors.primary}10`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = colors.background
                      }}
                    >
                      📅 Testar Receita Diária
                    </button>

                    <button
                      onClick={() => testPushNotification('cooking')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1px solid ${colors.primary}`,
                        background: colors.background,
                        color: colors.primary,
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${colors.primary}10`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = colors.background
                      }}
                    >
                      ⏰ Testar Lembrete de Cozimento
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  )
}

interface NotificationToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  colors: any;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ 
  icon, 
  title, 
  description, 
  enabled, 
  onToggle, 
  disabled = false,
  colors 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '16px',
      borderRadius: 16,
      background: enabled ? `${colors.primary}10` : 'transparent',
      border: `2px solid ${enabled ? colors.primary : 'rgba(44,85,48,0.1)'}`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: enabled 
            ? `linear-gradient(135deg, ${colors.primary}, #1a4d1f)`
            : `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
          color: enabled ? 'white' : colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: enabled ? '0 4px 16px rgba(44,85,48,0.3)' : 'none'
        }}>
          {icon}
        </div>
        <div>
          <div style={{ 
            fontWeight: 700, 
            color: colors.text, 
            fontSize: '16px',
            marginBottom: 4
          }}>
            {title}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: colors.textSecondary 
          }}>
            {description}
          </div>
        </div>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        style={{
          width: 52,
          height: 28,
          borderRadius: 14,
          background: enabled ? colors.primary : '#e5e7eb',
          border: 'none',
          position: 'relative',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: enabled ? '0 2px 8px rgba(44,85,48,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = enabled 
              ? '0 4px 12px rgba(44,85,48,0.4)' 
              : '0 2px 6px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = enabled 
              ? '0 2px 8px rgba(44,85,48,0.3)' 
              : '0 1px 3px rgba(0,0,0,0.1)';
          }
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: enabled ? 28 : 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.3s ease, transform 0.3s ease',
          transform: enabled ? 'scale(1.1)' : 'scale(1)'
        }} />
      </button>
    </div>
  )
}