import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppPreferences, type ThemeType, type FontSizeType } from '../contexts/AppPreferencesContext'
import { toast } from 'sonner'
import { BottomNav } from '../components/BottomNav'
import { supabase } from '@/integrations/supabase'
import { Eye, EyeOff, ArrowLeft, Settings, Palette, Shield, Trash2, Moon, Sun, Type, Lock, Sparkles } from 'lucide-react'

export default function Preferences() {
  const navigate = useNavigate()
  const { theme, fontSize, setTheme, setFontSize, colors, fontSizes } = useAppPreferences()
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false)
  
  // State for password management
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleThemeToggle = () => {
    const newTheme: ThemeType = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    toast.success(`Modo ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`)
  }

  const handleFontSizeChange = (size: FontSizeType) => {
    setFontSize(size)
    const sizeLabels = {
      small: 'Pequeno',
      medium: 'Médio',
      large: 'Grande'
    }
    toast.success(`Tamanho da fonte alterado para ${sizeLabels[size]}!`)
  }

  const handleClearCache = () => {
    setShowClearCacheConfirm(false)
    // Simula limpeza de cache (apenas visual)
    toast.success('Cache limpo com sucesso!')
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.functions.invoke('set-password', {
        body: { newPassword },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Senha atualizada com sucesso!');
      setPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (error: any) {
      console.error('Erro ao invocar a função set-password:', error);
      toast.error(`Falha ao atualizar a senha: ${error.message}`);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
              onClick={() => navigate(-1)}
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
              <Settings size={24} color="white" />
              <h1 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '24px',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Preferências
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
            
            {/* Seção Aparência */}
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
                  <Palette size={24} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: colors.primary, 
                    fontSize: '20px',
                    fontWeight: 700
                  }}>
                    Aparência
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    fontSize: '14px' 
                  }}>
                    Personalize a aparência do aplicativo
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 20 }}>
                {/* Toggle Tema */}
                <PreferenceItem
                  icon={theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  title="Modo Escuro"
                  description="Alternar entre tema claro e escuro"
                  action={
                    <button
                      onClick={handleThemeToggle}
                      style={{
                        width: 52,
                        height: 28,
                        borderRadius: 14,
                        background: theme === 'dark' ? colors.primary : '#e5e7eb',
                        border: 'none',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        boxShadow: theme === 'dark' ? '0 2px 8px rgba(44,85,48,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = theme === 'dark' 
                          ? '0 4px 12px rgba(44,85,48,0.4)' 
                          : '0 2px 6px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = theme === 'dark' 
                          ? '0 2px 8px rgba(44,85,48,0.3)' 
                          : '0 1px 3px rgba(0,0,0,0.1)';
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: 3,
                        left: theme === 'dark' ? 28 : 3,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'left 0.3s ease, transform 0.3s ease',
                        transform: theme === 'dark' ? 'scale(1.1)' : 'scale(1)'
                      }} />
                    </button>
                  }
                  colors={colors}
                />

                {/* Tamanho da Fonte */}
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    marginBottom: 16
                  }}>
                    <Type size={20} color={colors.primary} />
                    <div>
                      <div style={{ 
                        fontSize: '16px',
                        fontWeight: 700,
                        color: colors.text,
                        marginBottom: 4
                      }}>
                        Tamanho da Fonte
                      </div>
                      <div style={{ 
                        fontSize: '14px',
                        color: colors.textSecondary
                      }}>
                        Ajuste o tamanho do texto para melhor legibilidade
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: 12,
                    flexWrap: 'wrap'
                  }}>
                    {(['small', 'medium', 'large'] as FontSizeType[]).map((size) => {
                      const labels = {
                        small: 'Pequeno',
                        medium: 'Médio', 
                        large: 'Grande'
                      }
                      
                      const isSelected = fontSize === size
                      
                      return (
                        <button
                          key={size}
                          onClick={() => handleFontSizeChange(size)}
                          style={{
                            padding: '12px 20px',
                            borderRadius: 16,
                            border: `2px solid ${isSelected ? colors.primary : 'rgba(44,85,48,0.1)'}`,
                            background: isSelected ? colors.primary : 'white',
                            color: isSelected ? 'white' : colors.text,
                            fontSize: '14px',
                            fontWeight: isSelected ? 700 : 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minWidth: '80px',
                            boxShadow: isSelected ? '0 4px 16px rgba(44,85,48,0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                              e.currentTarget.style.borderColor = colors.primary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                              e.currentTarget.style.borderColor = 'rgba(44,85,48,0.1)';
                            }
                          }}
                        >
                          {labels[size]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Segurança */}
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
                  <Shield size={24} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: colors.primary, 
                    fontSize: '20px',
                    fontWeight: 700
                  }}>
                    Segurança
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    fontSize: '14px' 
                  }}>
                    Gerencie a segurança da sua conta
                  </p>
                </div>
              </div>

              <PreferenceItem
                icon={<Lock size={20} />}
                title="Alterar Senha"
                description="Defina uma nova senha para sua conta"
                action={
                  <button
                    onClick={() => setPasswordDialogOpen(true)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 16,
                      border: `2px solid ${colors.primary}`,
                      background: colors.primary,
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(44,85,48,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,85,48,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,85,48,0.3)';
                    }}
                  >
                    Alterar
                  </button>
                }
                colors={colors}
              />
            </div>

            {/* Seção Sistema */}
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
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: colors.primary, 
                    fontSize: '20px',
                    fontWeight: 700
                  }}>
                    Sistema
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    fontSize: '14px' 
                  }}>
                    Configurações do sistema e manutenção
                  </p>
                </div>
              </div>

              <PreferenceItem
                icon={<Trash2 size={20} />}
                title="Limpar Cache"
                description="Remove dados temporários do aplicativo"
                action={
                  <button
                    onClick={() => setShowClearCacheConfirm(true)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 16,
                      border: `2px solid #dc2626`,
                      background: 'white',
                      color: '#dc2626',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
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
                    Limpar
                  </button>
                }
                colors={colors}
              />
            </div>
          </div>
        </div>

      {/* Modal de Confirmação para Limpar Cache */}
      {showClearCacheConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: colors.surface,
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '12px',
              color: colors.text
            }}>
              Confirmar Limpeza
            </h3>
            <p style={{
                fontSize: '16px',
              color: colors.textSecondary,
              marginBottom: '20px',
              lineHeight: 1.5
            }}>
              Tem certeza que deseja limpar o cache? Esta ação irá remover dados temporários do aplicativo.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowClearCacheConfirm(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  color: colors.text,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleClearCache}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: colors.secondary,
                  color: colors.surface,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Dialog */}
      {isPasswordDialogOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: colors.surface, padding: 24, borderRadius: 12, width: '90%', maxWidth: 400, border: `1px solid ${colors.border}` }}>
            <h2 style={{ marginTop: 0, color: colors.primary, fontSize: fontSizes.lg }}>Defina sua Nova Senha</h2>
            <form onSubmit={handlePasswordUpdate} style={{ display: 'grid', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Nova Senha (mín. 8 caracteres)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <input 
                type="password"
                placeholder="Confirmar Nova Senha"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${colors.border}`, boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setPasswordDialogOpen(false)} style={{ padding:'10px 14px', borderRadius:8, border:`1px solid ${colors.border}`, background: colors.surface, color: colors.text, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={isUpdatingPassword} style={{ padding:'10px 14px', borderRadius:8, border:'none', background: colors.primary, color: colors.surface, cursor: 'pointer', opacity: isUpdatingPassword ? 0.7 : 1 }}>
                  {isUpdatingPassword ? 'Salvando...' : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        <BottomNav />
      </div>
    </>
  )
}

interface PreferenceItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  colors: any;
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ 
  icon, 
  title, 
  description, 
  action, 
  colors 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '16px',
      borderRadius: 16,
      background: 'transparent',
      border: '1px solid rgba(44,85,48,0.1)',
      transition: 'all 0.3s ease'
    }}>
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
          transition: 'all 0.3s ease',
          border: `2px solid ${colors.primary}20`
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
      {action}
    </div>
  )
}
