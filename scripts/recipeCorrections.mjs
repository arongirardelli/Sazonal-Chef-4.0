// Receitas adicionais que precisam ser corrigidas
export const additionalRecipeCorrections = [
  {
    title: 'Omelete de Espinafre e Queijo',
    rating: 4.4,
    tips: [
      'Use frigideira antiaderente bem aquecida para evitar que grude.',
      'Não mexa muito os ovos para manter a textura cremosa.',
      'Adicione o queijo no final para não derreter demais.',
      'Sirva imediatamente para melhor textura.'
    ],
    instructions: [
      'Em uma tigela, bata os ovos com o leite, sal e pimenta até ficarem homogêneos.',
      'Aqueça uma frigideira antiaderente em fogo médio com um fio de azeite.',
      'Adicione o espinafre e refogue por 1-2 minutos até murchar.',
      'Despeje a mistura de ovos sobre o espinafre.',
      'Deixe cozinhar por 2-3 minutos até as bordas ficarem firmes.',
      'Adicione o queijo mussarela sobre uma metade.',
      'Dobre o omelete ao meio com uma espátula.',
      'Cozinhe por mais 1 minuto até o queijo derreter.',
      'Deslize para um prato e sirva quente.'
    ],
    structured_ingredients: [
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Espinafre', quantity: 50, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 30, unit: 'g' },
      { name: 'Leite', quantity: 20, unit: 'ml' },
      { name: 'Azeite', quantity: 5, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.25, unit: 'colher de chá' }
    ],
    calories: 280,
    servings: 1
  },
  {
    title: 'Panquecas de Aveia e Banana',
    rating: 4.3,
    tips: [
      'Use aveia fina para melhor textura.',
      'Amasse bem a banana para evitar pedaços grandes.',
      'Deixe a massa descansar por 5 minutos para hidratar a aveia.',
      'Use frigideira antiaderente bem aquecida.'
    ],
    instructions: [
      'Em uma tigela, amasse a banana com um garfo até ficar cremosa.',
      'Adicione os ovos e misture bem.',
      'Incorpore a aveia e o leite de aveia gradualmente.',
      'Deixe a massa descansar por 5 minutos.',
      'Aqueça uma frigideira antiaderente em fogo médio.',
      'Unte levemente com azeite.',
      'Despeje porções de 1/4 de xícara da massa na frigideira.',
      'Cozinhe por 2-3 minutos até aparecerem bolhas na superfície.',
      'Vire e cozinhe por mais 1-2 minutos até dourado.',
      'Repita com a massa restante.',
      'Sirva quente com mel opcional.'
    ],
    structured_ingredients: [
      { name: 'Banana', quantity: 0.5, unit: 'unidade' },
      { name: 'Ovos', quantity: 1, unit: 'unidade' },
      { name: 'Aveia em flocos', quantity: 40, unit: 'g' },
      { name: 'Leite de aveia', quantity: 60, unit: 'ml' },
      { name: 'Azeite', quantity: 5, unit: 'ml' },
      { name: 'Mel', quantity: 0.5, unit: 'colher de sopa' }
    ],
    calories: 320,
    servings: 2
  },
  {
    title: 'Chia Pudding com Manga',
    rating: 4.2,
    tips: [
      'Use sementes de chia de boa qualidade para melhor gelificação.',
      'Deixe hidratar por pelo menos 2 horas ou durante a noite.',
      'Para mais sabor, adicione canela ou baunilha.',
      'Sirva gelado para melhor textura.'
    ],
    instructions: [
      'Em uma tigela, misture as sementes de chia com o leite de coco.',
      'Adicione o melado e misture bem.',
      'Deixe hidratar na geladeira por pelo menos 2 horas ou durante a noite.',
      'Misture novamente para quebrar qualquer grumo.',
      'Corte a manga em cubos pequenos.',
      'Divida o pudim de chia em taças individuais.',
      'Decore com os cubos de manga.',
      'Sirva gelado.'
    ],
    structured_ingredients: [
      { name: 'Chia', quantity: 20, unit: 'g' },
      { name: 'Leite de coco', quantity: 120, unit: 'ml' },
      { name: 'Manga', quantity: 60, unit: 'g' },
      { name: 'Melado', quantity: 10, unit: 'ml' }
    ],
    calories: 180,
    servings: 1
  },
  {
    title: 'Gelatina de Agar com Frutas',
    rating: 4.0,
    tips: [
      'Use agar agar em pó para melhor dissolução.',
      'Ferva por pelo menos 2 minutos para ativar o agar.',
      'Adicione as frutas após a gelatina começar a esfriar.',
      'Deixe gelar completamente antes de servir.'
    ],
    instructions: [
      'Em uma panela, aqueça o suco de uva em fogo médio.',
      'Adicione o agar agar e mexa constantemente.',
      'Ferva por 2-3 minutos até o agar dissolver completamente.',
      'Retire do fogo e deixe esfriar por 5 minutos.',
      'Corte as frutas em pedaços pequenos.',
      'Distribua as frutas em taças individuais.',
      'Despeje a gelatina ainda líquida sobre as frutas.',
      'Leve à geladeira por pelo menos 2 horas até gelar.',
      'Sirva gelado.'
    ],
    structured_ingredients: [
      { name: 'Suco de uva', quantity: 250, unit: 'ml' },
      { name: 'Agar agar', quantity: 4, unit: 'g' },
      { name: 'Morangos', quantity: 75, unit: 'g' }
    ],
    calories: 140,
    servings: 2
  }
]

