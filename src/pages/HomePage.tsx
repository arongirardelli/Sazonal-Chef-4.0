import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase'
import type { Recipe } from '@/types/supabase'
import { getUserProfile, type UserProfileRow } from '@/services/userService'
import { getUserSettings, addRecipeViewPoint, addSavedRecipePoint, updateSavedRecipeCount, registerDailyAccessServer } from '@/services/gamificationService'
import { getSavedRecipeIds, setSavedRecipeIds } from '@/services/menuService'
import { BottomNav } from '@/components/BottomNav'
import { RecipeModal } from '@/components/RecipeModal'
import { RecipeCard } from '@/components/RecipeCard'
import { SectionHeader } from '@/components/SectionHeader'
import { SeasonalIcon, QuickIcon, PersonalizedIcon } from '@/components/SectionIcons'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { toast } from 'sonner'
import { toastStyles } from '@/lib/toastStyles'

const SkeletonCard: React.FC = () => {
  const { colors } = useAppPreferences()
  
  return (
    <div style={{ 
      minWidth: '280px',
      width: '280px',
      border: `1px solid ${colors.border}`, 
      borderRadius: '16px', 
      overflow: 'hidden', 
      background: colors.surface,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ 
        height: '160px', 
        background: `linear-gradient(90deg, ${colors.accent} 25%, ${colors.accent}40 50%, ${colors.accent} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite'
      }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ 
          height: '20px', 
          background: `linear-gradient(90deg, ${colors.accent} 25%, ${colors.accent}40 50%, ${colors.accent} 75%)`,
          backgroundSize: '200% 100%',
          borderRadius: '8px',
          animation: 'shimmer 2s infinite'
        }} />
        <div style={{ 
          height: '14px', 
          background: `linear-gradient(90deg, ${colors.accent} 25%, ${colors.accent}40 50%, ${colors.accent} 75%)`,
          backgroundSize: '200% 100%',
          borderRadius: '6px',
          width: '70%',
          animation: 'shimmer 2s infinite'
        }} />
        <div style={{ 
          height: '12px', 
          background: `linear-gradient(90deg, ${colors.accent} 25%, ${colors.accent}40 50%, ${colors.accent} 75%)`,
          backgroundSize: '200% 100%',
          borderRadius: '6px',
          width: '40%',
          animation: 'shimmer 2s infinite'
        }} />
      </div>
      
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  )
}

const RecipeSection: React.FC<{
  title: string
  subtitle: string
  recipes: Recipe[]
  loading: boolean
  onRecipeClick: (recipe: Recipe) => void
  icon: React.ReactNode
}> = ({ title, subtitle, recipes, loading, onRecipeClick, icon }) => {
  const { colors } = useAppPreferences()
  
  return (
    <div style={{ marginBottom: '48px' }}>
      <SectionHeader 
        title={title}
        subtitle={subtitle}
        icon={icon}
      />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingBottom: '12px'
      }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={() => onRecipeClick(recipe)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export const HomePage: React.FC = () => {
  const { colors, fontSizes } = useAppPreferences()
  const [profile, setProfile] = useState<UserProfileRow | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [seasonalRecipes, setSeasonalRecipes] = useState<Recipe[]>([])
  const [quickRecipes, setQuickRecipes] = useState<Recipe[]>([])
  const [personalizedRecipes, setPersonalizedRecipes] = useState<Recipe[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState({
    seasonal: true,
    quick: true,
    personalized: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Carregar dados de forma otimizada
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          loadUserData(),
          loadSeasonalRecipes(),
          loadQuickRecipes(),
          loadPersonalizedRecipes()
        ])
        setIsInitialized(true)
      } catch (error) {
        console.error('Erro ao carregar dados da página inicial:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Delay para renderização suave
  useEffect(() => {
    if (isInitialized && userId) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isInitialized, userId])

  // Registrar acesso diário quando o usuário for identificado
  useEffect(() => {
    if (userId) {
      console.log('🚀 [HomePage] Usuário identificado, registrando acesso diário...');
      registerDailyAccessServer().catch(error => {
        console.error('💥 [HomePage] Falha ao registrar acesso diário:', error.message);
      });
    }
  }, [userId]); // Executa sempre que o userId mudar (de null para um valor)

  const loadUserData = async () => {
    const { data } = await supabase.auth.getSession()
    const uid = data.session?.user?.id
    setUserId(uid || null)
    if (uid) {
      const userProfile = await getUserProfile(uid)
      setProfile(userProfile)
      
      // Carrega receitas salvas
      const saved = await getSavedRecipeIds(uid)
      setSavedIds(new Set(saved))
    }
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1 // 1-12
    
    if (month >= 12 || month <= 2) return 'verão'
    if (month >= 3 && month <= 5) return 'outono'
    if (month >= 6 && month <= 8) return 'inverno'
    if (month >= 9 && month <= 11) return 'primavera'
    
    return 'verão'
  }

  const getSeasonalKeywords = (season: string) => {
    const keywords = {
      verão: ['salada', 'morango', 'manga', 'melancia', 'sorvete', 'gelado', 'fresco'],
      outono: ['abóbora', 'castanha', 'maçã', 'pêra', 'canela'],
      inverno: ['sopa', 'caldo', 'ensopado', 'chocolate', 'quente', 'mingau'],
      primavera: ['aspargo', 'ervilha', 'brócolis', 'couve-flor', 'leve']
    }
    return keywords[season as keyof typeof keywords] || keywords.verão
  }

  const loadSeasonalRecipes = async () => {
    try {
      const season = getCurrentSeason()
      const keywords = getSeasonalKeywords(season)
      
      // Busca receitas que contenham palavras-chave sazonais no título ou ingredientes
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .or(keywords.map(keyword => `title.ilike.%${keyword}%`).join(','))
        .limit(6)
      
      if (error) throw error
      setSeasonalRecipes(data || [])
    } catch (error) {
      console.error('Erro ao carregar receitas sazonais:', error)
      setSeasonalRecipes([])
    } finally {
      setLoading(prev => ({ ...prev, seasonal: false }))
    }
  }

  const loadQuickRecipes = async () => {
    try {
      // Busca receitas com tempo <= 30 minutos
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .lte('time', 30)
        .order('rating', { ascending: false })
        .limit(6)
      
      if (error) throw error
      setQuickRecipes(data || [])
    } catch (error) {
      console.error('Erro ao carregar receitas rápidas:', error)
      setQuickRecipes([])
    } finally {
      setLoading(prev => ({ ...prev, quick: false }))
    }
  }

  const loadPersonalizedRecipes = async () => {
    try {
      const { data } = await supabase.auth.getSession()
      const uid = data.session?.user?.id
      
      if (!uid) {
        setPersonalizedRecipes([])
        setLoading(prev => ({ ...prev, personalized: false }))
        return
      }

      // Busca as configurações do usuário para obter receitas salvas
      const userSettings = await getUserSettings(uid)
      const savedRecipeIds = userSettings?.saved_recipes || []
      
      if (savedRecipeIds.length === 0) {
        // Se não há receitas salvas, mostra receitas populares
        const { data: popularRecipes, error } = await supabase
          .from('recipes')
          .select('*')
          .order('rating', { ascending: false })
          .limit(6)
        
        if (error) throw error
        setPersonalizedRecipes(popularRecipes || [])
      } else {
        // Busca receitas salvas para analisar padrões
        const { data: savedRecipes, error: savedError } = await supabase
          .from('recipes')
          .select('*')
          .in('id', savedRecipeIds.slice(0, 10)) // Pega até 10 receitas salvas para análise
        
        if (savedError) throw savedError
        
        // Extrai tags mais comuns das receitas salvas
        const allTags: string[] = []
        const mealTypes: string[] = []
        
        savedRecipes?.forEach(recipe => {
          if (recipe.dietary_tags) {
            allTags.push(...recipe.dietary_tags)
          }
          if (recipe.meal_type) {
            mealTypes.push(recipe.meal_type)
          }
        })
        
        // Encontra as tags mais comuns
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        const popularTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([tag]) => tag)
        
        // Busca receitas similares que o usuário ainda não salvou
        let query = supabase
          .from('recipes')
          .select('*')
          .not('id', 'in', `(${savedRecipeIds.join(',')})`)
        
        if (popularTags.length > 0) {
          query = query.or(popularTags.map(tag => `dietary_tags.cs.{${tag}}`).join(','))
        }
        
        const { data: recommendedRecipes, error: recError } = await query
          .order('rating', { ascending: false })
          .limit(6)
        
        if (recError) throw recError
        setPersonalizedRecipes(recommendedRecipes || [])
      }
    } catch (error) {
      console.error('Erro ao carregar receitas personalizadas:', error)
      setPersonalizedRecipes([])
    } finally {
      setLoading(prev => ({ ...prev, personalized: false }))
    }
  }

  const handleRecipeClick = async (recipe: Recipe) => {
    setModalRecipe(recipe)
    // Pontos por visualizar receita
    if (userId) {
      try {
        const res = await addRecipeViewPoint(userId)
        if (res?.leveledUp) {
          toast(`🎉 Você subiu de nível! Agora é ${res.chef_level}.`, {
            style: toastStyles.success
          })
        }
      } catch (error) {
        console.error('Erro ao adicionar pontos:', error)
      }
    }
  }

  const handleSaveRecipe = async (recipeId: string) => {
    if (!userId) return
    
    try {
      const next = new Set(savedIds)
      if (next.has(recipeId)) {
        next.delete(recipeId)
      } else {
        next.add(recipeId)
      }
      setSavedIds(new Set(next))
      await setSavedRecipeIds(userId, Array.from(next))
      
      // Confirma a persistência
      const confirmIds = await getSavedRecipeIds(userId)
      setSavedIds(new Set(confirmIds))
      
      const saved = confirmIds.includes(recipeId)
      if (saved) {
        const res = await addSavedRecipePoint(userId, confirmIds.length)
        if (res?.leveledUp) {
          toast(`🎉 Você subiu de nível! Agora é ${res.chef_level}.`, {
            style: toastStyles.success
          })
        } else {
          toast('❤️ Receita adicionada aos favoritos', {
            style: toastStyles.success
          })
        }
              } else {
          await updateSavedRecipeCount(userId, confirmIds.length)
          toast('✅ Receita removida dos favoritos', {
            style: toastStyles.success
          })
        }
    } catch (error) {
      // Reverte a mudança otimista em caso de erro
      const refresh = await getSavedRecipeIds(userId)
      setSavedIds(new Set(refresh))
      toast.error('Não foi possível salvar. Tente novamente.', {
        style: toastStyles.error
      })
    }
  }

  const userName = profile?.display_name || profile?.full_name || profile?.email?.split('@')[0] || 'Chef'

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: colors.background,
        color: colors.text,
        paddingBottom: '88px',
        fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.15s ease-in'
      }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            gap: '16px',
            color: colors.textSecondary,
            fontSize: fontSizes.lg
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                border: `3px solid ${colors.border}`,
                borderTop: `3px solid ${colors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Carregando seu cardápio...
            </div>
          </div>
        ) : (
          <>
            {/* Seção de Boas-Vindas */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent}05 100%)`,
              padding: '32px 24px',
              borderBottom: `1px solid ${colors.border}`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
                borderRadius: '50%',
                opacity: 0.6
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '60px',
                height: '60px',
                background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
                borderRadius: '50%',
                opacity: 0.4
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Badge elegante */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: `${colors.primary}10`,
                  border: `1px solid ${colors.primary}20`,
                  marginBottom: '16px'
                }}>
                  <span style={{
                    fontSize: fontSizes.sm,
                    fontWeight: 600,
                    color: colors.primary,
                    letterSpacing: '0.5px'
                  }}>
                    Bem-vindo de volta
                  </span>
                </div>
                
                <h1 style={{
                  fontSize: fontSizes['3xl'],
                  fontWeight: 800,
                  color: colors.primary,
                  margin: '0 0 16px 0',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1
                }}>
                  Olá Chef, {userName}! 👨‍🍳
                </h1>
                <p style={{
                  fontSize: fontSizes.lg,
                  color: colors.textSecondary,
                  margin: 0,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  maxWidth: '500px'
                }}>
                  O que vamos cozinhar hoje?
                </p>
              </div>
            </div>

      {/* Seções de Receitas */}
      <div style={{ paddingTop: '24px' }}>
        <RecipeSection
          title="Tesouros da Estação"
          subtitle="Aproveite os ingredientes no auge do frescor e sabor."
          recipes={seasonalRecipes}
          loading={loading.seasonal}
          onRecipeClick={handleRecipeClick}
          icon={<SeasonalIcon />}
        />

        <RecipeSection
          title="Pratos em 30 Minutos"
          subtitle="Soluções deliciosas para os dias mais corridos."
          recipes={quickRecipes}
          loading={loading.quick}
          onRecipeClick={handleRecipeClick}
          icon={<QuickIcon />}
        />

        <RecipeSection
          title="Feito Para Você"
          subtitle="Sugestões inspiradas nas receitas que você mais ama."
          recipes={personalizedRecipes}
          loading={loading.personalized}
          onRecipeClick={handleRecipeClick}
          icon={<PersonalizedIcon />}
        />
      </div>

      {/* Modal de Receita */}
      <RecipeModal
        recipe={modalRecipe}
        isOpen={!!modalRecipe}
        onClose={() => setModalRecipe(null)}
        onSave={handleSaveRecipe}
        isSaved={modalRecipe ? savedIds.has(modalRecipe.id) : false}
        userId={userId}
      />

      <BottomNav />
      </>
        )}
      </div>
    </>
  )
}
