import React from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';

interface DietTagProps {
  diet: string | null | undefined;
  showFallback?: boolean;
  className?: string;
}

export const DietTag: React.FC<DietTagProps> = ({ 
  diet, 
  showFallback = true,
  className = ''
}) => {
  const { fontSizes } = useAppPreferences();
  
  // Se não há dieta e não deve mostrar fallback, não renderiza nada
  if (!diet && !showFallback) return null;
  
  // Determina o texto a ser exibido
  const displayText = diet || 'Tradicional';
  
  // Função auxiliar para mapear dietas para cores CSS
  const getTagColors = (dietType: string) => {
    const normalizedDiet = dietType.toLowerCase().trim();
    
    // Família Verde: Vegano e Vegetariano
    if (normalizedDiet === 'vegano' || normalizedDiet === 'vegetariano') {
      return { bg: '#DCFCE7', color: '#166534' }; // green-100 e green-800
    }
    
    // Família Azul: Restrições (Sem Glúten e Sem Lactose)
    if (normalizedDiet === 'sem glúten' || normalizedDiet === 'sem lactose') {
      return { bg: '#DBEAFE', color: '#1E40AF' }; // blue-100 e blue-800
    }
    
    // Família Amarela: Foco Nutricional (Proteico e Low Carb)
    if (normalizedDiet === 'proteico' || normalizedDiet === 'low carb') {
      return { bg: '#FEF3C7', color: '#92400E' }; // yellow-100 e yellow-800
    }
    
    // Família Cinza: Padrão (Tradicional, Todos) e Fallback
    return { bg: '#F3F4F6', color: '#374151' }; // gray-100 e gray-800
  };
  
  const tagColors = getTagColors(displayText);
  
  return (
    <div className={className} style={{ marginTop: '8px' }}>
      <span style={{
        display: 'inline-block',
        backgroundColor: tagColors.bg,
        color: tagColors.color,
        fontSize: fontSizes.xs,
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        border: '1px solid transparent'
      }}>
        {displayText}
      </span>
    </div>
  );
};
