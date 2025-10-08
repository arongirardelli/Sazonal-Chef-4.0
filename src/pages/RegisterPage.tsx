import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, User, CheckCircle, XCircle } from 'lucide-react'
import { Logo } from '../components/Logo'
import { toast } from 'sonner'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Validação de senha
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }

  const passwordStrength = Object.values(passwordRequirements).filter(Boolean).length
  const isPasswordValid = passwordStrength >= 4 && password === confirmPassword

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#ef4444'
    if (passwordStrength <= 3) return '#f59e0b'
    return '#10b981'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 [RegisterPage] handleSubmit iniciado');
    console.log('📝 [RegisterPage] displayName:', displayName);
    console.log('📧 [RegisterPage] email:', email);
    console.log('🔒 [RegisterPage] password length:', password.length);
    
    if (!displayName || !email || !password || !confirmPassword) {
      console.log('❌ [RegisterPage] Campos vazios detectados');
      toast.error('Por favor, preencha todos os campos', {
        className: 'toast-register-error',
        style: {
          background: 'white',
          color: '#2F2F2F',
          border: '1px solid #E0E0E0',
          borderRadius: '12px',
          padding: '16px 24px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '380px',
          minWidth: '300px',
          margin: '0 auto',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          lineHeight: '1.4',
          letterSpacing: '0.01em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%'
        }
      })
      return
    }

    if (password !== confirmPassword) {
      console.log('❌ [RegisterPage] Senhas não coincidem');
      toast.error('As senhas não coincidem', {
        className: 'toast-register-error',
        style: {
          background: 'white',
          color: '#2F2F2F',
          border: '1px solid #E0E0E0',
          borderRadius: '12px',
          padding: '16px 24px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '380px',
          minWidth: '300px',
          margin: '0 auto',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          lineHeight: '1.4',
          letterSpacing: '0.01em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%'
        }
      })
      return
    }

    if (passwordStrength < 4) {
      console.log('❌ [RegisterPage] Senha não atende aos requisitos');
      toast.error('A senha não atende aos requisitos mínimos', {
        className: 'toast-register-error',
        style: {
          background: 'white',
          color: '#2F2F2F',
          border: '1px solid #E0E0E0',
          borderRadius: '12px',
          padding: '16px 24px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '380px',
          minWidth: '300px',
          margin: '0 auto',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          lineHeight: '1.4',
          letterSpacing: '0.01em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%'
        }
      })
      return
    }

    console.log('✅ [RegisterPage] Validações passaram, chamando signUp...');
    setLoading(true)
    
    try {
      console.log('🚀 [RegisterPage] Chamando signUp com:', { email, password, displayName });
      const result = await signUp(email, password, displayName)
      
      console.log('📊 [RegisterPage] Resultado do signUp:', result);
      
      if (result.success) {
        console.log('✅ [RegisterPage] Cadastro realizado com sucesso!');
        toast.success('Cadastro realizado com sucesso! Faça o login para começar.', {
          className: 'toast-register-success',
          style: {
            background: 'white',
            color: '#2F2F2F',
            border: '1px solid #E0E0E0',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '15px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '380px',
            minWidth: '300px',
            margin: '0 auto',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            lineHeight: '1.4',
            letterSpacing: '0.01em',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%'
          }
        })
        navigate('/login')
      } else {
        console.log('❌ [RegisterPage] Falha no cadastro:', result.message);
        toast.error(result.message || 'Falha no cadastro', {
          className: 'toast-register-error',
          style: {
            background: 'white',
            color: '#2F2F2F',
            border: '1px solid #E0E0E0',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '15px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '380px',
            minWidth: '300px',
            margin: '0 auto',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            lineHeight: '1.4',
            letterSpacing: '0.01em',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%'
          }
        })
      }
    } catch (error) {
      console.error('💥 [RegisterPage] Erro interno:', error);
      toast.error('Erro interno no cadastro', {
        className: 'toast-register-error',
        style: {
          background: 'white',
          color: '#2F2F2F',
          border: '1px solid #E0E0E0',
          borderRadius: '12px',
          padding: '16px 24px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '380px',
          minWidth: '300px',
          margin: '0 auto',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          lineHeight: '1.4',
          letterSpacing: '0.01em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  // CSS inline elegante e profissional
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F5F5DC 0%, #F0E68C 50%, #D2B48C 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      width: '100%',
      maxWidth: '480px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
      padding: '40px',
      transform: 'translateY(0)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'slideIn 0.6s ease-out'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px'
    },
    logo: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #CD853F 0%, #8B4513 100%)',
      borderRadius: '50%',
      marginBottom: '32px',
      boxShadow: '0 8px 24px rgba(205, 133, 63, 0.3)',
      animation: 'pulse 2s infinite'
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#CD853F',
      marginBottom: '12px',
      margin: '0',
      background: 'linear-gradient(135deg, #CD853F 0%, #8B4513 100%)',
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: '#555555',
      fontSize: '18px',
      margin: '0',
      fontWeight: '500'
    },
    form: {
      marginBottom: '40px'
    },
    fieldGroup: {
      marginBottom: '28px'
    },
    label: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '600',
      color: '#2F2F2F',
      marginBottom: '12px',
      transition: 'color 0.2s ease'
    },
    inputContainer: {
      position: 'relative' as const,
      transition: 'transform 0.2s ease'
    },
    input: {
      width: '100%',
      padding: '18px 20px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      boxSizing: 'border-box' as const,
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8fafc'
    },
    inputWithIcon: {
      width: '100%',
      padding: '18px 56px 18px 20px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      boxSizing: 'border-box' as const,
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8fafc'
    },
    inputFocus: {
      border: '2px solid #2C5530',
      backgroundColor: 'white',
      boxShadow: '0 0 0 4px rgba(205, 133, 63, 0.1)',
      transform: 'translateY(-2px)'
    },
    inputError: {
      border: '2px solid #ef4444',
      backgroundColor: 'white',
      boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.1)'
    },
    iconRight: {
      position: 'absolute' as const,
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      padding: '4px',
      borderRadius: '8px'
    },
    iconHover: {
      color: '#8B4513',
      backgroundColor: 'rgba(139, 69, 19, 0.1)'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #CD853F 0%, #8B4513 100%)',
      color: 'white',
      padding: '20px 32px',
      fontSize: '18px',
      fontWeight: '700',
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(205, 133, 63, 0.3)',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(139, 69, 19, 0.4)'
    },
    buttonActive: {
      transform: 'translateY(0)',
      boxShadow: '0 4px 16px rgba(139, 69, 19, 0.3)'
    },
    buttonDisabled: {
      width: '100%',
      backgroundColor: '#94a3b8',
      color: 'white',
      padding: '20px 32px',
      fontSize: '18px',
      fontWeight: '700',
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
    passwordStrength: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    strengthHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px'
    },
    strengthLabel: {
      fontSize: '14px',
      color: '#555555',
      fontWeight: '500'
    },
    strengthValue: {
      fontSize: '14px',
      fontWeight: '600'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '16px'
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'all 0.3s ease'
    },
    requirements: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '8px'
    },
    requirement: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      fontWeight: '500'
    },
    requirementMet: {
      color: '#10b981'
    },
    requirementUnmet: {
      color: '#94a3b8'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '8px',
      fontWeight: '500'
    },
    links: {
      textAlign: 'center' as const
    },
    linkText: {
      fontSize: '16px',
      color: '#555555',
      marginBottom: '20px',
      lineHeight: '1.5'
    },
    link: {
      color: '#CD853F',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      padding: '4px 8px',
      borderRadius: '8px',
      marginLeft: '4px',
      border: '1px solid #000000',
      backgroundColor: 'transparent'
    },
    linkHover: {
      color: '#CD853F',
      backgroundColor: 'rgba(205, 133, 63, 0.1)',
      border: '1px solid #000000'
    },
    backButton: {
      color: '#CD853F',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      padding: '8px 16px',
      borderRadius: '12px',
      border: '2px solid #000000',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px'
    },
    backButtonHover: {
      backgroundColor: '#2C5530',
      color: 'white',
      border: '2px solid #2C5530'
    }
  }

  // Estados para hover effects
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)

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
          <h1 style={styles.title}>Crie sua Conta</h1>
          </div>

          {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.form}>
            {/* Campo de nome */}
          <div style={styles.fieldGroup}>
            <label htmlFor="name" style={styles.label}>
              Como você gostaria que seus cozinheiros te chamassem? 👨‍🍳
            </label>
            <div style={styles.inputContainer}>
              <input
                id="name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder="Chef: Maria, João ou apenas seu nome"
                style={{
                  ...styles.inputWithIcon,
                  ...(nameFocused ? styles.inputFocus : {})
                }}
                required
                title="Por favor, preencha este campo"
              />
              <User 
                size={22} 
                style={{
                  ...styles.iconRight,
                  ...(nameFocused ? styles.iconHover : {})
                }} 
              />
            </div>
            <p style={{
              fontSize: '12px',
              color: '#555555',
              marginTop: '6px',
              fontStyle: 'italic',
              lineHeight: '1.4'
            }}>
              💡 Este nome aparecerá em todo o app para personalizar sua experiência culinária!
            </p>
          </div>

            {/* Campo de e-mail */}
          <div style={styles.fieldGroup}>
            <label htmlFor="email" style={styles.label}>
                E-mail
              </label>
            <div style={styles.inputContainer}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="seu@email.com"
                style={{
                  ...styles.inputWithIcon,
                  ...(emailFocused ? styles.inputFocus : {})
                }}
                required
                title="Por favor, preencha este campo"
                />
              <Mail 
                size={22} 
                style={{
                  ...styles.iconRight,
                  ...(emailFocused ? styles.iconHover : {})
                }} 
              />
            </div>
            </div>

            {/* Campo de senha */}
          <div style={styles.fieldGroup}>
            <label htmlFor="password" style={styles.label}>
                Senha
              </label>
            <div style={styles.inputContainer}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="••••••••"
                style={{
                  ...styles.inputWithIcon,
                  ...(passwordFocused ? styles.inputFocus : {})
                }}
                required
                title="Por favor, preencha este campo"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                style={{
                  ...styles.iconRight,
                  ...(passwordFocused ? styles.iconHover : {})
                }}
                >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {/* Indicador de força da senha */}
              {password && (
              <div style={styles.passwordStrength}>
                <div style={styles.strengthHeader}>
                  <span style={styles.strengthLabel}>Força da senha:</span>
                  <span style={{...styles.strengthValue, color: getPasswordStrengthColor()}}>
                      {passwordStrength <= 2 ? 'Fraca' : passwordStrength <= 3 ? 'Média' : 'Forte'}
                    </span>
                  </div>
                  
                  {/* Barra de progresso */}
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      backgroundColor: getPasswordStrengthColor(),
                      width: `${(passwordStrength / 5) * 100}%`
                    }}
                    />
                  </div>

                  {/* Requisitos da senha */}
                <div style={styles.requirements}>
                  <div style={{...styles.requirement, ...(passwordRequirements.minLength ? styles.requirementMet : styles.requirementUnmet)}}>
                    {passwordRequirements.minLength ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      Mínimo 8 caracteres
                    </div>
                  <div style={{...styles.requirement, ...(passwordRequirements.hasUpperCase ? styles.requirementMet : styles.requirementUnmet)}}>
                    {passwordRequirements.hasUpperCase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      Uma letra maiúscula
                    </div>
                  <div style={{...styles.requirement, ...(passwordRequirements.hasLowerCase ? styles.requirementMet : styles.requirementUnmet)}}>
                    {passwordRequirements.hasLowerCase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      Uma letra minúscula
                    </div>
                  <div style={{...styles.requirement, ...(passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementUnmet)}}>
                    {passwordRequirements.hasNumber ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      Um número
                    </div>
                  <div style={{...styles.requirement, ...(passwordRequirements.hasSpecialChar ? styles.requirementMet : styles.requirementUnmet)}}>
                    {passwordRequirements.hasSpecialChar ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      Um caractere especial
                  </div>
                  </div>
                </div>
              )}
            </div>

            {/* Campo de confirmar senha */}
          <div style={styles.fieldGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
                Confirmar Senha
              </label>
            <div style={styles.inputContainer}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                placeholder="••••••••"
                style={{
                  ...styles.inputWithIcon,
                  ...(confirmPasswordFocused ? styles.inputFocus : {}),
                  ...(confirmPassword && password !== confirmPassword ? styles.inputError : {})
                }}
                required
                title="Por favor, preencha este campo"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  ...styles.iconRight,
                  ...(confirmPasswordFocused ? styles.iconHover : {})
                }}
                >
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              
              {confirmPassword && password !== confirmPassword && (
              <p style={styles.errorText}>As senhas não coincidem</p>
              )}
            </div>

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            onMouseDown={() => setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
            style={{
              ...(loading || !isPasswordValid ? styles.buttonDisabled : styles.button),
              ...(buttonHovered && !loading && isPasswordValid ? styles.buttonHover : {}),
              ...(buttonPressed && !loading && isPasswordValid ? styles.buttonActive : {})
            }}
          >
            <div style={styles.buttonContent}>
              {loading && <div style={styles.spinner} />}
              <span>{loading ? 'Criando conta...' : 'Confirmar Cadastro'}</span>
            </div>
            </button>
          </form>

          {/* Links de navegação */}
        <div style={styles.links}>
          <div style={styles.linkText}>
              Já tem uma conta?{' '}
              <button
                onClick={() => navigate('/login')}
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = styles.linkHover.color
                e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = styles.link.color
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              >
                Faça login
              </button>
          </div>

            <button
              onClick={() => navigate('/login')}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = styles.backButtonHover.backgroundColor
              e.currentTarget.style.border = styles.backButtonHover.border
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = styles.backButton.backgroundColor
              e.currentTarget.style.border = styles.backButton.border
            }}
            >
              ← Voltar ao login
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
          .register-card {
            padding: 24px;
            margin: 16px;
          }
          
          .register-title {
            font-size: 28px;
          }
          
          .register-input {
            padding: 16px 52px 16px 16px;
          }
        }
      `}</style>
    </div>
  )
}
