import React, { useEffect, useState, useLayoutEffect, useMemo, useCallback, useRef } from 'react'
import type { Recipe } from '@/types/supabase'
import { loadAllRecipes } from '@/services/menuService'
import { RecipeCatalog } from './RecipeCatalog'
import { BottomNav } from '@/components/BottomNav'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { useNavigate } from 'react-router-dom'

type TimeFilter = 'any'|'<=15'|'15-30'|'30-60'|'>60'
type DifficultyFilter = 'any'|'Fácil'|'Médio'|'Difícil'
type DietFilter = 'all'|'Vegano'|'Vegetariano'|'Sem Glúten'|'Sem Lactose'|'Low Carb'|'Proteico'|'Tradicional'

const MEALS = ['Café da manhã','Almoço','Lanche','Jantar','Sobremesa'] as const
const TIME_OPTIONS: readonly TimeFilter[] = ['any','<=15','15-30','30-60','>60'] as const
const DIFFICULTY_OPTIONS: readonly DifficultyFilter[] = ['any','Fácil','Médio','Difícil'] as const
const DIET_OPTIONS: readonly DietFilter[] = ['all','Vegano','Vegetariano','Sem Glúten','Sem Lactose','Low Carb','Proteico','Tradicional'] as const

const NAVIGATION_STATE_KEY = 'navigationState-categories'
const SESSION_CACHE_KEY = 'categories-session-cache'

