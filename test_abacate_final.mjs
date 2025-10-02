// test_abacate_final.mjs
import { buildShoppingList } from './src/lib/shoppingListBuilder.ts';

console.log('🥑 INICIANDO TESTE DE CORREÇÃO DO ABACATE 🥑');
console.log('============================================');

// Simula os ingredientes das 3 receitas do cardápio que usam abacate
const mockIngredients = [
  // 1. Salada Cobb Clássica: 1 Abacate em cubos
  {
    name: 'Abacate',
    quantity: 1,
    unit: 'unidade',
    originalUnit: 'unidade',
    category: 'Hortifruti',
    household_display: '1 unidade',
  },
  // 2. Guacamole com Chips de Batata-Doce: 3 Abacates maduros
  {
    name: 'Abacate maduro',
    quantity: 3,
    unit: 'unidades',
    originalUnit: 'unidades',
    category: 'Hortifruti',
    household_display: '3 unidades',
  },
  // 3. Tostada com Abacate e Ovo Pochê: 1 Abacate pequeno maduro
  {
    name: 'Abacate pequeno',
    quantity: 1,
    unit: 'unidade',
    originalUnit: 'unidade',
    category: 'Hortifruti',
    household_display: '1 unidade',
  },
  // Adicionar outro ingrediente para garantir que o resto da lista funcione
  {
    name: 'Tomate',
    quantity: 2,
    unit: 'unidades',
    originalUnit: 'unidades',
    category: 'Hortifruti',
    household_display: '2 unidades',
  }
];

console.log('\n📝 Ingredientes de entrada (simulando o cardápio):');
mockIngredients.forEach(ing => {
  if (ing.name.toLowerCase().includes('abacate')) {
    console.log(`- ${ing.quantity} ${ing.unit} de ${ing.name}`);
  }
});

// Constrói a lista de compras
const shoppingList = buildShoppingList(mockIngredients);

// Encontra o item "Abacate" na lista final
let avocadoItem = null;
if (shoppingList.items['Hortifruti']) {
  avocadoItem = shoppingList.items['Hortifruti'].find(item => item.name.toLowerCase() === 'abacate');
}

console.log('\n🔍 Resultado da Lista de Compras para "Abacate":');

if (avocadoItem) {
  console.log(`\n  >> displayText: "${avocadoItem.displayText}"`);
  
  // Validação
  const expectedText = 'Abacate – 1750g (aprox. 5 unidades)';
  console.log(`\n  >> Esperado:    "${expectedText}"`);

  if (avocadoItem.displayText === expectedText) {
    console.log('\n\n✅ SUCESSO! O resultado do abacate está correto.');
  } else {
    console.error('\n\n❌ FALHA! O resultado do abacate está incorreto.');
    process.exit(1); // Termina com código de erro
  }
} else {
  console.error('\n\n❌ FALHA! Não foi encontrado o item "Abacate" na lista de compras.');
  process.exit(1); // Termina com código de erro
}

console.log('\n============================================');
console.log('🎉 Teste do abacate concluído com sucesso! 🎉\n');
