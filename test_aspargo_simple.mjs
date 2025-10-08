// Teste simples de normalização
const normalizeName = (name) => {
  const lower = name.toLowerCase().trim();
  
  // Normalizar aspargo/aspargos para "aspargo" (singular)
  if (lower.includes('aspargo')) {
    return 'aspargo';
  }
  
  return lower;
};

console.log('🧪 TESTE DE NORMALIZAÇÃO - ASPARGO\n');
console.log('='.repeat(80));

const testCases = [
  'Aspargo',
  'Aspargos',
  'Aspargos frescos',
  'aspargo',
  'aspargos'
];

console.log('\n📋 CASOS DE TESTE:');
testCases.forEach(name => {
  const normalized = normalizeName(name);
  const status = normalized === 'aspargo' ? '✅' : '❌';
  console.log(`   ${status} "${name}" → "${normalized}"`);
});

console.log('\n\n📊 SIMULAÇÃO DE CONSOLIDAÇÃO:');
console.log('─'.repeat(80));

const ingredients = [
  { name: 'Aspargo', qty: 0.5, unit: 'maço' },
  { name: 'Aspargos', qty: 300, unit: 'g' },
  { name: 'Aspargos frescos', qty: 1, unit: 'maço' }
];

const consolidated = {};

ingredients.forEach(ing => {
  const key = normalizeName(ing.name);
  console.log(`\n   Processing: "${ing.name}"`);
  console.log(`   → Normalized key: "${key}"`);
  
  if (!consolidated[key]) {
    consolidated[key] = { count: 0, items: [] };
  }
  consolidated[key].count++;
  consolidated[key].items.push(`${ing.qty} ${ing.unit}`);
});

console.log('\n\n🎯 RESULTADO DA CONSOLIDAÇÃO:');
console.log('─'.repeat(80));

Object.entries(consolidated).forEach(([key, data]) => {
  console.log(`\n   Key: "${key}"`);
  console.log(`   Itens consolidados: ${data.count}`);
  data.items.forEach((item, i) => {
    console.log(`     ${i + 1}. ${item}`);
  });
});

const success = Object.keys(consolidated).length === 1 && consolidated['aspargo'];

console.log('\n\n' + '='.repeat(80));
if (success) {
  console.log('✅ SUCESSO: Todos os aspargos foram consolidados em uma única chave!');
} else {
  console.log('❌ ERRO: Aspargos foram consolidados em múltiplas chaves!');
}
console.log('='.repeat(80));

