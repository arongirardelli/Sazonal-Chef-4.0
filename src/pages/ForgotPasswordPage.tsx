import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Mail } from 'lucide-react'
import { Logo } from '../components/Logo'
import { toast } from 'sonner'
import { toastStyles } from '../lib/toastStyles'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

  // CSS inline elegante e profissional
  const styles = useMemo(() => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(135deg, #F5F5DC 0%, #F0E68C 100%)',
      fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
    },
    card: {
      width: '100%',
      maxWidth: '480px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(139, 69, 19, 0.15), 0 8px 32px rgba(0, 0, 0, 0.08)',
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
      background: 'linear-gradient(135deg, #CD853F 0%, #8B4513 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px auto',
      boxShadow: '0 12px 32px rgba(139, 69, 19, 0.4)',
      animation: 'pulse 2s infinite'
    },
    title: {
      fontSize: '32px',
      fontWeight: 800,
      color: '#CD853F',
      margin: '0 0 12px 0',
      lineHeight: '1.2'
    },
    subtitle: {
      color: '#555555',
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
      color: '#8B4513',
      marginBottom: '4px'
    },
    inputContainer: {
      position: 'relative' as const
    },
    input: {
      width: '100%',
      padding: '16px 16px 16px 16px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      background: '#f8fafc',
      color: '#2F2F2F',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    inputWithIcon: {
      width: '100%',
      padding: '16px 48px 16px 16px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      background: '#f8fafc',
      color: '#2F2F2F',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    inputFocus: {
      border: '2px solid #CD853F',
      background: '#ffffff',
      boxShadow: '0 0 0 4px rgba(205, 133, 63, 0.1)',
      transform: 'translateY(-2px)'
    },
    iconRight: {
      position: 'absolute' as const,
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      transition: 'all 0.3s ease'
    },
    iconHover: {
      color: '#2C5530'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #CD853F 0%, #8B4513 100%)',
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
    links: {
      marginTop: '24px',
      textAlign: 'center' as const,
      display: 'grid',
      gap: '16px'
    },
    linkText: {
      fontSize: '14px',
      color: '#64748b'
    },
    link: {
      background: 'transparent',
      border: 'none',
      color: '#CD853F',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      padding: '8px 16px',
      borderRadius: '8px'
    },
    linkHover: {
      color: '#CD853F',
      backgroundColor: 'rgba(205, 133, 63, 0.1)'
    },
    backButton: {
      background: 'transparent',
      border: '2px solid #CD853F',
      color: '#CD853F',
      fontSize: '14px',
      fontWeight: 600,
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
      backgroundColor: '#CD853F',
      border: '2px solid #CD853F',
      color: 'white'
    }
  }), [])

  const [buttonHovered, setButtonHovered] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Por favor, insira seu e-mail', {
        className: 'toast-forgot-password-error',
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

    setLoading(true)
    
    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSubmitted(true)
      } else {
        toast.error(result.message || 'Falha ao enviar link de recuperação', {
          className: 'toast-forgot-password-error',
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
      toast.error('Erro interno ao processar solicitação', {
        className: 'toast-forgot-password-error',
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

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <Mail size={32} color="white" />
            </div>
            <h1 style={styles.title}>E-mail Enviado!</h1>
            <p style={styles.subtitle}>
              Se houver uma conta com este e-mail, um link de recuperação foi enviado. 
              Verifique sua caixa de entrada e spam.
            </p>
          </div>

          <div style={styles.links}>
            <button
              onClick={() => navigate('/login')}
              style={styles.button}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              onMouseDown={() => setButtonPressed(true)}
              onMouseUp={() => setButtonPressed(false)}
            >
              Voltar ao Login
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
          <h1 style={styles.title}>Esqueceu sua senha?</h1>
          <p style={styles.subtitle}>
            Sem problemas!<br />
            Enviaremos um link para seu<br />
            e-mail
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Campo de e-mail */}
          <div style={styles.fieldGroup}>
            <label htmlFor="email" style={styles.label}>
              E-mail da conta
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

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...(loading || !email ? styles.buttonDisabled : styles.button),
              ...(buttonHovered && !loading && email ? styles.buttonHover : {}),
              ...(buttonPressed && !loading && email ? styles.buttonActive : {})
            }}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            onMouseDown={() => setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
          >
            <div style={styles.buttonContent}>
              {loading && <div style={styles.spinner} />}
              <span>{loading ? 'Enviando...' : 'Enviar Link de Recuperação'}</span>
            </div>
          </button>
        </form>

        {/* Links de navegação */}
        <div style={styles.links}>
          <div style={styles.linkText}>
            Lembrou sua senha?{' '}
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
          
          <div style={styles.linkText}>
            Não tem uma conta?{' '}
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

          {/* Botão de voltar */}
          <button
            onClick={() => navigate('/login')}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = styles.backButtonHover.backgroundColor
              e.currentTarget.style.border = styles.backButtonHover.border
              e.currentTarget.style.color = styles.backButtonHover.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.border = '2px solid #D35400'
              e.currentTarget.style.color = '#D35400'
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
          .forgot-password-card {
            padding: 24px;
            margin: 16px;
          }
          
          .forgot-password-title {
            font-size: 28px;
          }
          
          .forgot-password-input {
            padding: 16px 52px 16px 16px;
          }
        }
      `}</style>
    </div>
  )
}
