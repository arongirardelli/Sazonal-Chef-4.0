console.log('🔍 Debug: Investigando possível duplicação de peito de frango...\n');

// Simular cenários possíveis que causariam 700g:
console.log('📊 Cenários possíveis:');
console.log('1. Se 400g + 300g = 700g → Há uma receita extra com 300g');
console.log('2. Se 400g * 1.75 = 700g → Está aplicando um fator de multiplicação incorreto');
console.log('3. Se 400g + (400g * 0.75) = 700g → Está somando o valor original + conversão');
console.log('');

// Cenário 1: Há uma receita extra
console.log('📋 Cenário 1: Receita extra com 300g');
console.log('  400g + 300g = 700g ✅');
console.log('  Possível causa: Há outra receita no cardápio que não foi identificada');
console.log('');

// Cenário 2: Está aplicando um fator de multiplicação incorreto
console.log('🧮 Cenário 2: Fator de multiplicação incorreto');
const fator = 700 / 400;
console.log(`  400g * ${fator} = 700g ✅`);
console.log(`  Possível causa: Está aplicando um fator de ${fator} incorretamente`);
console.log('');

// Cenário 3: Está somando o valor original + conversão
console.log('➕ Cenário 3: Somando valor original + conversão');
const original = 400;
const converted = Math.round(original * 0.75);
const sum = original + converted;
console.log(`  400g + (400g * 0.75) = 400g + ${converted}g = ${sum}g ✅`);
console.log(`  Possível causa: Está somando o valor original com a conversão de cozido para cru`);
console.log('');

console.log('🎯 Conclusão: O cenário 3 é o mais provável!');
console.log('  O código está somando o valor original (400g) com a conversão (300g)');
console.log('  Isso sugere que há uma lógica que está:');
console.log('  1. Consolidando o peito de frango cru: 400g');
console.log('  2. Aplicando conversão de cozido para cru: 400g * 0.75 = 300g');
console.log('  3. Somando os dois: 400g + 300g = 700g');
console.log('');

console.log('✅ Teste concluído!');
