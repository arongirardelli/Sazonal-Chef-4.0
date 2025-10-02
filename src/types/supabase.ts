// src/types/supabase.ts
// Este arquivo agora apenas re-exporta os tipos centralizados para manter a compatibilidade.

import type { Recipe as CoreRecipe, StructuredIngredient as CoreStructuredIngredient } from './entities';

// Re-exporta os tipos com os mesmos nomes para não quebrar as importações existentes.
export type Recipe = CoreRecipe;
export type StructuredIngredient = CoreStructuredIngredient;
export type Ingredient = CoreStructuredIngredient; // Alias comum no projeto