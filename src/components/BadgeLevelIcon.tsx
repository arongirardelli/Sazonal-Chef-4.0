import React from 'react';
import { useAppPreferences } from '../contexts/AppPreferencesContext';

interface BadgeLevelIconProps {
  level: number;
  userInitial: string;
  size?: number;
  className?: string;
}

export const BadgeLevelIcon: React.FC<BadgeLevelIconProps> = ({
  level,
  userInitial,
  size = 80,
  className = ''
}) => {
  const { colors } = useAppPreferences();

  // Garantir que o nível está entre 1 e 14
  const normalizedLevel = Math.max(1, Math.min(14, level));
  
  // Caminho para a imagem do badge (usando as novas imagens sem fundo)
  const badgeImagePath = `/badges/level_${normalizedLevel}-removebg-preview.png`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease-in-out',
        // Garantir que o fundo seja transparente para as imagens
        backgroundColor: 'transparent',
        overflow: 'visible',
      }}
    >
      {/* Badge de fundo */}
      <img
        src={badgeImagePath}
        alt={`Nível ${normalizedLevel}`}
        style={{
          width: '220px',
          height: '220px',
          objectFit: 'contain',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          // Garantir que a imagem seja renderizada corretamente sem fundo
          backgroundColor: 'transparent',
          // Otimizações para manter qualidade em tamanhos maiores
          imageRendering: 'crisp-edges',
          WebkitImageRendering: 'crisp-edges',
          msImageRendering: 'crisp-edges',
          filter: `
            drop-shadow(0 4px 12px rgba(0,0,0,0.15))
            ${normalizedLevel >= 10 ? 'brightness(1.1) saturate(1.2)' : ''}
            ${normalizedLevel >= 13 ? 'contrast(1.1)' : ''}
          `,
          transition: 'all 0.3s ease-in-out',
        }}
        onError={(e) => {
          // Fallback caso a imagem não carregue
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      
      {/* Efeito de brilho para níveis altos */}
      {normalizedLevel >= 10 && (
        <div
          style={{
            position: 'absolute',
            top: -size * 0.1,
            left: -size * 0.1,
            right: -size * 0.1,
            bottom: -size * 0.1,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)`,
            zIndex: 0,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
      )}
      
      
      {/* Animações CSS */}
      <style>
        {`
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};
