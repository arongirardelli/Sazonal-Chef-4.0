import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fs from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Carrega os problemas encontrados
const issues = JSON.parse(fs.readFileSync('./hortifruti_issues.json', 'utf-8'));

console.log('🔧 CORREÇÃO DE HOUSEHOLD_DISPLAY - INGREDIENTES HORTIFRUTI\n');
console.log('=' .repeat(80));
console.log(`Total de problemas a corrigir: ${issues.length}\n`);

async function fixRecipes() {
  let fixed = 0;
  let errors = 0;
  
  // Agrupa correções por receita para minimizar queries
  const byRecipe = {};
  for (const issue of issues) {
    if (!byRecipe[issue.recipeId]) {
      byRecipe[issue.recipeId] = [];
    }
    byRecipe[issue.recipeId].push(issue);
  }
  
  console.log(`📦 Receitas a atualizar: ${Object.keys(byRecipe).length}\n`);
  
  for (const [recipeId, recipeIssues] of Object.entries(byRecipe)) {
    try {
      // Busca a receita
      const { data: recipe, error: fetchError } = await supabase
        .from('recipes')
        .select('id, title, structured_ingredients')
        .eq('id', recipeId)
        .single();
      
      if (fetchError) {
        console.error(`❌ Erro ao buscar receita ${recipeId}:`, fetchError.message);
        errors++;
        continue;
      }
      
      console.log(`\n📝 Corrigindo: ${recipe.title}`);
      
      // Cria cópia dos ingredientes para modificar
      const updatedIngredients = [...recipe.structured_ingredients];
      
      for (const issue of recipeIssues) {
        // Encontra o ingrediente exato
        const ingIndex = updatedIngredients.findIndex(ing => {
          // Compara nome, quantidade e unidade para garantir que é o ingrediente correto
          return ing.name === issue.ingredient && 
                 ing.quantity === issue.quantity &&
                 (ing.unit || '') === (issue.unit || '');
        });
        
        if (ingIndex === -1) {
          console.warn(`   ⚠️  Ingrediente não encontrado: ${issue.ingredient}`);
          continue;
        }
        
        const oldDisplay = updatedIngredients[ingIndex].household_display || '(vazio)';
        
        // Determina o novo household_display
        let newDisplay;
        if (issue.type === 'MISSING_DISPLAY') {
          newDisplay = `aprox. ${issue.expectedGrams}g`;
        } else if (issue.type === 'INCORRECT_DISPLAY') {
          // Mantém qualquer texto adicional do display original
          const currentDisplay = updatedIngredients[ingIndex].household_display || '';
          if (currentDisplay.includes('aprox.')) {
            newDisplay = `aprox. ${issue.expectedGrams}g`;
          } else {
            newDisplay = `aprox. ${issue.expectedGrams}g`;
          }
        }
        
        // Atualiza o household_display
        updatedIngredients[ingIndex] = {
          ...updatedIngredients[ingIndex],
          household_display: newDisplay
        };
        
        console.log(`   ✅ ${issue.ingredient}: "${oldDisplay}" → "${newDisplay}"`);
        fixed++;
      }
      
      // Atualiza a receita no banco
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ structured_ingredients: updatedIngredients })
        .eq('id', recipeId);
      
      if (updateError) {
        console.error(`   ❌ Erro ao atualizar:`, updateError.message);
        errors++;
      }
      
    } catch (err) {
      console.error(`❌ Erro ao processar receita ${recipeId}:`, err.message);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 RESUMO DA CORREÇÃO:');
  console.log('─'.repeat(80));
  console.log(`✅ Ingredientes corrigidos: ${fixed}`);
  console.log(`❌ Erros: ${errors}`);
  console.log('\n' + '='.repeat(80));
}

fixRecipes().catch(console.error);

