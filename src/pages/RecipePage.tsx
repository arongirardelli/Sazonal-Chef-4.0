// src/pages/RecipePage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase';
import type { Recipe } from '@/types/supabase';
import { formatIngredientForRecipe } from '@/lib/recipeFormatter';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { addRecipeViewPoint } from '@/services/gamificationService';
import { toast } from 'sonner';
import { ArrowLeft, Heart, Clock, Flame, Star, Users } from 'lucide-react';

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', width: '8rem', height: '8rem', borderTop: '2px solid #22c55e', borderBottom: '2px solid #22c55e' }}></div>
  </div>
);

// Removido BackIcon - agora usando ArrowLeft do Lucide

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { savedRecipeIds, toggleSaved } = useSavedRecipes();
  const { colors, fontSizes, theme } = useAppPreferences();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        const { data } = await supabase.from('recipes').select('*').eq('id', id).single();
        setRecipe(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Aplica gamificação por visualizar receita (assíncrona e não bloqueante)
  useEffect(() => {
    if (!recipe) return;
    
    // Executa a gamificação de forma assíncrona para não bloquear a UI
    const applyGamificationAsync = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const uid = session?.user?.id || null;
        
        if (uid) {
          // Usa setTimeout para garantir que a operação seja não-bloqueante
          setTimeout(async () => {
            try {
              const res = await addRecipeViewPoint(uid);
              if (res?.leveledUp) {
                toast(`🎉 Você subiu de nível! Agora é ${res.chef_level}.`, {
                  style: {
                    minWidth: 'fit-content',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }
                });
              }
            } catch (error) {
              console.error('Erro ao adicionar pontos por visualização:', error);
            }
          }, 0);
        }
      } catch (error) {
        console.error('Erro ao obter sessão do usuário:', error);
      }
    };
    
    // Executa imediatamente de forma assíncrona
    applyGamificationAsync();
  }, [recipe]);

  if (loading) return <LoadingSpinner />;
  if (!recipe) return <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>Receita não encontrada.</div>;

  const isSaved = savedRecipeIds.has(recipe.id);

  return (
    <div style={{ 
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent}05 100%)`, 
      color: colors.text, 
      minHeight: '100vh', 
      paddingBottom: '2rem',
      fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
    }}>
      {/* Imagem da receita modernizada */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '320px',
        overflow: 'hidden'
      }}>
        {recipe.image_url ? (
          <img 
            src={recipe.image_url} 
            alt={recipe.title} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }} 
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
          height: '100px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
          pointerEvents: 'none'
        }} />
        
        {/* Botão de voltar modernizado */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20 }}>
          <button 
            onClick={() => navigate(-1)} 
            aria-label="Voltar"
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              border: 'none', 
              background: 'rgba(255, 255, 255, 0.95)', 
              color: theme === 'dark' ? '#CD853F' : '#2F2F2F', 
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
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Botão de salvar modernizado */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 20 }}>
          <button
            onClick={() => toggleSaved(recipe)}
            aria-label="Salvar"
            title={isSaved ? 'Remover dos salvos' : 'Salvar nos favoritos'}
            style={{ 
              width: '52px', 
              height: '52px', 
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
            <Heart size={22} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Container modernizado */}
      <div style={{ 
        maxWidth: '900px', 
        margin: '-40px auto 0 auto', 
        background: colors.surface, 
        borderRadius: '24px 24px 0 0', 
        boxShadow: '0 -10px 30px rgba(0,0,0,0.1)', 
        position: 'relative', 
        zIndex: 10, 
        padding: '32px 24px 24px 24px',
        border: `1px solid ${colors.border}`,
        borderBottom: 'none'
      }}>
        {/* Título modernizado */}
        <h1 style={{
          fontSize: fontSizes['3xl'], 
          color: colors.primary, 
          fontWeight: 800, 
          marginBottom: '12px', 
          marginTop: '0',
          lineHeight: 1.2,
          letterSpacing: '-0.02em'
        }}>
          {recipe.title}
        </h1>
        
        {/* Descrição modernizada */}
        {recipe.description && (
          <p style={{
            fontSize: fontSizes.lg, 
            color: colors.textSecondary, 
            marginBottom: '24px',
            lineHeight: 1.5,
            fontWeight: 500
          }}>
            {recipe.description}
          </p>
        )}

        {/* Tags de informações modernizadas */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '32px', 
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
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
        </div>

        {recipe.tips && Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
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
  );
}
