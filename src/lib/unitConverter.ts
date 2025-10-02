import { findIngredientData, getIngredientCategory } from './ingredientData'

class UnitConverter {
  private normalizeUnit(u: string): string {
    const s = (u || '').toLowerCase().trim()
    if (s === '' || s === ' ') return '' // Unidade vazia
    if (s.includes('xícara') || s.includes('xicara') || s.includes('xicaras') || s.includes('xícaras')) return 'xícara'
    if (/colher(?:es)? de sopa/.test(s) || s === 'c.s.' || s.includes('c. sopa') || s === 'cs' || s === 'c.s') return 'colher de sopa'
    if (/colher(?:es)? de ch[aá]/.test(s) || s === 'c.c.' || s.includes('c. chá') || s.includes('c. cha')) return 'colher de chá'
    if (s === 'litros' || s === 'litro') return 'l'
    if (s === 'mililitros') return 'ml'
    if (s === 'gramas') return 'g'
    if (s === 'unidade' || s === 'unidades') return 'unidades'
    if (s === 'raminhos' || s === 'raminho') return 'ramos'
    if (s === 'pequena' || s === 'pequeno') return 'pequena'
    if (s === 'média' || s === 'médio') return 'média'
    if (s === 'madura' || s === 'maduras') return 'madura'
    return s.replace(/s$/, '')
  }

  private SOLID_PER_CUP: Record<string, number> = {
    'farinha de trigo': 120,
    'farinha de amêndoas': 96,
    'açúcar': 180, // ½ xícara = 90g, então 1 xícara = 180g
    'cacau em pó': 90, // ½ xícara = 45g, então 1 xícara = 90g
    'quinoa': 170,
    'arroz': 200,
    'aveia em flocos': 80, // 1 xícara = 80g
    'aveia': 80, // 1 xícara = 80g
    'espinafre': 30,
    'rúcula': 20,
    'morangos': 150,
    'morango': 150, // 1 xícara = 150g (conforme receita)
  }

  // Gramas por lata para ingredientes específicos
  private GRAMS_PER_CAN: Record<string, number> = {
    'leite condensado': 395, // 1 lata = 395g
  }

  private isLiquid(name: string): boolean {
    const n = (name || '').toLowerCase()
    return ['água','agua','leite','óleo','oleo','azeite','vinagre','molho','caldo','creme','xarope','suco','vinho','extrato','baunilha']
      .some(k => n.includes(k))
  }

  // Gramas por colher de sopa para ingredientes específicos
  private TBSP_PER_INGREDIENT_GRAMS: Record<string, number> = {
    'tahine': 15,
    'tahini': 15,
    'goma de tapioca': 15, // 4 colheres = 60g, então 15g por colher
    'queijo parmesão': 6.67, // 3 colheres = 20g, então ~6.67g por colher
    'parmesão': 6.67, // 3 colheres = 20g, então ~6.67g por colher
    'açúcar': 12, // 1 colher = 12g
    'aveia em flocos': 8, // 1 colher = 8g (mais preciso)
    'aveia': 8, // 1 colher = 8g
    'curry em pó': 8, // 2 colheres = 16g, então 8g por colher
    'curry': 8, // 2 colheres = 16g, então 8g por colher
    'farinha de trigo': 8, // 1 colher = 8g
    'farinha de arroz': 8, // 1 colher = 8g (similar à farinha de trigo)
    'fermento em pó': 8, // 1 colher = 8g (fermento químico)
    'fermento': 8, // 1 colher = 8g (fermento químico)
    'manteiga': 12, // 1 colher = 12g
    'açafrão da terra': 12, // 1 colher = 12g
    'acafrao da terra': 12, // 1 colher = 12g
    'açafrão': 12, // 1 colher = 12g
    'acafrao': 12, // 1 colher = 12g
  }

  /**
   * NOVA FUNÇÃO DE CATEGORIZAÇÃO - Usa o Dicionário Mestre
   * Elimina ambiguidade e resolve erros de uma vez por todas
   */
  getCategory(name: string): string {
    return getIngredientCategory(name)
  }

  /**
   * Converte um ingrediente para sua unidade base (gramas ou ml)
   * Recebe um ingrediente com nome, quantidade e unidade
   */
  convertToBaseUnit(ingredient: { name: string; quantity: number; unit: string }): { quantity: number; unit: 'g'|'ml'|'unidades'; countLabel?: string } {
    const { name, quantity, unit } = ingredient
    return this.convertToStandard(name, quantity, unit)
  }

