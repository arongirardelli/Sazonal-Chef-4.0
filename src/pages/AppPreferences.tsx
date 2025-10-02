import { BottomNav } from '@/components/BottomNav'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AppPreferences: React.FC = () => {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [push, setPush] = useState(true)

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#F5F0E5', fontFamily:'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif' }}>
      <div style={{ position:'sticky', top:0, background:'#1f2d1a', color:'#fff', zIndex:50 }}>
        <div style={{ maxWidth:1080, margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={()=>navigate(-1)} style={{ background:'transparent', border:'none', color:'#fff', fontSize:18, cursor:'pointer' }}>←</button>
          <div style={{ fontSize:18, fontWeight:800 }}>Preferências do Aplicativo</div>
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ maxWidth:1080, margin:'0 auto', padding:16, display:'grid', gap:16 }}>
          <section style={{ background:'#fff', borderRadius:12, padding:16, border:'1px solid #eee' }}>
            <h2 style={{ marginTop:0, color:'#2C5530' }}>Aparência</h2>
            <SettingRow title="Modo Escuro" subtitle="Alterna entre tema claro e escuro" value={dark} onChange={setDark} />
          </section>
          <section style={{ background:'#fff', borderRadius:12, padding:16, border:'1px solid #eee' }}>
            <h2 style={{ marginTop:0, color:'#2C5530' }}>Notificações</h2>
            <SettingRow title="Notificações Push" subtitle="Receber notificações no dispositivo" value={push} onChange={setPush} />
          </section>
          <section style={{ background:'#fff', borderRadius:12, padding:16, border:'1px solid #eee' }}>
            <h2 style={{ marginTop:0, color:'#2C5530' }}>Sistema</h2>
            <button style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff', cursor:'pointer' }}>🗑️ Limpar Cache</button>
          </section>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

const SettingRow: React.FC<{ title: string; subtitle: string; value: boolean; onChange: (v: boolean)=>void }> = ({ title, subtitle, value, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderTop:'1px solid #f1f5f9' }}>
    <div>
      <div style={{ fontWeight:700, color:'#111827' }}>{title}</div>
      <div style={{ color:'#6b7280', fontSize:12 }}>{subtitle}</div>
    </div>
    <label style={{ position:'relative', display:'inline-block', width:46, height:26 }}>
      <input type="checkbox" checked={value} onChange={(e)=>onChange(e.target.checked)} style={{ display:'none' }} />
      <span style={{ position:'absolute', cursor:'pointer', inset:0, background:value?'#1f2d1a':'#e5e7eb', borderRadius:9999, transition:'background .2s' }} />
      <span style={{ position:'absolute', top:3, left:value?24:3, width:20, height:20, background:'#fff', borderRadius:'50%', transition:'left .2s', boxShadow:'0 1px 2px rgba(0,0,0,.2)' }} />
    </label>
  </div>
)