export const Categories: React.FC = () => {
  const { colors, fontSizes } = useAppPreferences()
  const navigate = useNavigate()
  
  const [catalog, setCatalog] = useState<Recipe[]>([])
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([])
  const [filters, setFilters] = useState<{ q: string; category: string; time: TimeFilter; difficulty: DifficultyFilter; diet: DietFilter }>({ q: '', category: '', time: 'any', difficulty: 'any', diet: 'all' })
  const [isLoading, setIsLoading] = useState(true)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const preloadTimeoutRef = useRef<number | null>(null)
  const isPreloadingRef = useRef(false)

  useEffect(() => {
    const handleResize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Funções de cache de sessão híbrido
  const saveSessionCache = useCallback(() => {
    const cacheData = {
      loadedRecipes: displayedRecipes,
      totalLoaded: displayedRecipes.length,
      scrollPosition: window.scrollY,
      filters: filters,
      timestamp: Date.now()
    }
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(cacheData))
  }, [displayedRecipes, filters])

  const restoreSessionCache = useCallback((filteredRecipesLength: number) => {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY)
    if (!cached) return false

    try {
      const data = JSON.parse(cached)
      const now = Date.now()
      const maxAge = 30 * 60 * 1000 // 30 minutos
      
      // Validar cache
      if ((now - data.timestamp) > maxAge) {
        sessionStorage.removeItem(SESSION_CACHE_KEY)
        return false
      }

      // Validar filtros
      const currentFiltersStr = JSON.stringify(filters)
      const cachedFiltersStr = JSON.stringify(data.filters)
      if (currentFiltersStr !== cachedFiltersStr) {
        sessionStorage.removeItem(SESSION_CACHE_KEY)
        return false
      }

      // Restaurar dados
      setDisplayedRecipes(data.loadedRecipes)
      setHasMore(data.totalLoaded < filteredRecipesLength)
      
      return true
    } catch (error) {
      console.error('Erro ao restaurar cache de sessão:', error)
      sessionStorage.removeItem(SESSION_CACHE_KEY)
      return false
    }
  }, [filters])

  const clearSessionCache = useCallback(() => {
    sessionStorage.removeItem(SESSION_CACHE_KEY)
  }, [])

  // Carregamento inicial e lógica de restauração híbrida (não bloqueante)
  useEffect(() => {
    const savedStateJSON = sessionStorage.getItem(NAVIGATION_STATE_KEY);
    let restoredFilters = null;

    if (savedStateJSON) {
      setIsRestoring(true); // Ativa o modo de restauração imediatamente
      try {
        restoredFilters = JSON.parse(savedStateJSON).filters;
      } catch (e) {
        console.error("Failed to parse saved state:", e);
        sessionStorage.removeItem(NAVIGATION_STATE_KEY);
      }
    } else {
      window.scrollTo(0, 0);
      clearSessionCache(); // Limpar cache ao vir de outra página
    }

    // Carregamento assíncrono não bloqueante (como na página Salvos)
    (async () => {
      if (!savedStateJSON) {
        setIsLoading(true);
      }
      const recipes = await loadAllRecipes(); // Usa o cache, é rápido na volta
      setCatalog(recipes);
      if (restoredFilters) {
        setFilters(restoredFilters);
      }
      setIsLoading(false);
    })();
  }, [clearSessionCache]);

  const filteredRecipes = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const hasSearch = q.length > 0
    const hasCategory = filters.category.length > 0
    const hasDifficulty = filters.difficulty !== 'any'
    const hasDiet = filters.diet !== 'all'
    const hasTime = filters.time !== 'any'
    
    return catalog.filter(r => {
      if (hasCategory && r.category.toLowerCase() !== filters.category.toLowerCase()) return false
      if (hasDifficulty && r.difficulty !== filters.difficulty) return false
      if (hasDiet && r.diet !== filters.diet) return false
      if (hasTime) {
        if (filters.time === '<=15' && !(r.time <= 15)) return false
        if (filters.time === '15-30' && !(r.time > 15 && r.time <= 30)) return false
        if (filters.time === '30-60' && !(r.time > 30 && r.time <= 60)) return false
        if (filters.time === '>60' && !(r.time > 60)) return false
      }
      if (hasSearch) {
        const inTitle = r.title.toLowerCase().includes(q)
        if (inTitle) return true
        const inIngs = (r.structured_ingredients || []).some(ing => (ing.name || '').toLowerCase().includes(q))
        return inIngs
      }
      return true
    })
  }, [catalog, filters])

  // Resetar receitas exibidas quando os filtros mudarem (com cache híbrido otimizado)
  useEffect(() => {
    // Tentar restaurar cache primeiro (não bloqueante)
    if (!restoreSessionCache(filteredRecipes.length)) {
      // Se não há cache válido, carregar primeiras 50 imediatamente
      setDisplayedRecipes(filteredRecipes.slice(0, 50))
      setHasMore(filteredRecipes.length > 50)
    }
  }, [filteredRecipes, restoreSessionCache])

  // Restaura o scroll após a renderização, se necessário (otimizado para navegação imediata)
  useLayoutEffect(() => {
    if (isRestoring && catalog.length > 0 && displayedRecipes.length > 0) {
      const savedStateJSON = sessionStorage.getItem(NAVIGATION_STATE_KEY);
      if (savedStateJSON) {
        try {
          const savedState = JSON.parse(savedStateJSON);
          if (savedState.scrollPosition) {
            // Usar requestAnimationFrame para restauração suave
            requestAnimationFrame(() => {
              window.scrollTo(0, savedState.scrollPosition);
            });
          }
          sessionStorage.removeItem(NAVIGATION_STATE_KEY);
        } catch (e) {
          console.error("Failed to parse or use saved state for scrolling:", e);
        }
      }
      // Revelar conteúdo imediatamente após restauração
      setIsRestoring(false);
    }
  }, [isRestoring, catalog, displayedRecipes]);

  const handleOpenDetails = useCallback((recipe: Recipe) => {
    // Salvar cache de sessão antes de navegar
    saveSessionCache()
    
    const stateToSave = {
      scrollPosition: window.scrollY,
      filters: filters,
    }
    sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(stateToSave))
    sessionStorage.setItem('isReturningToCategories', 'true');
    navigate(`/receita/${recipe.id}`)
  }, [filters, navigate, saveSessionCache])

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    // Salvar posição atual do scroll antes de aplicar filtro
    const currentScrollPosition = window.scrollY;
    
    clearSessionCache(); // Limpar cache ao mudar filtros
    setFilters(prev => ({ ...prev, [filterType]: value }))
    
    // Restaurar posição do scroll após a atualização dos filtros
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollPosition);
    });
  }, [clearSessionCache])

  const handleSearchChange = useCallback((value: string) => {
    // Salvar posição atual do scroll antes de aplicar busca
    const currentScrollPosition = window.scrollY;
    
    clearSessionCache(); // Limpar cache ao mudar busca
    setFilters(prev => ({ ...prev, q: value }))
    
    // Restaurar posição do scroll após a atualização da busca
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollPosition);
    });
  }, [clearSessionCache])

  // Função para carregar mais receitas (com pré-carregamento inteligente)
  const loadMoreRecipes = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const currentCount = displayedRecipes.length;
      const nextBatch = filteredRecipes.slice(currentCount, currentCount + 50);
      setDisplayedRecipes(prev => [...prev, ...nextBatch]);
      setHasMore(currentCount + 50 < filteredRecipes.length);
      setIsLoadingMore(false);
      
      // Pré-carregar próximo bloco em background
      preloadNextBatch(currentCount + 50);
    }, 300);
  }, [displayedRecipes.length, filteredRecipes, isLoadingMore, hasMore]);

  // Pré-carregamento inteligente do próximo bloco (otimizado para performance)
  const preloadNextBatch = useCallback((startIndex: number) => {
    if (isPreloadingRef.current || startIndex >= filteredRecipes.length) return;
    
    isPreloadingRef.current = true;
    preloadTimeoutRef.current = setTimeout(() => {
      const nextBatch = filteredRecipes.slice(startIndex, startIndex + 50);
      if (nextBatch.length > 0) {
        // Pré-carregar em background sem afetar a UI
        setDisplayedRecipes(prev => {
          const newRecipes = [...prev, ...nextBatch];
          // Salvar cache atualizado de forma assíncrona
          requestAnimationFrame(() => {
            const cacheData = {
              loadedRecipes: newRecipes,
              totalLoaded: newRecipes.length,
              scrollPosition: window.scrollY,
              filters: filters,
              timestamp: Date.now()
            };
            sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(cacheData));
          });
          return newRecipes;
        });
        setHasMore(startIndex + 50 < filteredRecipes.length);
      }
      isPreloadingRef.current = false;
    }, 500); // Reduzido para 500ms para pré-carregamento mais rápido
  }, [filteredRecipes, filters]);

  // Intersection Observer para detectar quando chegar ao final
  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreRecipes();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreRecipes]);

  // Limpeza de timeouts ao desmontar
  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  function noop() {}

  const isMobile = screenSize.width < 768
  const searchConfig = {
    containerPadding: isMobile ? '12px 16px' : '20px 24px',
    inputPadding: isMobile ? '12px 16px' : '16px 20px',
    borderRadius: isMobile ? '8px' : '12px',
    fontSize: isMobile ? fontSizes.sm : fontSizes.base,
    iconSize: isMobile ? '16px' : '18px',
    iconRight: isMobile ? '12px' : '16px'
  }

  return (
    <>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        body { background-color: ${colors.background}; }
      `}</style>
      <div style={{ 
        maxWidth: 1080, 
        margin: '0 auto', 
        padding: '24px 16px 100px 16px',
        minHeight: '100vh',
        backgroundColor: colors.background,
        opacity: isRestoring ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out',
      }}>
      {isRestoring && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: colors.textSecondary,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: fontSizes.sm,
          zIndex: 100, // Garante que fique por cima de tudo
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${colors.border}`,
            borderTop: `2px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Restaurando...
        </div>
      )}
      {/* Header */}
      <div style={{ 
        padding: '32px 24px', 
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent}05 100%)`,
        borderRadius: '16px',
        marginBottom: '24px',
        border: `1px solid ${colors.border}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '80px', height: '80px', background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`, borderRadius: '50%', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '60px', height: '60px', background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`, borderRadius: '50%', opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '40px', height: '3px', background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primary}40 100%)`, borderRadius: '2px', marginBottom: '16px' }} />
          <h1 style={{ margin: '0 0 8px 0', color: colors.primary, fontSize: fontSizes['3xl'], fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Categorias
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: fontSizes.lg, margin: 0, fontWeight: 500, lineHeight: 1.5, maxWidth: '500px' }}>
            Encontre a receita perfeita para cada momento
          </p>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div style={{ padding: searchConfig.containerPadding, background: colors.surface, borderRadius: '16px', marginBottom: '20px', border: `1px solid ${colors.border}`, boxShadow: `0 2px 8px ${colors.border}20`, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            value={filters.q} 
            onChange={(e) => handleSearchChange(e.target.value)} 
            placeholder={isMobile ? "Buscar..." : "Busque por nome ou ingrediente..."} 
            style={{ 
              width: '100%',
              minWidth: isMobile ? '150px' : '200px',
              padding: searchConfig.inputPadding, 
              border: `2px solid ${colors.border}`, 
              borderRadius: searchConfig.borderRadius,
              background: colors.background,
              color: colors.text,
              fontSize: searchConfig.fontSize,
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: `0 2px 4px ${colors.border}10`,
              boxSizing: 'border-box'
            }}
            onFocus={(e) => { e.target.style.borderColor = colors.primary; e.target.style.boxShadow = `0 4px 12px ${colors.primary}20`; }}
            onBlur={(e) => { e.target.style.borderColor = colors.border; e.target.style.boxShadow = `0 2px 4px ${colors.border}10`; }}
          />
          <div style={{ position: 'absolute', right: searchConfig.iconRight, top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary, fontSize: searchConfig.iconSize, pointerEvents: 'none' }}>
            🔍
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ padding: '24px', background: colors.surface, borderRadius: '16px', marginBottom: '24px', border: `1px solid ${colors.border}`, boxShadow: `0 2px 8px ${colors.border}20` }}>
        {/* Tipo de Refeição */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: colors.primary, fontSize: fontSizes.base, fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Tipo de Refeição</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {MEALS.map(c => (
              <button key={c} onClick={() => handleFilterChange('category', c === filters.category ? '' : c)} style={{ padding: '10px 16px', borderRadius: '20px', border: `2px solid ${filters.category === c ? colors.primary : colors.border}`, background: filters.category === c ? colors.primary : colors.background, color: filters.category === c ? colors.surface : colors.text, fontSize: fontSizes.sm, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: filters.category === c ? `0 2px 8px ${colors.primary}30` : `0 1px 3px ${colors.border}20` }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {/* Tempo de Preparo */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: colors.primary, fontSize: fontSizes.base, fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Tempo de Preparo</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TIME_OPTIONS.map(t => (
              <button key={t} onClick={() => handleFilterChange('time', t)} style={{ padding: '10px 16px', borderRadius: '20px', border: `2px solid ${filters.time === t ? colors.primary : colors.border}`, background: filters.time === t ? colors.primary : colors.background, color: filters.time === t ? colors.surface : colors.text, fontSize: fontSizes.sm, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: filters.time === t ? `0 2px 8px ${colors.primary}30` : `0 1px 3px ${colors.border}20` }}>
                {t === 'any' ? 'Qualquer tempo' : t === '<=15' ? 'Até 15 min' : t === '15-30' ? '15-30 min' : t === '30-60' ? '30-60 min' : 'Mais de 1h'}
              </button>
            ))}
          </div>
        </div>
        {/* Dificuldade */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: colors.primary, fontSize: fontSizes.base, fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Dificuldade</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DIFFICULTY_OPTIONS.map(d => (
              <button key={d} onClick={() => handleFilterChange('difficulty', d)} style={{ padding: '10px 16px', borderRadius: '20px', border: `2px solid ${filters.difficulty === d ? colors.primary : colors.border}`, background: filters.difficulty === d ? colors.primary : colors.background, color: filters.difficulty === d ? colors.surface : colors.text, fontSize: fontSizes.sm, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: filters.difficulty === d ? `0 2px 8px ${colors.primary}30` : `0 1px 3px ${colors.border}20` }}>
                {d === 'any' ? 'Qualquer' : d}
              </button>
            ))}
          </div>
        </div>
        {/* Tipo de Dieta */}
        <div>
          <h3 style={{ margin: '0 0 12px 0', color: colors.primary, fontSize: fontSizes.base, fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Tipo de Dieta</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DIET_OPTIONS.map(d => (
              <button key={d} onClick={() => handleFilterChange('diet', d)} style={{ padding: '10px 16px', borderRadius: '20px', border: `2px solid ${filters.diet === d ? colors.primary : colors.border}`, background: filters.diet === d ? colors.primary : colors.background, color: filters.diet === d ? colors.surface : colors.text, fontSize: fontSizes.sm, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: filters.diet === d ? `0 2px 8px ${colors.primary}30` : `0 1px 3px ${colors.border}20` }}>
                {d === 'all' ? 'Todas' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Receitas */}
      <div style={{ padding: '24px', background: colors.surface, borderRadius: '16px', marginBottom: '24px', border: `1px solid ${colors.border}`, boxShadow: `0 2px 8px ${colors.border}20` }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: colors.textSecondary, fontSize: fontSizes.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', border: `2px solid ${colors.border}`, borderTop: `2px solid ${colors.primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Carregando receitas...
            </div>
          </div>
        ) : (
          <>
            <RecipeCatalog
              data={displayedRecipes} // Renderiza apenas as receitas exibidas
              filters={filters}
              onSelect={noop}
              userTaken={new Set()}
              onOpenDetails={handleOpenDetails}
              showSelect={false}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              totalFilteredCount={filteredRecipes.length}
            />
            {hasMore && (
              <div ref={loadMoreRef} style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
                padding: '20px',
                color: colors.textSecondary,
                fontSize: fontSizes.sm
              }}>
                {/* Mensagem de carregamento removida - já exibida no RecipeCatalog */}
              </div>
            )}
          </>
        )}
      </div>
      
      <BottomNav />
      </div>
    </>
  )
}
