import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Cardápio de teste com as 3 receitas de aspargo
const TEST_RECIPES = [
  'Bife com Ovos e Aspargos',
  'Salmão ao Forno com Aspargos', 
  'Salmão Assado com Aspargos e Limão'
];

async function testAspargo() {
  console.log('🧪 TESTE - ASPARGO NA LISTA DE COMPRAS\n');
  console.log('=' .repeat(80));
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
    .in('title', TEST_RECIPES);
  
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  console.log(`\n📋 Receitas do cardápio: ${recipes.length}/${TEST_RECIPES.length}`);
  
  // Simular consolidação
  let totalMacos = 0;
  const details = [];
  
  for (const recipe of recipes) {
    const aspargos = recipe.structured_ingredients.filter(ing => 
      ing.name.toLowerCase().includes('aspargo')
    );
    
    for (const asp of aspargos) {
      let macos = 0;
      
      if (asp.unit === 'maço' || asp.unit === 'maços') {
        macos = asp.quantity;
      } else if (asp.unit === 'g') {
        if (asp.household_display) {
          const match = asp.household_display.match(/(\d+(?:\.\d+)?)\s*maço/i);
          macos = match ? parseFloat(match[1]) : Math.ceil(asp.quantity / 200);
        } else {
          macos = Math.ceil(asp.quantity / 200);
        }
      } else {
        macos = asp.quantity;
      }
      
      totalMacos += macos;
      
      details.push({
        recipe: recipe.title,
        quantity: asp.quantity,
        unit: asp.unit || 'unidade',
        display: asp.display,
        household_display: asp.household_display || '(sem display)',
        macos: macos
      });
    }
  }
  
  console.log('\n\n📊 DETALHES POR RECEITA:');
  console.log('─'.repeat(80));
  
  for (const detail of details) {
    console.log(`\n   📝 ${detail.recipe}`);
    console.log(`      Quantidade: ${detail.quantity} ${detail.unit}`);
    console.log(`      Display: ${detail.display}`);
    console.log(`      Household: ${detail.household_display}`);
    console.log(`      → Maços: ${detail.macos}`);
  }
  
  const totalGrams = Math.round(totalMacos * 200);
  const macosText = totalMacos === 1 ? 'maço' : 'maços';
  
  console.log('\n\n🎯 CONSOLIDAÇÃO ESPERADA:');
  console.log('─'.repeat(80));
  console.log(`   Total de maços: ${totalMacos}`);
  console.log(`   Total em gramas: ${totalGrams}g`);
  console.log(`   Renderização esperada: "Aspargo – ${Math.round(totalMacos)} ${macosText} (aprox. ${totalGrams}g)"`);
  
  console.log('\n\n❓ PROBLEMA ATUAL:');
  console.log('─'.repeat(80));
  console.log('   O aplicativo está renderizando:');
  console.log('   • "Aspargo – 1 maço (aprox. 200g)"');
  console.log('   • "Aspargo – 2 maços (aprox. 400g)"');
  console.log('\n   Isso indica que há DUPLICAÇÃO na consolidação!');
  
  console.log('\n' + '='.repeat(80));
}

testAspargo().catch(console.error);