// Receitas de sobremesa que precisam ser corrigidas
export const dessertRecipeCorrections = [
  {
    title: 'Mousse de Chocolate 70%',
    rating: 4.7,
    tips: [
      'Use chocolate de boa qualidade para melhor sabor.',
      'Deixe o chocolate esfriar um pouco antes de incorporar o creme.',
      'Bata o creme até ponto de picos firmes.',
      'Refrigere por pelo menos 4 horas antes de servir.'
    ],
    instructions: [
      'Pique o chocolate em pedaços pequenos e derreta em banho-maria.',
      'Deixe esfriar por 5 minutos.',
      'Em uma tigela separada, bata o creme de leite até ponto de picos firmes.',
      'Adicione o açúcar gradualmente enquanto bate.',
      'Com movimentos suaves, incorpore o chocolate derretido ao creme.',
      'Distribua em taças individuais.',
      'Leve à geladeira por pelo menos 4 horas.',
      'Sirva gelado decorado com raspas de chocolate.'
    ],
    structured_ingredients: [
      { name: 'Chocolate 70%', quantity: 100, unit: 'g' },
      { name: 'Creme de leite', quantity: 150, unit: 'ml' },
      { name: 'Açúcar', quantity: 20, unit: 'g' }
    ],
    calories: 450,
    servings: 2
  },
  {
    title: 'Pudim de Chia com Coco',
    rating: 4.4,
    tips: [
      'Use sementes de chia de boa qualidade.',
      'Deixe hidratar por pelo menos 4 horas.',
      'Para mais sabor, adicione canela ou baunilha.',
      'Sirva gelado para melhor textura.'
    ],
    instructions: [
      'Em uma tigela, misture as sementes de chia com o leite de coco.',
      'Adicione o melado e misture bem.',
      'Deixe hidratar na geladeira por pelo menos 4 horas.',
      'Misture novamente para quebrar qualquer grumo.',
      'Distribua em taças individuais.',
      'Decore com coco ralado se desejar.',
      'Sirva gelado.'
    ],
    structured_ingredients: [
      { name: 'Chia', quantity: 20, unit: 'g' },
      { name: 'Leite de coco', quantity: 125, unit: 'ml' },
      { name: 'Melado', quantity: 10, unit: 'ml' }
    ],
    calories: 180,
    servings: 1
  }
]
