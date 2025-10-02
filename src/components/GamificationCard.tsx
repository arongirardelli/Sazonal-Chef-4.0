import React from 'react'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { BookOpen, Heart, ChefHat } from 'lucide-react'

interface Props {
  totalPoints?: number
  recipesViewed?: number
  recipesSavedCount?: number
  cookingDays?: number
}

const gamificationLevels = [
  { name: 'Aprendiz Culinário', minPoints: 0, maxPoints: 50 },
  { name: 'Ajudante de Cozinha', minPoints: 50, maxPoints: 125 },
  { name: 'Cozinheiro Amador', minPoints: 125, maxPoints: 250 },
  { name: 'Cozinheiro Dedicado', minPoints: 250, maxPoints: 450 },
  { name: 'Artesão Culinário', minPoints: 450, maxPoints: 750 },
  { name: 'Chef de Fim de Semana', minPoints: 750, maxPoints: 1200 },
  { name: 'Chef da Brigada', minPoints: 1200, maxPoints: 1900 },
  { name: 'Sous Chef', minPoints: 1900, maxPoints: 2900 },
  { name: 'Chef Experiente', minPoints: 2900, maxPoints: 4200 },
  { name: 'Chef de Cuisine', minPoints: 4200, maxPoints: 6000 },
  { name: 'Mestre Culinário', minPoints: 6000, maxPoints: 8500 },
  { name: 'Lenda Culinária', minPoints: 8500, maxPoints: 12000 },
  { name: 'Ícone da Gastronomia', minPoints: 12000, maxPoints: 17000 },
  { name: 'Sazonal Chef', minPoints: 17000, maxPoints: Infinity }
];

const getLevelInfo = (points: number) => {
  const currentLevel = gamificationLevels.find(level => points >= level.minPoints && points < level.maxPoints) || gamificationLevels[gamificationLevels.length - 1];
  const currentLevelIndex = gamificationLevels.findIndex(level => level.name === currentLevel.name);
  const nextLevel = gamificationLevels[currentLevelIndex + 1];

  if (!nextLevel) {
    return {
      currentLevelName: currentLevel.name,
      nextLevelName: 'Nível Máximo',
      progressPercentage: 100,
      pointsRemaining: 0,
    };
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
  const progressPercentage = pointsNeededForNextLevel > 0 ? Math.min(100, (pointsInCurrentLevel / pointsNeededForNextLevel) * 100) : 100;
  const pointsRemaining = Math.max(0, nextLevel.minPoints - points);

  return {
    currentLevelName: currentLevel.name,
    nextLevelName: nextLevel.name,
    progressPercentage,
    pointsRemaining,
  };
};

// Função para converter pontos em nível numérico (1-14)
export const getLevelNumber = (points: number): number => {
  const currentLevel = gamificationLevels.find(level => points >= level.minPoints && points < level.maxPoints) || gamificationLevels[gamificationLevels.length - 1];
  const levelIndex = gamificationLevels.findIndex(level => level.name === currentLevel.name);
  return levelIndex + 1; // Retorna 1-14
};

export const GamificationCard: React.FC<Props> = ({ totalPoints = 0, recipesViewed = 0, recipesSavedCount = 0, cookingDays = 0 }) => {
  const { colors, fontSizes } = useAppPreferences()
  
  const { currentLevelName, nextLevelName, progressPercentage, pointsRemaining } = getLevelInfo(totalPoints)
  
  return (
    <div style={{ 
      background: colors.surface, 
      border: `1px solid ${colors.border}`, 
      borderRadius: 16, 
      padding: '16px 20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative element */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}15)`,
        opacity: 0.6
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header with points and level */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: 500 }}>Seus pontos</div>
            <div style={{ fontWeight: 800, fontSize: fontSizes['2xl'], color: colors.primary }}>{totalPoints}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: 500 }}>Nível</div>
            <div style={{ fontWeight: 700, color: colors.secondary, fontSize: fontSizes.base }}>{currentLevelName}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 8 
          }}>
            <div style={{ 
              color: colors.textSecondary, 
              fontSize: fontSizes.sm, 
              fontWeight: 600 
            }}>
              Progresso para {nextLevelName}
            </div>
            <div style={{ 
              color: colors.textSecondary, 
              fontSize: fontSizes.sm, 
              fontWeight: 500 
            }}>
              {nextLevelName === 'Nível Máximo'
                ? 'Nível máximo alcançado!' 
                : `${pointsRemaining} pontos restantes`
              }
            </div>
          </div>
          
          <div style={{
            width: '100%',
            height: 8,
            backgroundColor: colors.accent,
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: 4,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Stats with icons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 10
        }}>
          <div style={{ 
            background: colors.accent, 
            borderRadius: 10, 
            padding: '12px 8px', 
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease',
            minHeight: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 6 
            }}>
              <BookOpen size={18} color={colors.secondary} />
            </div>
            <div style={{ fontSize: fontSizes.xs, color: colors.textSecondary, marginBottom: 3, lineHeight: 1.2 }}>Receitas Visualizadas</div>
            <div style={{ fontWeight: 700, color: colors.text, fontSize: fontSizes.base }}>{recipesViewed}</div>
          </div>
          
          <div style={{ 
            background: colors.accent, 
            borderRadius: 10, 
            padding: '12px 8px', 
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease',
            minHeight: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 6 
            }}>
              <Heart size={18} color={colors.secondary} />
            </div>
            <div style={{ fontSize: fontSizes.xs, color: colors.textSecondary, marginBottom: 3, lineHeight: 1.2 }}>Receitas Favoritas</div>
            <div style={{ fontWeight: 700, color: colors.text, fontSize: fontSizes.base }}>{recipesSavedCount}</div>
          </div>
          
          <div style={{ 
            background: colors.accent, 
            borderRadius: 10, 
            padding: '12px 8px', 
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease',
            minHeight: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 6 
            }}>
              <ChefHat size={18} color={colors.secondary} />
            </div>
            <div style={{ fontSize: fontSizes.xs, color: colors.textSecondary, marginBottom: 3, lineHeight: 1.2 }}>Dias Cozinhando</div>
            <div style={{ fontWeight: 700, color: colors.text, fontSize: fontSizes.base }}>{cookingDays}</div>
          </div>
        </div>
      </div>
    </div>
  )
}