import React from 'react';
import { Leaf, Clock, Heart } from 'lucide-react';
import { useAppPreferences } from '../contexts/AppPreferencesContext';

// Ícone para "Tesouros da Estação"
export const SeasonalIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const { colors } = useAppPreferences();
  return <Leaf size={size} color="#2C5530" />;
};

// Ícone para "Pratos em 30 Minutos"
export const QuickIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const { colors } = useAppPreferences();
  return <Clock size={size} color="#CD853F" />;
};

// Ícone para "Feito Para Você"
export const PersonalizedIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const { colors } = useAppPreferences();
  return <Heart size={size} color="#8B4513" />;
};
