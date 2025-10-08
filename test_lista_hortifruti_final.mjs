import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Ingredientes Hortifruti com referência visual esperada
const EXPECTED_VISUAL_REF = [
  'abacate', 'avocado', 'abóbora', 'abobrinha', 'banana', 'batata', 'batata doce',
  'berinjela', 'cebola', 'cebola roxa', 'cenoura', 'gengibre', 'limão',
  'maçã', 'manga', 'pepino', 'pimentão', 'tomate'
];

// Cardápio de teste com vários ingredientes Hortifruti
const TEST_RECIPES = [
  'Ovos Rancheros', // Pimentão verde, Tomate
  'Mousse de Chocolate com Abacate e Cacau', // Avocado
  'Mousse de Chocolate com Abacate e Whey', // Avocado
  'Curry de Frango com Leite de Coco', // Tomate, Cebola
  'Creme de Abacate com Cacau', // Abacate
  'Arroz de Forno Cremoso com Frango e "Maionese" de Abacate', // Abacate, Limão, Cebola
  'Pad Thai com Tofu e Amendoim', // Cenoura, Limão
  'Salada Grega Completa', // Pepino, Pimentão verde, Cebola roxa, Tomate, Limão
  'Guacamole com Chips de Batata-Doce Assada', // Abacate, Batata doce, Tomate, Limão
  'Smoothie Verde com Abacate e Espinafre', // Abacate, Banana
  'Pão Integral com Abacate e Ovo' // Abacate
];

async function testShoppingList() {
  console.log('🧪 TESTE FINAL - LISTA DE COMPRAS HORTIFRUTI\n');
  console.log('=' .repeat(80));
  
  // Buscar receitas do cardápio de teste
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
    .in('title', TEST_RECIPES);
  
  if (error) {
    console.error('Erro ao buscar receitas:', error);
    return;
  }
  
  console.log(`\n📋 Receitas do cardápio: ${recipes.length}/${TEST_RECIPES.length}`);
  recipes.forEach(r => console.log(`   ✓ ${r.title}`));
  
  // Simular consolidação (versão simplificada)
  const ingredientMap = new Map();
  
  for (const recipe of recipes) {
    if (!recipe.structured_ingredients) continue;
    
    for (const ing of recipe.structured_ingredients) {
      const key = ing.name.toLowerCase();
      
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          name: ing.name,
          category: ing.category,
          items: []
        });
      }
      
      ingredientMap.get(key).items.push({
        recipe: recipe.title,
        quantity: ing.quantity,
        unit: ing.unit || '',
        household_display: ing.household_display || ''
      });
    }
  }
  
  // Análise dos ingredientes Hortifruti
  console.log('\n\n📊 ANÁLISE DE INGREDIENTES HORTIFRUTI COM REFERÊNCIA VISUAL:');
  console.log('─'.repeat(80));
  
  const hortifrutiIngredients = Array.from(ingredientMap.values())
    .filter(item => item.category === 'Hortifruti')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const withVisualRef = [];
  const withoutVisualRef = [];
  
  for (const item of hortifrutiIngredients) {
    const normalized = item.name.toLowerCase();
    const needsVisual = EXPECTED_VISUAL_REF.some(ref => 
      normalized.includes(ref) || ref.includes(normalized)
    );
    
    if (needsVisual) {
      withVisualRef.push(item);
    } else {
      withoutVisualRef.push(item);
    }
  }
  
  console.log(`\n✅ Ingredientes COM referência visual esperada: ${withVisualRef.length}`);
  for (const item of withVisualRef) {
    console.log(`\n   📦 ${item.name}`);
    
    // Verifica household_display
    const hasDisplay = item.items.every(i => i.household_display);
    const allDisplaysCorrect = item.items.every(i => {
      if (!i.household_display) return false;
      // Verifica se tem peso em gramas
      return /\d+\s*g/i.test(i.household_display);
    });
    
    if (hasDisplay && allDisplaysCorrect) {
      console.log(`      ✅ Todos os household_display corretos`);
    } else if (!hasDisplay) {
      console.log(`      ❌ Faltam household_display`);
    } else {
      console.log(`      ⚠️  Alguns household_display sem peso em gramas`);
    }
    
    // Mostra detalhes
    for (const detail of item.items) {
      console.log(`      • ${detail.recipe}: ${detail.quantity} ${detail.unit} → ${detail.household_display || '(sem display)'}`);
    }
  }
  
  if (withoutVisualRef.length > 0) {
    console.log(`\n\n📝 Ingredientes SEM referência visual (correto): ${withoutVisualRef.length}`);
    for (const item of withoutVisualRef) {
      console.log(`   • ${item.name}`);
    }
  }
  
  // Resumo final
  console.log('\n\n' + '='.repeat(80));
  console.log('\n🎯 RESUMO DO TESTE:');
  console.log('─'.repeat(80));
  console.log(`Total de ingredientes Hortifruti: ${hortifrutiIngredients.length}`);
  console.log(`Com referência visual: ${withVisualRef.length}`);
  console.log(`Sem referência visual: ${withoutVisualRef.length}`);
  
  const allCorrect = withVisualRef.every(item => 
    item.items.every(i => i.household_display && /\d+\s*g/i.test(i.household_display))
  );
  
  if (allCorrect) {
    console.log('\n✅ SUCESSO: Todos os ingredientes com referência visual têm household_display correto!');
  } else {
    console.log('\n⚠️  ATENÇÃO: Alguns ingredientes precisam de ajustes nos household_display');
  }
  
  console.log('\n' + '='.repeat(80));
}

testShoppingList().catch(console.error);

