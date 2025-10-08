import { buildShoppingList } from './src/lib/shoppingListBuilder.ts';

// Simular ingredientes das 3 receitas
const mockIngredients = [
  // Bife com Ovos e Aspargos
  {
    name: 'Aspargo',
    quantity: 0.5,
    unit: 'maço',
    category: 'Hortifruti',
    display: '½ maço de Aspargos',
    household_display: 'aprox. 150g'
  },
  // Salmão ao Forno com Aspargos
  {
    name: 'Aspargos',
    quantity: 300,
    unit: 'g',
    category: 'Hortifruti',
    display: '300g de Aspargos frescos',
    household_display: 'aprox. 1.5 maços (300g)'
  },
  // Salmão Assado com Aspargos e Limão
  {
    name: 'Aspargos frescos',
    quantity: 1,
    unit: 'maço',
    category: 'Hortifruti',
    display: '1 maço de Aspargos frescos',
    household_display: 'aprox. 1 maço (200g)'
  }
];

console.log('🧪 TESTE DE CONSOLIDAÇÃO - ASPARGO\n');
console.log('='.repeat(80));

console.log('\n📋 INGREDIENTES DE ENTRADA:');
mockIngredients.forEach((ing, i) => {
  console.log(`\n${i + 1}. ${ing.name}`);
  console.log(`   Quantidade: ${ing.quantity} ${ing.unit}`);
  console.log(`   household_display: ${ing.household_display}`);
});

console.log('\n\n🔄 PROCESSANDO LISTA DE COMPRAS...\n');

const result = buildShoppingList(mockIngredients);

console.log('📊 RESULTADO:');
console.log('─'.repeat(80));

const aspargoItems = result.items.filter(item => 
  item.name.toLowerCase().includes('aspargo')
);

if (aspargoItems.length === 0) {
  console.log('❌ ERRO: Nenhum item de aspargo encontrado na lista!');
} else if (aspargoItems.length > 1) {
  console.log(`❌ ERRO: Encontrados ${aspargoItems.length} itens de aspargo (duplicação!):\n`);
  aspargoItems.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item.displayText}`);
  });
} else {
  console.log(`✅ SUCESSO: 1 item consolidado:\n`);
  console.log(`   ${aspargoItems[0].displayText}`);
  
  // Verificar se está correto
  const expected = 'Aspargo – 3 maços (aprox. 600g)';
  if (aspargoItems[0].displayText === expected) {
    console.log(`\n   ✅ Renderização CORRETA: "${expected}"`);
  } else {
    console.log(`\n   ⚠️  Esperado: "${expected}"`);
    console.log(`   ⚠️  Obtido:   "${aspargoItems[0].displayText}"`);
  }
}

console.log('\n' + '='.repeat(80));

