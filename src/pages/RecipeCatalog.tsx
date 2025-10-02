import React, { useMemo, memo } from 'react'
import type { Recipe } from '@/types/supabase'
import { RecipeCard } from '@/components/RecipeCard'
import { useAppPreferences } from '../contexts/AppPreferencesContext'

interface Props {
  data: Recipe[]
  filters: { q: string; category: string; time: 'any'|'<=15'|'15-30'|'30-60'|'>60'; difficulty: 'any'|'Fácil'|'Médio'|'Difícil'; diet: 'all'|'Vegano'|'Vegetariano'|'Sem Glúten'|'Sem Lactose'|'Low Carb'|'Proteico'|'Tradicional' }
  onSelect: (r: Recipe) => void
  userTaken: Set<string>
  onOpenDetails?: (r: Recipe) => void
  showSelect?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  totalFilteredCount?: number
}

export const RecipeCatalog: React.FC<Props> = memo(({ data, filters, onSelect, userTaken, onOpenDetails, showSelect = true, onLoadMore, hasMore = false, isLoadingMore = false, totalFilteredCount }) => {
  const { colors, fontSizes } = useAppPreferences()
  
  const list = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const hasSearch = q.length > 0
    const hasCategory = filters.category.length > 0
    const hasDifficulty = filters.difficulty !== 'any'
    const hasDiet = filters.diet !== 'all'
    const hasTime = filters.time !== 'any'
    
    return (data || [])
      .filter(r => {
        // Filtros mais específicos primeiro (mais restritivos)
        if (hasCategory && r.category.toLowerCase() !== filters.category.toLowerCase()) return false
        if (hasDifficulty && r.difficulty !== filters.difficulty) return false
        if (hasDiet && r.diet !== filters.diet) return false
        
        // Filtro de tempo
        if (hasTime) {
          if (filters.time === '<=15' && !(r.time <= 15)) return false
          if (filters.time === '15-30' && !(r.time > 15 && r.time <= 30)) return false
          if (filters.time === '30-60' && !(r.time > 30 && r.time <= 60)) return false
          if (filters.time === '>60' && !(r.time > 60)) return false
        }
        
        // Busca por texto (mais custosa, por último)
        if (hasSearch) {
          const inTitle = r.title.toLowerCase().includes(q)
          if (inTitle) return true
          
          // Só busca em ingredientes se não encontrou no título
          const inIngs = (r.structured_ingredients || []).some(ing => 
            (ing.name || '').toLowerCase().includes(q)
          )
          return inIngs
        }
        
        return true
      })
  }, [data, filters])

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:12 }}>
        {list.map(r => (
          <RecipeCard
            key={r.id}
            recipe={r}
            variant="detailed"
            onClick={() => onOpenDetails?.(r)}
            showSelect={showSelect}
            onSelect={() => onSelect(r)}
            isSelected={userTaken.has(r.id)}
            showTakenWarning={userTaken.has(r.id)}
          />
        ))}
      </div>
      {hasMore && (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 16,
          padding: '20px',
          color: colors.textSecondary,
          fontSize: fontSizes.sm
        }}>
          {isLoadingMore ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: `2px solid ${colors.border}`,
                borderTop: `2px solid ${colors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Carregando mais receitas...
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              style={{
                padding: '8px 16px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                background: colors.surface,
                color: colors.primary,
                fontSize: fontSizes.sm,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.primary
                e.currentTarget.style.color = colors.surface
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.surface
                e.currentTarget.style.color = colors.primary
              }}
            >
              Carregar mais receitas
            </button>
          )}
        </div>
      )}
    </div>
  )
})


