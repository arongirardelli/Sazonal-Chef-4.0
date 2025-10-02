import { createClient } from '@supabase/supabase-js'
import { additionalRecipeCorrections, dessertRecipeCorrections } from './recipeCorrections.mjs'
import dotenv from 'dotenv'

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}
const supabase = createClient(url, anonKey)

function nowIso() {
  return new Date().toISOString()
}

// Receitas corrigidas com todas as informações completas
const correctedRecipes = [
  ...additionalRecipeCorrections,
  ...dessertRecipeCorrections,
  {
    title: 'Mousse de Chocolate Vegano',
    rating: 4.5,
    tips: [
      'Use abacates bem maduros para melhor cremosidade.',
      'Ajuste a doçura com mais ou menos tâmaras.',
      'Para uma versão mais cremosa, adicione 1 colher de sopa de óleo de coco.',
      'Deixe as tâmaras de molho em água quente por 10 minutos para facilitar o processamento.'
    ],
    instructions: [
      'Deixe as tâmaras de molho em água quente por 10 minutos.',
      'Bata no liquidificador o abacate, cacau em pó, tâmaras e baunilha até ficar homogêneo.',
      'Adicione o leite vegetal aos poucos até obter a cremosidade desejada.',
      'Transfira para taças individuais e leve à geladeira por pelo menos 2 horas.',
      'Sirva gelado decorado com frutas vermelhas e folhas de hortelã.'
    ],
    structured_ingredients: [
      { name: 'Abacate', quantity: 0.5, unit: 'unidade' },
      { name: 'Cacau em pó', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Tâmaras', quantity: 4, unit: 'unidades' },
      { name: 'Extrato de baunilha', quantity: 2.5, unit: 'ml' },
      { name: 'Leite de coco', quantity: 100, unit: 'ml' }
    ],
    calories: 180,
    servings: 2
  },
  {
    title: 'Tapioca com Queijo e Tomate',
    rating: 4.3,
    tips: [
      'Use goma de tapioca fina para melhor textura.',
      'Aqueça bem a frigideira antes de colocar a goma.',
      'Para uma versão mais saborosa, adicione orégano e pimenta.',
      'Sirva imediatamente para manter a crocância.'
    ],
    instructions: [
      'Em uma tigela, hidrate a goma de tapioca com água por 5 minutos.',
      'Aqueça uma frigideira antiaderente em fogo médio.',
      'Espalhe a goma úmida na frigideira formando um disco uniforme.',
      'Cozinhe por 2-3 minutos até ficar transparente e firme.',
      'Vire a tapioca e cozinhe por mais 1 minuto.',
      'Adicione o queijo mussarela e o tomate picado em uma metade.',
      'Dobre a tapioca ao meio e pressione levemente.',
      'Cozinhe por mais 1 minuto até o queijo derreter.',
      'Tempere com sal e sirva quente.'
    ],
    structured_ingredients: [
      { name: 'Goma de tapioca', quantity: 60, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 40, unit: 'g' },
      { name: 'Tomate', quantity: 40, unit: 'g' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Água', quantity: 60, unit: 'ml' }
    ],
    calories: 280,
    servings: 1
  },
  {
    title: 'Pão Integral com Abacate e Ovo',
    rating: 4.4,
    tips: [
      'Use pão integral fresco para melhor sabor.',
      'Amasse o abacate com limão para evitar que escureça.',
      'Para um toque extra, adicione pimenta do reino e flocos de sal.',
      'Sirva o ovo ainda morno para melhor textura.'
    ],
    instructions: [
      'Torre o pão integral até ficar dourado e crocante.',
      'Em uma tigela, amasse o abacate com sal e suco de limão.',
      'Espalhe o purê de abacate sobre as torradas.',
      'Cozinhe o ovo na forma desejada (frito, mexido ou pochê).',
      'Coloque o ovo sobre o abacate nas torradas.',
      'Tempere com sal, pimenta e flocos de sal se desejar.',
      'Sirva imediatamente.'
    ],
    structured_ingredients: [
      { name: 'Pão integral', quantity: 2, unit: 'fatias' },
      { name: 'Abacate', quantity: 0.25, unit: 'unidade' },
      { name: 'Ovos', quantity: 1, unit: 'unidade' },
      { name: 'Suco de limão', quantity: 5, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.25, unit: 'colher de chá' }
    ],
    calories: 320,
    servings: 1
  },
  {
    title: 'Crepioca de Frango',
    rating: 4.2,
    tips: [
      'Use goma de tapioca fina para melhor textura.',
      'Para uma versão mais proteica, adicione 1 colher de sopa de farinha de aveia.',
      'Tempere o frango com ervas antes de desfiar.',
      'Sirva quente para melhor sabor.'
    ],
    instructions: [
      'Em uma tigela, misture o ovo batido com a goma de tapioca.',
      'Deixe a mistura descansar por 5 minutos para hidratar.',
      'Aqueça uma frigideira antiaderente em fogo médio.',
      'Despeje metade da mistura na frigideira formando um disco fino.',
      'Cozinhe por 2-3 minutos até ficar firme e dourado.',
      'Vire e cozinhe por mais 1 minuto.',
      'Adicione o frango desfiado e o queijo em uma metade.',
      'Dobre ao meio e pressione levemente.',
      'Cozinhe por mais 1 minuto até o queijo derreter.',
      'Repita o processo com a massa restante.',
      'Sirva quente.'
    ],
    structured_ingredients: [
      { name: 'Ovos', quantity: 1, unit: 'unidade' },
      { name: 'Goma de tapioca', quantity: 40, unit: 'g' },
      { name: 'Peito de frango cozido desfiado', quantity: 60, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 20, unit: 'g' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.25, unit: 'colher de chá' }
    ],
    calories: 280,
    servings: 1
  },
  {
    title: 'Wrap de Ovo com Peru',
    rating: 4.1,
    tips: [
      'Use wraps integrais para mais fibras.',
      'Aqueça o wrap antes de rechear para evitar que quebre.',
      'Para uma versão mais saborosa, adicione mostarda ou molho de iogurte.',
      'Sirva imediatamente para manter a textura.'
    ],
    instructions: [
      'Aqueça o wrap em uma frigideira seca por 30 segundos de cada lado.',
      'Em uma frigideira separada, aqueça um fio de azeite em fogo médio.',
      'Bata os ovos com sal e pimenta em uma tigela.',
      'Despeje os ovos na frigideira e mexa constantemente até ficarem cremosos.',
      'Retire do fogo quando ainda estiverem úmidos.',
      'Coloque o wrap em um prato e adicione os ovos mexidos no centro.',
      'Adicione o peito de peru fatiado sobre os ovos.',
      'Polvilhe o queijo mussarela.',
      'Dobre as laterais do wrap e depois dobre de baixo para cima.',
      'Sirva quente.'
    ],
    structured_ingredients: [
      { name: 'Wrap integral', quantity: 1, unit: 'unidade' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Peito de peru', quantity: 40, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 20, unit: 'g' },
      { name: 'Azeite', quantity: 5, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.25, unit: 'colher de chá' }
    ],
          calories: 300,
      servings: 1
    },
    {
      title: 'Salada de Quinoa com Legumes',
      rating: 4.6,
      tips: [
        'Lave bem a quinoa antes de cozinhar para remover o sabor amargo.',
        'Para mais sabor, toste a quinoa em uma frigideira seca antes de cozinhar.',
        'Use legumes da estação para melhor sabor e preço.',
        'Finalize com suco de limão fresco para realçar os sabores.'
      ],
      instructions: [
        'Lave a quinoa em água corrente até a água ficar transparente.',
        'Em uma panela, cozinhe a quinoa com 2 xícaras de água por 15-20 minutos.',
        'Escorra e deixe esfriar completamente.',
        'Pré-aqueça o forno a 200°C.',
        'Corte os legumes em pedaços uniformes e coloque em uma assadeira.',
        'Regue com azeite, sal e pimenta e misture bem.',
        'Asse por 20-25 minutos até os legumes ficarem macios e dourados.',
        'Em uma tigela grande, misture a quinoa cozida com os legumes assados.',
        'Tempere com azeite, sal, pimenta e suco de limão a gosto.',
        'Sirva em temperatura ambiente ou gelada.'
      ],
      structured_ingredients: [
        { name: 'Quinoa', quantity: 100, unit: 'g' },
        { name: 'Pimentão', quantity: 80, unit: 'g' },
        { name: 'Abobrinha', quantity: 100, unit: 'g' },
        { name: 'Cebola', quantity: 50, unit: 'g' },
        { name: 'Azeite', quantity: 15, unit: 'ml' },
        { name: 'Suco de limão', quantity: 10, unit: 'ml' },
        { name: 'Sal', quantity: 1, unit: 'colher de chá' },
        { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
      ],
      calories: 280,
      servings: 2
    },
    {
      title: 'Frango Grelhado com Brócolis',
      rating: 4.5,
      tips: [
        'Deixe o frango em temperatura ambiente por 15 minutos antes de grelhar.',
        'Para frango mais suculento, não pressione durante o cozimento.',
        'Cozinhe o brócolis no vapor para manter a cor e nutrientes.',
        'Tempere o frango com ervas frescas para mais sabor.'
      ],
      instructions: [
        'Tempere o peito de frango com azeite, sal, pimenta e ervas a gosto.',
        'Deixe marinar por 15 minutos em temperatura ambiente.',
        'Aqueça uma grelha ou frigideira em fogo alto.',
        'Grelhe o frango por 6-8 minutos de cada lado até ficar dourado.',
        'Verifique o cozimento com um termômetro (74°C) ou corte uma parte.',
        'Enquanto isso, prepare o brócolis: corte em floretes.',
        'Em uma panela com água fervente, cozinhe o brócolis por 3-4 minutos.',
        'Escorra e mergulhe em água gelada para manter a cor verde.',
        'Tempere o brócolis com azeite, sal e pimenta.',
        'Sirva o frango fatiado com o brócolis ao lado.'
      ],
      structured_ingredients: [
        { name: 'Peito de frango', quantity: 200, unit: 'g' },
        { name: 'Brócolis', quantity: 150, unit: 'g' },
        { name: 'Azeite', quantity: 10, unit: 'ml' },
        { name: 'Sal', quantity: 1, unit: 'colher de chá' },
        { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
        { name: 'Ervas frescas', quantity: 2, unit: 'raminhos' }
      ],
      calories: 320,
      servings: 2
    }
  ]

async function updateRecipe(recipeData) {
  const { data: existing } = await supabase
    .from('recipes')
    .select('id')
    .ilike('title', recipeData.title)
    .maybeSingle()

  if (existing?.id) {
    const { error } = await supabase
      .from('recipes')
      .update({
        rating: recipeData.rating,
        tips: recipeData.tips,
        instructions: recipeData.instructions,
        structured_ingredients: recipeData.structured_ingredients,
        calories: recipeData.calories,
        servings: recipeData.servings,
        updated_at: nowIso()
      })
      .eq('id', existing.id)
    
    if (error) throw error
    console.log(`✅ Atualizada: ${recipeData.title}`)
  } else {
    console.log(`⚠️  Receita não encontrada: ${recipeData.title}`)
  }
}

async function main() {
  console.log(`Corrigindo ${correctedRecipes.length} receitas...`)
  
  for (const recipe of correctedRecipes) {
    try {
      await updateRecipe(recipe)
    } catch (error) {
      console.error(`❌ Erro ao atualizar ${recipe.title}:`, error.message)
    }
  }
  
  console.log('✅ Processo de correção concluído!')
}

main().catch((e) => { 
  console.error('Erro fatal:', e)
  process.exit(1) 
})
