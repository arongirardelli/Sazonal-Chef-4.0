import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase'
import { toast } from 'sonner'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('arongirardelli@gmail.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)

  async function signIn() {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data?.user) {
        toast.success('Login realizado!')
        navigate('/menu')
      }
    } catch (e: any) {
      toast.error(`Falha no login: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <h1 style={{ color: '#2C5530' }}>Entrar</h1>
      <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>E-mail</div>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="seu@email.com" type="email" style={{ width:'100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
          </label>
          <label>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>Senha</div>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••" type="password" style={{ width:'100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
          </label>
          <button onClick={signIn} disabled={loading} style={{ background:'#2C5530', color:'#fff', padding:'10px 12px', borderRadius:6, border:'none', cursor:'pointer', opacity: loading ? .6 : 1 }}>Entrar</button>
          <button onClick={()=>navigate('/menu')} style={{ background:'#fff', color:'#2C5530', padding:'8px 12px', borderRadius:6, border:'1px solid #2C5530', cursor:'pointer' }}>Voltar</button>
        </div>
      </div>
    </div>
  )
}


