import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback, useRef } from 'react'
import { RecipeCatalog } from './RecipeCatalog'
import { BottomNav } from '@/components/BottomNav'
import { RecipeCard } from '@/components/RecipeCard'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase'
import type { Recipe } from '@/types/supabase'
import { saveOrUpdateMenu, loadRecipesByCategory, loadSavedMenu, loadAllRecipes, getSavedRecipeIds, setSavedRecipeIds as setSavedRecipeIdsAPI, type MenuData } from '@/services/menuService'
import { addSavedRecipePoint, updateSavedRecipeCount } from '@/services/gamificationService'
import { toast } from 'sonner'
import { toastStyles } from '@/lib/toastStyles'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { groupBy } from 'lodash'
import { RecipeModal } from '@/components/RecipeModal'
import { Calendar, Plus, Save, ShoppingCart, ChefHat, Sparkles, Clock, Users } from 'lucide-react'

type TimeFilter = 'any'|'<=15'|'15-30'|'30-60'|'>60'
type DifficultyFilter = 'any'|'Fácil'|'Médio'|'Difícil'
type DietFilter = 'all'|'Vegano'|'Vegetariano'|'Sem Glúten'|'Sem Lactose'|'Low Carb'|'Proteico'|'Tradicional'

const TIME_OPTIONS: readonly TimeFilter[] = ['any','<=15','15-30','30-60','>60'] as const
const DIFFICULTY_OPTIONS: readonly DifficultyFilter[] = ['any','Fácil','Médio','Difícil'] as const
const DIET_OPTIONS: readonly DietFilter[] = ['all','Vegano','Vegetariano','Sem Glúten','Sem Lactose','Low Carb','Proteico','Tradicional'] as const

const DAYS = ['segunda','terça','quarta','quinta','sexta','sábado','domingo'] as const
type Day = typeof DAYS[number]
const MEALS = ['Café da manhã','Almoço','Lanche','Jantar','Sobremesa'] as const
type Meal = typeof MEALS[number]

const MEAL_ORDER = new Map(MEALS.map((m,i)=>[m,i]))

// Chave para persistir o estado da navegação
const NAVIGATION_STATE_KEY = 'navigationState-menu'

// Simplified and robust state structure
interface MenuSlot {
  id: string; // Unique ID for the slot, e.g., "segunda-almoço"
  day: Day;
  meal: Meal;
  recipe: Recipe | null;
}

