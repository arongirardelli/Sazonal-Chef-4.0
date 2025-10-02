const fs = require('fs');

// Categorização fornecida pelo usuário
const categories = {
  'Carnes e Peixes': [
    'Acém', 'Bife de alcatra', 'Bife de contra-filé', 'Bife de contrafilé', 'Bife de coxão mole',
    'Carne em cubos', 'Carne moída', 'Carne seca', 'Costela bovina', 'Filé mignon', 'Maminha',
    'Músculo bovino', 'Rosbife', 'Bacon', 'Bacon em cubos', 'Bacon em fatias', 'Bisteca de porco',
    'Costela de porco', 'Costelinha de porco', 'Guanciale', 'Linguiça calabresa', 'Linguiça paio',
    'Linguiça toscana', 'Lombo de porco', 'Presunto cozido', 'Presunto Parma', 'Salsicha',
    'Torresmo', 'Frango desfiado', 'Frango em pedaços', 'Peito de frango', 'Peito de frango cozido e desfiado',
    'Peito de peru', 'Peito de peru defumado', 'Bacalhau dessalgado e desfiado', 'Camarão',
    'Filé de peixe branco', 'Filé de salmão', 'Filé de Tilápia', 'Filé de tilápia', 'Lula',
    'Mexilhão', 'Paleta de cordeiro', 'Peixe inteiro', 'Polvo', 'Posta de peixe branco',
    'Salmão', 'Salmão fresco'
  ],
  'Hortifruti': [
    'Acelga', 'Abacate', 'Abacaxi', 'Banana', 'Banana nanica', 'Banana-da-terra',
    'Frutas frescas', 'Frutas frescas picadas', 'Frutas vermelhas', 'Jaca verde', 'Laranja',
    'Limão', 'Limão siciliano', 'Limão Taiti', 'Maçã', 'Maçã verde', 'Mamão formosa',
    'Mamão papaya', 'Manga', 'Maracujá', 'Milho verde', 'Morango', 'Raspas de laranja',
    'Raspas de limão', 'Tâmara', 'Tâmaras', 'Uva passa', 'Abóbora cabotiá', 'Abóbora de pescoço',
    'Abóbora moranga', 'Abobrinha', 'Batata', 'Batata doce', 'Berinjela', 'Brócolis',
    'Broto de feijão', 'Cenoura', 'Cogumelo Paris', 'Cogumelo Portobello', 'Cogumelos Paris',
    'Cogumelos shiitake', 'Cogumelos variados', 'Couve', 'Couve crespa', 'Couve-flor',
    'Endívia', 'Endro', 'Ervilha fresca', 'Espinafre', 'Gengibre', 'Inhame',
    'Legumes picados a gosto', 'Mandioca', 'Mandioquinha', 'Palmito pupunha', 'Pepino',
    'Pequi', 'Pimenta jalapeño', 'Pimentão', 'Pimentão amarelo', 'Pimentão verde',
    'Pimentão vermelho', 'Quiabo', 'Repolho', 'Rúcula', 'Tomate', 'Tomate cereja',
    'Vagem', 'Alecrim', 'Alface', 'Alface romana', 'Alho', 'Alho-poró', 'Aspargo',
    'Aspargos frescos', 'Cebola', 'Cebola pérola', 'Cebola roxa', 'Cebolinha',
    'Cheiro-verde', 'Coentro', 'Ervas frescas', 'Hortelã', 'Manjericão', 'Manjericão fresco',
    'Salsinha', 'Salsinha picada', 'Sálvia', 'Tomilho', 'Cominho'
  ],
  'Laticínios': [
    'Queijos', 'Burrata', 'Muçarela de búfala', 'Mussarela de búfala (bocconcini)',
    'Queijo azul (gorgonzola)', 'Queijo cheddar', 'Queijo coalho', 'Queijo Cottage',
    'Queijo de cabra', 'Queijo Feta', 'Queijo Gorgonzola', 'Queijo Gruyère',
    'Queijo Mascarpone', 'Queijo Minas curado', 'Queijo Minas frescal', 'Queijo mussarela',
    'Queijo parmesão', 'Queijo parmesão ralado', 'Queijo Pecorino Romano', 'Queijo prato',
    'Queijo Provolone', 'Queijo Roquefort', 'Queijo suíço', 'Creme de leite',
    'Creme de leite fresco', 'Iogurte Grego', 'Iogurte natural', 'Leite', 'Leite integral',
    'Manteiga', 'Manteiga de garrafa', 'Manteiga derretida', 'Manteiga gelada',
    'Manteiga Ghee', 'Manteiga sem sal', 'Requeijão cremoso', 'Ricota'
  ],
  'Mercearia': [
    'Milho em lata', 'Suco de laranja', 'Suco de limão', 'Polpa de maracujá', 'Nozes',
    'Grão-de-bico', 'Grão-de-bico cozido', 'Biomassa de banana verde', 'Ovo inteiro, clara, gema',
    'Leite condensado', 'Ameixa seca', 'Açaí congelado', 'Atum em lata', 'Arroz',
    'Arroz agulhinha', 'Arroz arbóreo', 'Arroz bomba', 'Arroz branco', 'Arroz cozido',
    'Arroz integral', 'Arroz japonês', 'Aveia em flocos', 'Aveia em flocos (sem glúten)',
    'Aveia em flocos finos', 'Cuscuz marroquino', 'Flocão de milho', 'Flocos de milho',
    'Quinoa', 'Trigo para quibe', 'Farinha de Amêndoas', 'Farinha de Arroz', 'Farinha de aveia',
    'Farinha de coco', 'Farinha de grão-de-bico', 'Farinha de linhaça', 'Farinha de mandioca',
    'Farinha de milho amarela', 'Farinha de rosca', 'Farinha de rosca sem glúten',
    'Farinha de trigo', 'Farinha sem glúten', 'Mix de farinhas sem glúten', 'Ervilha',
    'feijão', 'feijão cozido', 'Feijão branco', 'Feijão Carioca', 'Feijão fradinho',
    'Feijão preto', 'Feijão vermelho', 'Lentilha', 'Lentilha vermelha', 'Azeite',
    'Azeite de dendê', 'Azeite de oliva', 'Óleo', 'Óleo de coco', 'Óleo de gergelim',
    'Óleo de gergelim torrado', 'Óleo para fritar', 'Óleo vegetal', 'Açafrão da terra',
    'Alho em pó', 'Berbere', 'Cúrcuma em pó', 'Garam Masala', 'Gochujang', 'Orégano',
    'Páprica', 'Páprica defumada', 'Páprica doce', 'Pimenta calabresa', 'Pimenta do reino',
    'Pimenta em pó', 'Pimenta síria', 'Pistilos de Açafrão', 'Sal', 'Sal negro', 'Zattar',
    'Açúcar', 'Açúcar de coco', 'Açúcar de confeiteiro', 'Açúcar de palma', 'Açúcar demerara',
    'Açúcar mascavo', 'Adoçante', 'Mel', 'Mel ou Agave', 'Melado de cana', 'Xarope de guaraná',
    'Atum (em água)', 'Coração de Alcachofra', 'Palmito', 'Sardinha em lata', 'Tomate pelado',
    'Capeletti de queijo', 'Capeletti sem glúten', 'Espaguete', 'Espaguete integral',
    'Folha de arroz', 'Macarrão Caracol', 'Macarrão de arroz', 'Macarrão para Lámen',
    'Macarrão para Yakisoba', 'Massa de pizza', 'Massa folhada', 'Massa para lasanha',
    'Massa tipo Fettuccine', 'Massa tipo Fusilli', 'Massa tipo Penne', 'Pão', 'Pão baguete',
    'Pão de fermentação natural', 'Pão de forma', 'Pão de hambúrguer', 'Pão Folha',
    'Pão francês', 'Pão integral', 'Pão italiano', 'Pão para Hot Dog', 'Pão sírio',
    'Spaghetti', 'Tortilha integral', 'Tortilhas de milho', 'Tortilhas de trigo',
    'Tortilhas para Tacos', 'Wrap integral', 'Caldo de carne', 'Caldo de frango',
    'Caldo de legumes', 'Caldo de peixe', 'Extrato de tomate', 'Ketchup', 'Maionese',
    'Maionese vegana', 'Maionese vegetal', 'Molho Caesar', 'Molho de peixe',
    'Molho de tomate', 'Molho inglês', 'Molho Pesto', 'Molho shoyu', 'Mostarda',
    'Mostarda Dijon', 'Sriracha', 'Amêndoas', 'Amendoim', 'Amendoim torrado',
    'Castanha de caju', 'Castanha-do-pará', 'Cachaça', 'Café', 'Conhaque',
    'Licor de café', 'Vinagre', 'Vinagre balsâmico', 'Vinagre de maçã',
    'Vinagre de vinho tinto', 'Vinho branco seco', 'Vinho Madeira', 'Vinho tinto seco',
    'Ágar-ágar em pó', 'Bicarbonato de sódio', 'Biscoito Calipso', 'Biscoito Champagne',
    'Biscoito de Arroz', 'Biscoito Maizena', 'Biscoito sem glúten', 'Cacau em pó',
    'Chocolate amargo', 'Chocolate em pó', 'Chocolate granulado', 'Chocolate meio amargo',
    'Coco ralado', 'Coentro em pó', 'Cominho em pó', 'Creme de castanha de caju',
    'Croutons', 'Doce de leite', 'Falafel', 'Fermento biológico seco', 'Fermento em pó',
    'Folha de louro', 'Fubá Mimoso', 'Fubá para angu', 'Fubá para polenta',
    'Fumaça líquida', 'Gelatina incolor', 'Gelatina incolor sem sabor', 'Geleia de pimenta',
    'Gema', 'Gema de ovo', 'Gergelim branco', 'Gergelim preto', 'Goiabada',
    'Goma de Tapioca', 'Gotas de chocolate', 'Granola', 'Leite condensado de coco',
    'Leite de amêndoas', 'Leite de aveia', 'Leite de castanhas', 'Leite de coco',
    'Leite vegetal', 'Levedura nutricional', 'Linguiça vegetal', 'Manteiga Ghee',
    'Manteiga vegana', 'Margarina vegetal', 'Muffin Inglês', 'Nori', 'Noz-moscada',
    'Ovo de codorna', 'Ovo inteiro', 'Pasta de amendoim', 'Pasta de curry amarelo',
    'Pasta de curry verde', 'Pasta de missô', 'Pasta de tamarindo', 'Picles',
    'Polvilho azedo', 'Polvilho doce', 'Presunto vegetal', 'Proteína de soja',
    'Psyllium em pó', 'Queijo vegano', 'Queijo vegetal', 'Redução de balsâmico',
    'Sagu', 'Salsicha Vegetariana', 'Semente de Chia', 'Shoyu', 'Suco de maracujá concentrado',
    'Tahine', 'Tapioca granulada', 'Tofu defumado', 'Tofu extra firme', 'Tofu firme',
    'Tofu macio', 'Tofu sedoso', 'Whey protein'
  ]
};

