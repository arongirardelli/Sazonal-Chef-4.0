import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase'
import { getShoppingSource } from '@/services/menuService'
import { buildShoppingList, type ShoppingList as ShoppingListType } from '@/lib/shoppingListBuilder'
import { toast } from 'sonner'
import { toastStyles } from '../lib/toastStyles'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { ShoppingCart, ArrowLeft, CheckCircle, ChefHat, Sparkles, Package, Leaf, Droplets, Wheat } from 'lucide-react'

// Interface para controlar o estado dos itens marcados
interface CheckedItemsState {
  [key: string]: boolean // key: "category-index" ou "optional-index"
}

export const ShoppingList: React.FC = () => {
  const { colors, fontSizes, theme } = useAppPreferences()
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [view, setView] = useState<ShoppingListType | null>(null)
  const [checkedItems, setCheckedItems] = useState<CheckedItemsState>({})
  const [menuName, setMenuName] = useState<string>('Cardápio Semanal')
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null)

  // Função para obter o ID do cardápio atual
  const getCurrentMenuId = async (): Promise<string | null> => {
    if (!userId) return null
    try {
      const { data } = await supabase
        .from('user_menus')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      return data?.id || null
    } catch (error) {
      console.error('Erro ao obter ID do cardápio:', error)
      return null
    }
  }

  // Função para salvar estado dos itens marcados no localStorage (específico do cardápio)
  const saveCheckedItems = (items: CheckedItemsState, menuId: string | null) => {
    if (!menuId) return
    try {
      const key = `shopping-list-checked-items-${menuId}`
      localStorage.setItem(key, JSON.stringify(items))
    } catch (error) {
      console.error('Erro ao salvar itens marcados:', error)
    }
  }

  // Função para carregar estado dos itens marcados do localStorage (específico do cardápio)
  const loadCheckedItems = (menuId: string | null): CheckedItemsState => {
    if (!menuId) return {}
    try {
      const key = `shopping-list-checked-items-${menuId}`
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.error('Erro ao carregar itens marcados:', error)
      return {}
    }
  }

  // Função para limpar marcações de cardápios antigos (manter apenas os últimos 5)
  const cleanupOldMenuMarkings = async () => {
    if (!userId) return
    try {
      const { data: menus } = await supabase
        .from('user_menus')
        .select('id, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(10) // Buscar mais para ter margem de segurança

      if (!menus || menus.length <= 5) return

      // Manter apenas os 5 cardápios mais recentes
      const menusToKeep = menus.slice(0, 5).map(m => m.id)
      const menusToRemove = menus.slice(5).map(m => m.id)

      // Remover marcações dos cardápios antigos
      menusToRemove.forEach(menuId => {
        const key = `shopping-list-checked-items-${menuId}`
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Erro ao limpar marcações antigas:', error)
    }
  }

  // Função para alternar estado de um item
  const toggleItem = (itemKey: string) => {
    setCheckedItems(prev => {
      const newState = { ...prev, [itemKey]: !prev[itemKey] }
      saveCheckedItems(newState, currentMenuId)
      return newState
    })
  }

  // Função para limpar todos os itens marcados
  const clearAllChecked = () => {
    setCheckedItems({})
    saveCheckedItems({}, currentMenuId)
    toast('✅ Lista de compras resetada!', {
      style: toastStyles.success
    })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id || null))
  }, [])

  // Carregar ID do cardápio atual e estado dos itens marcados
  useEffect(() => {
    const loadMenuData = async () => {
      if (!userId) return
      
      const menuId = await getCurrentMenuId()
      setCurrentMenuId(menuId)
      
      if (menuId) {
        const savedCheckedItems = loadCheckedItems(menuId)
        setCheckedItems(savedCheckedItems)
        
        // Limpar marcações antigas
        await cleanupOldMenuMarkings()
      }
    }
    
    loadMenuData()
  }, [userId])

  // Carregar nome do cardápio do localStorage
  useEffect(() => {
    const savedMenuName = localStorage.getItem('current-menu-name')
    if (savedMenuName) {
      setMenuName(savedMenuName)
    }
  }, [])

  // Atualizar nome do cardápio e recarregar marcações quando a página receber foco
  useEffect(() => {
    const handleFocus = async () => {
      const savedMenuName = localStorage.getItem('current-menu-name')
      if (savedMenuName && savedMenuName !== menuName) {
        setMenuName(savedMenuName)
      }
      
      // Recarregar ID do cardápio e marcações quando voltar para a aba
      if (userId) {
        const menuId = await getCurrentMenuId()
        if (menuId !== currentMenuId) {
          setCurrentMenuId(menuId)
          const savedCheckedItems = loadCheckedItems(menuId)
          setCheckedItems(savedCheckedItems)
        }
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [menuName, userId, currentMenuId])

  useEffect(() => {
    (async () => {
      if (!userId) return
      try {
        const src = await getShoppingSource(userId)
        setView(buildShoppingList(src))
      } catch (e:any) {
        toast.error(`Erro ao carregar lista: ${e.message}`)
      }
    })()
  }, [userId])

  // Função para obter ícone da categoria
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('hortifruti') || categoryLower.includes('vegetais') || categoryLower.includes('frutas')) {
      return <Leaf size={20} color="#8B4513" />
    } else if (categoryLower.includes('carnes') || categoryLower.includes('proteína')) {
      return <Package size={20} color="#8B4513" />
    } else if (categoryLower.includes('laticínios') || categoryLower.includes('leite')) {
      return <Droplets size={20} color="#8B4513" />
    } else if (categoryLower.includes('padaria') || categoryLower.includes('pão')) {
      return <Wheat size={20} color="#8B4513" />
    } else {
      return <ShoppingCart size={20} color="#8B4513" />
    }
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
      `}</style>
      
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '24px', 
        backgroundColor: colors.background, 
        minHeight: '100vh',
        fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
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
            background: `radial-gradient(circle, #8B451310 0%, transparent 70%)`,
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
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '4px',
                height: '32px',
                background: `linear-gradient(135deg, #8B4513 0%, ${colors.secondary} 100%)`,
                borderRadius: '2px'
              }} />
              <ShoppingCart size={24} color="#8B4513" />
              <h1 style={{
                color: '#8B4513',
                fontSize: fontSizes['3xl'],
                fontWeight: 800,
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                Lista de Compras
              </h1>
            </div>
            
            {/* Div do nome do cardápio */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: `linear-gradient(135deg, #8B451315 0%, ${colors.secondary}15 100%)`,
              padding: '8px 16px',
              borderRadius: '12px',
              border: `1px solid #8B451330`,
              marginTop: '12px',
              alignSelf: 'flex-start'
            }}>
              <ChefHat size={20} color="#8B4513" />
              <span style={{
                fontSize: fontSizes.sm,
                fontWeight: 600,
                color: '#8B4513'
              }}>
                {menuName}
              </span>
            </div>
            
            <p style={{
              fontSize: fontSizes.lg,
              color: colors.textSecondary,
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.5,
              maxWidth: '600px'
            }}>
              Ingredientes organizados por categoria para facilitar suas compras
            </p>
          </div>
        </div>

        {/* Mensagem do Chef Modernizada */}
        <div style={{ 
          background: theme === 'dark' 
            ? `linear-gradient(135deg, #F5F5DC 0%, #F8F8F8 100%)` 
            : `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent} 100%)`,
          border: `2px solid #2C5530`,
          color: '#2C5530',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(44, 85, 48, 0.15)',
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
            background: `radial-gradient(circle, #2C553020 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: 0.6
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
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
                background: '#2C5530',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(44,85,48,0.3)'
              }}>
                <ChefHat size={24} color="white" />
              </div>
              <h3 style={{ 
                fontWeight: 700, 
                fontSize: fontSizes.xl, 
                margin: 0,
                color: '#115e59'
              }}>
                Chef, sua lista está pronta!
              </h3>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ 
                fontSize: fontSizes.sm, 
                margin: '0 0 12px 0',
                lineHeight: 1.6,
                color: '#115e59'
              }}>
                Calculei as quantidades, esta lista de compras mostra os valores exatos dos ingredientes para você realizar as receitas do seu cardápio.
              </p>
              <p style={{ 
                fontSize: fontSizes.sm, 
                margin: '0 0 12px 0',
                lineHeight: 1.6,
                color: '#115e59'
              }}>
                Uma dica de mestre: no hortifruti, as unidades (ex: 3 cenouras) são apenas seu guia visual para facilitar no momento da compra, mas o peso em gramas é sua garantia de precisão e mostra a quantidade que você precisa, considerando que os tamanhos dos alimentos variam.
              </p>
              <p style={{ 
                fontSize: fontSizes.sm, 
                margin: '0 0 12px 0',
                lineHeight: 1.6,
                color: '#115e59'
              }}>
                Antes de ir, confira a despensa e a geladeira para comprar somente o necessário e evitar o desperdício.
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: fontSizes.sm,
              color: '#115e59'
            }}>
              <Sparkles size={16} />
              Boas compras, te vejo na cozinha! 👨‍🍳
            </div>
          </div>
        </div>
        
        {/* Botões de Navegação e Controle */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '32px',
          gap: '16px'
        }}>
          <button 
            onClick={()=>navigate('/menu')} 
            style={{ 
              padding: '12px 20px', 
              border: `2px solid #8B4513`, 
              background: 'transparent', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              color: '#8B4513', 
              fontSize: fontSizes.sm,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8B4513'
              e.currentTarget.style.color = colors.surface
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = colors.primary
            }}
          >
            <ArrowLeft size={16} />
            Voltar ao Cardápio
          </button>

          {/* Botão para limpar itens marcados */}
          {Object.keys(checkedItems).length > 0 && (
            <button 
              onClick={clearAllChecked} 
              style={{ 
                background: `linear-gradient(135deg, ${colors.secondary} 0%, #B7410E 100%)`, 
                color: '#fff', 
                padding: '12px 16px', 
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
              <CheckCircle size={16} />
              Limpar Marcados ({Object.keys(checkedItems).length})
            </button>
          )}
        </div>

        {!view ? (
          <div style={{ 
            background: colors.surface, 
            padding: '32px', 
            borderRadius: '16px', 
            color: colors.text, 
            fontSize: fontSizes.lg,
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.accent} 0%, #8B451320 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingCart size={32} color={colors.primary} />
              </div>
              <p style={{ margin: 0, fontWeight: 500 }}>
                Nenhum item na lista de compras
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Categorias Principais */}
            <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
              {Object.entries(view.items).map(([cat, items]) => (
                <div 
                  key={cat} 
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
                    top: '-20px',
                    right: '-20px',
                    width: '40px',
                    height: '40px',
                    background: `radial-gradient(circle, #8B451310 0%, transparent 70%)`,
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
                        background: `linear-gradient(135deg, #8B4513 0%, ${colors.secondary} 100%)`,
                        borderRadius: '2px'
                      }} />
                      {getCategoryIcon(cat)}
                      <h3 style={{ 
                        margin: 0, 
                        color: '#8B4513', 
                        fontSize: fontSizes.xl,
                        fontWeight: 700
                      }}>
                        {cat}
                      </h3>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {items.map((it, idx) => {
                        const itemKey = `${cat}-${idx}`
                        const isChecked = checkedItems[itemKey] || false
                        
                        return (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              fontSize: fontSizes.sm, 
                              padding: '16px 20px',
                              background: isChecked 
                                ? `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent} 100%)`
                                : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.surface} 100%)`,
                              borderRadius: '12px',
                              border: isChecked 
                                ? `2px solid ${colors.primary}`
                                : `1px solid ${colors.border}`,
                              color: isChecked ? colors.primary : colors.text,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              opacity: isChecked ? 0.8 : 1,
                              textDecoration: isChecked ? 'line-through' : 'none'
                            }}
                            onClick={() => toggleItem(itemKey)}
                            onMouseEnter={(e) => {
                              if (!isChecked) {
                                e.currentTarget.style.background = `linear-gradient(135deg, #8B451310 0%, ${colors.accent} 100%)`
                                e.currentTarget.style.borderColor = '#8B4513'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = `0 4px 12px #8B451320`
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isChecked) {
                                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.accent} 0%, ${colors.surface} 100%)`
                                e.currentTarget.style.borderColor = colors.border
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                              }
                            }}
                          >
                            <div style={{
                              position: 'relative',
                              width: '20px',
                              height: '20px'
                            }}>
                              <input 
                                type="checkbox" 
                                id={`item-${cat}-${idx}`}
                                checked={isChecked}
                                onChange={() => toggleItem(itemKey)}
                                style={{ 
                                  width: '20px', 
                                  height: '20px',
                                  accentColor: '#8B4513',
                                  cursor: 'pointer'
                                }}
                              />
                            </div>
                            <label 
                              htmlFor={`item-${cat}-${idx}`}
                              style={{ 
                                flex: 1,
                                cursor: 'pointer',
                                fontWeight: isChecked ? 400 : 500,
                                fontSize: fontSizes.sm,
                                lineHeight: 1.4
                              }}
                            >
                              {it.displayText}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Itens Opcionais */}
            {view.optionalItems.length > 0 && (
              <div style={{ 
                background: colors.surface, 
                padding: '24px', 
                borderRadius: '16px', 
                marginBottom: '32px', 
                border: `2px dashed ${colors.secondary}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Elemento decorativo */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '40px',
                  height: '40px',
                  background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
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
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, #8B4513 100%)`,
                      borderRadius: '2px'
                    }} />
                    <Sparkles size={20} color={colors.secondary} />
                    <h3 style={{ 
                      margin: 0, 
                      color: colors.secondary, 
                      fontSize: fontSizes.xl,
                      fontWeight: 700
                    }}>
                      Itens Opcionais e Temperos
                    </h3>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {view.optionalItems.map((it, idx) => {
                      const itemKey = `optional-${idx}`
                      const isChecked = checkedItems[itemKey] || false
                      
                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: fontSizes.sm, 
                            padding: '16px 20px',
                            background: isChecked 
                              ? `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.accent} 100%)`
                              : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.surface} 100%)`,
                            borderRadius: '12px',
                            border: isChecked 
                              ? `2px solid ${colors.secondary}`
                              : `1px dashed ${colors.secondary}`,
                            color: isChecked ? colors.secondary : colors.text,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            opacity: isChecked ? 0.8 : 1,
                            textDecoration: isChecked ? 'line-through' : 'none'
                          }}
                          onClick={() => toggleItem(itemKey)}
                          onMouseEnter={(e) => {
                            if (!isChecked) {
                              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.accent} 100%)`
                              e.currentTarget.style.borderColor = colors.secondary
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.secondary}20`
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isChecked) {
                              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.accent} 0%, ${colors.surface} 100%)`
                              e.currentTarget.style.borderColor = `1px dashed ${colors.secondary}`
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = 'none'
                            }
                          }}
                        >
                          <div style={{
                            position: 'relative',
                            width: '20px',
                            height: '20px'
                          }}>
                            <input 
                              type="checkbox" 
                              id={`optional-${idx}`}
                              checked={isChecked}
                              onChange={() => toggleItem(itemKey)}
                              style={{ 
                                width: '20px', 
                                height: '20px',
                                accentColor: colors.secondary,
                                cursor: 'pointer'
                              }}
                            />
                          </div>
                          <label 
                            htmlFor={`optional-${idx}`}
                            style={{ 
                              flex: 1,
                              cursor: 'pointer',
                              fontWeight: isChecked ? 400 : 500,
                              fontSize: fontSizes.sm,
                              lineHeight: 1.4
                            }}
                          >
                            {it.displayText}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Resumo Final */}
            <div style={{ 
              background: `linear-gradient(135deg, #2C5530 0%, #1e3a22 100%)`, 
              color: colors.surface, 
              padding: '24px', 
              borderRadius: '16px', 
              fontSize: fontSizes.lg,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Elemento decorativo */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '60px',
                height: '60px',
                background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                borderRadius: '50%',
                opacity: 0.6
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <CheckCircle size={24} />
                  <span>Resumo da Lista</span>
                </div>
                <div style={{ fontSize: fontSizes.sm, opacity: 0.9 }}>
                  <strong>{view.summary.totalItems}</strong> itens em <strong>{view.summary.totalCategories}</strong> categorias
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}


