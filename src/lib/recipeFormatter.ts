// src/lib/recipeFormatter.ts

import type { StructuredIngredient } from '@/types/supabase';

/**
 * Retorna a string de exibição pré-formatada do ingrediente.
 * A lógica foi movida para os dados para garantir 100% de precisão gramatical.
 * @param ing - O objeto do ingrediente estruturado.
 * @returns A string de exibição perfeita.
 */
export function formatIngredientForRecipe(ing: StructuredIngredient): string {
  // Se ambos display e household_display existem, combinar adequadamente
  if (ing.display && ing.household_display) {
    // Normalização simples para comparação
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
    const displayNorm = norm(ing.display);
    const householdNorm = norm(ing.household_display);

    // 1) Se o display já contém o household_display → usar display
    if (ing.display.includes(ing.household_display)) {
      return ing.display;
    }

    // 2) Se o household_display já contém o display (caso de "20 Tomates cereja (aprox 20g)") → usar household_display
    if (householdNorm.includes(displayNorm)) {
      return ing.household_display;
    }

    // 3) Caso comum: anexar household_display ao display
    return `${ing.display} (${ing.household_display})`;
  }
  
  // Se apenas display existe, usar ele
  if (ing.display) {
    return ing.display;
  }
  
  // Se apenas household_display existe, criar o display
  if (ing.household_display) {
    const quantity = ing.quantity;
    const unit = ing.unit;
    const name = ing.name;
    
    // Casos especiais para formatação
    if (name.toLowerCase().includes('ovo') && unit === 'unidades') {
      const pluralName = name.replace('Ovo', 'Ovos');
      return `${quantity} ${pluralName} (${ing.household_display})`;
    }
    
    // Formatação com household_display: quantidade + unidade + nome + (household_display)
    if (quantity === 1) {
      return `${quantity} ${unit} de ${name} (${ing.household_display})`;
    } else {
      // Se a unidade já está no plural, usar como está
      const pluralUnit = unit.endsWith('s') ? unit : getCorrectPluralUnit(unit);
      return `${quantity} ${pluralUnit} de ${name} (${ing.household_display})`;
    }
  }
  
  // Caso contrário, gere o display dinamicamente
  const quantity = ing.quantity;
  const unit = ing.unit;
  const name = ing.name;
  
  // Casos especiais para formatação
  if (name.toLowerCase().includes('ovo') && unit === 'unidades') {
    const pluralName = name.replace('Ovo', 'Ovos');
    return `${quantity} ${pluralName}`;
  }
  
  // Formatação básica: quantidade + unidade + nome
  if (quantity === 1) {
    return `${quantity} ${unit} de ${name}`;
  } else {
    // Se a unidade já está no plural, usar como está
    const pluralUnit = unit.endsWith('s') ? unit : getCorrectPluralUnit(unit);
    return `${quantity} ${pluralUnit} de ${name}`;
  }
}

/**
 * Retorna a forma plural correta da unidade
 */
function getCorrectPluralUnit(unit: string): string {
  // Casos especiais onde o plural é diferente
  const specialPlurals: Record<string, string> = {
    'colher de sopa': 'colheres de sopa',
    'colher de chá': 'colheres de chá',
    'colher de sobremesa': 'colheres de sobremesa',
    'colher de café': 'colheres de café',
    'xícara': 'xícaras',
    'copo': 'copos',
    'litro': 'litros',
    'quilo': 'quilos',
    'grama': 'gramas',
    'mililitro': 'mililitros',
    'unidade': 'unidades',
    'dente': 'dentes',
    'folha': 'folhas',
    'ramo': 'ramos',
    'pequena': 'pequenas',
    'média': 'médias',
    'grande': 'grandes',
    'pequeno': 'pequenos',
    'médio': 'médios'
  };
  
  // Se já está no plural ou é um caso especial, retorna como está
  if (specialPlurals[unit]) {
    return specialPlurals[unit];
  }
  
  // Se já termina com 's', retorna como está
  if (unit.endsWith('s')) {
    return unit;
  }
  
  // Caso padrão: adiciona 's'
  return `${unit}s`;
}