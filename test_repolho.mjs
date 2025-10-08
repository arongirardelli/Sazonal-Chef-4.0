import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testRepolho() {
  console.log('🧪 TESTE - REPOLHO NA LISTA DE COMPRAS\n');
  console.log('=' .repeat(80));
  
  // Buscar receitas com repolho
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('title, structured_ingredients')
    .in('title', [
      'Charutinho de Repolho com Arroz e Carne',
      'Sopa de Frango com "Macarrão" de Repolho'
    ]);
  
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  console.log(`\n📋 Receitas encontradas: ${recipes.length}\n`);
  
  let totalGrams = 0;
  
  for (const recipe of recipes) {
    const repolho = recipe.structured_ingredients.find(ing => 
      ing.name.toLowerCase().includes('repolho')
    );
    
    if (repolho) {
      console.log(`📝 ${recipe.title}`);
      console.log(`   Quantidade: ${repolho.quantity} ${repolho.unit || 'unidade'}`);
      console.log(`   Display: ${repolho.display}`);
      console.log(`   household_display: ${repolho.household_display || '(sem display)'}`);
      
      // Calcular gramas
      let grams = 0;
      if (repolho.household_display) {
        const match = repolho.household_display.match(/(\d+)g/);
        grams = match ? parseInt(match[1]) : repolho.quantity * 1000;
      } else {
        grams = repolho.quantity * 1000;
      }
      
      totalGrams += grams;
      console.log(`   → ${grams}g\n`);
    }
  }
  
  const totalUnits = totalGrams / 1000;
  const unitWord = totalUnits > 1 ? 'unidades' : 'unidade';
  
  console.log('='.repeat(80));
  console.log('\n🎯 CONSOLIDAÇÃO ESPERADA:');
  console.log(`   Total: ${totalGrams}g (aprox. ${totalUnits} ${unitWord})`);
  console.log(`   Renderização esperada: "Repolho – ${totalGrams}g (aprox. ${totalUnits} ${unitWord})"`);
  
  console.log('\n' + '='.repeat(80));
}

testRepolho().catch(console.error);

