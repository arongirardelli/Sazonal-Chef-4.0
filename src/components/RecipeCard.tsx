import React, { memo } from 'react';
import type { Recipe } from '@/types/supabase';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { DietTag } from './DietTag';
import { Clock, Star, Flame } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showSelect?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  showTakenWarning?: boolean;
  variant?: 'default' | 'compact' | 'detailed' | 'menu';
  className?: string;
  mealType?: string;
  onReplace?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = memo(({
  recipe,
  onClick,
  showSelect = false,
  onSelect,
  isSelected = false,
  showTakenWarning = false,
  variant = 'default',
  className = '',
  mealType,
  onReplace,
}) => {
  const { colors, fontSizes } = useAppPreferences();
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };
  
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect();
  };

  const handleReplace = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReplace) onReplace();
  };
  
  const renderCardContent = () => {
    switch (variant) {
      case 'menu':
        return (
          <>
            <div style={{ position: 'relative' }}>
              <div style={{
                height: '160px',
                background: colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
              }}
              onClick={handleClick}
              >
                {recipe.image_url ? (
                  <img 
                    src={recipe.image_url} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                    alt={recipe.title} 
                  />
                ) : (
                  <span style={{ fontSize: '32px' }}>🍽️</span>
                )}
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              }}>
                <div style={{
                  fontWeight: 600,
                  color: '#fff',
                  fontSize: fontSizes.sm,
                  textTransform: 'capitalize',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                }}>
                  {mealType}
                </div>
                <button
                  onClick={handleReplace}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    border: '1px solid #fff',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: fontSizes.xs,
                    fontWeight: '500',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  Substituir
                </button>
              </div>
            </div>
            <div style={{ padding: '16px', display: 'grid', gap: '12px', flexGrow: 1 }}>
              <div style={{
                fontWeight: '700',
                color: colors.text,
                fontSize: fontSizes.base,
                lineHeight: 1.3,
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onClick={handleClick}
              >
                {recipe.title}
              </div>
              <div style={{
                fontSize: fontSizes.xs,
                color: colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  <span>{recipe.time} min</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={14} />
                  <span>{recipe.difficulty}</span>
                </div>
                {recipe.calories && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🔥</span>
                    <span>{recipe.calories} kcal</span>
                  </div>
                )}
              </div>
              <DietTag diet={recipe.diet} />
            </div>
          </>
        );

      case 'compact':
        return (
          <div onClick={handleClick} style={{ padding: '8px', display: 'grid', gap: '4px', cursor: 'pointer' }}>
            <div style={{ 
              fontWeight: '600', 
              color: colors.text, 
              fontSize: fontSizes.sm,
              lineHeight: 1.2
            }}>
              {recipe.title}
            </div>
            <div style={{ 
              fontSize: fontSizes.xs, 
              color: colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{recipe.time} min</span>
              <span>•</span>
              <span>{recipe.difficulty}</span>
            </div>
            <DietTag diet={recipe.diet} />
          </div>
        );
        
      case 'detailed':
        return (
          <div onClick={handleClick} style={{ padding: '16px', display: 'grid', gap: '12px', cursor: 'pointer' }}>
            <div style={{ 
              fontWeight: '700', 
              color: colors.text, 
              fontSize: fontSizes.base,
              lineHeight: 1.3,
              transition: 'color 0.2s ease'
            }}>
              {recipe.title}
            </div>
            <div style={{ 
              fontSize: fontSizes.xs, 
              color: colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                <span>{recipe.time} min</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={14} />
                <span>{recipe.difficulty}</span>
              </div>
              {recipe.calories && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔥</span>
                  <span>{recipe.calories} kcal</span>
                </div>
              )}
              {recipe.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} fill="currentColor" />
                  <span>{recipe.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <DietTag diet={recipe.diet} />
            {showSelect && (
              <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
                <button 
                  onClick={handleSelect}
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: `1px solid ${colors.primary}`, 
                    background: isSelected ? colors.accent : colors.primary, 
                    color: isSelected ? colors.primary : colors.surface, 
                    cursor: 'pointer', 
                    fontSize: fontSizes.sm,
                    fontWeight: 600,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {isSelected ? 'Selecionado' : 'Selecionar'}
                </button>
                {showTakenWarning && (
                  <div style={{ 
                    fontSize: fontSizes.xs, 
                    color: colors.secondary,
                    textAlign: 'center',
                    padding: '8px',
                    background: `${colors.secondary}10`,
                    borderRadius: '8px'
                  }}>
                    Esta receita já está no cardápio
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      default: // default
        return (
          <div onClick={handleClick} style={{ padding: '16px', display: 'grid', gap: '12px', cursor: 'pointer' }}>
            <div style={{ 
              fontWeight: '700', 
              color: colors.text, 
              fontSize: fontSizes.base,
              lineHeight: 1.3,
              transition: 'color 0.2s ease'
            }}>
              {recipe.title}
            </div>
            <div style={{ 
              fontSize: fontSizes.xs, 
              color: colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                <span>{recipe.time} min</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={14} />
                <span>{recipe.difficulty}</span>
              </div>
              {recipe.calories && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔥</span>
                  <span>{recipe.calories} kcal</span>
                </div>
              )}
            </div>
            <DietTag diet={recipe.diet} />
            {showSelect && (
              <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
                <button 
                  onClick={handleSelect}
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: `1px solid ${colors.primary}`, 
                    background: colors.primary, 
                    color: colors.surface, 
                    cursor: 'pointer', 
                    fontSize: fontSizes.sm,
                    fontWeight: 600,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Selecionar
                </button>
                {showTakenWarning && (
                  <div style={{ 
                    fontSize: fontSizes.xs, 
                    color: colors.secondary,
                    textAlign: 'center',
                    padding: '8px',
                    background: `${colors.secondary}10`,
                    borderRadius: '8px'
                  }}>
                    Esta receita já está no cardápio
                  </div>
                )}
              </div>
            )}
          </div>
        );
    }
  };
  
  return (
    <div 
      className={`recipe-card-modern ${className}`}
      style={{ 
        border: `1px solid ${colors.border}`, 
        borderRadius: '16px', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        background: colors.surface,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
        }
      }}
    >
      {variant !== 'menu' && (
        <div style={{ 
          height: variant === 'compact' ? '120px' : '160px', 
          background: colors.accent, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={handleClick}
        >
          {recipe.image_url ? (
            <img 
              src={recipe.image_url} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} 
              alt={recipe.title}
              onMouseEnter={(e) => {
                if (onClick) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (onClick) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            />
          ) : (
            <div style={{
              fontSize: variant === 'compact' ? '32px' : '48px',
              opacity: 0.6,
              transition: 'opacity 0.3s ease'
            }}>
              🍽️
            </div>
          )}
          
          {/* Overlay gradient */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
            pointerEvents: 'none'
          }} />
          
          {/* Rating badge - only show for non-detailed variants */}
          {recipe.rating && variant !== 'detailed' && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: fontSizes.xs,
              fontWeight: 600,
              color: colors.text,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <Star size={12} fill="currentColor" />
              {recipe.rating.toFixed(1)}
            </div>
          )}
        </div>
      )}
      
      {/* Conteúdo do card */}
      {renderCardContent()}
    </div>
  );
});