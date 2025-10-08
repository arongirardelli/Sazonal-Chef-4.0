const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLaticiniosShoppingList() {
  console.log('🧪 Testando lista de compras para ingredientes de Laticínios...\n');

  try {
    // Buscar algumas receitas que usam ingredientes de Laticínios
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, title, structured_ingredients')
      .limit(10);

    if (error) {
      console.error('❌ Erro ao buscar receitas:', error);
      return;
    }

    console.log(`📊 Testando com ${recipes.length} receitas\n`);

    // Simular a lógica de consolidação para Laticínios
    const laticiniosIngredients = new Map();

    for (const recipe of recipes) {
      if (!recipe.structured_ingredients || !Array.isArray(recipe.structured_ingredients)) {
        continue;
      }

      console.log(`\n📋 Receita: ${recipe.title}`);

      for (const ingredient of recipe.structured_ingredients) {
        if (ingredient.category === 'Laticínios') {
          const key = ingredient.name.toLowerCase().trim();
          
          console.log(`   🥛 ${ingredient.name}: ${ingredient.quantity} ${ingredient.unit} (${ingredient.household_display || 'SEM household_display'})`);

          if (!laticiniosIngredients.has(key)) {
            laticiniosIngredients.set(key, {
              name: ingredient.name,
              category: ingredient.category,
              totalQuantity: 0,
              units: new Set(),
              household_display: ingredient.household_display,
              recipes: []
            });
          }

          const ingredientData = laticiniosIngredients.get(key);
          ingredientData.totalQuantity += ingredient.quantity;
          ingredientData.units.add(ingredient.unit);
          ingredientData.recipes.push(recipe.title);

          // Simular conversão para gramas/ml baseado no household_display
          if (ingredient.household_display) {
            const weightMatch = ingredient.household_display.match(/(\d+(?:\.\d+)?)\s*(g|ml)/i);
            if (weightMatch) {
              const weight = parseFloat(weightMatch[1]);
              const unit = weightMatch[2];
              console.log(`      → Convertido: ${weight}${unit}`);
            }
          }
        }
      }
    }

    console.log(`\n📈 RESUMO DA CONSOLIDAÇÃO:`);
    console.log(`   • Total de ingredientes únicos: ${laticiniosIngredients.size}`);

    for (const [key, ingredient] of laticiniosIngredients) {
      console.log(`\n🥛 ${ingredient.name.toUpperCase()}`);
      console.log(`   • Quantidade total: ${ingredient.totalQuantity}`);
      console.log(`   • Unidades usadas: ${Array.from(ingredient.units).join(', ')}`);
      console.log(`   • household_display: ${ingredient.household_display || 'AUSENTE'}`);
      console.log(`   • Receitas: ${ingredient.recipes.length}`);
    }

    // Verificar se há problemas de consolidação
    console.log(`\n🔍 VERIFICAÇÃO DE PROBLEMAS:`);
    
    let totalProblems = 0;
    for (const [key, ingredient] of laticiniosIngredients) {
      const hasMultipleUnits = ingredient.units.size > 1;
      const hasNoHouseholdDisplay = !ingredient.household_display;
      const hasIncorrectFormat = ingredient.household_display && !/(\d+)\s*(g|ml)/i.test(ingredient.household_display);
      
      if (hasMultipleUnits || hasNoHouseholdDisplay || hasIncorrectFormat) {
        console.log(`   ⚠️  ${ingredient.name}:`);
        if (hasMultipleUnits) console.log(`      - Múltiplas unidades: ${Array.from(ingredient.units).join(', ')}`);
        if (hasNoHouseholdDisplay) console.log(`      - household_display ausente`);
        if (hasIncorrectFormat) console.log(`      - Formato incorreto: ${ingredient.household_display}`);
        totalProblems++;
      }
    }

    if (totalProblems === 0) {
      console.log(`   ✅ Nenhum problema encontrado!`);
    } else {
      console.log(`   ❌ ${totalProblems} ingredientes com problemas`);
    }

    console.log(`\n✅ Teste concluído!`);

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testLaticiniosShoppingList();
