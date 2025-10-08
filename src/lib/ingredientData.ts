export interface IngredientData {
  primaryUnit: string
  averageWeightGrams?: number
  category: string
  purchaseUnit?: string
  recipeUnitsPerPurchaseUnit?: number
  primaryStandardUnit?: 'g' | 'ml'
}

// Mapeia ingredientes processados para sua forma primária de compra
export const ingredientConversions: Record<string, { primary: string; factor: number }> = {
  'grão-de-bico cozido': { primary: 'grão-de-bico', factor: 0.45 }, // 1g de cozido ~= 0.45g de cru
  // Adicionar outras conversões aqui no futuro, se necessário
};

export const ingredientMasterDictionary: Record<string, IngredientData> = {
  // Hortifruti - Tabela de Pesos Padronizados - Sazonal Chef: O App de Receita Que Transforma Sua Relação com a Comida
  'cebola': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // 150g - AJUSTADO conforme solicitado
  'cebola roxa': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // 150g - AJUSTADO conforme solicitado
  'maçã': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // AJUSTADO: valor mais realista
  'maca': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // AJUSTADO: valor mais realista
  'rúcula': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // 150g - AJUSTADO conforme solicitado
  'rucula': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // 150g - AJUSTADO conforme solicitado
  'tomate cereja': { primaryUnit: 'g', category: 'Hortifruti' },
  'abóbora roxa': { primaryUnit: 'g', averageWeightGrams: 1000, category: 'Hortifruti' },
  'abobora roxa': { primaryUnit: 'g', averageWeightGrams: 1000, category: 'Hortifruti' },
  'morango': { primaryUnit: 'g', category: 'Hortifruti' },
  'morangos': { primaryUnit: 'g', category: 'Hortifruti' },
  'pepino': { primaryUnit: 'unidade', averageWeightGrams: 250, category: 'Hortifruti' }, // 250g - AJUSTADO
  'alface': { primaryUnit: 'maço', averageWeightGrams: 250, category: 'Hortifruti' }, // 250g por maço (25 folhas)
  'folha de alface': { primaryUnit: 'folha', averageWeightGrams: 10, category: 'Hortifruti' }, // 10g por folha
  'cebolinha': { primaryUnit: 'talo', averageWeightGrams: 6, category: 'Hortifruti' }, // 1 talo = 6g = 1 colher de sopa
  'cenoura': { primaryUnit: 'unidade', averageWeightGrams: 120, category: 'Hortifruti' }, // 120g - TABELA PADRONIZADA
  'batata': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' },
  'batata doce': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - TABELA PADRONIZADA
  'tomate': { primaryUnit: 'unidade', averageWeightGrams: 120, category: 'Hortifruti' }, // 120g - AJUSTADO conforme solicitado
  'abacate': { primaryUnit: 'unidade', averageWeightGrams: 350, category: 'Hortifruti' }, // 350g - AJUSTADO conforme solicitado
  'avocado': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - Tipo menor de abacate
  'manga': { primaryUnit: 'unidade', averageWeightGrams: 250, category: 'Hortifruti' }, // 250g - MANTIDO (valor realista)
  'maracujá': { primaryUnit: 'unidade', averageWeightGrams: 100, category: 'Hortifruti' }, // 100g - Fruta
  'maracuja': { primaryUnit: 'unidade', averageWeightGrams: 100, category: 'Hortifruti' }, // 100g - Fruta
  'banana': { primaryUnit: 'unidade', averageWeightGrams: 120, category: 'Hortifruti' }, // 120g - MANTIDO (valor realista)
  'banana-da-terra': { primaryUnit: 'unidade', averageWeightGrams: 250, category: 'Hortifruti' }, // 250g - CORRIGIDO: unidade média
  'banana da terra': { primaryUnit: 'unidade', averageWeightGrams: 250, category: 'Hortifruti' }, // 250g - CORRIGIDO: unidade média
  'jaca verde': { primaryUnit: 'g', category: 'Hortifruti' },
  'berinjela': { primaryUnit: 'unidade', averageWeightGrams: 250, category: 'Hortifruti' }, // 250g - TABELA PADRONIZADA
  'abobrinha': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - MANTIDO (valor realista)
  'abóbora': { primaryUnit: 'g', averageWeightGrams: 1000, category: 'Hortifruti' },
  'abobora': { primaryUnit: 'g', averageWeightGrams: 1000, category: 'Hortifruti' },
  'alho': { primaryUnit: 'dente', averageWeightGrams: 5, category: 'Hortifruti', purchaseUnit: 'cabeça', recipeUnitsPerPurchaseUnit: 10 }, // 5g (por dente) - TABELA PADRONIZADA
  'gengibre': { primaryUnit: 'unidade', averageWeightGrams: 50, category: 'Hortifruti' }, // 50g - AJUSTADO para unidade (pedaço médio)
  'pimentão': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - AJUSTADO conforme solicitado
  'pimentao': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - AJUSTADO conforme solicitado
  'pimentão amarelo': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - AJUSTADO conforme solicitado
  'pimentão verde': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - AJUSTADO conforme solicitado
  'pimentão vermelho': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - AJUSTADO conforme solicitado
  'limão': { primaryUnit: 'unidade', averageWeightGrams: 90, category: 'Hortifruti' }, // 90g - TABELA PADRONIZADA
  'limao': { primaryUnit: 'unidade', averageWeightGrams: 90, category: 'Hortifruti' }, // 90g - TABELA PADRONIZADA
  'espinafre': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // 150g - AJUSTADO conforme solicitado
  'brócolis': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - MANTIDO (valor realista)
  'brocolis': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - MANTIDO (valor realista)
  'brócoli': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - MANTIDO (valor realista)
  'brocoli': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' }, // 200g - MANTIDO (valor realista)
  'cogumelos': { primaryUnit: 'g', category: 'Hortifruti' },
  'cogumelos variados': { primaryUnit: 'g', category: 'Hortifruti' },
  'aspargo': { primaryUnit: 'unidade', averageWeightGrams: 15, category: 'Hortifruti' }, // 15g - AJUSTADO conforme solicitado
  'aspargos': { primaryUnit: 'unidade', averageWeightGrams: 15, category: 'Hortifruti' }, // 15g - AJUSTADO conforme solicitado
  'edamame': { primaryUnit: 'g', category: 'Hortifruti' },
  'tâmaras': { primaryUnit: 'g', category: 'Hortifruti' },
  'tamaras': { primaryUnit: 'g', category: 'Hortifruti' },
  'frutas vermelhas': { primaryUnit: 'g', category: 'Hortifruti' },
  'frutas frescas': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' }, // Frutas frescas - 150g padrão
  'costela de porco': { primaryUnit: 'g', category: 'Carnes e Peixes' }, // Carne de porco (normalizado)
  'costelinha de porco': { primaryUnit: 'g', category: 'Carnes e Peixes' }, // Carne de porco (variação)
  'nozes': { primaryUnit: 'g', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'amêndoas': { primaryUnit: 'g', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'amendoas': { primaryUnit: 'g', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'castanha de caju': { primaryUnit: 'g', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'ervas frescas': { primaryUnit: 'ramos', category: 'Hortifruti' },
  
  // NOVOS INGREDIENTES PARA HORTIFRUTI
  'açafrão da terra': { primaryUnit: 'g', category: 'Mercearia' },
  'acafrao da terra': { primaryUnit: 'g', category: 'Mercearia' },
  'açafrão': { primaryUnit: 'g', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'acafrao': { primaryUnit: 'g', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'couve-flor': { primaryUnit: 'g', category: 'Hortifruti' },
  'couve flor': { primaryUnit: 'g', category: 'Hortifruti' },
  'couve crespa': { primaryUnit: 'maço', averageWeightGrams: 200, category: 'Hortifruti' },
  'couve crespa (kale)': { primaryUnit: 'maço', averageWeightGrams: 200, category: 'Hortifruti' },
  'couve': { primaryUnit: 'maço', averageWeightGrams: 200, category: 'Hortifruti' },
  'cheiro-verde': { primaryUnit: 'maço', averageWeightGrams: 40, category: 'Hortifruti' },
  'cheiro verde': { primaryUnit: 'maço', averageWeightGrams: 40, category: 'Hortifruti' },
  'mandioca': { primaryUnit: 'g', category: 'Hortifruti' },
  'hortelã': { primaryUnit: 'maço', averageWeightGrams: 60, category: 'Hortifruti' },
  'hortela': { primaryUnit: 'maço', averageWeightGrams: 60, category: 'Hortifruti' },
  'manjericão fresco': { primaryUnit: 'maço', averageWeightGrams: 20, category: 'Hortifruti' }, // 20g por maço
  'manjericao fresco': { primaryUnit: 'maço', averageWeightGrams: 20, category: 'Hortifruti' }, // 20g por maço
  'palmito pupunha': { primaryUnit: 'g', category: 'Hortifruti' },
  'repolho': { primaryUnit: 'unidade', averageWeightGrams: 1000, category: 'Hortifruti' },
  'ervilha fresca': { primaryUnit: 'g', category: 'Hortifruti' },
  'ervilha congelada': { primaryUnit: 'g', category: 'Hortifruti' },
  'ervilha fresca ou congelada': { primaryUnit: 'g', category: 'Hortifruti' },
  'quiabo': { primaryUnit: 'g', category: 'Hortifruti' },
  'vagem': { primaryUnit: 'g', category: 'Hortifruti' },
  'salsinha': { primaryUnit: 'maço', averageWeightGrams: 20, category: 'Hortifruti' },
  'salsinha picada': { primaryUnit: 'maço', averageWeightGrams: 20, category: 'Hortifruti' },
  'aipo': { primaryUnit: 'talo', averageWeightGrams: 50, category: 'Hortifruti' },
  'fava de baunilha': { primaryUnit: 'unidade', category: 'Mercearia' },
  'capeletti de queijo': { primaryUnit: 'g', category: 'Mercearia' },
  'mandioquinha': { primaryUnit: 'g', category: 'Hortifruti' },
  'palmito': { primaryUnit: 'vidro', averageWeightGrams: 300, category: 'Mercearia' },
  'abacaxi': { primaryUnit: 'unidade', averageWeightGrams: 1000, category: 'Hortifruti' },
  'mamão formosa': { primaryUnit: 'g', category: 'Hortifruti' },
  'pequi': { primaryUnit: 'unidade', category: 'Hortifruti' },
  'pimenta jalapeño': { primaryUnit: 'unidade', category: 'Hortifruti' },
  'alho em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'alecrim': { primaryUnit: 'ramos', averageWeightGrams: 5, category: 'Hortifruti' },
  'endívia': { primaryUnit: 'ramos', averageWeightGrams: 50, category: 'Hortifruti' },
  'endivia': { primaryUnit: 'ramos', averageWeightGrams: 50, category: 'Hortifruti' },
  'inhame': { primaryUnit: 'g', category: 'Hortifruti' },
  'mamão papaya': { primaryUnit: 'g', category: 'Hortifruti' },
  'mamao papaya': { primaryUnit: 'g', category: 'Hortifruti' },
  'coentro': { primaryUnit: 'g', category: 'Hortifruti' },
  'coentro fresco': { primaryUnit: 'g', category: 'Hortifruti' },
  'maminha': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'milho verde': { primaryUnit: 'lata', averageWeightGrams: 200, category: 'Mercearia' },
  'espiga de milho': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' },
  'tomilho': { primaryUnit: 'ramos', averageWeightGrams: 3, category: 'Hortifruti' },
  'alho-poró': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' },
  'alho poro': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' },
  'alho poró': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Hortifruti' },
  'farinha de mandioca': { primaryUnit: 'g', category: 'Mercearia' },
  'acém': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },

  // Laticínios
  'manteiga': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo gruyère': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo gruyere': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo mussarela': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo parmesão': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo parmesao': { primaryUnit: 'g', category: 'Laticínios' },
  'muçarela de búfala': { primaryUnit: 'g', category: 'Laticínios' },
  'mucarela de bufala': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo parmesão ralado': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo parmesao ralado': { primaryUnit: 'g', category: 'Laticínios' },
  'queijo': { primaryUnit: 'g', category: 'Laticínios' },
  'cream cheese': { primaryUnit: 'g', category: 'Laticínios' },
  'ricota': { primaryUnit: 'g', category: 'Laticínios' },
  'creme de leite': { primaryUnit: 'ml', category: 'Laticínios' },
  'iogurte': { primaryUnit: 'ml', category: 'Laticínios' },
  'whey protein': { primaryUnit: 'g', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'leite': { primaryUnit: 'ml', category: 'Laticínios' },
  'leite condensado': { primaryUnit: 'lata', averageWeightGrams: 395, category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'ovo': { primaryUnit: 'unidade', category: 'Mercearia', purchaseUnit: 'unidade' },
  
  // NOVOS INGREDIENTES PARA LATICÍNIOS
  'burrata': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Laticínios' },
  'mussarela de búfala': { primaryUnit: 'g', category: 'Laticínios' },
  'mussarela de bufala': { primaryUnit: 'g', category: 'Laticínios' },
  'mussarela de búfala (bocconcini)': { primaryUnit: 'g', category: 'Laticínios' },
  'mussarela de bufala (bocconcini)': { primaryUnit: 'g', category: 'Laticínios' },
  'requeijão cremoso': { primaryUnit: 'g', category: 'Laticínios' },
  'requeijao cremoso': { primaryUnit: 'g', category: 'Laticínios' },

  // Carnes e Peixes - Pesos médios para formatação com unidades
  'filé de salmão': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'filé mignon': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'file de salmao': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'salmão': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'salmao': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'salmão fresco': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'salmao fresco': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'posta de peixe branco': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'filé de peixe branco': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'file de peixe branco': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'filé de frango': { primaryUnit: 'g', averageWeightGrams: 120, category: 'Carnes e Peixes' },
  'file de frango': { primaryUnit: 'g', averageWeightGrams: 120, category: 'Carnes e Peixes' },
  'peito de frango': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'frango': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'frango em pedaços': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'frango em pedacos': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'frango inteiro': { primaryUnit: 'unidade', averageWeightGrams: 1200, category: 'Carnes e Peixes' },
  'bife': { primaryUnit: 'g', averageWeightGrams: 100, category: 'Carnes e Peixes' },
  'músculo bovino': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'musculo bovino': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'contrafilé': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' }, // CORRIGIDO: 150g por bife
  'contrafile': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' }, // CORRIGIDO: 150g por bife
  'contra-filé': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' }, // 150g por bife
  'contra filé': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' }, // 150g por bife
  'costela': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'linguiça': { primaryUnit: 'g', averageWeightGrams: 80, category: 'Carnes e Peixes' },
  'linguica': { primaryUnit: 'g', averageWeightGrams: 80, category: 'Carnes e Peixes' },
  'linguiça calabresa': { primaryUnit: 'g', averageWeightGrams: 80, category: 'Carnes e Peixes' },
  'linguica calabresa': { primaryUnit: 'g', averageWeightGrams: 80, category: 'Carnes e Peixes' },
  'linguiça vegetal': { primaryUnit: 'g', averageWeightGrams: 80, category: 'Mercearia' },
  'linguica vegetal': { primaryUnit: 'g', averageWeightGrams: 80, category: 'Mercearia' },
  'paleta de cordeiro': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'lombo de porco': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'suco de maracujá concentrado': { primaryUnit: 'ml', category: 'Mercearia' },
  'limão siciliano': { primaryUnit: 'unidade', averageWeightGrams: 120, category: 'Hortifruti' },
  'cogumelo portobello': { primaryUnit: 'g', averageWeightGrams: 100, category: 'Hortifruti' },
  'frango desfiado': { primaryUnit: 'g', averageWeightGrams: 60, category: 'Carnes e Peixes' },
  'peito de frango desfiado': { primaryUnit: 'g', averageWeightGrams: 60, category: 'Carnes e Peixes' },
  'bacon': { primaryUnit: 'g', averageWeightGrams: 20, category: 'Carnes e Peixes' }, // fatia
  'camarão': { primaryUnit: 'g', averageWeightGrams: 15, category: 'Carnes e Peixes' }, // unidade média
  'camarao': { primaryUnit: 'g', averageWeightGrams: 15, category: 'Carnes e Peixes' },
  'carne': { primaryUnit: 'g', averageWeightGrams: 100, category: 'Carnes e Peixes' },
  'carne bovina em cubos': { primaryUnit: 'g', averageWeightGrams: 100, category: 'Carnes e Peixes' },
  'atum': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'atum fresco': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'tilápia': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'tilapia': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'filé de tilápia': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'file de tilapia': { primaryUnit: 'unidade', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'peito de peru': { primaryUnit: 'g', averageWeightGrams: 20, category: 'Carnes e Peixes' }, // fatia
  
  // NOVOS INGREDIENTES PARA CARNES E PEIXES
  'lula': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'mexilhão': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'mexilhao': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'presunto cozido': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'presunto parma': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'presunto parmesão': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'presunto vegetal': { primaryUnit: 'fatias', category: 'Mercearia' },
  'bacalhau dessalgado e desfiado': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'bacalhau dessalgado': { primaryUnit: 'g', category: 'Carnes e Peixes' },

  // Mercearia
  'batata palha': { primaryUnit: 'pacote', averageWeightGrams: 120, category: 'Mercearia' },
  'purê de batata instantâneo': { primaryUnit: 'g', category: 'Mercearia' },
  'pure de batata instantaneo': { primaryUnit: 'g', category: 'Mercearia' },
  'batata em flocos': { primaryUnit: 'g', category: 'Mercearia' },
  'queijo vegetal': { primaryUnit: 'g', category: 'Mercearia' },
  'queijo vegano': { primaryUnit: 'g', category: 'Mercearia' },
  
  // NOVOS INGREDIENTES - CARNES E PEIXES
  'bife de contrafilé': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'carne moída': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  'peito de frango cozido desfiado': { primaryUnit: 'g', category: 'Carnes e Peixes' },
  
  // NOVOS INGREDIENTES - LATICÍNIOS
  'iogurte grego': { primaryUnit: 'g', category: 'Laticínios' },
  'iogurte natural': { primaryUnit: 'g', category: 'Laticínios' },
  
  // NOVOS INGREDIENTES - MERCEARIA
  'agar agar': { primaryUnit: 'g', category: 'Mercearia' },
  'arroz arbóreo': { primaryUnit: 'g', category: 'Mercearia' },
  'arroz branco': { primaryUnit: 'g', category: 'Mercearia' },
  'arroz integral': { primaryUnit: 'g', category: 'Mercearia' },
  'canela em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'chia': { primaryUnit: 'g', category: 'Mercearia' },
  'chocolate 70%': { primaryUnit: 'g', category: 'Mercearia' },
  'curry em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'farinha de rosca': { primaryUnit: 'g', category: 'Mercearia' },
  'feijão cozido': { primaryUnit: 'g', category: 'Mercearia' },
  'feijão preto cozido': { primaryUnit: 'g', category: 'Mercearia' },
  'feijão preto': { primaryUnit: 'g', category: 'Mercearia' },
  'gelatina incolor': { primaryUnit: 'g', category: 'Mercearia' },
  'macarrão para yakisoba': { primaryUnit: 'g', category: 'Mercearia' },
  'melado': { primaryUnit: 'ml', category: 'Mercearia' },
  'molho de ostras': { primaryUnit: 'ml', category: 'Mercearia' },
  'molho ponzu': { primaryUnit: 'ml', category: 'Mercearia' },
  'molho shoyu': { primaryUnit: 'ml', category: 'Mercearia' },
  'sal grosso': { primaryUnit: 'g', category: 'Mercearia' },
  'suco de uva': { primaryUnit: 'ml', category: 'Mercearia' },
  'tortilhas': { primaryUnit: 'unidade', category: 'Mercearia' },
  'vinagre balsâmico': { primaryUnit: 'ml', category: 'Mercearia' },
  'wrap integral': { primaryUnit: 'unidade', category: 'Mercearia' },
  'água': { primaryUnit: 'ml', category: 'Mercearia' },
  'óleo de coco': { primaryUnit: 'ml', category: 'Mercearia' },
  'óleo': { primaryUnit: 'ml', category: 'Mercearia' },
  
  // NOVOS INGREDIENTES - HORTIFRUTI
  'manga congelada': { primaryUnit: 'g', category: 'Hortifruti' },
  
  // INGREDIENTE ESPECÍFICO - Suco de 4 Laranjas pera (aprox. 350ml)
  'suco de 4 laranjas pera (aprox. 350ml)': { primaryUnit: 'ml', category: 'Mercearia' },
  'extrato de baunilha': { primaryUnit: 'ml', category: 'Mercearia' },
  'leite de aveia': { primaryUnit: 'ml', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'leite de coco': { primaryUnit: 'ml', category: 'Mercearia' }, // CORRIGIDO: movido para Mercearia
  'atum em lata': { primaryUnit: 'g', averageWeightGrams: 120, category: 'Mercearia' },
  'caldo de legumes': { primaryUnit: 'ml', category: 'Mercearia' },
  'caldo de legume': { primaryUnit: 'ml', category: 'Mercearia' }, // Variação singular
  'molho de tomate': { primaryUnit: 'ml', category: 'Mercearia' }, // CORRIGIDO: agora usa volume (ml)
  'suco de laranja': { primaryUnit: 'ml', category: 'Mercearia', primaryStandardUnit: 'ml' },
  'suco de limão': { primaryUnit: 'ml', category: 'Mercearia' },
  'suco de limao': { primaryUnit: 'ml', category: 'Mercearia' },
  'vinho branco': { primaryUnit: 'ml', category: 'Mercearia' },
  'vinho branco seco': { primaryUnit: 'ml', category: 'Mercearia', primaryStandardUnit: 'ml' },
  'quinoa': { primaryUnit: 'g', category: 'Mercearia' },
  'shoyu': { primaryUnit: 'ml', category: 'Mercearia', primaryStandardUnit: 'ml' },
  'farinha de amêndoas': { primaryUnit: 'g', category: 'Mercearia' },
  'farinha de amendoas': { primaryUnit: 'g', category: 'Mercearia' },
  'farinha de amêndoa': { primaryUnit: 'g', category: 'Mercearia' }, // Variação singular
  'farinha de amendoa': { primaryUnit: 'g', category: 'Mercearia' }, // Variação singular
  'cúrcuma': { primaryUnit: 'g', category: 'Mercearia' },
  'curcuma': { primaryUnit: 'g', category: 'Mercearia' },
  'ovos': { primaryUnit: 'unidade', averageWeightGrams: 60, category: 'Mercearia' }, // Movido para Mercearia
  
  // NOVOS INGREDIENTES PARA MERCEARIA
  'extrato de tomate': { primaryUnit: 'g', category: 'Mercearia' },
  'tomate pelado': { primaryUnit: 'g', category: 'Mercearia' },
  'tomate pelado em lata': { primaryUnit: 'g', category: 'Mercearia' },
  'leite condensado de coco': { primaryUnit: 'g', category: 'Mercearia' },
  'leite vegetal': { primaryUnit: 'ml', category: 'Mercearia' },
  'doce de leite': { primaryUnit: 'g', category: 'Mercearia' },
  'pistilos de açafrão': { primaryUnit: 'pistilos', averageWeightGrams: 0.05, category: 'Mercearia' },
  'pistilos de acafrao': { primaryUnit: 'pistilos', averageWeightGrams: 0.05, category: 'Mercearia' },
  'manteiga de coco': { primaryUnit: 'g', category: 'Mercearia' },
  'manteiga de garrafa': { primaryUnit: 'g', category: 'Mercearia' },
  'manteiga vegana': { primaryUnit: 'g', category: 'Mercearia' },
  'caldo de carne': { primaryUnit: 'ml', category: 'Mercearia' },
  'caldo de frango': { primaryUnit: 'ml', category: 'Mercearia' },
  'ervilha': { primaryUnit: 'lata', averageWeightGrams: 200, category: 'Mercearia' }, // ervilha em lata

  'pão': { primaryUnit: 'fatia', averageWeightGrams: 50, category: 'Mercearia' },
  'pao': { primaryUnit: 'fatia', averageWeightGrams: 50, category: 'Mercearia' },
  'farinha de trigo': { primaryUnit: 'g', category: 'Mercearia' },
  'açúcar': { primaryUnit: 'g', category: 'Mercearia' },
  'acucar': { primaryUnit: 'g', category: 'Mercearia' },
  'açúcar mascavo': { primaryUnit: 'g', category: 'Mercearia' },
  'acucar mascavo': { primaryUnit: 'g', category: 'Mercearia' },
  'adoçante': { primaryUnit: 'g', category: 'Mercearia' },
  'adocante': { primaryUnit: 'g', category: 'Mercearia' },
  'cacau em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'cacau em po': { primaryUnit: 'g', category: 'Mercearia' },
  'arroz': { primaryUnit: 'g', category: 'Mercearia' },
  'arroz japonês': { primaryUnit: 'g', category: 'Mercearia' },
  'arroz japones': { primaryUnit: 'g', category: 'Mercearia' },
  'arroz japonê': { primaryUnit: 'g', category: 'Mercearia' }, // Variação sem 's' final
  'arroz japone': { primaryUnit: 'g', category: 'Mercearia' }, // Variação sem 's' final
  'tahine': { primaryUnit: 'g', category: 'Mercearia' },
  'tahini': { primaryUnit: 'g', category: 'Mercearia' },
  'sal': { primaryUnit: 'g', category: 'Mercearia' },
  'sal negro': { primaryUnit: 'g', category: 'Mercearia' },
  'pimenta do reino': { primaryUnit: 'g', category: 'Mercearia' },
  'azeite de oliva': { primaryUnit: 'ml', category: 'Mercearia' },
  'acelga': { primaryUnit: 'folha', averageWeightGrams: 50, category: 'Hortifruti' },
  'cogumelo paris': { primaryUnit: 'g', category: 'Hortifruti' },
  'laranja': { primaryUnit: 'unidade', averageWeightGrams: 200, category: 'Hortifruti' },
  'bisteca de porco': { primaryUnit: 'g', averageWeightGrams: 150, category: 'Carnes e Peixes' },
  'polvo': { primaryUnit: 'g', averageWeightGrams: 200, category: 'Carnes e Peixes' },
  'salsicha': { primaryUnit: 'unidade', averageWeightGrams: 50, category: 'Carnes e Peixes' },
  'salsicha vegetariana': { primaryUnit: 'unidade', averageWeightGrams: 50, category: 'Mercearia' },
  'fubá mimoso': { primaryUnit: 'g', category: 'Mercearia' },
  'pão para hot dog': { primaryUnit: 'unidade', averageWeightGrams: 50, category: 'Mercearia' },
  'leite de castanhas': { primaryUnit: 'ml', category: 'Mercearia' },
  'vinagre': { primaryUnit: 'ml', category: 'Mercearia' },
  'molho': { primaryUnit: 'ml', category: 'Mercearia' },
  'creme': { primaryUnit: 'ml', category: 'Mercearia' },
  'xarope': { primaryUnit: 'ml', category: 'Mercearia' },
  'gelo': { primaryUnit: 'g', category: 'Mercearia' },
  
  // Grãos e Leguminosas Secas
  'grão-de-bico': { primaryUnit: 'g', category: 'Mercearia' },
  'grao-de-bico': { primaryUnit: 'g', category: 'Mercearia' },
  'lentilha': { primaryUnit: 'g', category: 'Mercearia' },
  'lentilhas': { primaryUnit: 'g', category: 'Mercearia' },
  'feijão': { primaryUnit: 'g', category: 'Mercearia' },
  'feijao': { primaryUnit: 'g', category: 'Mercearia' },
  'feijões': { primaryUnit: 'g', category: 'Mercearia' },
  'feijoes': { primaryUnit: 'g', category: 'Mercearia' },
  'milho': { primaryUnit: 'g', category: 'Mercearia' },
  'trigo': { primaryUnit: 'g', category: 'Mercearia' },
  'cevada': { primaryUnit: 'g', category: 'Mercearia' },
  'aveia': { primaryUnit: 'g', category: 'Mercearia' },
  'aveia em flocos': { primaryUnit: 'g', category: 'Mercearia' },
  'aveia em floco': { primaryUnit: 'g', category: 'Mercearia' }, // Variação sem 's' final
  'amaranto': { primaryUnit: 'g', category: 'Mercearia' },
  'teff': { primaryUnit: 'g', category: 'Mercearia' },
  
  // Adoçantes e Molhos
  'mel': { primaryUnit: 'g', category: 'Mercearia', primaryStandardUnit: 'g' },
  'molho de tâmaras': { primaryUnit: 'ml', category: 'Mercearia' },
  'molho de tamaras': { primaryUnit: 'ml', category: 'Mercearia' },
  'xarope de bordo': { primaryUnit: 'ml', category: 'Mercearia' },
  'xarope de agave': { primaryUnit: 'ml', category: 'Mercearia' },
  'stevia': { primaryUnit: 'g', category: 'Mercearia' },
  'eritritol': { primaryUnit: 'g', category: 'Mercearia' },
  
  // Especiarias e Condimentos
  'canela': { primaryUnit: 'g', category: 'Mercearia' },
  'gengibre em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'pimenta caiena': { primaryUnit: 'g', category: 'Mercearia' },
  'orégano': { primaryUnit: 'g', category: 'Mercearia' },
  'oregano': { primaryUnit: 'g', category: 'Mercearia' },
  'manjericão': { primaryUnit: 'g', category: 'Mercearia' },
  'manjericao': { primaryUnit: 'g', category: 'Mercearia' },
  'salsa': { primaryUnit: 'g', category: 'Mercearia' },
  'louro': { primaryUnit: 'g', category: 'Mercearia' },
  
  // Frutas Secas e Oleaginosas
  'uva passa': { primaryUnit: 'g', category: 'Mercearia' },
  'damasco seco': { primaryUnit: 'g', category: 'Mercearia' },
  'ameixa seca': { primaryUnit: 'g', category: 'Mercearia' },
  'figo seco': { primaryUnit: 'g', category: 'Mercearia' },
  'pistache': { primaryUnit: 'g', category: 'Mercearia' },
  'pistaches': { primaryUnit: 'g', category: 'Mercearia' },
  'avelã': { primaryUnit: 'g', category: 'Mercearia' },
  'avelas': { primaryUnit: 'g', category: 'Mercearia' },
  'macadâmia': { primaryUnit: 'g', category: 'Mercearia' },
  'macadamia': { primaryUnit: 'g', category: 'Mercearia' },
  'pecã': { primaryUnit: 'g', category: 'Mercearia' },
  'peca': { primaryUnit: 'g', category: 'Mercearia' },
  'pecãs': { primaryUnit: 'g', category: 'Mercearia' },
  'pecas': { primaryUnit: 'g', category: 'Mercearia' },
  
  // Ingredientes que estavam em "Outros" - agora organizados em Mercearia
  'alga nori': { primaryUnit: 'folha', category: 'Mercearia' },
  'chocolate': { primaryUnit: 'g', category: 'Mercearia' },
  'chocolate granulado': { primaryUnit: 'pacote', category: 'Mercearia' },
  'chocolate em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'chocolate em po': { primaryUnit: 'g', category: 'Mercearia' },
  'ágar-ágar em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'agar-agar em po': { primaryUnit: 'g', category: 'Mercearia' },
  'cominho em pó': { primaryUnit: 'g', category: 'Mercearia' },
  'cominho em po': { primaryUnit: 'g', category: 'Mercearia' },
  'geleia de frutas': { primaryUnit: 'g', category: 'Mercearia' },
  'maionese': { primaryUnit: 'g', category: 'Mercearia' },
  'polvilho azedo': { primaryUnit: 'g', category: 'Mercearia' },
  'suco de uva integral': { primaryUnit: 'ml', category: 'Mercearia' },
  'tofu firme': { primaryUnit: 'g', category: 'Mercearia' },
  'curry': { primaryUnit: 'g', category: 'Mercearia' },
  'fermento': { primaryUnit: 'g', category: 'Mercearia' },
  'fermento biológico': { primaryUnit: 'g', category: 'Mercearia' },
  'fermento químico': { primaryUnit: 'g', category: 'Mercearia' },
  'gelatina': { primaryUnit: 'g', category: 'Mercearia' },
  'gergelim': { primaryUnit: 'g', category: 'Mercearia' },
  'goma de tapioca': { primaryUnit: 'g', category: 'Mercearia' },
  'granola': { primaryUnit: 'g', category: 'Mercearia' },
  'massa para lasanha': { primaryUnit: 'g', category: 'Mercearia' },
  'nachos': { primaryUnit: 'g', category: 'Mercearia' },
  'nacho': { primaryUnit: 'g', category: 'Mercearia' }, // Variação singular
  'pasta de amendoim': { primaryUnit: 'g', category: 'Mercearia' },
  'semente de chia': { primaryUnit: 'g', category: 'Mercearia' },
  'tortilha': { primaryUnit: 'unidade', category: 'Mercearia' },
  'wrap': { primaryUnit: 'unidade', category: 'Mercearia' },
  'massa': { primaryUnit: 'g', category: 'Mercearia' },
  'macarrão': { primaryUnit: 'g', category: 'Mercearia' },
  'macarrao': { primaryUnit: 'g', category: 'Mercearia' },
  'espaguete': { primaryUnit: 'g', category: 'Mercearia' },
  'penne': { primaryUnit: 'g', category: 'Mercearia' },
  'fusilli': { primaryUnit: 'g', category: 'Mercearia' },
  'ravioli': { primaryUnit: 'g', category: 'Mercearia' },
  'gnocchi': { primaryUnit: 'g', category: 'Mercearia' },
  'pão de forma': { primaryUnit: 'fatia', averageWeightGrams: 25, category: 'Mercearia' },
  'pao de forma': { primaryUnit: 'fatia', averageWeightGrams: 25, category: 'Mercearia' },
  'pão de forma sem casca': { primaryUnit: 'fatia', averageWeightGrams: 25, category: 'Mercearia' },
  'pao de forma sem casca': { primaryUnit: 'fatia', averageWeightGrams: 25, category: 'Mercearia' },
  'pão integral': { primaryUnit: 'fatia', category: 'Mercearia' },
  'pao integral': { primaryUnit: 'fatia', category: 'Mercearia' },
  'pão baguete': { primaryUnit: 'fatia', averageWeightGrams: 30, category: 'Mercearia' },
  'pao baguete': { primaryUnit: 'fatia', averageWeightGrams: 30, category: 'Mercearia' },
  'biscoito': { primaryUnit: 'g', category: 'Mercearia' },
  'biscoito maizena': { primaryUnit: 'g', averageWeightGrams: 5, category: 'Mercearia' }, // 1 biscoito = 5g, 1 pacote = 200g = 40 biscoitos
  'biscoito maisena': { primaryUnit: 'g', averageWeightGrams: 5, category: 'Mercearia' }, // Variação de nome
  'bolacha': { primaryUnit: 'g', category: 'Mercearia' },
  'cereal': { primaryUnit: 'g', category: 'Mercearia' },
  'barrinha': { primaryUnit: 'unidade', category: 'Mercearia' },
  'barrinha de cereal': { primaryUnit: 'unidade', category: 'Mercearia' },
  'páprica doce': { primaryUnit: 'g', category: 'Mercearia' },
  'paprica doce': { primaryUnit: 'g', category: 'Mercearia' }
}

/**
 * Busca um ingrediente no dicionário mestre
 * @param ingredientName Nome do ingrediente (case insensitive)
 * @returns Dados do ingrediente ou null se não encontrado
 */
export function findIngredientData(ingredientName: string): IngredientData | null {
  if (!ingredientName) return null;

  const normalizedName = ingredientName.toLowerCase().trim();

  // Prioridade 1: Busca por correspondência exata
  if (ingredientMasterDictionary[normalizedName]) {
    return ingredientMasterDictionary[normalizedName];
  }

  // Prioridade 2: Busca pela correspondência parcial mais longa para evitar ambiguidades
  const matchingKeys = Object.keys(ingredientMasterDictionary)
    .filter(key => normalizedName.includes(key))
    .sort((a, b) => b.length - a.length); // Ordena da mais longa para a mais curta

  if (matchingKeys.length > 0) {
    // A correspondência mais longa é a mais específica (ex: "molho de tomate" vs "tomate")
    return ingredientMasterDictionary[matchingKeys[0]];
  }

  return null;
}

/**
 * Sistema de Categorização Inteligente com Regras Hierárquicas
 * Prioriza exceções específicas antes de aplicar regras gerais
 */

// Regras de exceção (prioridade máxima)
const EXCEPTION_RULES: Record<string, string> = {
  // Leites vegetais (sempre Mercearia, independente de conter "leite")
  'leite de aveia': 'Mercearia',
  'leite de coco': 'Mercearia',
  'leite de amêndoas': 'Mercearia',
  'leite de amendoas': 'Mercearia',
  'leite de castanha': 'Mercearia',
  'leite de nozes': 'Mercearia',
  'leite de arroz': 'Mercearia',
  'leite de quinoa': 'Mercearia',
  'leite de soja': 'Mercearia',
  'leite de cânhamo': 'Mercearia',
  'leite de canhamo': 'Mercearia',
  'leite de linhaça': 'Mercearia',
  'leite de linhaca': 'Mercearia',
  'leite de gergelim': 'Mercearia',
  'leite de semente': 'Mercearia',
  'leite de sementes': 'Mercearia',
  'leite condensado de coco': 'Mercearia', // Leite vegetal
  'leite vegetal': 'Mercearia', // Leite vegetal
  'manteiga de coco': 'Mercearia', // Manteiga vegetal
  'manteiga de garrafa': 'Mercearia', // Manteiga vegetal
  'manteiga vegana': 'Mercearia', // Manteiga vegetal
  'caldo de carne': 'Mercearia', // Processado
  'caldo de frango': 'Mercearia', // Processado
  'extrato de tomate': 'Mercearia', // Processado
  'tomate pelado': 'Mercearia', // Processado
  'tomate pelado em lata': 'Mercearia', // Processado
  'doce de leite': 'Mercearia', // Processado
  'nozes': 'Mercearia', // Oleaginosas processadas
  'amêndoas': 'Mercearia', // Oleaginosas processadas
  'amendoas': 'Mercearia', // Oleaginosas processadas
  'castanha de caju': 'Mercearia', // Oleaginosas processadas
  'ervilha': 'Mercearia', // Ervilha em lata
  
  // Mercearia - Açafrão
  'açafrão da terra': 'Mercearia', // Especiaria em pó
  'acafrao da terra': 'Mercearia', // Especiaria em pó
  'açafrão': 'Mercearia', // Especiaria em pó
  'acafrao': 'Mercearia', // Especiaria em pó
  'pistilos de açafrão': 'Mercearia', // Especiaria em pistilos
  
  // Mercearia - Queijo vegetal
  'queijo vegetal': 'Mercearia', // Queijo vegetal/vegano
  'queijo vegano': 'Mercearia', // Queijo vegano
  'pistilos de acafrao': 'Mercearia', // Especiaria em pistilos
  'couve-flor': 'Hortifruti', // Vegetal
  'couve flor': 'Hortifruti', // Vegetal
  'couve crespa': 'Hortifruti', // Vegetal
  'couve crespa (kale)': 'Hortifruti', // Vegetal
  'couve': 'Hortifruti', // Vegetal
  'cheiro-verde': 'Hortifruti', // Erva fresca
  'cheiro verde': 'Hortifruti', // Erva fresca
  'mandioca': 'Hortifruti', // Tubérculo
  'hortelã': 'Hortifruti', // Erva fresca
  'hortela': 'Hortifruti', // Erva fresca
  'manjericão fresco': 'Hortifruti', // Erva fresca
  'manjericao fresco': 'Hortifruti', // Erva fresca
  'palmito pupunha': 'Hortifruti', // Vegetal
  'repolho': 'Hortifruti', // Vegetal
  'ervilha fresca': 'Hortifruti', // Vegetal fresco
  'ervilha congelada': 'Hortifruti', // Vegetal congelado
  'ervilha fresca ou congelada': 'Hortifruti', // Vegetal fresco/congelado
  'quiabo': 'Hortifruti', // Vegetal
  'vagem': 'Hortifruti', // Vegetal
  'salsinha': 'Hortifruti', // Erva fresca
  'salsinha picada': 'Hortifruti', // Erva fresca
  'aipo': 'Hortifruti', // Vegetal
  'alecrim': 'Hortifruti', // Erva fresca
  'endívia': 'Hortifruti', // Vegetal
  'endivia': 'Hortifruti', // Vegetal
  'inhame': 'Hortifruti', // Tubérculo
  'mamão papaya': 'Hortifruti', // Fruta
  'mamao papaya': 'Hortifruti', // Fruta
  'coentro': 'Hortifruti', // Erva fresca
  'coentro fresco': 'Hortifruti', // Erva fresca
  'maminha': 'Carnes e Peixes', // Carne bovina
  'milho verde': 'Mercearia', // Conserva/lata
  'espiga de milho': 'Hortifruti', // Vegetal fresco
  'tomilho': 'Hortifruti', // Erva fresca
  'alho-poró': 'Hortifruti', // Vegetal
  'alho poro': 'Hortifruti', // Vegetal
  'alho poró': 'Hortifruti', // Vegetal
  'farinha de mandioca': 'Mercearia', // Farinha processada
  'acém': 'Carnes e Peixes', // Carne bovina
  'azeite de oliva': 'Mercearia', // Óleo processado
  'acelga': 'Hortifruti', // Vegetal
  'cogumelo paris': 'Hortifruti', // Cogumelo
  'laranja': 'Hortifruti', // Fruta
  'bisteca de porco': 'Carnes e Peixes', // Carne de porco
  'polvo': 'Carnes e Peixes', // Fruto do mar
  'salsicha': 'Carnes e Peixes', // Embutido
  'salsicha vegetariana': 'Mercearia', // Embutido vegetal
  'fubá mimoso': 'Mercearia', // Farinha processada
  'pão para hot dog': 'Mercearia', // Pão processado
  'leite de castanhas': 'Mercearia', // Leite vegetal
  
  // Laticínios
  'burrata': 'Laticínios', // Queijo
  'mussarela de búfala': 'Laticínios', // Queijo
  'mussarela de bufala': 'Laticínios', // Queijo
  'mussarela de búfala (bocconcini)': 'Laticínios', // Queijo
  'mussarela de bufala (bocconcini)': 'Laticínios', // Queijo
  'requeijão cremoso': 'Laticínios', // Laticínio
  'requeijao cremoso': 'Laticínios', // Laticínio
  
  // Carnes e Peixes
  'lula': 'Carnes e Peixes', // Fruto do mar
  'mexilhão': 'Carnes e Peixes', // Fruto do mar
  'mexilhao': 'Carnes e Peixes', // Fruto do mar
  'presunto cozido': 'Carnes e Peixes', // Embutido
  'presunto parma': 'Carnes e Peixes', // Embutido
  'presunto parmesão': 'Carnes e Peixes', // Embutido
  'presunto vegetal': 'Mercearia', // Embutido vegetal
  'purê de batata instantâneo': 'Mercearia', // Produto processado
  'pure de batata instantaneo': 'Mercearia', // Produto processado (sem acentos)
  'batata em flocos': 'Mercearia', // Produto processado
  'biscoito maizena': 'Mercearia', // Biscoito
  'biscoito maisena': 'Mercearia', // Biscoito (variação de nome)
  'bacalhau dessalgado e desfiado': 'Carnes e Peixes', // Peixe
  'bacalhau dessalgado': 'Carnes e Peixes', // Peixe
  
  // Outras exceções importantes
  'ovos': 'Mercearia', // Não é laticínio
  'ovo': 'Mercearia', // Não é laticínio
  'ovo inteiro': 'Mercearia', // Não é laticínio
  'atum em lata': 'Mercearia', // Enlatado
  'atum fresco': 'Carnes e Peixes', // Atum fresco vai para peixaria
  'batata doce': 'Hortifruti', // Batata doce é hortifruti
  'tâmara': 'Hortifruti', // Tâmara é hortifruti
  'tamara': 'Hortifruti', // Tâmara é hortifruti
  'brócolis': 'Hortifruti', // Brócolis é hortifruti
  'brocolis': 'Hortifruti', // Brócolis é hortifruti
  'brócoli': 'Hortifruti', // Brócoli é hortifruti
  'brocoli': 'Hortifruti', // Brócoli é hortifruti
  'whey protein': 'Mercearia', // Suplemento, não laticínio
  'caldo de legumes': 'Mercearia', // Processado
  'caldo de legume': 'Mercearia', // Processado (singular)
  'molho de tomate': 'Mercearia', // Processado
  'suco de laranja': 'Mercearia', // Bebida
  'suco de limão': 'Mercearia', // Bebida
  'suco de limao': 'Mercearia', // Bebida
  'vinho branco': 'Mercearia', // Bebida
  'quinoa': 'Mercearia', // Grão seco
  'farinha de amêndoas': 'Mercearia', // Farinha processada
  'farinha de amendoas': 'Mercearia', // Farinha processada
  'farinha de amêndoa': 'Mercearia', // Farinha processada (singular)
  'farinha de amendoa': 'Mercearia', // Farinha processada (singular)
  'cúrcuma': 'Mercearia', // Especiaria
  'curcuma': 'Mercearia', // Especiaria
  'arroz': 'Mercearia', // Grão
  'arroz japonês': 'Mercearia', // Grão
  'arroz japones': 'Mercearia', // Grão
  'arroz japonê': 'Mercearia', // Grão (sem 's' final)
  'arroz japone': 'Mercearia', // Grão (sem 's' final)
  'farinha de trigo': 'Mercearia', // Farinha
  'açúcar': 'Mercearia', // Adoçante
  'acucar': 'Mercearia', // Adoçante
  'açúcar mascavo': 'Mercearia', // Adoçante
  'acucar mascavo': 'Mercearia', // Adoçante
  'sal': 'Mercearia', // Condimento
  'sal negro': 'Mercearia', // Condimento
  'pimenta do reino': 'Mercearia', // Condimento
  'aveia em flocos': 'Mercearia', // Grão processado
  'aveia em floco': 'Mercearia', // Grão processado (sem 's' final)
  'alga nori': 'Mercearia', // Alga processada
  'chocolate granulado': 'Mercearia', // Chocolate processado
  'mel': 'Mercearia', // Adoçante
  'ágar-ágar em pó': 'Mercearia', // Ingrediente processado
  'agar-agar em po': 'Mercearia', // Ingrediente processado (sem acentos)
  'cominho em pó': 'Mercearia', // Condimento
  'cominho em po': 'Mercearia', // Condimento (sem acentos)
  'geleia de frutas': 'Mercearia', // Conserva
  'maionese': 'Mercearia', // Molho processado
  'polvilho azedo': 'Mercearia', // Farinha processada
  'suco de uva integral': 'Mercearia', // Bebida
  'tofu firme': 'Mercearia', // Produto processado
  'páprica doce': 'Mercearia', // Especiaria
  'paprica doce': 'Mercearia', // Especiaria
}

// Palavras-chave para categorias específicas (prioridade média)
const CATEGORY_KEYWORDS: Record<string, string> = {
  // Laticínios (apenas produtos de origem animal)
  'queijo': 'Laticínios',
  'manteiga': 'Laticínios',
  'cream cheese': 'Laticínios',
  'ricota': 'Laticínios',
  'creme de leite': 'Laticínios',
  'iogurte': 'Laticínios',
  'leite condensado': 'Mercearia', // CORRIGIDO: movido para Mercearia
  'queijo parmesão ralado': 'Laticínios',
  'queijo parmesao ralado': 'Laticínios',
  'requeijão': 'Laticínios',
  'requeijao': 'Laticínios',
  'muçarela de búfala': 'Laticínios',
  'mucarela de bufala': 'Laticínios',
  'requeijão cremoso': 'Laticínios',
  'requeijao cremoso': 'Laticínios',
  
  // Carnes e Peixes
  'carne': 'Carnes e Peixes',
  'frango': 'Carnes e Peixes',
  'bife': 'Carnes e Peixes',
  'músculo bovino': 'Carnes e Peixes',
  'musculo bovino': 'Carnes e Peixes',
  'contrafilé': 'Carnes e Peixes',
  'contrafile': 'Carnes e Peixes',
  'contra-filé': 'Carnes e Peixes',
  'contra filé': 'Carnes e Peixes',
  'salmão': 'Carnes e Peixes',
  'salmao': 'Carnes e Peixes',
  'salmão fresco': 'Carnes e Peixes',
  'salmao fresco': 'Carnes e Peixes',
  'posta de peixe branco': 'Carnes e Peixes',
  'filé de peixe branco': 'Carnes e Peixes',
  'file de peixe branco': 'Carnes e Peixes',
  'tilápia': 'Carnes e Peixes',
  'tilapia': 'Carnes e Peixes',
  'camarão': 'Carnes e Peixes',
  'camarao': 'Carnes e Peixes',
  'linguiça': 'Carnes e Peixes',
  'linguica': 'Carnes e Peixes',
  'linguiça calabresa': 'Carnes e Peixes',
  'linguica calabresa': 'Carnes e Peixes',
  'linguiça vegetal': 'Mercearia',
  'linguica vegetal': 'Mercearia',
  'paleta de cordeiro': 'Carnes e Peixes',
  'lombo de porco': 'Carnes e Peixes',
  'suco de maracujá concentrado': 'Mercearia',
  'limão siciliano': 'Hortifruti',
  'cogumelo portobello': 'Hortifruti',
  'frango desfiado': 'Carnes e Peixes',
  'peito de frango desfiado': 'Carnes e Peixes',
  'frango inteiro': 'Carnes e Peixes',
  'carne bovina em cubos': 'Carnes e Peixes',
  'bacon': 'Carnes e Peixes',
  'costela': 'Carnes e Peixes',
  
  // Hortifruti
  'alface': 'Hortifruti',
  'rúcula': 'Hortifruti',
  'rucula': 'Hortifruti',
  'espinafre': 'Hortifruti',
  'cebola': 'Hortifruti',
  'alho': 'Hortifruti',
  'cenoura': 'Hortifruti',
  'abacate': 'Hortifruti',
  'manga': 'Hortifruti',
  'maracujá': 'Hortifruti', // Fruta
  'maracuja': 'Hortifruti', // Fruta
  'banana': 'Hortifruti',
  'banana-da-terra': 'Hortifruti', // Fruta
  'banana da terra': 'Hortifruti', // Fruta
  'maçã': 'Hortifruti',
  'maca': 'Hortifruti',
  'berinjela': 'Hortifruti',
  'abobrinha': 'Hortifruti',
  'abóbora': 'Hortifruti',
  'abobora': 'Hortifruti',
  'pepino': 'Hortifruti',
  'gengibre': 'Hortifruti',
  'pimentão': 'Hortifruti',
  'pimentao': 'Hortifruti',
  'pimentão amarelo': 'Hortifruti',
  'pimentão verde': 'Hortifruti',
  'pimentão vermelho': 'Hortifruti',
  'brócolis': 'Hortifruti',
  'brocolis': 'Hortifruti',
  'brócoli': 'Hortifruti',
  'brocoli': 'Hortifruti',
  'cogumelos': 'Hortifruti',
  'cogumelo': 'Hortifruti',
  'cogumelos variados': 'Hortifruti', // Confirmado: categoria Hortifruti
  'aspargos': 'Hortifruti',
  'edamame': 'Hortifruti',
  'tâmaras': 'Hortifruti',
  'tamaras': 'Hortifruti',
  'tâmara': 'Hortifruti',
  'tamara': 'Hortifruti',
  'frutas vermelhas': 'Hortifruti',
  'frutas frescas': 'Hortifruti', // Frutas frescas
  'costela de porco': 'Carnes e Peixes', // Carne de porco (normalizado)
  'costelinha de porco': 'Carnes e Peixes', // Carne de porco (variação)
  'castanha de caju': 'Hortifruti',
  'ervas frescas': 'Hortifruti',
  
  // NOVOS INGREDIENTES - REGRAS DE EXCEÇÃO
  // Carnes e Peixes
  'bife de contrafilé': 'Carnes e Peixes',
  'carne moída': 'Carnes e Peixes',
  'peito de frango cozido desfiado': 'Carnes e Peixes',
  
  // Laticínios
  'iogurte grego': 'Laticínios',
  'iogurte natural': 'Laticínios',
  
  // Mercearia
  'agar agar': 'Mercearia',
  'arroz arbóreo': 'Mercearia',
  'arroz branco': 'Mercearia',
  'arroz integral': 'Mercearia',
  'canela em pó': 'Mercearia',
  'chia': 'Mercearia',
  'chocolate 70%': 'Mercearia',
  'curry em pó': 'Mercearia',
  'farinha de rosca': 'Mercearia',
  'feijão cozido': 'Mercearia',
  'feijão preto cozido': 'Mercearia',
  'feijão preto': 'Mercearia',
  'gelatina incolor': 'Mercearia',
  'macarrão para yakisoba': 'Mercearia',
  'melado': 'Mercearia',
  'molho de ostras': 'Mercearia',
  'molho ponzu': 'Mercearia',
  'molho shoyu': 'Mercearia',
  'sal grosso': 'Mercearia',
  'suco de uva': 'Mercearia',
  'tortilhas': 'Mercearia',
  'vinagre balsâmico': 'Mercearia',
  'wrap integral': 'Mercearia',
  'água': 'Mercearia',
  'óleo de coco': 'Mercearia',
  'óleo': 'Mercearia',
  
  // Hortifruti
  'manga congelada': 'Hortifruti',
  
  // Ingrediente específico - Suco de 4 Laranjas pera (aprox. 350ml)
  'suco de 4 laranjas pera (aprox. 350ml)': 'Mercearia',
}

/**
 * Sistema de Categorização Inteligente
 * Aplica regras em ordem de prioridade para determinar a categoria correta
 */
export function getIngredientCategory(ingredientName: string): string {
  if (!ingredientName) return 'Mercearia'
  
  const normalizedName = ingredientName.toLowerCase().trim()
  
  // ETAPA 1: Verificar regras de exceção (prioridade máxima)
  for (const [pattern, category] of Object.entries(EXCEPTION_RULES)) {
    // CORREÇÃO: A comparação deve ser mais específica para evitar falsos positivos
    if (normalizedName === pattern || normalizedName.startsWith(pattern + ' ') || normalizedName.endsWith(' ' + pattern)) {
      return category
    }
  }
  
  // ETAPA 2: Verificar palavras-chave específicas
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (normalizedName.includes(keyword)) {
      return category
    }
  }
  
  // ETAPA 3: Verificar se contém "leite" (regra especial para laticínios)
  if (normalizedName.includes('leite')) {
    // Se chegou até aqui e contém "leite", é leite animal (laticínio)
    // porque todos os leites vegetais já foram capturados nas exceções
    return 'Laticínios'
  }
  
  // ETAPA 4: Fallback para Mercearia (padrão)
  return 'Mercearia'
}
