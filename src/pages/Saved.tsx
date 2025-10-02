import React, { useEffect, useState, useLayoutEffect } from 'react'
import { supabase } from '@/integrations/supabase'
import type { Recipe } from '@/types/supabase'
import { getSavedRecipeIds, loadRecipesByIds } from '@/services/menuService'
import { BottomNav } from '@/components/BottomNav'
import { RecipeCard } from '@/components/RecipeCard'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { useNavigate } from 'react-router-dom'

const NAVIGATION_STATE_KEY = 'navigationState-saved'

export const Saved: React.FC = () => {
  const { colors, fontSizes } = useAppPreferences()
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [isRestoring, setIsRestoring] = useState(false)

  useEffect(() => {
    const savedStateJSON = sessionStorage.getItem(NAVIGATION_STATE_KEY)
    if (savedStateJSON) {
      setIsRestoring(true) // Oculta o conteúdo para evitar flash
    } else {
      // Se não há estado salvo, direcionar para o topo da página e garantir que não está restaurando
      setIsRestoring(false)
      window.scrollTo(0, 0)
    }

    (async () => {
      const { data } = await supabase.auth.getSession()
      const uid = data.session?.user?.id || null
      setUserId(uid)
      if (uid) {
        const ids = await getSavedRecipeIds(uid)
        if (ids.length > 0) {
          const orderedIds = [...ids].reverse()
          const recs = await loadRecipesByIds(orderedIds)
          setRecipes(recs)
        } else {
          setRecipes([])
        }
      }
      setLoading(false)
      // Garantir que não está mais restaurando após o carregamento
      if (!savedStateJSON) {
        setIsRestoring(false)
      }
    })()
  }, [])

  useLayoutEffect(() => {
    // Apenas restaura se estiver no modo de restauração e os dados tiverem sido carregados
    if (isRestoring && !loading) {
      const savedStateJSON = sessionStorage.getItem(NAVIGATION_STATE_KEY)
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON)
        if (savedState.scrollPosition) {
          window.scrollTo(0, savedState.scrollPosition)
        }
        sessionStorage.removeItem(NAVIGATION_STATE_KEY)
      }
      // Revela o conteúdo após a restauração
      setIsRestoring(false)
    }
  }, [isRestoring, loading])

  const handleOpenDetails = (recipe: Recipe) => {
    const stateToSave = {
      scrollPosition: window.scrollY,
    }
    sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(stateToSave))
    sessionStorage.setItem('persistScroll', 'true')
    navigate(`/receita/${recipe.id}`)
  }

  if (!userId) {
    return <div style={{ 
      maxWidth: 960, 
      margin: '0 auto', 
      padding: 16,
      backgroundColor: colors.background,
      minHeight: '100vh'
    }}>
      <h1 style={{ color: colors.primary, fontSize: fontSizes['2xl'] }}>Salvos</h1>
      <div style={{ 
        background: colors.surface, 
        padding: 12, 
        borderRadius: 8,
        color: colors.text,
        border: `1px solid ${colors.border}`
      }}>
        Faça login para ver suas receitas salvas.
      </div>
    </div>
  }

  return (
    <div style={{ 
      maxWidth: 1080, 
      margin: '0 auto', 
      padding: '16px 16px 100px 16px',
      minHeight: '100vh',
      backgroundColor: colors.background,
      // Oculta o conteúdo durante a restauração
      opacity: isRestoring ? 0 : 1,
      transition: 'opacity 0.15s ease-in'
    }}>
      {/* Header elegante */}
      <div style={{
        padding: '28px 24px',
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent}05 100%)`,
        borderRadius: '16px',
        marginBottom: '24px',
        border: `1px solid ${colors.border}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elementos decorativos */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '3px',
          height: '3px',
          background: colors.primary,
          borderRadius: '50%',
          opacity: 0.3
        }}></div>
        <div style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          width: '2px',
          height: '2px',
          background: colors.accent,
          borderRadius: '2px',
          transform: 'rotate(45deg)',
          opacity: 0.4
        }}></div>
        
        {/* Linha decorativa */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '2px',
          background: `linear-gradient(90deg, ${colors.primary}20 0%, ${colors.accent}40 50%, ${colors.primary}20 100%)`
        }}></div>
        
        {/* Título principal */}
        <h1 style={{
          color: colors.primary,
          fontSize: fontSizes['3xl'],
          fontWeight: '800',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          margin: '0 0 20px 0'
        }}>
          Receitas Salvas
        </h1>
        
        {/* Contador elegante */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: '20px',
          background: colors.primary,
          color: colors.surface,
          fontSize: fontSizes.sm,
          fontWeight: '600',
          boxShadow: `0 2px 8px ${colors.primary}30`
        }}>
          <span style={{ marginRight: '6px' }}>📖</span>
          {recipes.length} receita{recipes.length !== 1 ? 's' : ''} salva{recipes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div style={{ 
          background: colors.surface, 
          padding: 12, 
          borderRadius: 8, 
          border: `1px solid ${colors.border}`,
          color: colors.text,
          textAlign: 'center'
        }}>
          Carregando suas receitas salvas...
        </div>
      ) : recipes.length === 0 ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24
          }}>
            <span style={{ fontSize: '40px', color: colors.primary }}>📖</span>
          </div>
          <h2 style={{ color: colors.text, fontSize: fontSizes.xl, fontWeight: 700, marginBottom: 12, marginTop: 0 }}>
            Nenhuma receita salva ainda
          </h2>
          <p style={{ color: colors.textSecondary, fontSize: fontSizes.base, lineHeight: 1.5, marginBottom: 32, maxWidth: 400 }}>
            Comece explorando nossas receitas e salve suas favoritas para ter acesso offline!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/categorias')}
              style={{ backgroundColor: colors.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: fontSizes.base, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s ease', minWidth: 160 }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Descobrir Receitas
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: 12,
          marginBottom: 20
        }}>
          {recipes.map(r => (
            <RecipeCard
              key={r.id}
              recipe={r}
              variant="default"
              onClick={() => handleOpenDetails(r)}
              showSelect={false}
            />
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  )
}