export const MenuPage: React.FC = () => {
  const { colors, fontSizes } = useAppPreferences()
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  
  // State for user's meal selection per day - inicializado vazio para carregar do banco
  const [selectedMeals, setSelectedMeals] = useState<Partial<Record<Day, Meal[]>>>({})
  
  // Holds the flat list of menu slots
  const [menu, setMenu] = useState<MenuSlot[]>([])
  
  // Cache for recipe pools by category
  const [recipePool, setRecipePool] = useState<Record<string, Recipe[]>>({})
  
  const [savedMenuId, setSavedMenuId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [menuName, setMenuName] = useState('Cardápio Semanal')
  
  // For the recipe details modal
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null)
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set())

  
  // For the replacement catalog modal
  const [showCatalog, setShowCatalog] = useState<MenuSlot | null>(null)
  const [catalogRecipes, setCatalogRecipes] = useState<Recipe[]>([])
  const [catalogFilters, setCatalogFilters] = useState<{ q: string; category: string; time: TimeFilter; difficulty: DifficultyFilter; diet: DietFilter }>({ q: '', category: '', time: 'any', difficulty: 'any', diet: 'all' })
  
  // Estados para renderização progressiva do modal de substituição
  const [displayedCatalogRecipes, setDisplayedCatalogRecipes] = useState<Recipe[]>([])
  const [isLoadingMoreCatalog, setIsLoadingMoreCatalog] = useState(false)
  const [hasMoreCatalog, setHasMoreCatalog] = useState(true)
  const [catalogLoadMoreRef, setCatalogLoadMoreRef] = useState<HTMLDivElement | null>(null)
  
  // Estado para controlar restauração de navegação
  const [isRestoring, setIsRestoring] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // --- Core Logic ---

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id || null))
  }, [])

  // Lógica de filtragem para o modal de substituição
  const filteredCatalogRecipes = useMemo(() => {
    if (!catalogRecipes.length) return []
    
    const { q, category, time, difficulty, diet } = catalogFilters
    
    return catalogRecipes.filter(recipe => {
      // Filtro de texto
      if (q) {
        const searchLower = q.toLowerCase()
        const titleMatch = recipe.title.toLowerCase().includes(searchLower)
        const ingredientMatch = recipe.structured_ingredients?.some(ing => 
          ing.name.toLowerCase().includes(searchLower)
        )
        if (!titleMatch && !ingredientMatch) return false
      }
      
      // Filtro de categoria (tipo de refeição)
      if (category && recipe.category !== category) return false
      
      // Filtro de tempo
      if (time !== 'any') {
        const recipeTime = recipe.time
        if (time === '<=15' && recipeTime > 15) return false
        if (time === '15-30' && (recipeTime <= 15 || recipeTime > 30)) return false
        if (time === '30-60' && (recipeTime <= 30 || recipeTime > 60)) return false
        if (time === '>60' && recipeTime <= 60) return false
      }
      
      // Filtro de dificuldade
      if (difficulty !== 'any' && recipe.difficulty !== difficulty) return false
      
      // Filtro de dieta
      if (diet !== 'all' && recipe.diet !== diet) return false
      
      return true
    })
  }, [catalogRecipes, catalogFilters])

  // Função para carregar mais receitas no modal
  const loadMoreCatalogRecipes = useCallback(() => {
    if (isLoadingMoreCatalog || !hasMoreCatalog) return
    
    setIsLoadingMoreCatalog(true)
    
    // Simular delay para melhor UX
    setTimeout(() => {
      const currentLength = displayedCatalogRecipes.length
      const nextBatch = filteredCatalogRecipes.slice(currentLength, currentLength + 50)
      
      if (nextBatch.length === 0) {
        setHasMoreCatalog(false)
      } else {
        setDisplayedCatalogRecipes(prev => [...prev, ...nextBatch])
      }
      
      setIsLoadingMoreCatalog(false)
    }, 300)
  }, [isLoadingMoreCatalog, hasMoreCatalog, displayedCatalogRecipes.length, filteredCatalogRecipes])

  // Reset das receitas exibidas quando os filtros mudam
  useEffect(() => {
    setDisplayedCatalogRecipes(filteredCatalogRecipes.slice(0, 50))
    setHasMoreCatalog(filteredCatalogRecipes.length > 50)
  }, [filteredCatalogRecipes])

  // Intersection Observer para carregar mais receitas
  useEffect(() => {
    if (!catalogLoadMoreRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreCatalogRecipes()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(catalogLoadMoreRef)

    return () => observer.disconnect()
  }, [catalogLoadMoreRef, loadMoreCatalogRecipes])

  // Carregar dados do usuário e verificar se há estado salvo
  useEffect(() => {
    const savedStateJSON = sessionStorage.getItem(NAVIGATION_STATE_KEY)
    if (savedStateJSON) {
      setIsRestoring(true) // Ativa modo de restauração
    }
  }, [])

  // Controlar carregamento com delay para melhor UX
  useEffect(() => {
    if (isInitialized && userId) {
      // Delay de 200ms para garantir que todos os dados estejam carregados
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [isInitialized, userId])

  // Load saved menu and recipes when user is identified
  useEffect(() => {
    if (!userId) return;
    
    const loadData = async () => {
      try {
        const { data, menuId, name } = await loadSavedMenu(userId)
        
        if (data && Object.keys(data).length > 0) {
          // Carregar cardápio salvo
          setMenuName(name)
          // Salvar nome no localStorage para uso na página de shopping
          localStorage.setItem('current-menu-name', name)
          const loadedMenu: MenuSlot[] = []
          const loadedSelections: Partial<Record<Day, Meal[]>> = {}
          
          // Processar apenas os dias/refeições que têm receitas salvas
          for (const day of DAYS) {
            const dayData = data[day]
            if (dayData && Object.keys(dayData).length > 0) {
              loadedSelections[day as Day] = []
              
              for (const meal of MEALS) {
                const recipe = dayData[meal]
                if (recipe) {
                  loadedMenu.push({ 
                    id: `${day}-${meal}`, 
                    day: day as Day, 
                    meal: meal as Meal, 
                    recipe 
                  })
                  loadedSelections[day as Day]!.push(meal as Meal)
                }
              }
            }
          }
          
          setMenu(loadedMenu)
          setSelectedMeals(loadedSelections)
        } else {
          // Se não há cardápio salvo, manter estado vazio
          setMenu([])
          setSelectedMeals({})
        }
        
        setSavedMenuId(menuId)
        
        const savedIds = await getSavedRecipeIds(userId)
        setSavedRecipeIds(new Set(savedIds))
        
        setIsInitialized(true)
      } catch (error) {
        console.error('Erro ao carregar dados do cardápio:', error)
        setIsInitialized(true)
      }
    }
    
    loadData()
  }, [userId])

  // Restaurar estado de navegação após carregamento
  useLayoutEffect(() => {
    if (isRestoring && isInitialized) {
      const savedStateJSON = sessionStorage.getItem(NAVIGATION_STATE_KEY)
      if (savedStateJSON) {
        try {
          const savedState = JSON.parse(savedStateJSON)
          
          // Restaurar seleções de refeições se existirem
          if (savedState.selectedMeals) {
            setSelectedMeals(savedState.selectedMeals)
          }
          
          // Restaurar posição de scroll se existir
          if (savedState.scrollPosition) {
            window.scrollTo(0, savedState.scrollPosition)
          }
          
          // Limpar estado salvo
          sessionStorage.removeItem(NAVIGATION_STATE_KEY)
        } catch (error) {
          console.error('Erro ao restaurar estado:', error)
        }
      }
      setIsRestoring(false)
    }
  }, [isInitialized, isRestoring])

  // Salvar estado quando o usuário sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveNavigationState()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveNavigationState()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [selectedMeals])

  // Memoized set of used recipe IDs to prevent duplicates
  const usedRecipeIds = useMemo(() => {
    return new Set(menu.map(slot => slot.recipe?.id).filter(Boolean) as string[])
  }, [menu])

  // Fetches recipes for a meal category and caches them
  const ensureRecipePool = useCallback(async (meal: Meal): Promise<Recipe[]> => {
    if (recipePool[meal]) {
      return recipePool[meal]
    }
    const recipes = await loadRecipesByCategory(meal)
    setRecipePool(prev => ({ ...prev, [meal]: recipes }))
    return recipes
  }, [recipePool])

  // --- User Actions ---

  const generateNewMenu = async () => {
    if (userId && savedMenuId) {
      const confirmed = await new Promise<boolean>((resolve) => {
        // Criar um toast customizado com botões
        const toastId = toast(
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            minWidth: '300px'
          }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#374151',
              textAlign: 'center',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              Vamos atualizar suas receitas da semana, Chef?
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '400',
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Gerar um novo cardápio substituirá o cardápio salvo anteriormente. Deseja continuar?
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              justifyContent: 'center',
              marginTop: '8px'
            }}>
              <button
                onClick={() => {
                  toast.dismiss(toastId)
                  resolve(true)
                }}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#22c55e',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#16a34a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#22c55e'
                }}
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  toast.dismiss(toastId)
                  resolve(false)
                }}
                style={{
                  padding: '6px 12px',
                  border: '1px solid rgb(211, 84, 0)',
                  borderRadius: '6px',
                  background: 'rgb(211, 84, 0)',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgb(180, 70, 0)'
                  e.currentTarget.style.borderColor = 'rgb(180, 70, 0)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgb(211, 84, 0)'
                  e.currentTarget.style.borderColor = 'rgb(211, 84, 0)'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>,
          {
            duration: Infinity,
            style: {
              minWidth: 'fit-content',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'left',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }
          }
        )
      })
      
      if (!confirmed) return
    }

    // Iniciar contador para mostrar toast de preparação se demorar mais de 1 segundo
    let preparationToastId: string | number | null = null
    const preparationTimer = setTimeout(() => {
      preparationToastId = toast(
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          minWidth: '320px'
        }}>
          <div style={{ 
            fontSize: '24px',
            animation: 'spin 1s linear infinite'
          }}>
            🍳
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2px'
          }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#374151',
              whiteSpace: 'nowrap'
            }}>
              Seu novo cardápio está sendo preparado, Chef!
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Um momento...
            </div>
          </div>
        </div>,
        {
          duration: Infinity,
          style: {
            minWidth: 'fit-content',
            padding: '16px 20px',
            borderRadius: '8px',
            textAlign: 'left',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }
        }
      )
    }, 1000)

    try {
      // Primeiro, criar todos os slots baseados nas seleções atuais
      const newMenu: MenuSlot[] = []
      const takenRecipeIds = new Set<string>()
      let shortages = 0

      for (const day of DAYS) {
        const mealsForDay = selectedMeals[day] || []
        for (const meal of mealsForDay) {
          const recipeList = await ensureRecipePool(meal)
          const availableRecipes = recipeList.filter(r => !takenRecipeIds.has(r.id))
          
          let pickedRecipe: Recipe | null = null;
          if (availableRecipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableRecipes.length)
            pickedRecipe = availableRecipes[randomIndex]
            if (pickedRecipe) takenRecipeIds.add(pickedRecipe.id)
          } else {
            shortages++
          }
          
          newMenu.push({ id: `${day}-${meal}`, day, meal, recipe: pickedRecipe })
        }
      }

      // Manter slots existentes que não foram regenerados (permitir edição manual)
      const existingSlots = menu.filter(slot => {
        const isSelected = selectedMeals[slot.day]?.includes(slot.meal)
        const wasRegenerated = newMenu.some(newSlot => newSlot.id === slot.id)
        return !isSelected || !wasRegenerated
      })

      // Combinar slots existentes com novos slots
      const combinedMenu = [...existingSlots, ...newMenu]
      
      // Remover duplicatas (manter o mais recente)
      const uniqueMenu = combinedMenu.reduce((acc, slot) => {
        acc[slot.id] = slot
        return acc
      }, {} as Record<string, MenuSlot>)

      setMenu(Object.values(uniqueMenu))
      
      if (shortages > 0) {
        toast.warning(`Cardápio gerado com ${shortages} posição(ões) sem sugestão por falta de receitas únicas.`, {
          style: {
            minWidth: 'fit-content',
            padding: '12px 16px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }
        })
      } else {
        toast.success(
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
            gap: '4px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              Cardápio gerado com sucesso!
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              Revise e salve para ver a lista de compras.
            </div>
          </div>,
          {
            style: {
              minWidth: 'fit-content',
              padding: '16px 24px',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          }
        )
      }
    } catch (error) {
      console.error('Erro ao gerar cardápio:', error)
              toast.error('Erro ao gerar o cardápio. Tente novamente.', {
          style: toastStyles.error
        })
    } finally {
      // Limpar timer e fechar toast de preparação se existir
      clearTimeout(preparationTimer)
      if (preparationToastId) {
        toast.dismiss(preparationToastId)
      }
    }
  }

  const handleSaveMenu = async () => {
    if (!userId) return toast.error('Faça login para salvar o cardápio.', {
      style: toastStyles.error
    })
    setIsSaving(true)
    
    try {
      // Usar exatamente o que está sendo exibido na página (groupedMenu)
      const menuData: MenuData = {}
      const allDisplayedSlots = Object.values(groupedMenu).flat()
      
      for (const slot of allDisplayedSlots) {
        if (slot.recipe) {
          if (!menuData[slot.day]) menuData[slot.day] = {}
          menuData[slot.day][slot.meal] = slot.recipe.id
        }
      }
      
      // Verificar se há pelo menos uma receita para salvar
      const hasRecipes = Object.values(menuData).some(dayMeals => Object.keys(dayMeals).length > 0)
      if (!hasRecipes) {
        toast.warning('Adicione pelo menos uma receita ao cardápio antes de salvar.', {
          style: {
            minWidth: 'fit-content',
            padding: '12px 16px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }
        })
        return
      }
      
      const menuId = await saveOrUpdateMenu(userId, menuName, menuData, { allowRepeats: true, startDate: null, endDate: null })
      if (!menuId) throw new Error('Falha ao salvar o cardápio.')
      
      setSavedMenuId(menuId)
      // Salvar nome no localStorage para uso na página de shopping
      localStorage.setItem('current-menu-name', menuName)
      
      // Limpar marcações da lista de compras do cardápio anterior
      if (savedMenuId) {
        const oldMenuKey = `shopping-list-checked-items-${savedMenuId}`
        localStorage.removeItem(oldMenuKey)
      }
      
      // Atualizar o estado do menu para refletir exatamente o que foi salvo
      setMenu(allDisplayedSlots.filter(slot => slot.recipe))
      
      toast.success(
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          textAlign: 'center',
          gap: '4px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            Cardápio salvo com sucesso!
          </div>
          <div style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280' }}>
            Lista de compras atualizada automaticamente
          </div>
        </div>,
        {
          style: {
            minWidth: 'fit-content',
            padding: '16px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }
      )
    } catch (e: any) {
      console.error('Erro ao salvar cardápio:', e)
      toast.error(`Erro ao salvar: ${e.message}`, {
        style: toastStyles.error
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenCatalog = async (slot: MenuSlot) => {
    setShowCatalog(slot)
    // Limpar filtros ao abrir o catálogo
    setCatalogFilters({ q: '', category: '', time: 'any', difficulty: 'any', diet: 'all' })
    const allRecipes = await loadAllRecipes()
    setCatalogRecipes(allRecipes)
  }

  const handleSelectFromCatalog = (recipe: Recipe) => {
    if (!showCatalog) return
    
    setMenu(prevMenu => {
      const existingSlot = prevMenu.find(slot => slot.id === showCatalog.id)
      if (existingSlot) {
        // Atualizar slot existente
        return prevMenu.map(slot => 
          slot.id === showCatalog.id ? { ...slot, recipe } : slot
        )
      } else {
        // Adicionar novo slot
        return [...prevMenu, { ...showCatalog, recipe }]
      }
    })
    
    setShowCatalog(null)
  }


  const handleSaveRecipe = async (recipeId: string) => {
    if (!userId) return
    
    try {
      const next = new Set(savedRecipeIds)
      if (next.has(recipeId)) {
        next.delete(recipeId)
      } else {
        next.add(recipeId)
      }
      setSavedRecipeIds(new Set(next))
      await setSavedRecipeIdsAPI(userId, Array.from(next))
      
      const confirmIds = await getSavedRecipeIds(userId)
      setSavedRecipeIds(new Set(confirmIds))
      
      const saved = confirmIds.includes(recipeId)
      if (saved) {
        const res = await addSavedRecipePoint(userId, confirmIds.length)
        if (res?.leveledUp) {
          toast(`🎉 Você subiu de nível! Agora é ${res.chef_level}.`, {
            style: {
              minWidth: 'fit-content',
              padding: '10px 14px',
              borderRadius: '6px',
              textAlign: 'center'
            }
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
      const refresh = await getSavedRecipeIds(userId)
      setSavedRecipeIds(new Set(refresh))
              toast.error('Não foi possível salvar. Tente novamente.', {
          style: toastStyles.error
        })
    }
  }

  const toggleDaySelection = (day: Day) => {
    setSelectedMeals(prev => {
      const currentMeals = prev[day] || []
      const newMeals = currentMeals.length > 0 ? [] : [...MEALS]
      return { ...prev, [day]: newMeals }
    })
  }

  const toggleMealSelection = (day: Day, meal: Meal) => {
    setSelectedMeals(prev => {
      const currentMeals = new Set(prev[day] || [])
      if (currentMeals.has(meal)) {
        currentMeals.delete(meal)
      } else {
        currentMeals.add(meal)
      }
      const newSelections = { ...prev, [day]: Array.from(currentMeals) }
      
      // Salvar estado atual no sessionStorage para restauração
      saveNavigationState(newSelections)
      
      return newSelections
    })
  }

  // Função para salvar estado de navegação
  const saveNavigationState = (currentSelectedMeals?: Partial<Record<Day, Meal[]>>) => {
    const stateToSave = {
      selectedMeals: currentSelectedMeals || selectedMeals,
      scrollPosition: window.scrollY,
      timestamp: Date.now()
    }
    sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(stateToSave))
  }

  // --- Render Logic ---

  const groupedMenu = useMemo(() => {
    // Criar slots para todos os dias/refeições selecionados, mesmo os vazios
    const allSlots: MenuSlot[] = []
    
    for (const day of DAYS) {
      const mealsForDay = selectedMeals[day] || []
      for (const meal of mealsForDay) {
        const slotId = `${day}-${meal}`
        const existingSlot = menu.find(slot => slot.id === slotId)
        
        if (existingSlot) {
          allSlots.push(existingSlot)
        } else {
          // Criar slot vazio para permitir seleção manual
          allSlots.push({ id: slotId, day, meal, recipe: null })
        }
      }
    }
    
    const grouped = groupBy(allSlots, 'day')
    
    return DAYS.reduce((acc, day) => {
      if (grouped[day]) {
        acc[day] = grouped[day].sort((a, b) => (MEAL_ORDER.get(a.meal)! - MEAL_ORDER.get(b.meal)!))
      }
      return acc
    }, {} as Record<string, MenuSlot[]>)
  }, [menu, selectedMeals])

  // Mostrar loading durante restauração
  if (isRestoring) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: colors.background,
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          animation: 'spin 1s linear infinite', 
          borderRadius: '50%', 
          width: '48px', 
          height: '48px', 
          borderTop: `3px solid ${colors.primary}`, 
          borderBottom: `3px solid ${colors.primary}` 
        }}></div>
        <div style={{ 
          color: colors.text, 
          fontSize: fontSizes.sm,
          fontWeight: '500'
        }}>
          Restaurando seu cardápio...
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Indicador de carregamento */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.background,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `4px solid ${colors.border}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            color: colors.textSecondary,
            fontSize: fontSizes.sm,
            fontWeight: 500,
            margin: 0
          }}>
            Carregando seu cardápio...
          </p>
        </div>
      )}
      
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '24px', 
        backgroundColor: colors.background, 
        minHeight: '100vh', 
        paddingBottom: '88px',
        fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        // Oculta o conteúdo durante o carregamento para evitar o "flash"
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        {/* Header Moderno */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent}08 50%, ${colors.surface} 100%)`,
          padding: '32px 24px',
          borderRadius: '20px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`
        }}>
          {/* Elementos decorativos */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: 0.6,
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '60px',
            height: '60px',
            background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: 0.4,
            animation: 'float 8s ease-in-out infinite reverse'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '4px',
                height: '32px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                borderRadius: '2px'
              }} />
              <Calendar size={24} color={colors.primary} />
              <h1 style={{
                color: colors.primary,
                fontSize: fontSizes['3xl'],
                fontWeight: 800,
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                Cardápio Semanal
              </h1>
            </div>
            <p style={{
              fontSize: fontSizes.lg,
              color: colors.textSecondary,
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.5,
              maxWidth: '600px'
            }}>
              Planeje suas refeições da semana e crie uma lista de compras automática
            </p>
          </div>
        </div>

        {/* Card de Instruções */}
        <div style={{
          background: `linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 50%, #f0fdfa 100%)`,
          border: `2px solid #14b8a6`,
          color: '#115e59',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(20, 184, 166, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }} role="alert">
          {/* Elemento decorativo */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '40px',
            height: '40px',
            background: `radial-gradient(circle, #14b8a620 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: 0.6
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Título do Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChefHat size={24} color="white" />
              </div>
              <h3 style={{ 
                fontWeight: 700, 
                fontSize: fontSizes.xl, 
                margin: 0,
                color: '#115e59'
              }}>
                Seu Guia Rápido para o Cardápio Perfeito
              </h3>
            </div>

            {/* Conteúdo das Instruções */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ 
                fontSize: fontSizes.sm, 
                margin: '0 0 12px 0',
                lineHeight: 1.6,
                color: '#115e59'
              }}>
                <strong>1. Defina sua Semana:</strong> Dê um nome ao cardápio, escolha os dias e quais refeições você quer planejar.
              </p>
              <p style={{ 
                fontSize: fontSizes.sm, 
                margin: '0 0 12px 0',
                lineHeight: 1.6,
                color: '#115e59'
              }}>
                <strong>2. Consultar o Chef:</strong> Clique em "Gerar Cardápio" e nossa inteligência treinada por chefs criará um menu delicioso para você.
              </p>
              <p style={{ 
                fontSize: fontSizes.sm, 
                margin: '0 0 12px 0',
                lineHeight: 1.6,
                color: '#115e59'
              }}>
                <strong>3. Assuma o Comando:</strong> Não gostou de uma sugestão? Clique em "Substituir" e troque por qualquer receita do nosso acervo. Afinal, aqui o Chef é você!
              </p>
              <p style={{ 
                fontSize: fontSizes.sm, 
                margin: '0 0 12px 0',
                lineHeight: 1.6,
                color: '#115e59'
              }}>
                <strong>4. Salve e Relaxe:</strong> Quando seu cardápio estiver perfeito, clique em "Salvar Cardápio" e sua lista de compras será atualizada instantaneamente.
              </p>
            </div>

            {/* Mensagem Final Motivadora */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: fontSizes.sm,
              color: '#115e59'
            }}>
              <Sparkles size={16} />
              Planejamento é o seu ingrediente secreto. Mãos à obra, Chef! 🍳
            </div>
          </div>
        </div>

        {/* Controles Modernos */}
        <div style={{
          background: colors.surface,
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '32px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Linha 1: Input do nome */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              maxWidth: '400px'
            }}>
              <label style={{
                fontSize: fontSizes.sm,
                fontWeight: 600,
                color: colors.text,
                marginBottom: '4px'
              }}>
                Nome do Cardápio
              </label>
              <input 
                placeholder="Ex: Cardápio da Semana" 
                value={menuName} 
                onChange={(e)=>setMenuName(e.target.value)} 
                style={{ 
                  padding: '12px 16px', 
                  border: `2px solid ${colors.border}`, 
                  borderRadius: '12px', 
                  background: colors.background, 
                  color: colors.text, 
                  fontSize: fontSizes.sm,
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary}20`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Linha 2: Botões de ação organizados horizontalmente */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <div style={{
                  width: '3px',
                  height: '16px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  borderRadius: '2px'
                }} />
                <span style={{
                  fontSize: fontSizes.sm,
                  fontWeight: 600,
                  color: colors.textSecondary
                }}>
                  Ações do Cardápio
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
              <button 
                onClick={generateNewMenu} 
                style={{ 
                  background: `linear-gradient(135deg, #22c55e 0%, #16a34a 100%)`,
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: fontSizes.sm,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)'
                }}
              >
                <Sparkles size={16} />
                Gerar Cardápio
              </button>
              
              {/* Separador visual */}
              <div style={{
                width: '1px',
                height: '24px',
                background: colors.border,
                opacity: 0.5
              }} />
              
              <button 
                onClick={handleSaveMenu} 
                disabled={isSaving} 
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                  fontSize: fontSizes.sm,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 2px 8px ${colors.primary}30`
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}40`
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = `0 2px 8px ${colors.primary}30`
                  }
                }}
              >
                <Save size={16} />
                Salvar Cardápio
              </button>
              
              {/* Separador visual */}
              <div style={{
                width: '1px',
                height: '24px',
                background: colors.border,
                opacity: 0.5
              }} />
              
              <button 
                onClick={()=>navigate('/shopping')} 
                style={{ 
                  background: `linear-gradient(135deg, #D35400 0%, #B7410E 100%)`,
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: fontSizes.sm,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(211, 84, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(211, 84, 0, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(211, 84, 0, 0.3)'
                }}
              >
                <ShoppingCart size={16} />
                Lista de Compras
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Seletor de Refeições Moderno */}
        <div style={{
          background: colors.surface,
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '32px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '4px',
              height: '24px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              borderRadius: '2px'
            }} />
            <h3 style={{
              margin: 0,
              color: colors.primary,
              fontSize: fontSizes.xl,
              fontWeight: 700
            }}>
              Configurar Semana
            </h3>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {DAYS.map((day, index) => {
              const meals = selectedMeals[day] || []
              const isDayEnabled = meals.length > 0
              return (
                <div 
                  key={day} 
                  style={{
                    border: `2px solid ${isDayEnabled ? colors.primary : colors.border}`,
                    borderRadius: '16px',
                    padding: '20px',
                    background: isDayEnabled ? `${colors.primary}05` : colors.surface,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Elemento decorativo */}
                  {isDayEnabled && (
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '40px',
                      height: '40px',
                      background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
                      borderRadius: '50%',
                      opacity: 0.6
                    }} />
                  )}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div style={{
                      textTransform: 'capitalize',
                      fontWeight: 700,
                      color: colors.primary,
                      fontSize: fontSizes.lg,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <ChefHat size={18} />
                      {day}
                    </div>
                    <button 
                      onClick={()=>toggleDaySelection(day)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: `2px solid ${isDayEnabled ? colors.primary : colors.border}`,
                        background: isDayEnabled ? colors.primary : colors.surface,
                        color: isDayEnabled ? colors.surface : colors.primary,
                        cursor: 'pointer',
                        fontSize: fontSizes.sm,
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (isDayEnabled) {
                          e.currentTarget.style.background = colors.secondary
                          e.currentTarget.style.borderColor = colors.secondary
                        } else {
                          e.currentTarget.style.background = colors.accent
                          e.currentTarget.style.borderColor = colors.primary
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDayEnabled ? colors.primary : colors.surface
                        e.currentTarget.style.borderColor = isDayEnabled ? colors.primary : colors.border
                      }}
                    >
                      {isDayEnabled ? '✓ Selecionado' : 'Selecionar dia'}
                    </button>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {MEALS.map(meal => {
                      const isMealSelected = meals.includes(meal)
                      return (
                        <button 
                          key={meal} 
                          onClick={()=>toggleMealSelection(day, meal)} 
                          style={{
                            padding: '8px 12px',
                            borderRadius: '20px',
                            border: `2px solid ${isMealSelected ? colors.primary : colors.border}`,
                            background: isMealSelected ? colors.primary : colors.surface,
                            color: isMealSelected ? colors.surface : colors.text,
                            cursor: 'pointer',
                            fontSize: fontSizes.sm,
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            if (isMealSelected) {
                              e.currentTarget.style.background = colors.secondary
                              e.currentTarget.style.borderColor = colors.secondary
                            } else {
                              e.currentTarget.style.background = colors.accent
                              e.currentTarget.style.borderColor = colors.primary
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isMealSelected ? colors.primary : colors.surface
                            e.currentTarget.style.borderColor = isMealSelected ? colors.primary : colors.border
                          }}
                        >
                          {meal === 'Café da manhã' && <Clock size={14} />}
                          {meal === 'Almoço' && <Users size={14} />}
                          {meal === 'Lanche' && <ChefHat size={14} />}
                          {meal === 'Jantar' && <Users size={14} />}
                          {meal === 'Sobremesa' && <Sparkles size={14} />}
                          {meal}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Exibição do Cardápio Moderna */}
        <div style={{ display: 'grid', gap: '24px' }}>
          {Object.entries(groupedMenu).map(([day, slots]) => (
            <div 
              key={day} 
              style={{ 
                background: colors.surface, 
                padding: '24px', 
                borderRadius: '16px', 
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Elemento decorativo */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '60px',
                height: '60px',
                background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
                borderRadius: '50%',
                opacity: 0.6
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '24px',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    borderRadius: '2px'
                  }} />
                  <h3 style={{ 
                    margin: 0, 
                    color: colors.primary, 
                    textTransform: 'capitalize', 
                    fontSize: fontSizes.xl,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Calendar size={20} />
                    {day}
                  </h3>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '16px' 
                }}>
                  {slots.map((slot) => (
                    <div key={slot.id}>
                      {slot.recipe ? (
                        <div style={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: colors.surface,
                          border: `1px solid ${colors.border}`,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)'
                        }}
                        >
                          <RecipeCard
                            recipe={slot.recipe}
                            variant="menu"
                            mealType={slot.meal}
                            onClick={() => setModalRecipe(slot.recipe)}
                            onReplace={() => handleOpenCatalog(slot)}
                          />
                        </div>
                      ) : (
                        <div 
                          onClick={() => handleOpenCatalog(slot)}
                          style={{ 
                            border: `2px dashed ${colors.border}`, 
                            borderRadius: '16px', 
                            overflow: 'hidden', 
                            background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent}05 100%)`, 
                            padding: '32px 20px', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: colors.textSecondary, 
                            fontSize: fontSizes.sm, 
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minHeight: '160px',
                            position: 'relative'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = colors.primary
                            e.currentTarget.style.background = `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary}10 100%)`
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primary}20`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = colors.border
                            e.currentTarget.style.background = `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent}05 100%)`
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px',
                            fontSize: '20px'
                          }}>
                            <Plus size={20} color={colors.primary} />
                          </div>
                          <div style={{ 
                            textAlign: 'center', 
                            fontWeight: '600',
                            color: colors.text,
                            marginBottom: '4px'
                          }}>
                            Adicionar receita
                          </div>
                          <div style={{ 
                            fontSize: fontSizes.sm, 
                            textAlign: 'center',
                            color: colors.textSecondary
                          }}>
                            Clique para escolher
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        <RecipeModal
          recipe={modalRecipe}
          isOpen={!!modalRecipe}
          onClose={() => setModalRecipe(null)}
          onSave={handleSaveRecipe}
          isSaved={modalRecipe ? savedRecipeIds.has(modalRecipe.id) : false}
          userId={userId}
        />

        {showCatalog && (
          <div onClick={()=>setShowCatalog(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:12, zIndex:1200, overflowY:'auto' }}>
            <div onClick={(e)=>e.stopPropagation()} style={{ width:'100%', maxWidth:1080, background: colors.surface, borderRadius:12, marginTop:'5vh', marginBottom:'5vh', display:'flex', flexDirection:'column', minHeight:'90vh' }}>
              <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {showCatalog && <div style={{ fontWeight:800, color: colors.primary, fontSize: fontSizes.lg }}>Substitua {showCatalog.meal} de {showCatalog.day}</div>}
                  <div style={{ color: colors.textSecondary, fontSize: fontSizes.sm }}>Encontre a receita perfeita para cada momento</div>
                </div>
                <button onClick={()=>setShowCatalog(null)} aria-label="Fechar" style={{ width:36, height:36, borderRadius:'50%', border:'none', background: colors.accent, color: colors.text, cursor:'pointer', fontSize: fontSizes.lg }}>×</button>
              </div>
              <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'grid', gap: '16px' }}>
                <input 
                  value={catalogFilters.q} 
                  onChange={(e) => setCatalogFilters(f => ({ ...f, q: e.target.value }))} 
                  placeholder="Busque por nome ou ingrediente" 
                  style={{ 
                    padding: '10px 12px', 
                    border: `1px solid ${colors.border}`, 
                    borderRadius: 8,
                    background: colors.background,
                    color: colors.text,
                    fontSize: fontSizes.sm
                  }} 
                />
                
                {/* Filtros de Categoria (Tipo de Refeição) */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {MEALS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setCatalogFilters(f => ({ ...f, category: c === catalogFilters.category ? '' : c }))} 
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: 16, 
                        border: `1px solid ${colors.border}`, 
                        background: catalogFilters.category === c ? colors.primary : colors.surface, 
                        color: catalogFilters.category === c ? colors.surface : colors.primary, 
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                
                {/* Filtros de Tempo */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {TIME_OPTIONS.map(t => (
                    <button 
                      key={t} 
                      onClick={() => setCatalogFilters(f => ({ ...f, time: t }))} 
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: 16, 
                        border: `1px solid ${colors.border}`, 
                        background: catalogFilters.time === t ? colors.primary : colors.surface, 
                        color: catalogFilters.time === t ? colors.surface : colors.primary, 
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {t === 'any' ? 'Qualquer tempo' : t === '<=15' ? 'Até 15 min' : t === '15-30' ? '15-30 min' : t === '30-60' ? '30-60 min' : 'Mais de 1h'}
                    </button>
                  ))}
                </div>
                
                {/* Filtros de Dificuldade */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {DIFFICULTY_OPTIONS.map(d => (
                    <button 
                      key={d} 
                      onClick={() => setCatalogFilters(f => ({ ...f, difficulty: d }))} 
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: 16, 
                        border: `1px solid ${colors.border}`, 
                        background: catalogFilters.difficulty === d ? colors.primary : colors.surface, 
                        color: catalogFilters.difficulty === d ? colors.surface : colors.primary, 
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {d === 'any' ? 'Qualquer' : d}
                    </button>
                  ))}
                </div>
                
                {/* Filtros de Dieta */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {DIET_OPTIONS.map(d => (
                    <button 
                      key={d} 
                      onClick={() => setCatalogFilters(f => ({ ...f, diet: d }))} 
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: 16, 
                        border: `1px solid ${colors.border}`, 
                        background: catalogFilters.diet === d ? colors.primary : colors.surface, 
                        color: catalogFilters.diet === d ? colors.surface : colors.primary, 
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {d === 'all' ? 'Todas' : d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '20px', flex: 1 }}>
                <RecipeCatalog
                  data={displayedCatalogRecipes}
                  filters={catalogFilters}
                  onSelect={handleSelectFromCatalog}
                  userTaken={usedRecipeIds}
                  onOpenDetails={(r)=>setModalRecipe(r)}
                  totalFilteredCount={filteredCatalogRecipes.length}
                />
                
                {/* Elemento para carregar mais receitas */}
                {hasMoreCatalog && (
                  <div 
                    ref={setCatalogLoadMoreRef}
                    style={{ 
                      height: '40px', 
                      marginTop: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isLoadingMoreCatalog && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: colors.textSecondary,
                        fontSize: fontSizes.sm,
                        fontWeight: 500
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          border: `2px solid ${colors.border}`,
                          borderTop: `2px solid ${colors.primary}`,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Carregando mais receitas...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
      
      {/* Animações CSS */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  )
}
