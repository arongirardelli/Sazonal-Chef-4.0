console.log('🔍 Teste Final: Verificando correção do peito de frango...\n');

// Simular ingredientes da receita "Peito de Frango ao Limão com Arroz"
const testIngredients = [
  {
    name: 'Peito de frango',
    quantity: 400,
    unit: 'g',
    household_display: '400g de peito de frango'
  }
];

console.log('📋 Ingredientes da receita:');
testIngredients.forEach(ing => {
  console.log(`  - ${ing.name}: ${ing.quantity}${ing.unit} (${ing.household_display})`);
});

// Simular a lógica de normalização
function normalizeName(name) {
  const lower = name.toLowerCase();
  
  // CORREÇÃO CRÍTICA: Normalizar frango desfiado para manter separado do peito de frango
  if (lower.includes('frango desfiado') || lower.includes('peito de frango desfiado') || 
      lower.includes('peito de frango cozido desfiado') || lower.includes('frango cozido desfiado')) {
    return 'frango desfiado';
  }
  
  // NOVO: Normalizar todas as variações de peito de frango para "peito de frango"
  if (lower.includes('peito de frango')) {
    return 'peito de frango';
  }
  
  return lower;
}

// Simular a lógica de consolidação
const consolidatedIngredients = {};

testIngredients.forEach(ing => {
  const key = normalizeName(ing.name);
  console.log(`\n🔄 Processando: "${ing.name}" -> normalizado para: "${key}"`);
  
  // LÓGICA ESPECÍFICA: Peito de frango
  if (key === 'peito de frango') {
    let peitoFrangoGrams = 0;
    
    // Calcular gramas baseado na unidade e household_display
    if (ing.unit === 'g') {
      peitoFrangoGrams = ing.quantity;
      console.log(`  ✅ Unidade em gramas: ${peitoFrangoGrams}g`);
    } else if (ing.unit === 'filés' || ing.unit === 'filé' || ing.unit === 'file' || ing.unit === 'files') {
      // Tentar extrair peso do household_display se disponível
      if (ing.household_display) {
        const weightMatch = ing.household_display.match(/(\d+(?:\.\d+)?)\s*g/i);
        if (weightMatch) {
          peitoFrangoGrams = parseFloat(weightMatch[1]);
          console.log(`  ✅ Peso extraído do household_display: ${peitoFrangoGrams}g`);
        } else {
          // Fallback: assumir 200g por filé de peito de frango
          peitoFrangoGrams = ing.quantity * 200;
          console.log(`  ⚠️ Fallback: ${ing.quantity} filés * 200g = ${peitoFrangoGrams}g`);
        }
      } else {
        // Fallback: assumir 200g por filé de peito de frango
        peitoFrangoGrams = ing.quantity * 200;
        console.log(`  ⚠️ Fallback: ${ing.quantity} filés * 200g = ${peitoFrangoGrams}g`);
      }
    } else {
      // Fallback: assumir que é em gramas
      peitoFrangoGrams = ing.quantity;
      console.log(`  ⚠️ Fallback: assumindo ${peitoFrangoGrams}g`);
    }
    
    if (consolidatedIngredients[key]) {
      // Somar gramas de peito de frango
      consolidatedIngredients[key].quantity += peitoFrangoGrams;
      console.log(`  ➕ Somando: ${peitoFrangoGrams}g (total: ${consolidatedIngredients[key].quantity}g)`);
    } else {
      // Criar novo ingrediente consolidado
      consolidatedIngredients[key] = {
        name: 'Peito de frango',
        quantity: peitoFrangoGrams,
        unit: 'g',
        originalUnit: ing.unit,
        category: 'Carnes e Peixes',
        household_display: ing.household_display
      };
      console.log(`  🆕 Criando: ${peitoFrangoGrams}g`);
    }
    return; // Pular processamento normal
  }
});

console.log('\n📊 Resultado da consolidação:');
Object.entries(consolidatedIngredients).forEach(([key, item]) => {
  console.log(`  - ${item.name}: ${item.quantity}${item.unit}`);
});

// Simular a lógica de exibição
console.log('\n🖥️ Simulando exibição:');
Object.entries(consolidatedIngredients).forEach(([key, item]) => {
  let displayText = '';
  
  // LÓGICA FINAL PARA ANEXAR PESO CRU (CORRIGIDA)
  const nameLower = item.name.toLowerCase();
  console.log(`  Nome em lowercase: "${nameLower}"`);
  console.log(`  Contém "cozido": ${nameLower.includes('cozido')}`);
  
  if (nameLower.includes('cozido') || nameLower.includes('cozida')) {
    console.log(`  ⚠️ Aplicaria conversão de cozido para cru`);
    
    // Verificar fatores de conversão (CORRIGIDOS)
    const cookedToRawFactors = {
      'frango': 0.75,
      // 'peito de frango': 0.75, // REMOVIDO: não aplicar conversão genérica
      'peito de frango cozido': 0.75,
      'peito de frango cozido desfiado': 0.75
    };
    
    for (const factorKey in cookedToRawFactors) {
      if (nameLower.includes(factorKey)) {
        const rawWeight = Math.round(item.quantity * cookedToRawFactors[factorKey]);
        console.log(`  ✅ Aplicando fator ${cookedToRawFactors[factorKey]} para "${factorKey}": ${rawWeight}g`);
        displayText = `${item.name} – ${item.quantity}g (aprox. ${rawWeight}g Cru)`;
        break;
      }
    }
  } else {
    console.log(`  ✅ Não aplica conversão de cozido para cru`);
    displayText = `${item.name} – ${item.quantity}g`;
  }
  
  console.log(`  Resultado final: "${displayText}"`);
});

console.log('\n🎯 Resultado esperado: "Peito de frango – 400g"');
console.log('✅ Teste concluído!');
