import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase'
import { toast } from 'sonner'


interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  subscriptionStatus: string
  planType: string
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; message?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive')
  const [planType, setPlanType] = useState<string>('none')

  useEffect(() => {
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[AuthContext] Auth event: ${event}`)
        setSession(session)
        setUser(session?.user ?? null)

        switch (event) {
          case 'INITIAL_SESSION':
          case 'SIGNED_IN':
            if (session?.user) {
              // Apenas verificar o status da assinatura, a lógica de acesso diário foi movida para a HomePage.
              checkSubscriptionStatus(session.user.id);
            }
            break

          case 'PASSWORD_RECOVERY':
            console.log('[AuthContext] Sessão de recuperação de senha estabelecida.')
            // Nenhuma ação extra é necessária. Apenas estabelecer a sessão
            // permite que a página de atualização de senha funcione.
            break

          case 'SIGNED_OUT':
            setSubscriptionStatus('inactive')
            setPlanType('none')
            break

          default:
            // Para outros eventos (TOKEN_REFRESHED, USER_UPDATED), a sessão já está
            // sendo atualizada. Se a sessão se tornar nula por qualquer motivo,
            // redefinimos o status da assinatura.
            if (!session) {
              setSubscriptionStatus('inactive')
              setPlanType('none')
            }
        }

        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      // Detectar se é PWA para comportamento diferente
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone === true ||
                    document.referrer.includes('android-app://')

      const { error } = await supabase
        .rpc('can_user_authenticate', { user_email: user?.email || '' })
      
      if (error) {
        console.error('Erro ao verificar status da assinatura:', error)
        // Para PWA, assumir ativo por padrão para evitar redirecionamentos
        setSubscriptionStatus(isPWA ? 'active' : 'inactive')
        setPlanType('none')
        return
      }

      // Buscar perfil do usuário para obter informações detalhadas
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_status, plan_type')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
        // Para PWA, assumir ativo por padrão para evitar redirecionamentos
        setSubscriptionStatus(isPWA ? 'active' : 'inactive')
        setPlanType('none')
        return
      }

      // Para PWA, sempre permitir acesso mesmo se subscription_status for 'inactive'
      const finalStatus = isPWA && profile.subscription_status === 'inactive' ? 'active' : profile.subscription_status
      setSubscriptionStatus(finalStatus || 'inactive')
      setPlanType(profile.plan_type || 'none')
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error)
      // Para PWA, assumir ativo por padrão para evitar redirecionamentos
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone === true ||
                    document.referrer.includes('android-app://')
      setSubscriptionStatus(isPWA ? 'active' : 'inactive')
      setPlanType('none')
    }
  }

  const registerDailyAccess = async () => {
    console.log('🚀 [AuthContext] Registrando acesso diário...');
    try {
      const { data, error } = await supabase.functions.invoke('daily-access');
      if (error) {
        // Não tratar como um erro fatal, apenas logar
        console.warn('⚠️ [AuthContext] Falha ao registrar acesso diário:', error.message);
      } else {
        console.log('✅ [AuthContext] Acesso diário registrado:', data);
      }
    } catch (err: any) {
      console.error('💥 [AuthContext] Erro inesperado ao invocar daily-access:', err.message);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        return { success: false, message: error.message }
      }

      if (data?.user) {
        // Verificar status da assinatura após login
        await checkSubscriptionStatus(data.user.id)
        return { success: true }
      }

      return { success: false, message: 'Erro desconhecido no login' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro interno no login' }
    }
  }

  const signUp = async (email: string, password: string, displayName: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('🔐 [AuthContext] Iniciando cadastro para:', email, 'displayName:', displayName);
      
      // Verificar se o e-mail está autorizado para registro especial
      const { data: specialAuth, error: authError } = await supabase
        .from('special_registrations')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single()

      if (authError || !specialAuth) {
        console.log('❌ [AuthContext] E-mail não autorizado:', email, 'erro:', authError?.message);
        return { 
          success: false, 
          message: 'Este e-mail não está autorizado para registro especial. Entre em contato com o suporte.' 
        }
      }

      console.log('✅ [AuthContext] E-mail autorizado:', specialAuth);
      console.log('📝 [AuthContext] Nome oficial da autorização:', specialAuth.full_name);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName }
        }
      })

      if (error) {
        console.log('❌ [AuthContext] Erro no signUp:', error.message);
        return { success: false, message: error.message }
      }

      console.log('✅ [AuthContext] Usuário criado:', data?.user?.id);

      if (data?.user) {
        // Verificar se o perfil já existe (criado automaticamente pelo Supabase)
        console.log('🔍 [AuthContext] Verificando se perfil já existe para usuário:', data.user.id);
        
        const { data: existingProfile, error: checkError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .maybeSingle();
        
        if (checkError) {
          console.log('⚠️ [AuthContext] Erro ao verificar perfil existente:', checkError.message);
        }
        
        if (existingProfile) {
          console.log('📝 [AuthContext] Perfil já existe, atualizando com dados corretos...');
          
          // Atualizar perfil existente
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              display_name: displayName,           // Nome escolhido pelo usuário
              full_name: specialAuth.full_name,    // Nome oficial da autorização
              subscription_status: 'active',       // Ativar assinatura para usuários autorizados
              plan_type: 'monthly',                // Plano mensal para usuários autorizados
              updated_at: new Date().toISOString()
            })
            .eq('user_id', data.user.id);
          
          if (updateError) {
            console.error('❌ [AuthContext] Erro ao atualizar perfil:', updateError);
          } else {
            console.log('✅ [AuthContext] Perfil atualizado com sucesso');
          }
        } else {
          console.log('📝 [AuthContext] Criando novo perfil para usuário:', data.user.id);
          
          // Criar novo perfil
          const profileData = {
            user_id: data.user.id,
            email: email,
            display_name: displayName,           // Nome escolhido pelo usuário
            full_name: specialAuth.full_name,    // Nome oficial da autorização
            subscription_status: 'active',       // Ativar assinatura para usuários autorizados
            plan_type: 'monthly'                 // Plano mensal para usuários autorizados
          };
          
          console.log('📊 [AuthContext] Dados do perfil:', profileData);
          
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert(profileData);

          if (profileError) {
            console.error('❌ [AuthContext] Erro ao criar perfil:', profileError);
          } else {
            console.log('✅ [AuthContext] Perfil criado com sucesso');
          }
        }

        toast.success('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.')
        return { success: true }
      }

      console.log('❌ [AuthContext] Usuário não foi criado');
      return { success: false, message: 'Erro desconhecido no cadastro' }
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro geral:', error);
      return { success: false, message: error.message || 'Erro interno no cadastro' }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      // Detectar se é desktop (não PWA)
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone === true ||
                    document.referrer.includes('android-app://')
      
      if (!isPWA) {
        // Para desktop, implementar logout robusto
        console.log('[AuthContext] Logout desktop - implementando estratégia robusta')
        
        let logoutSuccess = false
        
        try {
          // Tentar logout normal primeiro
          const { error } = await supabase.auth.signOut()
          if (!error) {
            logoutSuccess = true
            console.log('[AuthContext] Logout normal bem-sucedido')
          } else {
            console.warn('[AuthContext] Logout normal falhou:', error)
          }
        } catch (error) {
          console.warn('[AuthContext] Logout normal falhou com exceção:', error)
        }
        
        // Se logout normal falhou, tentar logout local
        if (!logoutSuccess) {
          try {
            const { error } = await supabase.auth.signOut({ scope: 'local' })
            if (!error) {
              logoutSuccess = true
              console.log('[AuthContext] Logout local bem-sucedido')
            } else {
              console.warn('[AuthContext] Logout local falhou:', error)
            }
          } catch (error) {
            console.warn('[AuthContext] Logout local falhou com exceção:', error)
          }
        }
        
        // Se ambos falharam, fazer limpeza manual completa
        if (!logoutSuccess) {
          console.warn('[AuthContext] Ambos os logouts falharam, executando limpeza manual completa')
          
          // Limpeza manual do estado para desktop
          setUser(null)
          setSession(null)
          setSubscriptionStatus('inactive')
          setPlanType('none')
          
          // Limpar localStorage do Supabase manualmente
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
          if (supabaseUrl) {
            const projectId = supabaseUrl.split('//')[1].split('.')[0]
            localStorage.removeItem(`sb-${projectId}-auth-token`)
            localStorage.removeItem(`sb-${projectId}-auth-token-code-verifier`)
          }
          
          // Limpar todos os itens relacionados ao Supabase
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') && key.includes('auth')) {
              localStorage.removeItem(key)
            }
          })
          
          console.log('[AuthContext] Limpeza manual completa executada')
        }
      } else {
        // Para PWA, manter comportamento original (já funciona perfeitamente)
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Erro ao fazer logout:', error)
        }
      }
      // Removido toast de logout para melhor UX
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Forçar a criação de uma URL de redirecionamento absoluta.
      // Isso garante que o caminho /update-password seja sempre incluído.
      const siteUrl = import.meta.env.VITE_SITE_URL || 'http://192.168.1.181:5174';
      const redirectTo = `${siteUrl}/update-password`;

      console.log(`[AuthContext] Tentando enviar e-mail de reset para ${email} com redirecionamento para ${redirectTo}`);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) {
        console.error('❌ [AuthContext] Erro ao enviar e-mail de reset de senha:', error);
        return { success: false, message: error.message };
      }

      console.log('✅ [AuthContext] E-mail de reset de senha enviado com sucesso.');
      return { success: true };
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro geral ao resetar senha:', error);
      return { success: false, message: error.message || 'Erro interno ao resetar senha' };
    }
  }

  const updatePassword = async (password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro interno ao atualizar senha' }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    subscriptionStatus,
    planType,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
