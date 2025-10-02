import React from 'react'
import type { Recipe } from '@/types/supabase'
import { useAppPreferences } from '@/contexts/AppPreferencesContext'
import { formatIngredientForRecipe } from '@/lib/recipeFormatter'
import { X, Heart, Clock, Flame, Star, Users } from 'lucide-react'

interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
  onSave?: (recipeId: string) => void
  isSaved?: boolean
  userId?: string | null
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onSave,
  isSaved = false,
  userId
}) => {
  const { colors, fontSizes } = useAppPreferences()

  if (!isOpen || !recipe) return null

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSave && userId) {
      onSave(recipe.id)
    }
  }

  return (
    <div 
      onClick={onClose} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.6)', 
        backdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '100%', 
          maxWidth: '900px', 
          background: colors.surface, 
          borderRadius: '20px', 
          overflow: 'hidden', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${colors.border}`
        }}
      >
        {/* Header com imagem e botões */}
        <div style={{ position: 'relative', height: '300px' }}>
          {recipe.image_url ? (
            <img 
              src={recipe.image_url} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }} 
              alt={recipe.title} 
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accent}80 100%)`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '64px',
              opacity: 0.8
            }}>
              🍽️
            </div>
          )}
          
          {/* Overlay gradiente */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
            pointerEvents: 'none'
          }} />
          
          {/* Botão fechar */}
          <button 
            onClick={onClose} 
            aria-label="Fechar" 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              border: 'none', 
              background: 'rgba(255, 255, 255, 0.95)', 
              color: colors.text, 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            <X size={20} />
          </button>
          
          {/* Botão salvar - apenas se usuário logado */}
          {userId && onSave && (
            <button
              onClick={handleSaveClick}
              aria-label="Salvar"
              title={isSaved ? 'Remover dos salvos' : 'Salvar nos favoritos'}
              style={{ 
                position: 'absolute', 
                bottom: '16px', 
                right: '16px', 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                border: 'none', 
                background: isSaved ? '#dc2626' : colors.primary, 
                color: '#fff', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
              }}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        
        {/* Conteúdo scrollável */}
        <div style={{ 
          padding: '24px', 
          overflow: 'auto',
          flex: 1,
          maxHeight: 'calc(95vh - 300px)' // Altura total menos header da imagem
        }}>
          {/* Título */}
          <h2 style={{ 
            margin: '0 0 8px', 
            color: colors.primary, 
            fontSize: fontSizes['2xl'],
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.01em'
          }}>
            {recipe.title}
          </h2>
          
          {/* Descrição */}
          {recipe.description && (
            <div style={{ 
              color: colors.textSecondary, 
              marginBottom: '20px', 
              fontSize: fontSizes.base,
              lineHeight: 1.5,
              fontWeight: 500
            }}>
              {recipe.description}
            </div>
          )}
          
          {/* Tags de informações modernizadas */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            marginBottom: '24px', 
            color: colors.text 
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: `${colors.primary}15`, 
              color: colors.primary, 
              padding: '8px 12px', 
              borderRadius: '12px', 
              fontSize: fontSizes.sm,
              fontWeight: 600,
              border: `1px solid ${colors.primary}30`
            }}>
              <Clock size={16} />
              <span>{recipe.time} min</span>
            </div>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: `${colors.secondary}15`, 
              color: colors.secondary, 
              padding: '8px 12px', 
              borderRadius: '12px', 
              fontSize: fontSizes.sm,
              fontWeight: 600,
              border: `1px solid ${colors.secondary}30`
            }}>
              <Flame size={16} />
              <span>{recipe.difficulty}</span>
            </div>
            
            {recipe.calories && (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: `${colors.accent}`, 
                color: colors.text, 
                padding: '8px 12px', 
                borderRadius: '12px', 
                fontSize: fontSizes.sm,
                fontWeight: 600,
                border: `1px solid ${colors.border}`
              }}>
                <span>🔥</span>
                <span>{recipe.calories} kcal</span>
              </div>
            )}
            
            {recipe.rating && (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: `${colors.accent}`, 
                color: colors.text, 
                padding: '8px 12px', 
                borderRadius: '12px', 
                fontSize: fontSizes.sm,
                fontWeight: 600,
                border: `1px solid ${colors.border}`
              }}>
                <Star size={16} fill="currentColor" />
                <span>{recipe.rating.toFixed(1)}</span>
              </div>
            )}
            
            {recipe.servings && (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: `${colors.accent}`, 
                color: colors.text, 
                padding: '8px 12px', 
                borderRadius: '12px', 
                fontSize: fontSizes.sm,
                fontWeight: 600,
                border: `1px solid ${colors.border}`
              }}>
                <Users size={16} />
                <span>{recipe.servings} {recipe.servings > 1 ? 'porções' : 'porção'}</span>
              </div>
            )}
            
            <div style={{ 
              background: `${colors.accent}`, 
              color: colors.text, 
              padding: '8px 12px', 
              borderRadius: '12px', 
              fontSize: fontSizes.sm,
              fontWeight: 600,
              border: `1px solid ${colors.border}`
            }}>
              {recipe.diet}
            </div>
          </div>
          
          {/* Ingredientes e Instruções */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {/* Ingredientes */}
            <div>
              <h4 style={{ 
                margin: '0 0 6px', 
                color: colors.primary, 
                fontSize: fontSizes.base 
              }}>
                Ingredientes
              </h4>
              <div style={{ 
                background: colors.accent, 
                padding: 12, 
                borderRadius: 8, 
                border: `1px solid ${colors.border}`,
                marginBottom: 8
              }}>
                {(recipe.structured_ingredients || []).map((ing, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: fontSizes.sm, 
                    marginBottom: 8,
                    padding: '8px 12px',
                    background: colors.surface,
                    borderRadius: 6,
                    border: `1px solid ${colors.border}`
                  }}>
                    <input 
                      type="checkbox" 
                      id={`ingredient-${idx}`}
                      style={{ 
                        width: '18px', 
                        height: '18px',
                        accentColor: colors.primary
                      }}
                    />
                    <label 
                      htmlFor={`ingredient-${idx}`}
                      style={{ 
                        flex: 1,
                        cursor: 'pointer',
                        color: colors.text,
                        fontWeight: 500
                      }}
                    >
                      {formatIngredientForRecipe(ing)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Instruções */}
            <div>
              <h4 style={{ 
                margin: '0 0 6px', 
                color: colors.primary, 
                fontSize: fontSizes.base 
              }}>
                Modo de preparo
              </h4>
              <div style={{ color: colors.text }}>
                {(() => {
                  let stepCounter = 0;
                  return (recipe.instructions || []).map((line, index) => {
                    // Verifica se é um título de seção (▶️ ou texto em maiúsculas)
                    const isSectionTitle = line.startsWith('▶️') || 
                      (/^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝ\s:]+$/.test(line.trim()) && 
                       line.trim().length < 60 && 
                       !line.includes('°C') && 
                       !line.includes('min') && 
                       !line.includes('aqueça') &&
                       !line.includes('misture') &&
                       !line.includes('adicione') &&
                       !line.includes('cozinhe'));
                    
                    if (isSectionTitle) {
                      return (
                        <h4 key={index} style={{ 
                          marginTop: '1.5em', 
                          marginBottom: '0.5em', 
                          fontWeight: 'bold', 
                          color: colors.primary,
                          fontSize: fontSizes.base
                        }}>
                          {line.replace('▶️', '').trim()}
                        </h4>
                      );
                    } else {
                      stepCounter++;
                      const isTip = line.startsWith('💡');
                      const content = isTip ? line.substring(1).trim() : line;
                      
                      return (
                        <div key={index} style={{ display: 'flex', alignItems: 'flex-start', margin: '0.5em 0', lineHeight: 1.5, fontSize: fontSizes.sm }}>
                          <span style={{ minWidth: '2em', fontWeight: 'bold', color: colors.primary }}>{stepCounter}.</span>
                          <span>{isTip ? <i>💡 {content}</i> : content}</span>
                        </div>
                      );
                    }
                  });
                })()}
              </div>
            </div>
            
            {/* Dicas do Chef */}
            {recipe.tips && Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
              <div>
                <h4 style={{ 
                  margin: '16px 0 6px', 
                  color: colors.primary, 
                  fontSize: fontSizes.base,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>👨‍🍳</span>
                  Dicas do Chef
                </h4>
                <div style={{ 
                  background: colors.accent, 
                  padding: 12, 
                  borderRadius: 8, 
                  border: `1px solid ${colors.border}`,
                  marginBottom: 8
                }}>
                  <div style={{ color: colors.text, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(recipe.tips || []).map((tip, idx) => {
                      const parts = tip.split(/:(.*)/s); // Divide no primeiro ":" e captura o resto
                      const hasTitle = parts.length > 1;

                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', fontSize: fontSizes.sm, lineHeight: 1.5 }}>
                          <span style={{ marginRight: '8px', color: colors.primary, fontSize: '16px' }}>💡</span>
                          <div>
                            {hasTitle ? (
                              <>
                                <strong style={{ fontWeight: 'bold' }}>{parts[0]}:</strong>
                                <span>{parts[1]}</span>
                              </>
                            ) : (
                              <span>{tip}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Animações CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}