  /**
   * NOVA FUNÇÃO formatForShoppingList - Usa o Dicionário Mestre
   * Formata um ingrediente para a lista de compras com lógica inteligente
   */
  formatForShoppingList(ingredientName: string, totalGramsOrMl: number, unit: 'g'|'ml'): string {
    const name = ingredientName.toLowerCase()
    
    // Busca o ingrediente no Dicionário Mestre
    const ingredientData = findIngredientData(name)
    
    if (ingredientData) {
      const { primaryUnit, averageWeightGrams } = ingredientData
      
      // Se a primaryUnit for 'g' ou 'ml': formata o total diretamente
      if (primaryUnit === 'g' || primaryUnit === 'ml') {
        // REMOVIDO: conversão para kg/L - manter sempre em g/ml
        return `${this.capitalizeFirst(ingredientName)} – ${totalGramsOrMl} ${unit}`
      }
      
      // Se a primaryUnit for 'unidade', 'maço' ou 'talo' e tem peso médio
      if ((primaryUnit === 'unidade' || primaryUnit === 'maço' || primaryUnit === 'talo') && averageWeightGrams) {
        const units = totalGramsOrMl / averageWeightGrams
        
        // Caso especial para aipo: usar fracionamento de 0.5 em 0.5 talos
        if (ingredientName.toLowerCase() === 'aipo') {
          // Arredonda para o múltiplo de 0.5 mais próximo
          const roundedToHalf = Math.round(units * 2) / 2;
          
          // Se for menor que 0.5, mostra apenas o peso
          if (roundedToHalf < 0.5) {
            return `${this.capitalizeFirst(ingredientName)} – ${totalGramsOrMl} ${unit}`;
          }
          
          // Formata o texto com frações - singular para 0.5 e 1, plural para o resto
          const unitText = (roundedToHalf === 1 || roundedToHalf === 0.5) ? primaryUnit : `${primaryUnit}s`;
          return `${this.capitalizeFirst(ingredientName)} – ${totalGramsOrMl} ${unit} (aprox. ${roundedToHalf} ${unitText})`;
        }
        
        // Para outros ingredientes, mantém a lógica original
        // NOVA REGRA: Se a quantidade calculada for menor que 1, mostra apenas o peso
        if (units < 1) {
          return `${this.capitalizeFirst(ingredientName)} – ${totalGramsOrMl} ${unit}`
        }
        
        // Se a quantidade for maior ou igual a 1, mostra o peso primeiro e depois a quantidade aproximada
        const roundedUnits = Math.round(units)
        return `${this.capitalizeFirst(ingredientName)} – ${totalGramsOrMl} ${unit} (aprox. ${roundedUnits} ${primaryUnit}${roundedUnits > 1 ? 's' : ''})`
      }
    }
    
    // Fallback para ingredientes não encontrados no dicionário
    // REMOVIDO: conversão para kg/L - manter sempre em g/ml
    return `${this.capitalizeFirst(ingredientName)} – ${totalGramsOrMl} ${unit}`
  }


