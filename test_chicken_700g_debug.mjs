// Simular a função buildShoppingList diretamente

console.log('🔍 Debug: Investigando por que peito de frango mostra 700g...\n');

// Simular ingredientes de uma receita com peito de frango
const testIngredients = [
  {
    name: 'Peito de frango',
    quantity: 400,
    unit: 'g',
    household_display: '400g de peito de frango'
  }
];

console.log('📋 Ingredientes de teste:');
testIngredients.forEach(ing => {
  console.log(`  - ${ing.name}: ${ing.quantity}${ing.unit} (${ing.household_display})`);
});

console.log('\n🔍 Verificando se há conversão de cozido para cru sendo aplicada...');

// Verificar se o nome contém "cozido"
const nameLower = 'Peito de frango'.toLowerCase();
console.log(`Nome em lowercase: "${nameLower}"`);
console.log(`Contém "cozido": ${nameLower.includes('cozido')}`);

// Verificar fatores de conversão
const cookedToRawFactors = {
  'frango': 0.75,
  'peito de frango': 0.75,
  'peito de frango cozido': 0.75,
  'peito de frango cozido desfiado': 0.75
};

console.log('\n📋 Fatores de conversão disponíveis:');
Object.entries(cookedToRawFactors).forEach(([key, factor]) => {
  console.log(`  - "${key}": ${factor}`);
});

console.log('\n🔍 Verificando se algum fator seria aplicado:');
Object.keys(cookedToRawFactors).forEach(key => {
  const wouldApply = nameLower.includes(key);
  console.log(`  - "${key}": ${wouldApply ? '✅ APLICARIA' : '❌ não aplicaria'}`);
});

// Simular o que aconteceria se aplicasse o fator
console.log('\n🧮 Simulando aplicação do fator 0.75:');
const originalQuantity = 400;
const convertedQuantity = Math.round(originalQuantity * 0.75);
console.log(`  - Quantidade original: ${originalQuantity}g`);
console.log(`  - Quantidade após conversão: ${convertedQuantity}g`);
console.log(`  - Diferença: ${originalQuantity - convertedQuantity}g`);

console.log('\n✅ Teste concluído!');
