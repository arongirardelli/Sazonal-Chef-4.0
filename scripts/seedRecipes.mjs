import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE
if (!url || !serviceRole) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE')
  process.exit(1)
}
const admin = createClient(url, serviceRole)

function nowIso() {
  return new Date().toISOString()
}

/**
 * Helper to build a recipe object conforming to the table columns
 */
function r({ title, description = '', category, time, difficulty, diet, servings, calories, imageSeed, instructions, tips = [], tags = [], structured_ingredients }) {
  return {
    title,
    description,
    category,
    time,
    difficulty,
    diet,
    servings,
    rating: null,
    calories,
    image_url: imageSeed ? `https://picsum.photos/seed/${encodeURIComponent(imageSeed)}/800/600` : null,
    instructions,
    tips,
    legacy_ingredients: [],
    tags,
    structured_ingredients,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
}

const cafe = [
  r({
    title: 'Omelete de Espinafre e Queijo',
    description: 'Omelete rápida e proteica com espinafre e queijo.',
    category: 'café da manhã', time: 15, difficulty: 'Fácil', diet: 'Proteico', servings: 1, calories: 320,
    imageSeed: 'omelete-espinafre-queijo',
    instructions: ['Bata os ovos com o leite e sal.', 'Refogue o espinafre no azeite.', 'Adicione os ovos e o queijo, cozinhe até firmar.'],
    tips: ['Use frigideira antiaderente.'],
    structured_ingredients: [
      { name: 'Ovos', quantity: 3, unit: 'unidades' },
      { name: 'Espinafre', quantity: 100, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 50, unit: 'g' },
      { name: 'Leite', quantity: 30, unit: 'ml' },
      { name: 'Azeite de oliva', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Panquecas de Aveia e Banana',
    description: 'Panquecas macias sem lactose com aveia e banana.',
    category: 'café da manhã', time: 20, difficulty: 'Fácil', diet: 'Sem Lactose', servings: 2, calories: 380,
    imageSeed: 'panquecas-aveia-banana',
    instructions: ['Amasse a banana e misture com os ovos e aveia.', 'Grelhe porções em frigideira untada.', 'Sirva com mel opcional.'],
    tips: ['Use aveia fina para melhor textura.'],
    structured_ingredients: [
      { name: 'Banana', quantity: 1, unit: 'unidade' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Aveia em flocos', quantity: 80, unit: 'g' },
      { name: 'Leite de aveia', quantity: 120, unit: 'ml' },
      { name: 'Azeite de oliva', quantity: 5, unit: 'ml' },
      { name: 'Mel', quantity: 1, unit: 'colher de sopa' },
    ]
  }),
  r({
    title: 'Iogurte com Granola e Frutas',
    description: 'Copo de iogurte com granola crocante e frutas frescas.',
    category: 'café da manhã', time: 5, difficulty: 'Fácil', diet: 'Tradicional', servings: 1, calories: 280,
    imageSeed: 'iogurte-granola-frutas',
    instructions: ['Monte em camadas: iogurte, granola e frutas.'],
    tips: [],
    structured_ingredients: [
      { name: 'Iogurte natural', quantity: 200, unit: 'g' },
      { name: 'Granola', quantity: 50, unit: 'g' },
      { name: 'Morangos', quantity: 100, unit: 'g' },
      { name: 'Mel', quantity: 1, unit: 'colher de sopa' },
    ]
  }),
  r({
    title: 'Smoothie Verde',
    description: 'Smoothie refrescante vegano com espinafre e abacate.',
    category: 'café da manhã', time: 7, difficulty: 'Fácil', diet: 'Vegano', servings: 1, calories: 220,
    imageSeed: 'smoothie-verde',
    instructions: ['Bata tudo no liquidificador até ficar homogêneo.'],
    tips: [],
    structured_ingredients: [
      { name: 'Leite de coco', quantity: 200, unit: 'ml' },
      { name: 'Espinafre', quantity: 40, unit: 'g' },
      { name: 'Abacate', quantity: 0.5, unit: 'unidade' },
      { name: 'Banana', quantity: 1, unit: 'unidade' },
      { name: 'Gelo', quantity: 6, unit: 'unidades' },
    ]
  }),
  r({
    title: 'Tapioca com Queijo e Tomate',
    description: 'Tapioca sem glúten com recheio simples.',
    category: 'café da manhã', time: 10, difficulty: 'Fácil', diet: 'Sem Glúten', servings: 1, calories: 300,
    imageSeed: 'tapioca-queijo-tomate',
    instructions: ['Hidrate a goma e forme o disco na frigideira.', 'Recheie com queijo e tomate, dobre e sirva.'],
    tips: [],
    structured_ingredients: [
      { name: 'Goma de tapioca', quantity: 80, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 60, unit: 'g' },
      { name: 'Tomate', quantity: 60, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Pão Integral com Abacate e Ovo',
    description: 'Torrada com purê de abacate e ovo cozido.',
    category: 'café da manhã', time: 12, difficulty: 'Fácil', diet: 'Proteico', servings: 1, calories: 350,
    imageSeed: 'torrada-abacate-ovo',
    instructions: ['Torre o pão, amasse o abacate com sal.', 'Cubra com ovo fatiado.'],
    tips: [],
    structured_ingredients: [
      { name: 'Pão integral', quantity: 2, unit: 'unidades' },
      { name: 'Abacate', quantity: 0.5, unit: 'unidade' },
      { name: 'Ovos', quantity: 1, unit: 'unidade' },
      { name: 'Azeite de oliva', quantity: 5, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Crepioca de Frango',
    description: 'Crepioca proteica com frango desfiado.',
    category: 'café da manhã', time: 15, difficulty: 'Fácil', diet: 'Sem Glúten', servings: 1, calories: 320,
    imageSeed: 'crepioca-frango',
    instructions: ['Misture ovo e tapioca.', 'Grelhe um disco e recheie com frango.'],
    tips: [],
    structured_ingredients: [
      { name: 'Ovos', quantity: 1, unit: 'unidade' },
      { name: 'Goma de tapioca', quantity: 60, unit: 'g' },
      { name: 'Peito de frango cozido desfiado', quantity: 100, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 30, unit: 'g' },
    ]
  }),
  r({
    title: 'Mingau de Aveia com Maçã',
    description: 'Mingau cremoso com maçã em cubos.',
    category: 'café da manhã', time: 12, difficulty: 'Fácil', diet: 'Tradicional', servings: 1, calories: 290,
    imageSeed: 'mingau-aveia-maca',
    instructions: ['Cozinhe aveia com leite e canela.', 'Adicione maçã e finalize com mel.'],
    tips: [],
    structured_ingredients: [
      { name: 'Aveia em flocos', quantity: 50, unit: 'g' },
      { name: 'Leite', quantity: 200, unit: 'ml' },
      { name: 'Maçã', quantity: 100, unit: 'g' },
      { name: 'Canela em pó', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Mel', quantity: 1, unit: 'colher de sopa' },
    ]
  }),
  r({
    title: 'Wrap de Ovo com Peru',
    description: 'Wrap rápido com ovo mexido e peito de peru.',
    category: 'café da manhã', time: 10, difficulty: 'Fácil', diet: 'Proteico', servings: 1, calories: 320,
    imageSeed: 'wrap-ovo-peru',
    instructions: ['Aqueça o wrap, adicione ovo mexido e peru, dobre e sirva.'],
    tips: [],
    structured_ingredients: [
      { name: 'Wrap integral', quantity: 1, unit: 'unidade' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Peito de peru', quantity: 60, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 30, unit: 'g' },
    ]
  }),
  r({
    title: 'Chia Pudding com Manga',
    description: 'Pudim de chia vegano com leite de coco e manga.',
    category: 'café da manhã', time: 5, difficulty: 'Fácil', diet: 'Vegano', servings: 1, calories: 260,
    imageSeed: 'chia-pudding-manga',
    instructions: ['Hidrate a chia no leite de coco por 2h.', 'Sirva com cubos de manga.'],
    tips: [],
    structured_ingredients: [
      { name: 'Chia', quantity: 30, unit: 'g' },
      { name: 'Leite de coco', quantity: 200, unit: 'ml' },
      { name: 'Manga', quantity: 120, unit: 'g' },
    ]
  }),
]

const almoco = [
  r({
    title: 'Salada de Quinoa com Legumes',
    description: 'Salada nutritiva com quinoa e legumes assados.',
    category: 'almoço', time: 25, difficulty: 'Fácil', diet: 'Vegetariano', servings: 2, calories: 520,
    imageSeed: 'salada-quinoa-legumes',
    instructions: ['Cozinhe a quinoa.', 'Asse os legumes.', 'Misture tudo e tempere.'],
    tips: ['Finalize com limão.'],
    structured_ingredients: [
      { name: 'Quinoa', quantity: 170, unit: 'g' },
      { name: 'Pimentão', quantity: 150, unit: 'g' },
      { name: 'Abobrinha', quantity: 200, unit: 'g' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 20, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Frango Grelhado com Brócolis',
    description: 'Frango suculento com brócolis no vapor.',
    category: 'almoço', time: 20, difficulty: 'Fácil', diet: 'Proteico', servings: 2, calories: 600,
    imageSeed: 'frango-grelhado-brocolis',
    instructions: ['Tempere e grelhe o frango.', 'Cozinhe o brócolis no vapor.'],
    tips: [],
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 400, unit: 'g' },
      { name: 'Brócolis', quantity: 300, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Arroz Integral com Feijão e Carne Moída',
    description: 'Prato completo brasileiro.',
    category: 'almoço', time: 30, difficulty: 'Fácil', diet: 'Tradicional', servings: 2, calories: 780,
    imageSeed: 'arroz-feijao-carne',
    instructions: ['Cozinhe arroz e feijão.', 'Refogue a carne e monte o prato.'],
    tips: [],
    structured_ingredients: [
      { name: 'Arroz integral', quantity: 200, unit: 'g' },
      { name: 'Feijão preto cozido', quantity: 300, unit: 'g' },
      { name: 'Carne moída', quantity: 300, unit: 'g' },
      { name: 'Cebola', quantity: 80, unit: 'g' },
      { name: 'Alho', quantity: 2, unit: 'dente' },
      { name: 'Azeite de oliva', quantity: 10, unit: 'ml' },
    ]
  }),
  r({
    title: 'Salmão ao Forno com Aspargos',
    description: 'Salmão assado com aspargos tenros.',
    category: 'almoço', time: 25, difficulty: 'Fácil', diet: 'Proteico', servings: 2, calories: 650,
    imageSeed: 'salmao-forno-aspargos',
    instructions: ['Tempere o salmão e os aspargos.', 'Asse até dourar.'],
    tips: [],
    structured_ingredients: [
      { name: 'Salmão fresco', quantity: 300, unit: 'g' },
      { name: 'Aspargos', quantity: 300, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Lasanha de Berinjela com Ricota',
    description: 'Lasanha sem massa, camadas de berinjela e ricota.',
    category: 'almoço', time: 40, difficulty: 'Médio', diet: 'Sem Glúten', servings: 4, calories: 720,
    imageSeed: 'lasanha-berinjela-ricota',
    instructions: ['Grelhe fatias de berinjela.', 'Monte camadas com ricota e molho de tomate.', 'Leve ao forno.'],
    tips: [],
    structured_ingredients: [
      { name: 'Berinjela', quantity: 600, unit: 'g' },
      { name: 'Ricota', quantity: 500, unit: 'g' },
      { name: 'Molho de tomate', quantity: 400, unit: 'ml' },
      { name: 'Queijo parmesão', quantity: 80, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Bowl Japonês com Edamame e Omelete',
    description: 'Tigela de arroz japonês com edamame e omelete.',
    category: 'almoço', time: 25, difficulty: 'Fácil', diet: 'Tradicional', servings: 2, calories: 680,
    imageSeed: 'bowl-japones-edamame-omelete',
    instructions: ['Cozinhe o arroz.', 'Prepare omelete fino.', 'Monte com edamame.'],
    tips: [],
    structured_ingredients: [
      { name: 'Arroz japonês', quantity: 300, unit: 'g' },
      { name: 'Edamame', quantity: 200, unit: 'g' },
      { name: 'Ovos', quantity: 3, unit: 'unidades' },
      { name: 'Molho shoyu', quantity: 15, unit: 'ml' },
    ]
  }),
  r({
    title: 'Strogonoff de Frango',
    description: 'Clássico strogonoff com creme de leite.',
    category: 'almoço', time: 30, difficulty: 'Fácil', diet: 'Tradicional', servings: 3, calories: 900,
    imageSeed: 'strogonoff-frango',
    instructions: ['Doure o frango.', 'Adicione molho de tomate e creme de leite.', 'Sirva com arroz.'],
    tips: [],
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 500, unit: 'g' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' },
      { name: 'Creme de leite', quantity: 200, unit: 'ml' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Curry de Grão-de-Bico com Coco',
    description: 'Curry vegano cremoso com leite de coco.',
    category: 'almoço', time: 30, difficulty: 'Fácil', diet: 'Vegano', servings: 3, calories: 780,
    imageSeed: 'curry-grao-coco',
    instructions: ['Refogue curry com cebola.', 'Some grão-de-bico e leite de coco.', 'Cozinhe até engrossar.'],
    tips: [],
    structured_ingredients: [
      { name: 'Grão-de-bico cozido', quantity: 500, unit: 'g' },
      { name: 'Leite de coco', quantity: 400, unit: 'ml' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Gengibre', quantity: 10, unit: 'g' },
      { name: 'Curry em pó', quantity: 1, unit: 'colher de sopa' },
    ]
  }),
  r({
    title: 'Tofu Grelhado com Legumes',
    description: 'Tofu dourado com legumes salteados.',
    category: 'almoço', time: 20, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 520,
    imageSeed: 'tofu-grelhado-legumes',
    instructions: ['Sele o tofu.', 'Salteie legumes.', 'Sirva com gergelim.'],
    tips: [],
    structured_ingredients: [
      { name: 'Tofu firme', quantity: 300, unit: 'g' },
      { name: 'Brócolis', quantity: 200, unit: 'g' },
      { name: 'Cenoura', quantity: 120, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' },
    ]
  }),
  r({
    title: 'Carne de Panela com Batata Doce',
    description: 'Carne cozida lentamente com batata doce.',
    category: 'almoço', time: 60, difficulty: 'Médio', diet: 'Tradicional', servings: 4, calories: 1100,
    imageSeed: 'carne-panela-batata-doce',
    instructions: ['Sele a carne.', 'Cozinhe com temperos e batata doce até macio.'],
    tips: [],
    structured_ingredients: [
      { name: 'Carne bovina em cubos', quantity: 600, unit: 'g' },
      { name: 'Batata doce', quantity: 500, unit: 'g' },
      { name: 'Cebola', quantity: 120, unit: 'g' },
      { name: 'Alho', quantity: 3, unit: 'dente' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' },
    ]
  }),
]

const lanche = [
  r({
    title: 'Mix de Castanhas',
    description: 'Mix simples de castanhas e nozes.',
    category: 'lanche', time: 2, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 500,
    imageSeed: 'mix-castanhas',
    instructions: ['Misture e porcione.'],
    tips: [],
    structured_ingredients: [
      { name: 'Castanha de caju', quantity: 80, unit: 'g' },
      { name: 'Amêndoas', quantity: 80, unit: 'g' },
      { name: 'Nozes', quantity: 80, unit: 'g' },
    ]
  }),
  r({
    title: 'Hummus com Cenoura',
    description: 'Hummus cremoso com palitos de cenoura.',
    category: 'lanche', time: 10, difficulty: 'Fácil', diet: 'Vegano', servings: 3, calories: 450,
    imageSeed: 'hummus-cenoura',
    instructions: ['Bata grão-de-bico com tahine e limão.', 'Sirva com cenoura.'],
    tips: [],
    structured_ingredients: [
      { name: 'Grão-de-bico cozido', quantity: 300, unit: 'g' },
      { name: 'Tahine', quantity: 2, unit: 'colher de sopa' },
      { name: 'Suco de limão', quantity: 20, unit: 'ml' },
      { name: 'Cenoura', quantity: 200, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 15, unit: 'ml' },
    ]
  }),
  r({
    title: 'Iogurte com Mel e Nozes',
    description: 'Iogurte grego com mel e nozes.',
    category: 'lanche', time: 5, difficulty: 'Fácil', diet: 'Tradicional', servings: 1, calories: 280,
    imageSeed: 'iogurte-mel-nozes',
    instructions: ['Misture iogurte, mel e nozes.'],
    tips: [],
    structured_ingredients: [
      { name: 'Iogurte grego', quantity: 180, unit: 'g' },
      { name: 'Mel', quantity: 1, unit: 'colher de sopa' },
      { name: 'Nozes', quantity: 30, unit: 'g' },
    ]
  }),
  r({
    title: 'Sanduíche de Atum',
    description: 'Sanduíche rápido com atum e maionese.',
    category: 'lanche', time: 8, difficulty: 'Fácil', diet: 'Tradicional', servings: 1, calories: 350,
    imageSeed: 'sanduiche-atum',
    instructions: ['Misture atum e maionese.', 'Monte no pão com alface.'],
    tips: [],
    structured_ingredients: [
      { name: 'Pão integral', quantity: 2, unit: 'unidades' },
      { name: 'Atum em lata', quantity: 120, unit: 'g' },
      { name: 'Maionese', quantity: 1, unit: 'colher de sopa' },
      { name: 'Alface', quantity: 30, unit: 'g' },
    ]
  }),
  r({
    title: 'Smoothie de Morango',
    description: 'Smoothie refrescante com leite de coco.',
    category: 'lanche', time: 5, difficulty: 'Fácil', diet: 'Vegano', servings: 1, calories: 180,
    imageSeed: 'smoothie-morango',
    instructions: ['Bata morangos com leite de coco e gelo.'],
    tips: [],
    structured_ingredients: [
      { name: 'Morangos', quantity: 200, unit: 'g' },
      { name: 'Leite de coco', quantity: 150, unit: 'ml' },
      { name: 'Gelo', quantity: 6, unit: 'unidades' },
    ]
  }),
  r({
    title: 'Barra Caseira de Aveia',
    description: 'Barrinhas de aveia e mel.',
    category: 'lanche', time: 25, difficulty: 'Fácil', diet: 'Vegano', servings: 6, calories: 900,
    imageSeed: 'barra-caseira-aveia',
    instructions: ['Misture tudo.', 'Asse e corte em barras.'],
    tips: [],
    structured_ingredients: [
      { name: 'Aveia em flocos', quantity: 200, unit: 'g' },
      { name: 'Pasta de amendoim', quantity: 120, unit: 'g' },
      { name: 'Melado', quantity: 60, unit: 'ml' },
      { name: 'Cacau em pó', quantity: 20, unit: 'g' },
    ]
  }),
  r({
    title: 'Guacamole com Nachos',
    description: 'Guacamole clássico com nachos.',
    category: 'lanche', time: 10, difficulty: 'Fácil', diet: 'Vegetariano', servings: 2, calories: 520,
    imageSeed: 'guacamole-nachos',
    instructions: ['Amasse o abacate com limão e sal.', 'Sirva com nachos.'],
    tips: [],
    structured_ingredients: [
      { name: 'Abacate', quantity: 1, unit: 'unidade' },
      { name: 'Cebola', quantity: 40, unit: 'g' },
      { name: 'Tomate', quantity: 80, unit: 'g' },
      { name: 'Suco de limão', quantity: 20, unit: 'ml' },
      { name: 'Nachos', quantity: 100, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Pão de Queijo',
    description: 'Clássico pão de queijo sem glúten.',
    category: 'lanche', time: 30, difficulty: 'Médio', diet: 'Sem Glúten', servings: 4, calories: 900,
    imageSeed: 'pao-de-queijo',
    instructions: ['Misture polvilho, leite e queijo.', 'Modele e asse.'],
    tips: [],
    structured_ingredients: [
      { name: 'Polvilho azedo', quantity: 300, unit: 'g' },
      { name: 'Leite', quantity: 200, unit: 'ml' },
      { name: 'Queijo parmesão', quantity: 100, unit: 'g' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Óleo', quantity: 60, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Edamame Cozido',
    description: 'Edamame cozido no sal.',
    category: 'lanche', time: 8, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 240,
    imageSeed: 'edamame-cozido',
    instructions: ['Cozinhe edamame em água salgada e escorra.'],
    tips: [],
    structured_ingredients: [
      { name: 'Edamame', quantity: 300, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Maçã com Pasta de Amendoim',
    description: 'Fatias de maçã com pasta de amendoim.',
    category: 'lanche', time: 3, difficulty: 'Fácil', diet: 'Vegano', servings: 1, calories: 220,
    imageSeed: 'maca-pasta-amendoim',
    instructions: ['Fatie e sirva com a pasta.'],
    tips: [],
    structured_ingredients: [
      { name: 'Maçã', quantity: 1, unit: 'unidade' },
      { name: 'Pasta de amendoim', quantity: 20, unit: 'g' },
    ]
  }),
]

const jantar = [
  r({
    title: 'Filé de Salmão com Quinoa',
    description: 'Salmão grelhado com quinoa.',
    category: 'jantar', time: 25, difficulty: 'Fácil', diet: 'Proteico', servings: 2, calories: 700,
    imageSeed: 'file-salmao-quinoa',
    instructions: ['Grelhe o salmão.', 'Cozinhe a quinoa e sirva juntos.'],
    tips: [],
    structured_ingredients: [
      { name: 'Salmão fresco', quantity: 360, unit: 'g' },
      { name: 'Quinoa', quantity: 170, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Peito de Frango ao Limão com Arroz',
    description: 'Frango ao limão com arroz branco.',
    category: 'jantar', time: 30, difficulty: 'Fácil', diet: 'Proteico', servings: 2, calories: 680,
    imageSeed: 'frango-limao-arroz',
    instructions: ['Tempere o frango com limão e grelhe.', 'Cozinhe o arroz.'],
    tips: [],
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 200, unit: 'g', household_display: '200g de peito de frango' },
      { name: 'Arroz branco', quantity: 200, unit: 'g', household_display: '200g de arroz branco' },
      { name: 'Suco de limão', quantity: 30, unit: 'ml', household_display: '30ml de suco de limão' },
      { name: 'Azeite de oliva', quantity: 15, unit: 'ml', household_display: '15ml de azeite de oliva' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá', household_display: '1 colher de chá de sal' },
    ]
  }),
  r({
    title: 'Risoto de Cogumelos',
    description: 'Risoto cremoso de cogumelos.',
    category: 'jantar', time: 35, difficulty: 'Médio', diet: 'Vegetariano', servings: 3, calories: 900,
    imageSeed: 'risoto-cogumelos',
    instructions: ['Refogue arroz com cebola.', 'Junte caldo aos poucos e cogumelos.'],
    tips: ['Finalize com parmesão.'],
    structured_ingredients: [
      { name: 'Arroz arbóreo', quantity: 300, unit: 'g' },
      { name: 'Cogumelos variados', quantity: 400, unit: 'g' },
      { name: 'Caldo de legumes', quantity: 800, unit: 'ml' },
      { name: 'Queijo parmesão', quantity: 100, unit: 'g' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 20, unit: 'ml' },
    ]
  }),
  r({
    title: 'Carne Moída com Abobrinha',
    description: 'Salteado low carb de carne com abobrinha.',
    category: 'jantar', time: 20, difficulty: 'Fácil', diet: 'Proteico', servings: 2, calories: 520,
    imageSeed: 'carne-abobrinha-lowcarb',
    instructions: ['Refogue a carne.', 'Adicione abobrinha e acerte o sal.'],
    tips: [],
    tags: ['low carb'],
    structured_ingredients: [
      { name: 'Carne moída', quantity: 300, unit: 'g' },
      { name: 'Abobrinha', quantity: 300, unit: 'g' },
      { name: 'Cebola', quantity: 60, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Sopa de Abóbora',
    description: 'Sopa vegana cremosa de abóbora.',
    category: 'jantar', time: 30, difficulty: 'Fácil', diet: 'Vegano', servings: 3, calories: 480,
    imageSeed: 'sopa-abobora',
    instructions: ['Cozinhe abóbora com caldo.', 'Bata e finalize.'],
    tips: [],
    structured_ingredients: [
      { name: 'Abóbora', quantity: 600, unit: 'g' },
      { name: 'Caldo de legumes', quantity: 800, unit: 'ml' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 10, unit: 'ml' },
      { name: 'Gengibre', quantity: 10, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Tilápia Assada com Rúcula',
    description: 'Tilápia ao forno com rúcula.',
    category: 'jantar', time: 22, difficulty: 'Fácil', diet: 'Proteico', servings: 2, calories: 500,
    imageSeed: 'tilapia-rucula',
    instructions: ['Asse a tilápia.', 'Sirva com rúcula temperada.'],
    tips: [],
    structured_ingredients: [
      { name: 'Filé de tilápia', quantity: 300, unit: 'g' },
      { name: 'Rúcula', quantity: 80, unit: 'g' },
      { name: 'Azeite de oliva', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    ]
  }),
  r({
    title: 'Tofu com Brócolis ao Molho',
    description: 'Tofu e brócolis com molho shoyu.',
    category: 'jantar', time: 18, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 460,
    imageSeed: 'tofu-brocolis-molho',
    instructions: ['Sele tofu.', 'Salteie brócolis e adicione molho.'],
    tips: [],
    structured_ingredients: [
      { name: 'Tofu firme', quantity: 250, unit: 'g' },
      { name: 'Brócolis', quantity: 250, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' },
    ]
  }),
  r({
    title: 'Almôndegas ao Molho de Tomate',
    description: 'Almôndegas de carne com molho de tomate.',
    category: 'jantar', time: 35, difficulty: 'Médio', diet: 'Tradicional', servings: 3, calories: 880,
    imageSeed: 'almondegas-molho',
    instructions: ['Modele e sele as almôndegas.', 'Cozinhe no molho.'],
    tips: [],
    structured_ingredients: [
      { name: 'Carne moída', quantity: 500, unit: 'g' },
      { name: 'Molho de tomate', quantity: 400, unit: 'ml' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Alho', quantity: 2, unit: 'dente' },
      { name: 'Queijo parmesão', quantity: 50, unit: 'g' },
    ]
  }),
  r({
    title: 'Yakisoba de Legumes',
    description: 'Yakisoba vegano de legumes.',
    category: 'jantar', time: 25, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 640,
    imageSeed: 'yakisoba-legumes',
    instructions: ['Cozinhe o macarrão.', 'Salteie legumes e finalize com molho.'],
    tips: [],
    structured_ingredients: [
      { name: 'Macarrão para yakisoba', quantity: 200, unit: 'g' },
      { name: 'Cenoura', quantity: 120, unit: 'g' },
      { name: 'Brócolis', quantity: 200, unit: 'g' },
      { name: 'Pimentão', quantity: 120, unit: 'g' },
      { name: 'Shoyu', quantity: 30, unit: 'ml' },
    ]
  }),
  r({
    title: 'Chili de Feijão e Carne',
    description: 'Chili consistente com feijão e carne.',
    category: 'jantar', time: 40, difficulty: 'Médio', diet: 'Tradicional', servings: 3, calories: 980,
    imageSeed: 'chili-feijao-carne',
    instructions: ['Refogue carne e cebola.', 'Adicione feijão e molho.'],
    tips: [],
    structured_ingredients: [
      { name: 'Carne moída', quantity: 400, unit: 'g' },
      { name: 'Feijão cozido', quantity: 400, unit: 'g' },
      { name: 'Molho de tomate', quantity: 300, unit: 'ml' },
      { name: 'Cebola', quantity: 120, unit: 'g' },
      { name: 'Cominho em pó', quantity: 1, unit: 'colher de chá' },
    ]
  }),
]

const sobremesa = [
  r({
    title: 'Mousse de Chocolate 70%',
    description: 'Mousse rápida com chocolate 70%.',
    category: 'sobremesa', time: 20, difficulty: 'Fácil', diet: 'Tradicional', servings: 4, calories: 900,
    imageSeed: 'mousse-chocolate-70',
    instructions: ['Derreta chocolate.', 'Incorpore creme e leve à geladeira.'],
    tips: [],
    structured_ingredients: [
      { name: 'Chocolate 70%', quantity: 200, unit: 'g' },
      { name: 'Creme de leite', quantity: 300, unit: 'ml' },
      { name: 'Açúcar', quantity: 40, unit: 'g' },
    ]
  }),
  r({
    title: 'Pudim de Chia com Coco',
    description: 'Pudim vegano de chia com coco.',
    category: 'sobremesa', time: 5, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 360,
    imageSeed: 'pudim-chia-coco',
    instructions: ['Misture chia e leite de coco e refrigere.'],
    tips: [],
    structured_ingredients: [
      { name: 'Chia', quantity: 40, unit: 'g' },
      { name: 'Leite de coco', quantity: 250, unit: 'ml' },
      { name: 'Melado', quantity: 20, unit: 'ml' },
    ]
  }),
  r({
    title: 'Sorbet de Manga',
    description: 'Sorbet leve de manga.',
    category: 'sobremesa', time: 10, difficulty: 'Fácil', diet: 'Vegano', servings: 4, calories: 400,
    imageSeed: 'sorbet-manga',
    instructions: ['Bata manga congelada com água.'],
    tips: [],
    structured_ingredients: [
      { name: 'Manga congelada', quantity: 600, unit: 'g' },
      { name: 'Água', quantity: 100, unit: 'ml' },
    ]
  }),
  r({
    title: 'Brownie Sem Glúten',
    description: 'Brownie úmido sem glúten.',
    category: 'sobremesa', time: 30, difficulty: 'Médio', diet: 'Sem Glúten', servings: 8, calories: 1600,
    imageSeed: 'brownie-sem-gluten',
    instructions: ['Misture ingredientes secos e úmidos.', 'Asse até firmar.'],
    tips: [],
    structured_ingredients: [
      { name: 'Farinha de amêndoas', quantity: 200, unit: 'g' },
      { name: 'Cacau em pó', quantity: 60, unit: 'g' },
      { name: 'Ovos', quantity: 3, unit: 'unidades' },
      { name: 'Açúcar', quantity: 120, unit: 'g' },
      { name: 'Óleo de coco', quantity: 60, unit: 'ml' },
    ]
  }),
  r({
    title: 'Salada de Frutas Tropicais com Suco de Laranja',
    description: 'Clássica salada de frutas fresca com suco de laranja natural.',
    category: 'sobremesa', time: 8, difficulty: 'Fácil', diet: 'Vegano', servings: 3, calories: 300,
    imageSeed: 'salada-de-frutas',
    instructions: ['Pique as frutas e misture.', 'Adicione o suco de laranja fresco.'],
    tips: [],
    structured_ingredients: [
      { name: 'Morango', quantity: 200, unit: 'g' },
      { name: 'Maçã', quantity: 200, unit: 'g' },
      { name: 'Banana', quantity: 2, unit: 'unidades' },
      { name: 'Suco de laranja', quantity: 350, unit: 'ml', display: 'Suco de 4 Laranjas pera (aprox. 350ml)', household_display: 'Suco de 4 Laranjas pera (aprox. 350ml)' },
    ]
  }),
  r({
    title: 'Iogurte com Calda de Morango',
    description: 'Iogurte com calda caseira de morango.',
    category: 'sobremesa', time: 12, difficulty: 'Fácil', diet: 'Tradicional', servings: 2, calories: 320,
    imageSeed: 'iogurte-calda-morango',
    instructions: ['Cozinhe morangos com açúcar para calda.', 'Sirva sobre iogurte.'],
    tips: [],
    structured_ingredients: [
      { name: 'Iogurte natural', quantity: 300, unit: 'g' },
      { name: 'Morangos', quantity: 200, unit: 'g' },
      { name: 'Açúcar', quantity: 40, unit: 'g' },
    ]
  }),
  r({
    title: 'Cheesecake no Copo',
    description: 'Cheesecake rápido individual.',
    category: 'sobremesa', time: 15, difficulty: 'Fácil', diet: 'Tradicional', servings: 2, calories: 520,
    imageSeed: 'cheesecake-no-copo',
    instructions: ['Misture cream cheese com açúcar.', 'Monte com bolacha e geleia.'],
    tips: [],
    structured_ingredients: [
      { name: 'Cream cheese', quantity: 200, unit: 'g' },
      { name: 'Biscoito maizena', quantity: 100, unit: 'g' },
      { name: 'Geleia de frutas', quantity: 80, unit: 'g' },
      { name: 'Açúcar', quantity: 40, unit: 'g' },
      { name: 'Manteiga', quantity: 30, unit: 'g' },
    ]
  }),
  r({
    title: 'Creme de Abacate com Cacau',
    description: 'Creme vegano de abacate com cacau.',
    category: 'sobremesa', time: 8, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 420,
    imageSeed: 'creme-abacate-cacau',
    instructions: ['Bata abacate com cacau e melado.'],
    tips: [],
    structured_ingredients: [
      { name: 'Abacate', quantity: 300, unit: 'g' },
      { name: 'Cacau em pó', quantity: 30, unit: 'g' },
      { name: 'Melado', quantity: 30, unit: 'ml' },
    ]
  }),
  r({
    title: 'Gelatina de Agar com Frutas',
    description: 'Gelatina vegana com agar agar.',
    category: 'sobremesa', time: 15, difficulty: 'Fácil', diet: 'Vegano', servings: 4, calories: 280,
    imageSeed: 'gelatina-agar-frutas',
    instructions: ['Dissolva agar no suco e ferva.', 'Gele e sirva com frutas.'],
    tips: [],
    structured_ingredients: [
      { name: 'Suco de uva', quantity: 500, unit: 'ml' },
      { name: 'Agar agar', quantity: 8, unit: 'g' },
      { name: 'Morangos', quantity: 150, unit: 'g' },
    ]
  }),
  r({
    title: 'Banana Assada com Canela',
    description: 'Bananas assadas com canela.',
    category: 'sobremesa', time: 15, difficulty: 'Fácil', diet: 'Vegano', servings: 2, calories: 300,
    imageSeed: 'banana-assada-canela',
    instructions: ['Asse bananas polvilhadas com canela.'],
    tips: [],
    structured_ingredients: [
      { name: 'Banana', quantity: 2, unit: 'unidades' },
      { name: 'Canela em pó', quantity: 1, unit: 'colher de chá' },
      { name: 'Açúcar mascavo', quantity: 20, unit: 'g' },
    ]
  }),
]

const all = [...cafe, ...almoco, ...lanche, ...jantar, ...sobremesa]

async function upsertRecipe(rec) {
  // If title exists, update; else insert
  const { data: existing } = await admin
    .from('recipes')
    .select('id')
    .ilike('title', rec.title)
    .maybeSingle()

  if (existing?.id) {
    const { error } = await admin.from('recipes').update({ ...rec, updated_at: nowIso() }).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await admin.from('recipes').insert(rec)
    if (error) throw error
  }
}

async function main() {
  console.log(`Seeding ${all.length} recipes...`)
  let ok = 0
  for (const rec of all) {
    await upsertRecipe(rec)
    ok += 1
  }
  console.log(`[OK] ${ok} recipes seeded/updated`)
}

main().catch((e) => { console.error(e); process.exit(1) })


