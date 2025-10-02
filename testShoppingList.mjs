// Teste simples da lógica de categorização
import { unitConverter } from './src/lib/unitConverter.ts';

console.log('🧪 TESTE DA LÓGICA DE CATEGORIZAÇÃO')
console.log('====================================')
console.log('')

// Simula a lógica de categorização
function getCategory(name) {
  return unitConverter.getCategory(name);
}

// Lista de exclusão de ingredientes básicos
const EXCLUSION_LIST = [
  'sal',
  'pimenta do reino',
  'água',
  'agua',
  'gelo'
]

function shouldExclude(name) {
  const normalizedName = name.toLowerCase().trim()
  return EXCLUSION_LIST.some(exclusion => normalizedName.includes(exclusion))
}

// Testa ingredientes específicos
const testCases = [
  // Hortifruti
  { name: 'Berinjela', expectedCategory: 'Hortifruti' },
  { name: 'Alface', expectedCategory: 'Hortifruti' },
  { name: 'Pepino', expectedCategory: 'Hortifruti' },
  { name: 'Cebolinha', expectedCategory: 'Hortifruti' },
  { name: 'Frutas vermelhas', expectedCategory: 'Hortifruti' },
  { name: 'Banana', expectedCategory: 'Hortifruti' },
  { name: 'Manga', expectedCategory: 'Hortifruti' },
  { name: 'Espinafre', expectedCategory: 'Hortifruti' },
  { name: 'Cebola', expectedCategory: 'Hortifruti' },
  { name: 'Alho', expectedCategory: 'Hortifruti' },
  { name: 'Gengibre', expectedCategory: 'Hortifruti' },
  { name: 'Quinoa', expectedCategory: 'Mercearia' }, // Corrigido: Quinoa é Mercearia
  { name: 'Grão-de-bico', expectedCategory: 'Hortifruti' },
  { name: 'Lentilhas', expectedCategory: 'Mercearia' }, // Corrigido: Lentilhas secas são Mercearia
  { name: 'Nozes', expectedCategory: 'Hortifruti' },
  { name: 'Amêndoas', expectedCategory: 'Hortifruti' },
  { name: 'Castanha de caju', expectedCategory: 'Hortifruti' },
  { name: 'Pasta de amendoim', expectedCategory: 'Mercearia' }, // Corrigido: Processado

  // Carnes e Peixes
  { name: 'Bacon', expectedCategory: 'Carnes e Peixes' },
  { name: 'Linguiça', expectedCategory: 'Carnes e Peixes' },
  { name: 'Frango', expectedCategory: 'Carnes e Peixes' },
  { name: 'Carne moída', expectedCategory: 'Carnes e Peixes' },
  { name: 'Salmão', expectedCategory: 'Carnes e Peixes' },
  { name: 'Atum', expectedCategory: 'Carnes e Peixes' },
  { name: 'Camarão', expectedCategory: 'Carnes e Peixes' },
  { name: 'Bife', expectedCategory: 'Carnes e Peixes' },
  { name: 'Contrafilé', expectedCategory: 'Carnes e Peixes' },
  { name: 'Costela', expectedCategory: 'Carnes e Peixes' },

  // Laticínios
  { name: 'Whey protein', expectedCategory: 'Laticínios' },
  { name: 'Queijo', expectedCategory: 'Laticínios' },
  { name: 'Manteiga', expectedCategory: 'Laticínios' },
  { name: 'Cream cheese', expectedCategory: 'Laticínios' },
  { name: 'Ricota', expectedCategory: 'Laticínios' },
  { name: 'Iogurte', expectedCategory: 'Laticínios' },
  { name: 'Leite', expectedCategory: 'Laticínios' },
  { name: 'Creme de leite', expectedCategory: 'Laticínios' },

  // Mercearia
  { name: 'Ovos', expectedCategory: 'Mercearia' },
  { name: 'Leite de coco', expectedCategory: 'Mercearia' },
  { name: 'Leite de aveia', expectedCategory: 'Mercearia' },
  { name: 'Farinha de amêndoas', expectedCategory: 'Mercearia' },
  { name: 'Molho de tomate', expectedCategory: 'Mercearia' },
  { name: 'Caldo de legumes', expectedCategory: 'Mercearia' },
  { name: 'Farinha de trigo', expectedCategory: 'Mercearia' },
  { name: 'Açúcar', expectedCategory: 'Mercearia' },
  { name: 'Arroz', expectedCategory: 'Mercearia' },
  { name: 'Feijão', expectedCategory: 'Mercearia' },
  { name: 'Azeite', expectedCategory: 'Mercearia' },
  { name: 'Óleo', expectedCategory: 'Mercearia' },
  { name: 'Vinagre', expectedCategory: 'Mercearia' },
  { name: 'Suco de laranja', expectedCategory: 'Mercearia' },
  { name: 'Vinho branco', expectedCategory: 'Mercearia' },
  { name: 'Tahine', expectedCategory: 'Mercearia' },
  { name: 'Shoyu', expectedCategory: 'Mercearia' },
  { name: 'Curry', expectedCategory: 'Mercearia' },
  { name: 'Cominho', expectedCategory: 'Mercearia' },
  { name: 'Cúrcuma', expectedCategory: 'Mercearia' },
  { name: 'Gergelim', expectedCategory: 'Mercearia' },
  { name: 'Alga nori', expectedCategory: 'Mercearia' },
  { name: 'Tortilhas', expectedCategory: 'Mercearia' },
  { name: 'Nachos', expectedCategory: 'Mercearia' },
  { name: 'Melado', expectedCategory: 'Mercearia' },
  { name: 'Agave', expectedCategory: 'Mercearia' },
  { name: 'Baunilha', expectedCategory: 'Mercearia' }
]

console.log('✅ VERIFICAÇÃO DE CATEGORIZAÇÃO:')
console.log('================================')

let successCount = 0
let totalCount = 0
let failedCases = []

testCases.forEach(testCase => {
  const actualCategory = getCategory(testCase.name)
  const status = actualCategory === testCase.expectedCategory ? '✅' : '❌'

  if (status === '✅') {
    successCount++
  } else {
    failedCases.push({ ...testCase, actualCategory })
  }
  totalCount++
})

if (failedCases.length > 0) {
  console.log('Casos que falharam:')
  failedCases.forEach(testCase => {
    console.log(`❌ ${testCase.name}: esperado ${testCase.expectedCategory}, encontrado ${testCase.actualCategory}`)
  })
  console.log('')
}


console.log(`
📊 RESULTADO: ${successCount}/${totalCount} testes passaram (${((successCount/totalCount)*100).toFixed(1)}%)`)

// Testa a lista de exclusão
console.log('\n🚫 TESTE DA LISTA DE EXCLUSÃO:')
console.log('================================')

const exclusionTestCases = [
  { name: 'Sal', shouldExclude: true },
  { name: 'Pimenta do reino', shouldExclude: true },
  { name: 'Água', shouldExclude: true },
  { name: 'Gelo', shouldExclude: true },
  { name: 'Queijo', shouldExclude: false },
  { name: 'Banana', shouldExclude: false },
  { name: 'Frango', shouldExclude: false }
]

exclusionTestCases.forEach(testCase => {
  const isExcluded = shouldExclude(testCase.name)
  const status = isExcluded === testCase.shouldExclude ? '✅' : '❌'
  console.log(`${status} ${testCase.name}: deve excluir ${testCase.shouldExclude}, excluído ${isExcluded}`)
})

console.log('\n🎉 Teste concluído!')
