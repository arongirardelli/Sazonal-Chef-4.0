// Segundo lote de receitas que precisam ser corrigidas
export const recipeCorrectionsBatch2 = [
  {
    title: 'Iogurte com Granola e Frutas',
    rating: 4.3,
    tips: [
      'Use iogurte grego para mais cremosidade.',
      'Para mais crocância, toste a granola no forno por 5 minutos.',
      'Adicione frutas da estação para melhor sabor e preço.',
      'Sirva imediatamente para manter a crocância da granola.'
    ],
    instructions: [
      'Em uma taça, coloque uma camada de iogurte natural.',
      'Adicione uma camada de granola sobre o iogurte.',
      'Corte as frutas em pedaços pequenos e uniformes.',
      'Distribua as frutas sobre a granola.',
      'Regue com mel por cima.',
      'Repita as camadas se desejar mais volume.',
      'Sirva imediatamente.'
    ],
    structured_ingredients: [
      { name: 'Iogurte natural', quantity: 150, unit: 'g' },
      { name: 'Granola', quantity: 40, unit: 'g' },
      { name: 'Morangos', quantity: 80, unit: 'g' },
      { name: 'Mel', quantity: 1, unit: 'colher de sopa' }
    ],
    calories: 280,
    servings: 1
  },
  {
    title: 'Salmão ao Forno com Aspargos',
    rating: 4.8,
    tips: [
      'Deixe o salmão em temperatura ambiente por 15 minutos antes de assar.',
      'Para salmão mais suculento, não asse demais - deve ficar rosado no centro.',
      'Use aspargos frescos e remova a base mais dura.',
      'Tempere com ervas frescas para mais sabor.'
    ],
    instructions: [
      'Pré-aqueça o forno a 200°C.',
      'Tempere os filés de salmão com azeite, sal, pimenta e suco de limão.',
      'Lave os aspargos e remova a base mais dura do talo.',
      'Tempere os aspargos com azeite, sal e pimenta.',
      'Disponha o salmão e os aspargos em uma assadeira.',
      'Asse por cerca de 15-20 minutos, ou até que o salmão esteja cozido.',
      'Verifique o cozimento do salmão com um garfo - deve se soltar em lascas.',
      'Sirva imediatamente com limão fresco.'
    ],
    structured_ingredients: [
      { name: 'Salmão fresco', quantity: 200, unit: 'g' },
      { name: 'Aspargos', quantity: 200, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Suco de limão', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ],
    calories: 325,
    servings: 2
  },
  {
    title: 'Bowl Japonês com Edamame e Omelete',
    rating: 4.4,
    tips: [
      'Use arroz japonês de grão curto para melhor textura.',
      'Cozinhe o arroz com um pouco menos de água para ficar mais solto.',
      'Para o omelete, use fogo baixo para ficar macio.',
      'Sirva o edamame ainda morno.'
    ],
    instructions: [
      'Lave o arroz japonês em água corrente até a água ficar transparente.',
      'Cozinhe o arroz com 1,5 xícaras de água por 15-20 minutos.',
      'Deixe o arroz descansar por 5 minutos antes de abrir a panela.',
      'Em uma frigideira antiaderente, aqueça um fio de azeite em fogo baixo.',
      'Bata os ovos com sal e pimenta em uma tigela.',
      'Despeje os ovos na frigideira e mexa suavemente até ficarem cremosos.',
      'Cozinhe o edamame em água fervente por 3-4 minutos.',
      'Escorra o edamame e tempere com sal.',
      'Monte o bowl: arroz na base, omelete fatiado e edamame.',
      'Regue com molho shoyu e sirva.'
    ],
    structured_ingredients: [
      { name: 'Arroz japonês', quantity: 150, unit: 'g' },
      { name: 'Edamame', quantity: 100, unit: 'g' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Molho shoyu', quantity: 15, unit: 'ml' },
      { name: 'Azeite', quantity: 5, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ],
    calories: 340,
    servings: 2
  },
  {
    title: 'Strogonoff de Frango',
    rating: 4.6,
    tips: [
      'Use peito de frango sem pele para menos gordura.',
      'Não cozinhe demais o creme de leite para não talhar.',
      'Para mais sabor, adicione cogumelos frescos.',
      'Sirva com arroz branco e batata palha.'
    ],
    instructions: [
      'Corte o peito de frango em tiras finas.',
      'Em uma panela grande, aqueça um fio de azeite em fogo médio.',
      'Doure o frango por todos os lados até ficar dourado.',
      'Adicione a cebola picada e refogue até ficar transparente.',
      'Adicione o alho picado e refogue por 1 minuto.',
      'Adicione o molho de tomate e mexa bem.',
      'Cozinhe por 5 minutos para reduzir o molho.',
      'Adicione o creme de leite e mexa suavemente.',
      'Cozinhe por mais 2-3 minutos até engrossar.',
      'Tempere com sal e pimenta a gosto.',
      'Sirva quente com arroz branco.'
    ],
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 300, unit: 'g' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' },
      { name: 'Creme de leite', quantity: 200, unit: 'ml' },
      { name: 'Cebola', quantity: 80, unit: 'g' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ],
    calories: 300,
    servings: 3
  },
  {
    title: 'Tofu Grelhado com Legumes',
    rating: 4.2,
    tips: [
      'Escorra bem o tofu antes de grelhar para melhor textura.',
      'Marine o tofu por pelo menos 30 minutos para mais sabor.',
      'Use legumes da estação para melhor sabor e preço.',
      'Sirva com arroz integral para uma refeição completa.'
    ],
    instructions: [
      'Escorra o tofu e corte em fatias de 1cm de espessura.',
      'Marine o tofu com shoyu, gengibre e alho por 30 minutos.',
      'Aqueça uma frigideira antiaderente em fogo médio.',
      'Grelhe o tofu por 3-4 minutos de cada lado até ficar dourado.',
      'Em uma panela separada, aqueça um fio de azeite.',
      'Adicione os legumes picados e salteie por 5-7 minutos.',
      'Adicione o shoyu e mexa bem.',
      'Polvilhe com gergelim por cima.',
      'Sirva o tofu grelhado com os legumes salteados.'
    ],
    structured_ingredients: [
      { name: 'Tofu firme', quantity: 200, unit: 'g' },
      { name: 'Brócolis', quantity: 150, unit: 'g' },
      { name: 'Cenoura', quantity: 80, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' },
      { name: 'Azeite', quantity: 10, unit: 'ml' },
      { name: 'Gengibre', quantity: 5, unit: 'g' },
      { name: 'Alho', quantity: 1, unit: 'dente' }
    ],
    calories: 260,
    servings: 2
  },
  {
    title: 'Carne de Panela com Batata Doce',
    rating: 4.5,
    tips: [
      'Use carne bovina com gordura para ficar mais macia.',
      'Cozinhe em fogo baixo por mais tempo para ficar mais macia.',
      'Adicione a batata doce no final para não desmanchar.',
      'Sirva com arroz ou pão para aproveitar o molho.'
    ],
    instructions: [
      'Corte a carne em cubos de 3cm e tempere com sal e pimenta.',
      'Em uma panela de pressão, aqueça um fio de azeite em fogo alto.',
      'Sele a carne por todos os lados até ficar dourada.',
      'Adicione a cebola e o alho picados e refogue por 2 minutos.',
      'Adicione o molho de tomate e mexa bem.',
      'Adicione água quente até cobrir a carne.',
      'Feche a panela de pressão e cozinhe por 30 minutos.',
      'Deixe a pressão sair naturalmente.',
      'Adicione a batata doce em cubos e cozinhe por mais 10 minutos.',
      'Verifique se a carne está macia e a batata cozida.',
      'Sirva quente com arroz branco.'
    ],
    structured_ingredients: [
      { name: 'Carne bovina em cubos', quantity: 400, unit: 'g' },
      { name: 'Batata doce', quantity: 300, unit: 'g' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ],
    calories: 275,
    servings: 4
  },
  {
    title: 'Mix de Castanhas',
    rating: 4.1,
    tips: [
      'Use castanhas frescas para melhor sabor.',
      'Toaste levemente no forno para realçar o sabor.',
      'Mantenha em recipiente hermético para preservar a crocância.',
      'Sirva como aperitivo ou adicione em saladas.'
    ],
    instructions: [
      'Pré-aqueça o forno a 180°C.',
      'Espalhe as castanhas em uma assadeira.',
      'Asse por 8-10 minutos até ficarem levemente douradas.',
      'Deixe esfriar completamente.',
      'Misture todas as castanhas em uma tigela.',
      'Divida em porções individuais.',
      'Sirva como aperitivo ou lanche.'
    ],
    structured_ingredients: [
      { name: 'Castanha de caju', quantity: 60, unit: 'g' },
      { name: 'Amêndoas', quantity: 60, unit: 'g' },
      { name: 'Nozes', quantity: 60, unit: 'g' }
    ],
    calories: 250,
    servings: 2
  },
  {
    title: 'Hummus com Cenoura',
    rating: 4.4,
    tips: [
      'Use grão-de-bico bem cozido para melhor textura.',
      'Adicione água aos poucos para controlar a consistência.',
      'Para mais sabor, adicione cominho ou páprica.',
      'Sirva com pão pita ou legumes frescos.'
    ],
    instructions: [
      'Em um processador de alimentos, coloque o grão-de-bico cozido.',
      'Adicione o tahine, suco de limão e alho.',
      'Bata até obter uma pasta homogênea.',
      'Adicione água aos poucos até obter a consistência desejada.',
      'Tempere com sal e pimenta a gosto.',
      'Transfira para uma tigela de servir.',
      'Regue com azeite e polvilhe com páprica.',
      'Corte as cenouras em palitos.',
      'Sirva o hummus com as cenouras ao lado.'
    ],
    structured_ingredients: [
      { name: 'Grão-de-bico cozido', quantity: 200, unit: 'g' },
      { name: 'Tahine', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Suco de limão', quantity: 20, unit: 'ml' },
      { name: 'Cenoura', quantity: 150, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Alho', quantity: 1, unit: 'dente' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ],
    calories: 150,
    servings: 3
  },
  {
    title: 'Iogurte com Mel e Nozes',
    rating: 4.2,
    tips: [
      'Use iogurte grego para mais cremosidade.',
      'Para mais crocância, toste as nozes no forno.',
      'Adicione o mel na hora de servir para não diluir.',
      'Sirva gelado para melhor textura.'
    ],
    instructions: [
      'Em uma taça, coloque o iogurte grego.',
      'Pique as nozes em pedaços pequenos.',
      'Polvilhe as nozes sobre o iogurte.',
      'Regue com mel por cima.',
      'Misture levemente antes de servir.',
      'Sirva gelado.'
    ],
    structured_ingredients: [
      { name: 'Iogurte grego', quantity: 150, unit: 'g' },
      { name: 'Mel', quantity: 1, unit: 'colher de sopa' },
      { name: 'Nozes', quantity: 25, unit: 'g' }
    ],
    calories: 280,
    servings: 1
  },
  {
    title: 'Sanduíche de Atum',
    rating: 4.0,
    tips: [
      'Escorra bem o atum para não deixar o pão úmido.',
      'Use pão integral para mais fibras.',
      'Adicione legumes frescos para mais nutrientes.',
      'Sirva imediatamente para manter a textura.'
    ],
    instructions: [
      'Em uma tigela, misture o atum escorrido com a maionese.',
      'Tempere com sal e pimenta a gosto.',
      'Torre levemente o pão integral.',
      'Lave e seque a alface.',
      'Monte o sanduíche: pão, alface, mistura de atum.',
      'Cubra com a outra fatia de pão.',
      'Corte ao meio e sirva.'
    ],
    structured_ingredients: [
      { name: 'Pão integral', quantity: 2, unit: 'fatias' },
      { name: 'Atum em lata', quantity: 80, unit: 'g' },
      { name: 'Maionese', quantity: 1, unit: 'colher de sopa' },
      { name: 'Alface', quantity: 20, unit: 'g' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.25, unit: 'colher de chá' }
    ],
    calories: 350,
    servings: 1
  }
]
