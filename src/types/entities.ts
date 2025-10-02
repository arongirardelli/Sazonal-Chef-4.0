// src/types/entities.ts
// Este arquivo será a única fonte da verdade para as interfaces de negócio.

/**
 * Representa um ingrediente com todos os dados necessários
 * para exibição na receita e cálculo na lista de compras.
 */
export interface StructuredIngredient {
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  household_display?: string; // Ex: "aprox. 150g"
  display: string; // A string final e perfeita para exibição na receita
}

/**
 * Representa uma receita completa com todas as suas propriedades.
 */
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  category: string; // 'Café da manhã', 'Almoço', etc.
  time: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  diet: 'Vegetariano' | 'Vegano' | 'Proteico' | 'Tradicional' | 'Sem Glúten' | 'Sem Lactose' | 'Low Carb' | 'Todos';
  servings?: number;
  calories?: number;
  rating?: number;
  image_url?: string;
  instructions: string[];
  tips: string[];
  tags: string[];
  structured_ingredients: StructuredIngredient[];
  legacy_ingredients?: string[]; // Mantido por compatibilidade, mas opcional
}
