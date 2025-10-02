// Lote final de receitas que precisam ser corrigidas
export const recipeCorrectionsFinal = [
  {
    title: 'Tofu com Brócolis ao Molho',
    rating: 4.2,
    tips: [
      'Escorra bem o tofu antes de grelhar para melhor textura.',
      'Marine o tofu por pelo menos 30 minutos para mais sabor.',
      'Use brócolis frescos para melhor sabor.',
      'Sirva com arroz integral para uma refeição completa.'
    ],
    instructions: [
      'Escorra o tofu e corte em fatias de 1cm de espessura.',
      'Marine o tofu com shoyu, gengibre e alho por 30 minutos.',
      'Aqueça uma frigideira antiaderente em fogo médio.',
      'Grelhe o tofu por 3-4 minutos de cada lado até ficar dourado.',
      'Em uma panela separada, aqueça um fio de azeite.',
      'Adicione o brócolis picado e salteie por 5-7 minutos.',
      'Adicione o shoyu e mexa bem.',
      'Polvilhe com gergelim por cima.',
      'Sirva o tofu grelhado com o brócolis salteado.'
    ],
    structured_ingredients: [
      { name: 'Tofu firme', quantity: 200, unit: 'g' },
      { name: 'Brócolis', quantity: 200, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' },
      { name: 'Azeite', quantity: 10, unit: 'ml' },
      { name: 'Gengibre', quantity: 5, unit: 'g' },
      { name: 'Alho', quantity: 1, unit: 'dente' }
    ],
    calories: 230,
    servings: 2
  },
  {
    title: 'Almôndegas ao Molho de Tomate',
    rating: 4.5,
    tips: [
      'Use carne bovina magra para menos gordura.',
      'Não amasse demais as almôndegas para ficarem macias.',
      'Deixe as almôndegas descansar por 5 minutos antes de fritar.',
      'Sirva com arroz ou macarrão para uma refeição completa.'
    ],
    instructions: [
      'Em uma tigela grande, misture a carne moída, cebola picada e alho.',
      'Adicione o queijo parmesão ralado e misture bem.',
      'Tempere com sal e pimenta a gosto.',
      'Modele almôndegas do tamanho de uma bola de golfe.',
      'Em uma frigideira grande, aqueça azeite em fogo médio.',
      'Sele as almôndegas por todos os lados até ficarem douradas.',
      'Adicione o molho de tomate e mexa suavemente.',
      'Cozinhe por 15-20 minutos até as almôndegas ficarem cozidas.',
      'Verifique o cozimento com um garfo.',
      'Sirva quente com arroz ou macarrão.'
    ],
    structured_ingredients: [
      { name: 'Carne moída', quantity: 400, unit: 'g' },
      { name: 'Molho de tomate', quantity: 300, unit: 'ml' },
      { name: 'Cebola', quantity: 80, unit: 'g' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
      { name: 'Queijo parmesão', quantity: 40, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ],
    calories: 293,
    servings: 3
  },
  {
    title: 'Yakisoba de Legumes',
    rating: 4.3,
    tips: [
      'Use macarrão específico para yakisoba.',
      'Cozinhe o macarrão al dente para não ficar mole.',
      'Salteie os legumes em fogo alto para manter a crocância.',
      'Sirva imediatamente para melhor textura.'
    ],
    instructions: [
      'Cozinhe o macarrão conforme as instruções da embalagem.',
      'Escorra e reserve.',
      'Em uma frigideira grande ou wok, aqueça azeite em fogo alto.',
      'Adicione os legumes picados e salteie por 3-4 minutos.',
      'Adicione o macarrão cozido e mexa bem.',
      'Adicione o shoyu e mexa para distribuir o molho.',
      'Cozinhe por mais 2-3 minutos até tudo ficar bem misturado.',
      'Tempere com sal e pimenta se necessário.',
      'Sirva quente decorado com gergelim.'
    ],
    structured_ingredients: [
      { name: 'Macarrão para yakisoba', quantity: 150, unit: 'g' },
      { name: 'Cenoura', quantity: 80, unit: 'g' },
      { name: 'Brócolis', quantity: 120, unit: 'g' },
      { name: 'Pimentão', quantity: 80, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' }
    ],
    calories: 320,
    servings: 2
  },
  {
    title: 'Sorbet de Manga',
    rating: 4.2,
    tips: [
      'Use mangas bem maduras para melhor sabor.',
      'Congele a manga em pedaços para facilitar o processamento.',
      'Adicione um pouco de suco de limão para realçar o sabor.',
      'Sirva imediatamente para melhor textura.'
    ],
    instructions: [
      'Descasque e corte a manga em pedaços pequenos.',
      'Coloque em um recipiente e leve ao freezer por 2 horas.',
      'Retire do freezer e deixe amolecer por 5 minutos.',
      'Coloque no processador de alimentos ou liquidificador.',
      'Adicione água aos poucos e bata até ficar cremoso.',
      'Se necessário, adicione mais água para obter a consistência desejada.',
      'Transfira para um recipiente hermético.',
      'Leve ao freezer por mais 2 horas.',
      'Sirva gelado decorado com fatias de manga.'
    ],
    structured_ingredients: [
      { name: 'Manga', quantity: 400, unit: 'g' },
      { name: 'Água', quantity: 100, unit: 'ml' },
      { name: 'Suco de limão', quantity: 10, unit: 'ml' }
    ],
    calories: 100,
    servings: 4
  },
  {
    title: 'Brownie Sem Glúten',
    rating: 4.4,
    tips: [
      'Use farinha de amêndoas de boa qualidade.',
      'Não asse demais para ficar úmido por dentro.',
      'Deixe esfriar completamente antes de cortar.',
      'Sirva com sorvete para uma sobremesa especial.'
    ],
    instructions: [
      'Pré-aqueça o forno a 180°C.',
      'Unte uma assadeira quadrada de 20x20cm.',
      'Em uma tigela, misture a farinha de amêndoas, cacau e sal.',
      'Em outra tigela, bata os ovos com o açúcar até ficar claro.',
      'Adicione o óleo de coco e misture bem.',
      'Incorpore a mistura seca aos poucos.',
      'Despeje na assadeira untada.',
      'Asse por 25-30 minutos até ficar firme nas bordas.',
      'Deixe esfriar completamente na assadeira.',
      'Corte em quadrados e sirva.'
    ],
    structured_ingredients: [
      { name: 'Farinha de amêndoas', quantity: 150, unit: 'g' },
      { name: 'Cacau em pó', quantity: 40, unit: 'g' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Açúcar', quantity: 80, unit: 'g' },
      { name: 'Óleo de coco', quantity: 40, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' }
    ],
    calories: 200,
    servings: 8
  },
  {
    title: 'Salada de Frutas',
    rating: 4.1,
    tips: [
      'Use frutas da estação para melhor sabor e preço.',
      'Corte as frutas em pedaços uniformes.',
      'Adicione suco de limão para evitar que escureçam.',
      'Sirva gelada para melhor sabor.'
    ],
    instructions: [
      'Lave e seque todas as frutas.',
      'Descasque e corte as frutas em pedaços pequenos e uniformes.',
      'Coloque em uma tigela grande.',
      'Adicione o suco de laranja e misture suavemente.',
      'Adicione o suco de limão para evitar que escureçam.',
      'Misture bem todas as frutas.',
      'Transfira para taças individuais.',
      'Decore com folhas de hortelã se desejar.',
      'Sirva gelada.'
    ],
    structured_ingredients: [
      { name: 'Morango', quantity: 150, unit: 'g' },
      { name: 'Maçã', quantity: 150, unit: 'g' },
      { name: 'Banana', quantity: 1, unit: 'unidade' },
      { name: 'Suco de laranja', quantity: 80, unit: 'ml' },
      { name: 'Suco de limão', quantity: 10, unit: 'ml' }
    ],
    calories: 100,
    servings: 3
  },
  {
    title: 'Iogurte com Calda de Morango',
    rating: 4.3,
    tips: [
      'Use iogurte grego para mais cremosidade.',
      'Não cozinhe demais os morangos para manter a textura.',
      'Deixe a calda esfriar antes de servir.',
      'Sirva gelado para melhor sabor.'
    ],
    instructions: [
      'Lave e seque os morangos.',
      'Corte os morangos em pedaços pequenos.',
      'Em uma panela pequena, coloque os morangos e o açúcar.',
      'Cozinhe em fogo baixo por 8-10 minutos até formar uma calda.',
      'Mexa ocasionalmente para não grudar.',
      'Deixe esfriar completamente.',
      'Em taças individuais, coloque o iogurte.',
      'Regue com a calda de morango por cima.',
      'Decore com morangos frescos se desejar.',
      'Sirva gelado.'
    ],
    structured_ingredients: [
      { name: 'Iogurte natural', quantity: 200, unit: 'g' },
      { name: 'Morangos', quantity: 150, unit: 'g' },
      { name: 'Açúcar', quantity: 30, unit: 'g' }
    ],
    calories: 160,
    servings: 2
  },
  {
    title: 'Cheesecake no Copo',
    rating: 4.4,
    tips: [
      'Use cream cheese em temperatura ambiente para melhor mistura.',
      'Deixe na geladeira por pelo menos 2 horas antes de servir.',
      'Use biscoitos frescos para a base.',
      'Decore com frutas frescas para mais sabor.'
    ],
    instructions: [
      'Em uma tigela, misture o cream cheese com o açúcar.',
      'Bata até ficar cremoso e homogêneo.',
      'Triture os biscoitos em um processador ou saco plástico.',
      'Derreta a manteiga e misture com os biscoitos triturados.',
      'Em copos individuais, coloque uma camada de biscoitos.',
      'Adicione uma camada da mistura de cream cheese.',
      'Adicione uma camada de geleia.',
      'Repita as camadas se desejar.',
      'Leve à geladeira por pelo menos 2 horas.',
      'Decore com frutas frescas antes de servir.'
    ],
    structured_ingredients: [
      { name: 'Cream cheese', quantity: 150, unit: 'g' },
      { name: 'Biscoito maizena', quantity: 80, unit: 'g' },
      { name: 'Geleia de frutas', quantity: 60, unit: 'g' },
      { name: 'Açúcar', quantity: 30, unit: 'g' },
      { name: 'Manteiga', quantity: 20, unit: 'g' }
    ],
    calories: 260,
    servings: 2
  },
  {
    title: 'Creme de Abacate com Cacau',
    rating: 4.2,
    tips: [
      'Use abacates bem maduros para melhor cremosidade.',
      'Adicione o cacau aos poucos para controlar o sabor.',
      'Sirva gelado para melhor textura.',
      'Decore com frutas frescas para mais sabor.'
    ],
    instructions: [
      'Descasque e remova o caroço do abacate.',
      'Coloque a polpa no liquidificador.',
      'Adicione o cacau em pó e o melado.',
      'Bata até ficar homogêneo e cremoso.',
      'Se necessário, adicione um pouco de água para diluir.',
      'Transfira para taças individuais.',
      'Leve à geladeira por pelo menos 1 hora.',
      'Decore com frutas frescas se desejar.',
      'Sirva gelado.'
    ],
    structured_ingredients: [
      { name: 'Abacate', quantity: 200, unit: 'g' },
      { name: 'Cacau em pó', quantity: 20, unit: 'g' },
      { name: 'Melado', quantity: 20, unit: 'ml' }
    ],
    calories: 210,
    servings: 2
  },
  {
    title: 'Sopa de Abóbora',
    rating: 4.5,
    tips: [
      'Use abóbora de boa qualidade para melhor sabor.',
      'Cozinhe bem a abóbora para facilitar o processamento.',
      'Adicione creme de leite no final para mais cremosidade.',
      'Sirva quente com pão torrado.'
    ],
    instructions: [
      'Descasque e corte a abóbora em cubos pequenos.',
      'Em uma panela grande, aqueça um fio de azeite.',
      'Refogue a cebola até ficar transparente.',
      'Adicione a abóbora e o caldo de legumes.',
      'Cozinhe por 20-25 minutos até a abóbora ficar macia.',
      'Retire do fogo e deixe esfriar um pouco.',
      'Bata no liquidificador até ficar cremoso.',
      'Volte para a panela e aqueça em fogo baixo.',
      'Adicione o gengibre ralado e mexa bem.',
      'Tempere com sal a gosto.',
      'Sirva quente decorada com salsinha.'
    ],
    structured_ingredients: [
      { name: 'Abóbora', quantity: 400, unit: 'g' },
      { name: 'Caldo de legumes', quantity: 600, unit: 'ml' },
      { name: 'Cebola', quantity: 80, unit: 'g' },
      { name: 'Azeite', quantity: 10, unit: 'ml' },
      { name: 'Gengibre', quantity: 8, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ],
    calories: 160,
    servings: 3
  },
  {
    title: 'Smoothie Verde',
    rating: 4.3,
    tips: [
      'Use espinafre fresco para melhor sabor.',
      'Adicione gelo aos poucos para controlar a textura.',
      'Para mais cremosidade, adicione banana.',
      'Sirva imediatamente para melhor sabor.'
    ],
    instructions: [
      'Lave e seque o espinafre.',
      'Descasque e corte o abacate ao meio.',
      'Coloque todos os ingredientes no liquidificador.',
      'Bata até obter uma consistência homogênea.',
      'Se necessário, adicione mais leite para diluir.',
      'Adicione gelo aos poucos para controlar a textura.',
      'Bata novamente até ficar bem misturado.',
      'Transfira para um copo alto.',
      'Decore com folhas de hortelã se desejar.',
      'Sirva imediatamente.'
    ],
    structured_ingredients: [
      { name: 'Leite de coco', quantity: 150, unit: 'ml' },
      { name: 'Espinafre', quantity: 30, unit: 'g' },
      { name: 'Abacate', quantity: 0.25, unit: 'unidade' },
      { name: 'Banana', quantity: 0.5, unit: 'unidade' },
      { name: 'Gelo', quantity: 4, unit: 'cubos' }
    ],
    calories: 220,
    servings: 1
  },
  {
    title: 'Curry de Grão-de-Bico com Coco',
    rating: 4.6,
    tips: [
      'Use grão-de-bico bem cozido para melhor textura.',
      'Deixe o curry cozinhar por mais tempo para desenvolver o sabor.',
      'Adicione o leite de coco no final para não talhar.',
      'Sirva com arroz basmati para uma refeição completa.'
    ],
    instructions: [
      'Em uma panela grande, aqueça o óleo de coco em fogo médio.',
      'Refogue a cebola até ficar transparente.',
      'Adicione o alho e o gengibre picados e refogue por 1 minuto.',
      'Adicione o curry em pó e mexa bem.',
      'Adicione o grão-de-bico cozido e mexa.',
      'Adicione o leite de coco e mexa bem.',
      'Cozinhe em fogo baixo por 15-20 minutos.',
      'Mexa ocasionalmente para não grudar.',
      'Tempere com sal a gosto.',
      'Sirva quente com arroz basmati.'
    ],
    structured_ingredients: [
      { name: 'Grão-de-bico cozido', quantity: 300, unit: 'g' },
      { name: 'Leite de coco', quantity: 300, unit: 'ml' },
      { name: 'Cebola', quantity: 80, unit: 'g' },
      { name: 'Gengibre', quantity: 8, unit: 'g' },
      { name: 'Curry em pó', quantity: 1, unit: 'colher de sopa' },
      { name: 'Óleo de coco', quantity: 15, unit: 'ml' },
      { name: 'Alho', quantity: 2, unit: 'dentes' }
    ],
    calories: 260,
    servings: 3
  }
]
