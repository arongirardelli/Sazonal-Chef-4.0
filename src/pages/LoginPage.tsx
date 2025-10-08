import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { Logo } from '../components/Logo'
import { toast } from 'sonner'
import { toastStyles } from '../lib/toastStyles'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/inicio'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos', {
        className: 'toast-login-error',
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
          justifyContent: 'center'
        }
      });
      return
    }

    setLoading(true)
    
    try {
      const result = await signIn(email, password)
      
      if (result.success) {
        toast('❤️ Login realizado com sucesso!', {
          style: toastStyles.success
        });
        navigate(from)
      } else {
        toast.error('Credenciais inválidas', {
          className: 'toast-login-error',
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
            justifyContent: 'center'
          }
        });
      }
    } catch (error) {
      toast.error('Erro interno no login', {
        className: 'toast-login-error',
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
          justifyContent: 'center'
        }
      });
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
      maxWidth: '420px',
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
      margin: '0'
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
      border: '2px solid #CD853F',
      backgroundColor: 'white',
      boxShadow: '0 0 0 4px rgba(205, 133, 63, 0.1)',
      transform: 'translateY(-2px)'
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
      marginLeft: '4px'
    },
    linkHover: {
      color: '#CD853F',
      backgroundColor: 'rgba(205, 133, 63, 0.1)'
    }
  }

  // Estados para hover effects
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
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
          <h1 style={styles.title}>Olá, Chef!</h1>
          <p style={styles.subtitle}>Bem-vindo(a) de volta ao Sazonal Chef</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.form}>
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
                placeholder="Digite seu e-mail"
                style={{
                  ...styles.inputWithIcon,
                  ...(emailFocused ? styles.inputFocus : {})
                }}
                required
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
                placeholder="Digite sua senha"
                style={{
                  ...styles.inputWithIcon,
                  ...(passwordFocused ? styles.inputFocus : {})
                }}
                required
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
          </div>

          {/* Botão de login */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            onMouseDown={() => setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
            style={{
              ...(loading ? styles.buttonDisabled : styles.button),
              ...(buttonHovered && !loading ? styles.buttonHover : {}),
              ...(buttonPressed && !loading ? styles.buttonActive : {})
            }}
          >
            <div style={styles.buttonContent}>
              {loading && <div style={styles.spinner} />}
              <span>{loading ? 'Entrando...' : 'Entrar na Cozinha'}</span>
            </div>
          </button>
        </form>

        {/* Links de navegação */}
        <div style={styles.links}>
          <div style={styles.linkText}>
            Ainda não tem uma conta?{' '}
            <button
              onClick={() => navigate('/register')}
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
              Cadastre-se
            </button>
          </div>
          
          <button
            onClick={() => navigate('/forgot-password')}
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
            Esqueci minha senha
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
          .login-card {
            padding: 24px;
            margin: 16px;
          }
          
          .login-title {
            font-size: 28px;
          }
          
          .login-input {
            padding: 16px 52px 16px 16px;
          }
        }
      `}</style>
    </div>
  )
}
