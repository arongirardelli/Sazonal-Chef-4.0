import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, ChefHat } from 'lucide-react'
import { toast } from 'sonner'

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
      background: 'linear-gradient(135deg, #2C5530 0%, #1e3a22 100%)',
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
      color: '#2C5530',
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
      color: '#2C5530',
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
      color: '#1f2937',
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
      color: '#1f2937',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    inputFocus: {
      border: '2px solid #2C5530',
      background: '#ffffff',
      boxShadow: '0 0 0 4px rgba(44, 85, 48, 0.1)',
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
      background: 'linear-gradient(135deg, #2C5530 0%, #1e3a22 100%)',
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
      color: '#D35400',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      padding: '8px 16px',
      borderRadius: '8px'
    },
    linkHover: {
      color: '#B7410E',
      backgroundColor: 'rgba(211, 84, 0, 0.1)'
    },
    backButton: {
      background: 'transparent',
      border: '2px solid #2C5530',
      color: '#2C5530',
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
      backgroundColor: '#2C5530',
      border: '2px solid #2C5530',
      color: 'white'
    }
  }), [])

  const [buttonHovered, setButtonHovered] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Por favor, insira seu e-mail')
      return
    }

    setLoading(true)
    
    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSubmitted(true)
        toast.success('Link de recuperação enviado com sucesso!')
      } else {
        toast.error(result.message || 'Falha ao enviar link de recuperação')
      }
    } catch (error) {
      toast.error('Erro interno ao processar solicitação')
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
          <div style={styles.logo}>
            <ChefHat size={40} color="white" />
          </div>
          <h1 style={styles.title}>Esqueceu sua senha?</h1>
          <p style={styles.subtitle}>
            Sem problemas!<br />
            Enviaremos um link para seu e-mail
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
              e.currentTarget.style.border = '2px solid #2C5530'
              e.currentTarget.style.color = '#2C5530'
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
