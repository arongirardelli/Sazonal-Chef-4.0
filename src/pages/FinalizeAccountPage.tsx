import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Logo } from '../components/Logo'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase'

const FinalizeAccountPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)

  useEffect(() => {
    const captureSessionData = async () => {
      setLoading(true)
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (session?.user) {
          setCurrentEmail(session.user.email || null)
        } else {
          toast.error("Sessão inválida. Por favor, faça o login novamente.")
          navigate('/login')
        }
      } catch (error: any) {
        console.error('Erro ao buscar sessão:', error.message)
        toast.error('Não foi possível verificar sua sessão. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    captureSessionData()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim()) {
      toast.error('Por favor, informe como devemos te chamar.')
      return
    }
    if (password.length < 8) {
      toast.error('Sua senha precisa ter no mínimo 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem. Verifique por favor.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.functions.invoke('set-password', {
        body: {
          newPassword: password,
          displayName: displayName.trim(),
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      console.log('✅ [FinalizeAccountPage] Perfil e senha atualizados com sucesso.');
      toast.success(`Bem-vindo(a), ${displayName.trim()}! Sua cozinha está pronta!`);
      navigate('/inicio') // Redireciona para a Home

    } catch (err: any) {
      console.error('💥 [FinalizeAccountPage] Erro ao finalizar o cadastro:', err)
      toast.error(`Houve um erro ao finalizar seu cadastro: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Styles (mantidos para consistência visual)
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#F5F0E5'
    },
    card: {
      width: '100%',
      maxWidth: '560px',
      background: '#FFFFFF',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      padding: '32px',
      animation: 'slideIn 400ms ease',
    },
    header: { textAlign: 'center' as const, marginBottom: '16px' },
    logo: {
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      backgroundColor: '#D35400',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px auto',
      boxShadow: '0 8px 24px rgba(211,84,0,0.35)'
    },
    title: { fontSize: '28px', fontWeight: 800, color: '#D35400', margin: '0 0 8px 0' },
    subtitle: { color: '#64748b', margin: 0 },
    emailInfo: { marginTop: '10px', color: '#6b7280', fontSize: '14px' },
    form: { display: 'grid', gap: '16px', marginTop: '18px' },
    field: { display: 'grid', gap: '8px' },
    label: { fontWeight: 700, color: '#D35400', fontSize: '14px' },
    inputWrapper: { position: 'relative' as const },
    input: {
      width: '100%',
      padding: '14px 48px 14px 14px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      background: '#f8fafc',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontSize: '16px',
      boxSizing: 'border-box' as const
    },
    inputFocus: {
      background: '#fff',
      border: '1px solid #D35400',
      boxShadow: '0 0 0 3px rgba(211,84,0,0.15)'
    },
    eyeIcon: {
        position: 'absolute' as const,
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#94a3b8'
    },
    helpText: { fontSize: '12px', color: '#64748b', fontStyle: 'italic' },
    button: {
      marginTop: '8px',
      width: '100%',
      background: '#D35400',
      color: '#fff',
      padding: '16px 20px',
      borderRadius: '14px',
      border: 'none',
      fontWeight: 800,
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 10px 24px rgba(44,85,48,0.30)'
    },
    buttonDisabled: {
      background: '#94a3b8',
      cursor: 'not-allowed' as const,
      boxShadow: 'none'
    }
  }

  const [nameFocused, setNameFocused] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)
  const [confirmPwFocused, setConfirmPwFocused] = useState(false)

  if (loading && !currentEmail) {
    return <div>Carregando...</div> // Ou um spinner mais elegante
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Logo size={80} />
          <h1 style={styles.title}>Quase lá, Chef!</h1>
          <p style={styles.subtitle}>Só mais um passo para começar sua jornada culinária.</p>
          {currentEmail && (
            <p style={styles.emailInfo}>Finalizando o cadastro para: <strong>{currentEmail}</strong></p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>Como você gostaria de ser chamado? 🤠</label>
            <div style={styles.inputWrapper}>
              <input
                id="name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder="Ex: Chef João, Maria..."
                style={{ ...styles.input, paddingRight: '16px', ...(nameFocused ? styles.inputFocus : {}) }}
                required
              />
            </div>
            <span style={styles.helpText}>Este nome aparecerá para personalizar sua experiência.</span>
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Crie sua senha de acesso 🔑</label>
            <div style={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
                placeholder="Mínimo de 8 caracteres"
                style={{ ...styles.input, ...(pwFocused ? styles.inputFocus : {}) }}
                required
              />
              <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div style={styles.field}>
            <label htmlFor="confirm-password" style={styles.label}>Confirme sua senha</label>
            <div style={styles.inputWrapper}>
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPwFocused(true)}
                onBlur={() => setConfirmPwFocused(false)}
                placeholder="Repita a senha"
                style={{ ...styles.input, ...(confirmPwFocused ? styles.inputFocus : {}) }}
                required
              />
              <div style={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}>
            {loading ? 'Salvando...' : 'Salvar e Entrar na Cozinha'}
          </button>
        </form>

        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(12px) }
            to { opacity: 1; transform: translateY(0) }
          }
        `}</style>
      </div>
    </div>
  )
}

export default FinalizeAccountPage