// Unidades por categoria (g para sólidos, ml para líquidos)
const units = {
  'Carnes e Peixes': 'g',
  'Hortifruti': 'g', 
  'Laticínios': 'g', // Exceto líquidos
  'Mercearia': 'g' // Exceto líquidos
};

// Exceções para líquidos (ml)
const liquidExceptions = [
  'Creme de leite fresco', 'Leite', 'Leite integral', 'Manteiga de garrafa',
  'Suco de laranja', 'Suco de limão', 'Polpa de maracujá', 'Azeite', 'Azeite de dendê',
  'Azeite de oliva', 'Óleo', 'Óleo de coco', 'Óleo de gergelim', 'Óleo de gergelim torrado',
  'Óleo para fritar', 'Óleo vegetal', 'Xarope de guaraná', 'Caldo de carne', 'Caldo de frango',
  'Caldo de legumes', 'Caldo de peixe', 'Molho Caesar', 'Molho de peixe', 'Molho de tomate',
  'Molho inglês', 'Molho shoyu', 'Sriracha', 'Cachaça', 'Conhaque', 'Licor de café',
  'Vinagre', 'Vinagre balsâmico', 'Vinagre de maçã', 'Vinagre de vinho tinto',
  'Vinho branco seco', 'Vinho Madeira', 'Vinho tinto seco', 'Fumaça líquida',
  'Leite de amêndoas', 'Leite de aveia', 'Leite de castanhas', 'Leite de coco',
  'Leite vegetal', 'Redução de balsâmico', 'Suco de maracujá concentrado'
];

console.log('📋 Atualizando categorias de ingredientes...');
console.log('✅ Categorização baseada na lista fornecida pelo usuário');
console.log('🎯 Total de ingredientes por categoria:');
Object.entries(categories).forEach(([category, ingredients]) => {
  console.log(`  ${category}: ${ingredients.length} ingredientes`);
});

console.log('\n🔧 Próximos passos:');
console.log('1. Atualizar ingredientData.ts com essas categorias');
console.log('2. Verificar unidades (g/ml) para cada ingrediente');
console.log('3. Testar lista de compras');