  /**
   * Capitaliza a primeira letra de uma string
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // Converte para base g/ml/unidades
  convertToStandard(
    name: string,
    quantity: number,
    unit: string
  ): { quantity: number; unit: 'g'|'ml'|'unidades'; countLabel?: string; sourceUnit?: string; sourceQtyOriginal?: number } {
    const u = this.normalizeUnit(unit)
    const n = (name || '').toLowerCase()

    // padrões já base
    if (u === 'kg') return { quantity: quantity * 1000, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    if (u === 'l')  return { quantity: quantity * 1000, unit: 'ml', sourceUnit: u, sourceQtyOriginal: quantity }
    if (u === 'g' || u === 'ml') return { quantity, unit: u, sourceUnit: u, sourceQtyOriginal: quantity }

    // Conversões específicas para unidades não-padrão (DEVE VIR ANTES das conversões gerais)
    if (u === 'pote' && n.includes('iogurte')) {
      return { quantity: quantity * 150, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    if (u === 'scoop' && n.includes('whey')) {
      return { quantity: quantity * 30, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    if (u === 'fatia' && n.includes('queijo')) {
      return { quantity: quantity * 20, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    if ((u === 'filé' || u === 'filés') && n.includes('salmão')) {
      return { quantity: quantity * 100, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    if ((u === 'filé' || u === 'filés') && (n.includes('tilápia') || n.includes('tilapia'))) {
      return { quantity: quantity, unit: 'unidades', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    if (u === 'lata' && n.includes('atum')) {
      return { quantity: quantity * 120, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    
    // Conversões específicas para tamanhos de ingredientes
    if (u === 'pequena' || u === 'pequeno') {
      if (n.includes('cebola')) {
        return { quantity: quantity * 100, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
      if (n.includes('abobrinha')) {
        return { quantity: quantity * 200, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
    }
    if (u === 'média' || u === 'médio') {
      if (n.includes('abobrinha')) {
        return { quantity: quantity * 200, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
      if (n.includes('cebola')) {
        return { quantity: quantity * 100, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
    }
    if (u === 'madura' || u === 'maduras') {
      if (n.includes('banana')) {
        return { quantity: quantity * 120, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
    }
    
    // Conversões para unidades sem especificação (apenas quantidade)
    if (u === '' || u === ' ') {
      if (n.includes('cebola')) {
        return { quantity: quantity * 100, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
      if (n.includes('banana')) {
        return { quantity: quantity * 120, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
      if (n.includes('ovo inteiro')) {
        return { quantity: quantity * 50, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
    }
    
    // Conversões para unidades que não foram normalizadas (fallback)
    if (u === 'l' && n.includes('caldo')) {
      return { quantity: quantity * 1000, unit: 'ml', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    // Conversão de lata para gramas
    if (u === 'lata' || u === 'latas') {
      const key = Object.keys(this.GRAMS_PER_CAN).find(k => n.includes(k))
      if (key) {
        return { quantity: quantity * this.GRAMS_PER_CAN[key], unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
    }
    // CORREÇÃO CRÍTICA: Conversões específicas para queijo parmesão ralado ANTES das conversões gerais
    if (u === 'colher de sopa' && n.includes('queijo parmesão ralado')) {
      return { quantity: quantity * 6.67, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    if (u === 'g' && n.includes('queijo parmesão ralado')) {
      return { quantity: quantity, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }
    if (u === 'xícara' && n.includes('queijo parmesão ralado')) {
      return { quantity: quantity * 80, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
    }

    // xícara/colheres (conversões gerais)
    if (u === 'xícara' || u === 'colher de sopa' || u === 'colher de chá') {
      if (this.isLiquid(n)) {
        const ml = u === 'xícara' ? 240 : (u === 'colher de sopa' ? 15 : 5)
        return { quantity: quantity * ml, unit: 'ml', sourceUnit: u, sourceQtyOriginal: quantity }
      } else {
        if (u === 'xícara') {
          const key = Object.keys(this.SOLID_PER_CUP).find(k => n.includes(k))
          const grams = key ? this.SOLID_PER_CUP[key] * quantity : Math.round(quantity * 240 * 0.8)
          return { quantity: grams, unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
        }
        if (u === 'colher de sopa') {
          const mapKey = Object.keys(this.TBSP_PER_INGREDIENT_GRAMS).find(k => n.includes(k))
          const perTbsp = mapKey ? this.TBSP_PER_INGREDIENT_GRAMS[mapKey] : Math.round(15 * 0.8)
          return { quantity: Math.round(quantity * perTbsp), unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
        }
        if (u === 'colher de chá')   return { quantity: Math.round(quantity * 5 * 0.8), unit: 'g', sourceUnit: u, sourceQtyOriginal: quantity }
      }
    }
    
    // fallback contável - MAS verifica se é líquido primeiro
    if (u === 'unidade' || u === 'unidades' || ['dente','posta','fatia','ramo','ramos','maço','filé','lata','envelope','pacote','file','files','filés','fatias','maços','postas','latas','envelopes','pacotes','dentes','peito','peitos'].includes(u)) {
      // EXCEÇÃO: Fava de baunilha não é líquida, é uma unidade física
      if (n.includes('fava de baunilha') || n.includes('fava baunilha')) {
        return { quantity, unit: 'unidades', sourceUnit: u, sourceQtyOriginal: quantity }
      }
      
      // NOVA LÓGICA: Se for líquido, converte para ml mesmo sendo "unidades"
      if (this.isLiquid(n)) {
        // Para líquidos em "unidades", assume que cada unidade é aproximadamente 140ml (tamanho padrão de lata)
        const mlPerUnit = 140
        return { quantity: quantity * mlPerUnit, unit: 'ml', sourceUnit: u, sourceQtyOriginal: quantity }
      }
      
      // Se não for líquido, mantém como unidades contáveis
      const singularMap: Record<string, string> = {
        'unidades': 'unidade',
        'filés': 'filé',
        'fatias': 'fatia',
        'maços': 'maço',
        'postas': 'posta',
        'latas': 'lata',
        'envelopes': 'envelope',
        'pacotes': 'pacote',
        'dentes': 'dente',
        'peitos': 'peito',
        'ramos': 'ramo',
      }
      const labelRaw = (u === 'file' || u === 'files') ? 'filé' : u
      let label: string | undefined = singularMap[labelRaw] || labelRaw
      if (label === 'unidade') label = undefined
      return { quantity, unit: 'unidades', countLabel: label, sourceUnit: u, sourceQtyOriginal: quantity }
    }

    return { quantity, unit: 'unidades', sourceUnit: u, sourceQtyOriginal: quantity }
  }

  formatForDisplay(quantity: number, unit: 'g'|'ml'|'unidades'): { quantity: number; unit: string } {
    // REMOVIDO: conversão para kg/L - manter sempre em g/ml
    if (unit === 'unidades') return { quantity, unit: quantity > 1 ? 'unidades' : 'unidade' }
    return { quantity, unit }
  }
}

export const unitConverter = new UnitConverter()