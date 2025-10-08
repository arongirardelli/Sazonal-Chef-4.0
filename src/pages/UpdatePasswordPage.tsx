import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Logo } from '../components/Logo'
import { toast } from 'sonner'

export const UpdatePasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { updatePassword, session } = useAuth()
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPasswordFocused, setNewPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  

  // CSS inline elegante e profissional
  const styles = useMemo(() => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(135deg, #F5F0E5 0%, #E8E0D0 100%)',
      fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
    },
    card: {
      width: '100%',
      maxWidth: '480px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(44, 85, 48, 0.15), 0 8px 32px rgba(0, 0, 0, 0.08)',
      padding: '40px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'slideIn 0.6s ease-out'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px'
    },
    logo: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #D35400 0%, #B7410E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px auto',
      boxShadow: '0 12px 32px rgba(44, 85, 48, 0.4)',
      animation: 'pulse 2s infinite'
    },
    title: {
      fontSize: '32px',
      fontWeight: 800,
      color: '#D35400',
      margin: '0 0 12px 0',
      lineHeight: '1.2'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '16px',
      lineHeight: '1.6',
      margin: 0
    },
    form: {
      display: 'grid',
      gap: '24px'
    },
    fieldGroup: {
      display: 'grid',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#D35400',
      marginBottom: '4px'
    },
    inputContainer: {
      position: 'relative' as const
    },
    input: {
      width: '100%',
      padding: '16px 48px 16px 16px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      background: '#f8fafc',
      color: '#1f2937',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    inputFocus: {
      border: '2px solid #D35400',
      background: '#ffffff',
      boxShadow: '0 0 0 4px rgba(211, 84, 0, 0.1)',
      transform: 'translateY(-2px)'
    },
    iconRight: {
      position: 'absolute' as const,
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      padding: '4px'
    },
    iconHover: {
      color: '#D35400',
      backgroundColor: 'rgba(211, 84, 0, 0.1)',
      borderRadius: '4px'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #D35400 0%, #B7410E 100%)',
      color: 'white',
      padding: '18px 32px',
      fontSize: '18px',
      fontWeight: 700,
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(44, 85, 48, 0.3)',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(44, 85, 48, 0.4)'
    },
    buttonActive: {
      transform: 'translateY(0)',
      boxShadow: '0 4px 16px rgba(44, 85, 48, 0.3)'
    },
    buttonDisabled: {
      width: '100%',
      backgroundColor: '#94a3b8',
      color: 'white',
      padding: '18px 32px',
      fontSize: '18px',
      fontWeight: 700,
      border: 'none',
      borderRadius: '16px',
      cursor: 'not-allowed',
      transition: 'all 0.3s ease'
    },
    buttonContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    passwordRequirements: {
      marginTop: '8px',
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    requirementTitle: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#64748b',
      marginBottom: '8px'
    },
    requirementList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: '4px'
    },
    requirementItem: {
      fontSize: '11px',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    requirementMet: {
      color: '#059669'
    },
    requirementUnmet: {
      color: '#dc2626'
    },
    backButton: {
      background: 'transparent',
      border: '1px solid #e2e8f0',
      color: '#64748b',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      padding: '12px 20px',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      margin: '0 auto'
    },
    backButtonHover: {
      backgroundColor: '#f1f5f9',
      border: '1px solid #cbd5e1',
      color: '#475569'
    }
  }), [])

  const [buttonHovered, setButtonHovered] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)

  // Validação de senha
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  }

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)
  const passwordsMatch = newPassword === confirmPassword
  const canSubmit = isPasswordValid && passwordsMatch && newPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error('Sessão inválida ou expirada. Por favor, solicite um novo link para redefinir sua senha.');
      return;
    }
    
    if (!canSubmit) {
      toast.error('Por favor, verifique os requisitos da senha e confirme que as senhas coincidem')
      return
    }

    setLoading(true)
    
    try {
      const result = await updatePassword(newPassword)
      
      if (result.success) {
        setSuccess(true)
        toast.success('Senha atualizada com sucesso!')
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        toast.error(result.message || 'Falha ao atualizar senha. A sessão pode ter expirado.')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro interno ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <CheckCircle size={40} color="white" />
            </div>
            <h1 style={styles.title}>Senha Atualizada!</h1>
            <p style={styles.subtitle}>
              Sua nova senha foi configurada com sucesso. 
              Você será redirecionado para a página de login em alguns segundos.
            </p>
          </div>

          <div style={{ textAlign: 'center' as const }}>
            <button
              onClick={() => navigate('/login')}
              style={styles.button}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              onMouseDown={() => setButtonPressed(true)}
              onMouseUp={() => setButtonPressed(false)}
            >
              Ir para Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.card,
          transform: buttonHovered ? 'translateY(-4px)' : 'translateY(0)'
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <Logo size={80} />
          <h1 style={styles.title}>Crie sua nova senha</h1>
          <p style={styles.subtitle}>
            Escolha uma senha forte e segura para proteger sua conta.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Campo de nova senha */}
          <div style={styles.fieldGroup}>
            <label htmlFor="newPassword" style={styles.label}>
              Nova Senha
            </label>
            <div style={styles.inputContainer}>
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setNewPasswordFocused(true)}
                onBlur={() => setNewPasswordFocused(false)}
                placeholder="Digite sua nova senha"
                style={{
                  ...styles.input,
                  ...(newPasswordFocused ? styles.inputFocus : {})
                }}
                required
              />
              <div
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  ...styles.iconRight,
                  ...(newPasswordFocused ? styles.iconHover : {})
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = styles.iconHover.color
                  e.currentTarget.style.backgroundColor = styles.iconHover.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = styles.iconRight.color
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {/* Campo de confirmação de senha */}
          <div style={styles.fieldGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirmar Nova Senha
            </label>
            <div style={styles.inputContainer}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                placeholder="Confirme sua nova senha"
                style={{
                  ...styles.input,
                  ...(confirmPasswordFocused ? styles.inputFocus : {})
                }}
                required
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  ...styles.iconRight,
                  ...(confirmPasswordFocused ? styles.iconHover : {})
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = styles.iconHover.color
                  e.currentTarget.style.backgroundColor = styles.iconHover.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = styles.iconRight.color
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {/* Requisitos da senha */}
          {newPassword.length > 0 && (
            <div style={styles.passwordRequirements}>
              <div style={styles.requirementTitle}>Requisitos da senha:</div>
              <ul style={styles.requirementList}>
                <li style={{
                  ...styles.requirementItem,
                  ...(passwordRequirements.minLength ? styles.requirementMet : styles.requirementUnmet)
                }}>
                  {passwordRequirements.minLength ? '✓' : '✗'} Mínimo de 8 caracteres
                </li>
                <li style={{
                  ...styles.requirementItem,
                  ...(passwordRequirements.hasUppercase ? styles.requirementMet : styles.requirementUnmet)
                }}>
                  {passwordRequirements.hasUppercase ? '✓' : '✗'} Pelo menos uma letra maiúscula
                </li>
                <li style={{
                  ...styles.requirementItem,
                  ...(passwordRequirements.hasLowercase ? styles.requirementMet : styles.requirementUnmet)
                }}>
                  {passwordRequirements.hasLowercase ? '✓' : '✗'} Pelo menos uma letra minúscula
                </li>
                <li style={{
                  ...styles.requirementItem,
                  ...(passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementUnmet)
                }}>
                  {passwordRequirements.hasNumber ? '✓' : '✗'} Pelo menos um número
                </li>
                <li style={{
                  ...styles.requirementItem,
                  ...(passwordRequirements.hasSpecialChar ? styles.requirementMet : styles.requirementUnmet)
                }}>
                  {passwordRequirements.hasSpecialChar ? '✓' : '✗'} Pelo menos um caractere especial
                </li>
              </ul>
            </div>
          )}

          {/* Validação de confirmação */}
          {confirmPassword.length > 0 && newPassword.length > 0 && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              color: passwordsMatch ? '#059669' : '#dc2626',
              background: passwordsMatch ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${passwordsMatch ? '#bbf7d0' : '#fecaca'}`
            }}>
              {passwordsMatch ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
            </div>
          )}

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={loading || !canSubmit || !session}
            style={{
              ...(loading || !canSubmit || !session ? styles.buttonDisabled : styles.button),
              ...(buttonHovered && !loading && canSubmit && session ? styles.buttonHover : {}),
              ...(buttonPressed && !loading && canSubmit && session ? styles.buttonActive : {})
            }}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            onMouseDown={() => setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
          >
            <div style={styles.buttonContent}>
              {loading && <div style={styles.spinner} />}
              <span>{loading ? 'Salvando...' : (session ? 'Salvar Nova Senha' : 'Aguardando sessão...')}</span>
            </div>
          </button>
        </form>

        {/* Botão de voltar */}
        <div style={{ marginTop: '24px', textAlign: 'center' as const }}>
          <button
            onClick={() => navigate('/forgot-password')}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = styles.backButtonHover.backgroundColor
              e.currentTarget.style.border = styles.backButtonHover.border
              e.currentTarget.style.color = styles.backButtonHover.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.border = '1px solid #e2e8f0'
              e.currentTarget.style.color = '#64748b'
            }}
          >
            ← Voltar ao esqueci a senha
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes spin {
          from {
            transform: translateY(-50%) rotate(0deg);
          }
          to {
            transform: translateY(-50%) rotate(360deg);
          }
        }
        
        @media (max-width: 480px) {
          .update-password-card {
            padding: 24px;
            margin: 16px;
          }
          
          .update-password-title {
            font-size: 28px;
          }
          
          .update-password-input {
            padding: 16px 52px 16px 16px;
          }
        }
      `}</style>
    </div>
  )
}
