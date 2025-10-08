import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Regra: Para carnes e peixes que já estão em gramas, household_display = "aprox. XXXg"
// Para carnes em kg, converter para gramas

async function fixHouseholdDisplay() {
  console.log('🔧 CORREÇÃO - HOUSEHOLD_DISPLAY CARNES E PEIXES\n');
  console.log('='.repeat(80));
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
    .not('structured_ingredients', 'is', null);
  
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  let totalFixed = 0;
  let totalRecipesUpdated = 0;
  
  for (const recipe of recipes) {
    let hasChanges = false;
    
    const updatedIngredients = recipe.structured_ingredients.map(ing => {
      // Apenas processar Carnes e Peixes sem household_display
      if (ing.category !== 'Carnes e Peixes' || ing.household_display) {
        return ing;
      }
      
      const unit = (ing.unit || '').toLowerCase();
      let displayValue = null;
      
      // Se já está em gramas
      if (unit === 'g' || unit === 'gramas') {
        displayValue = `aprox. ${ing.quantity}g`;
      }
      // Se está em kg, converter para gramas
      else if (unit === 'kg') {
        const grams = ing.quantity * 1000;
        displayValue = `aprox. ${grams}g`;
      }
      // Se não tem unidade clara ou está em unidades/filés, não adicionar
      // (esses serão tratados com lógica específica)
      
      if (displayValue) {
        hasChanges = true;
        totalFixed++;
        return { ...ing, household_display: displayValue };
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

fixHouseholdDisplay().catch(console.error);

