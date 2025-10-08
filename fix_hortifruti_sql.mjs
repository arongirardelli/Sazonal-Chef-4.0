import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fs from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Pesos padrão (sincronizado com ingredientData.ts)
const STANDARD_WEIGHTS = {
  'cebola': 150,
  'cebola roxa': 150,
  'cebola pérola': 150,
  'maçã': 150,
  'maca': 150,
  'maçã verde': 150,
  'pepino': 250,
  'cenoura': 120,
  'batata': 150,
  'batata doce': 200,
  'tomate': 120,
  'tomate cereja': 120,
  'abacate': 350,
  'avocado': 200,
  'manga': 250,
  'banana': 120,
  'banana nanica': 120,
  'banana-da-terra': 250,
  'banana da terra': 250,
  'berinjela': 250,
  'abobrinha': 200,
  'abóbora': 1000,
  'abobora': 1000,
  'abóbora cabotiá': 1000,
  'abóbora moranga': 1000,
  'abóbora de pescoço': 1000,
  'gengibre': 50,
  'pimentão': 200,
  'pimentao': 200,
  'pimentão amarelo': 200,
  'pimentao amarelo': 200,
  'pimentão verde': 200,
  'pimentao verde': 200,
  'pimentão vermelho': 200,
  'pimentao vermelho': 200,
  'limão': 90,
  'limao': 90,
  'limão siciliano': 120,
  'limao siciliano': 120,
  'limão taiti': 90
};

function normalizeKey(name) {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getStandardWeight(ingredientName) {
  const normalized = ingredientName.toLowerCase().trim();
  
  // Procura por correspondência exata primeiro
  if (STANDARD_WEIGHTS[normalized]) {
    return STANDARD_WEIGHTS[normalized];
  }
  
  // Procura por correspondência parcial
  for (const [key, weight] of Object.entries(STANDARD_WEIGHTS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return weight;
    }
  }
  
  return null;
}

function calculateExpectedGrams(ingredient) {
  const standardWeight = getStandardWeight(ingredient.name);
  if (!standardWeight) return null;
  
  const unit = (ingredient.unit || '').toLowerCase().trim();
  
  // Se já está em gramas
  if (unit === 'g' || unit === 'gramas') {
    return ingredient.quantity;
  }
  
  // Se é em unidades ou similar
  if (unit === 'unidade' || unit === 'unidades' || unit === '' || 
      unit === 'maduro' || unit === 'maduros' || 
      unit === 'pequeno' || unit === 'médio' || unit === 'grande' ||
      unit === 'rodelas' || unit === 'fatias') {
    return ingredient.quantity * standardWeight;
  }
  
  // Se é medida de volume/comprimento para gengibre
  if ((unit.includes('cm') || unit.includes('colher')) && ingredient.name.toLowerCase().includes('gengibre')) {
    return null; // Não sabemos exatamente
  }
  
  // Se já tem household_display, extrai de lá
  if (ingredient.household_display) {
    const match = ingredient.household_display.match(/(\d+)\s*g/i);
    if (match) return parseInt(match[1]);
  }
  
  return null;
}

async function fixAllRecipes() {
  console.log('🔧 CORREÇÃO MASSIVA DE HOUSEHOLD_DISPLAY\n');
  console.log('=' .repeat(80));
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
    .not('structured_ingredients', 'is', null);
  
  if (error) {
    console.error('Erro ao buscar receitas:', error);
    return;
  }
  
  let totalFixed = 0;
  let totalRecipesUpdated = 0;
  
  for (const recipe of recipes) {
    if (!recipe.structured_ingredients) continue;
    
    let hasChanges = false;
    const updatedIngredients = recipe.structured_ingredients.map(ing => {
      // Verifica se é um ingrediente Hortifruti com referência visual
      const standardWeight = getStandardWeight(ing.name);
      if (!standardWeight) return ing;
      
      const expectedGrams = calculateExpectedGrams(ing);
      if (expectedGrams === null) return ing;
      
      // Verifica se precisa atualizar
      const currentDisplay = ing.household_display || '';
      const currentGrams = currentDisplay.match(/(\d+)\s*g/i);
      const currentGramsValue = currentGrams ? parseInt(currentGrams[1]) : null;
      
      if (currentGramsValue !== expectedGrams) {
        hasChanges = true;
        totalFixed++;
        
        return {
          ...ing,
          household_display: `aprox. ${expectedGrams}g`
        };
      }
      
      return ing;
    });
    
    if (hasChanges) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ structured_ingredients: updatedIngredients })
        .eq('id', recipe.id);
      
      if (updateError) {
        console.error(`❌ Erro ao atualizar ${recipe.title}:`, updateError.message);
      } else {
        totalRecipesUpdated++;
        if (totalRecipesUpdated % 10 === 0) {
          console.log(`✅ ${totalRecipesUpdated} receitas atualizadas...`);
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 RESUMO:`);
  console.log(`✅ Total de receitas atualizadas: ${totalRecipesUpdated}`);
  console.log(`✅ Total de ingredientes corrigidos: ${totalFixed}`);
  console.log('\n' + '='.repeat(80));
}

fixAllRecipes().catch(console.error);

