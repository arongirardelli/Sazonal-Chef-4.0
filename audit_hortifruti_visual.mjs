import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Pesos padrão dos ingredientes (sincronizado com ingredientData.ts)
const STANDARD_WEIGHTS = {
  'cebola': 150,
  'cebola roxa': 150,
  'maçã': 150,
  'maca': 150,
  'pepino': 250,
  'cenoura': 120,
  'batata': 150,
  'batata doce': 200,
  'tomate': 120,
  'abacate': 350,
  'avocado': 200,
  'manga': 250,
  'banana': 120,
  'banana-da-terra': 250,
  'banana da terra': 250,
  'berinjela': 250,
  'abobrinha': 200,
  'abóbora': 1000,
  'abobora': 1000,
  'gengibre': 50,
  'pimentão': 200,
  'pimentao': 200,
  'pimentão amarelo': 200,
  'pimentao amarelo': 200,
  'pimentão verde': 200,
  'pimentao verde': 200,
  'pimentão vermelho': 200,
  'pimentao vermelho': 200,
  'limão': 90,
  'limao': 90,
  'limão siciliano': 120,
  'limao siciliano': 120
};

// Ingredientes que devem ter referência visual na lista
const VISUAL_REFERENCE_INGREDIENTS = [
  'abacate', 'avocado', 'abóbora', 'abobora', 'abobrinha', 'banana', 'batata', 'batata doce',
  'berinjela', 'cebola', 'cebola roxa', 'cenoura', 'gengibre', 'limão', 'limao',
  'maçã', 'maca', 'manga', 'pepino', 'pimentão', 'pimentao', 'tomate'
];

function normalizeIngredientName(name) {
  const lower = name.toLowerCase().trim();
  
  // Mantém avocado separado de abacate
  if (lower.includes('avocado')) return 'avocado';
  
  // Normalizações específicas
  if (lower.includes('pimentão vermelho') || lower.includes('pimentao vermelho')) return 'pimentão vermelho';
  if (lower.includes('pimentão amarelo') || lower.includes('pimentao amarelo')) return 'pimentão amarelo';
  if (lower.includes('pimentão verde') || lower.includes('pimentao verde')) return 'pimentão verde';
  if (lower.includes('pimentão') || lower.includes('pimentao')) return 'pimentão';
  if (lower.includes('batata doce')) return 'batata doce';
  if (lower.includes('cebola roxa')) return 'cebola roxa';
  if (lower.includes('banana-da-terra') || lower.includes('banana da terra')) return 'banana da terra';
  
  // Remove qualificadores comuns
  const cleaned = lower
    .replace(/\s+(picad[ao]s?|ralad[ao]s?|cortad[ao]s?|em\s+cubos|em\s+rodelas|madur[ao]s?|verde|pequen[ao]s?|médi[ao]s?|grande)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Retorna a chave base
  for (const key of Object.keys(STANDARD_WEIGHTS)) {
    if (cleaned.includes(key)) return key;
  }
  
  return cleaned;
}

function extractGramsFromDisplay(display) {
  if (!display) return null;
  const match = display.match(/(\d+)\s*g/i);
  return match ? parseInt(match[1]) : null;
}

function extractUnitsFromDisplay(display) {
  if (!display) return null;
  const match = display.match(/(\d+(?:\.\d+)?)\s*(unidade|unidades|unidade grande|unidade média|unidade pequena|avocados?|maduros?)/i);
  return match ? parseFloat(match[1]) : null;
}

function calculateExpectedGrams(ingredient) {
  const name = normalizeIngredientName(ingredient.name);
  const standardWeight = STANDARD_WEIGHTS[name];
  
  if (!standardWeight) return null;
  
  const unit = ingredient.unit?.toLowerCase() || '';
  
  // Se já está em gramas
  if (unit === 'g' || unit === 'gramas') {
    return ingredient.quantity;
  }
  
  // Se é em unidades ou similar
  if (unit === 'unidade' || unit === 'unidades' || unit === '' || 
      unit === 'maduro' || unit === 'maduros' || 
      unit === 'pequeno' || unit === 'médio' || unit === 'grande') {
    return ingredient.quantity * standardWeight;
  }
  
  // Casos especiais
  if (ingredient.household_display) {
    const gramsFromDisplay = extractGramsFromDisplay(ingredient.household_display);
    if (gramsFromDisplay) return gramsFromDisplay;
  }
  
  return null;
}

async function auditRecipes() {
  console.log('🔍 AUDITORIA DE INGREDIENTES HORTIFRUTI COM REFERÊNCIA VISUAL\n');
  console.log('=' .repeat(80));
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
    .not('structured_ingredients', 'is', null);
  
  if (error) {
    console.error('Erro ao buscar receitas:', error);
    return;
  }
  
  const issues = [];
  const summary = {
    totalRecipes: recipes.length,
    totalIngredients: 0,
    withVisualReference: 0,
    correctDisplays: 0,
    incorrectDisplays: 0,
    missingDisplays: 0
  };
  
  for (const recipe of recipes) {
    if (!recipe.structured_ingredients) continue;
    
    for (const ing of recipe.structured_ingredients) {
      const normalized = normalizeIngredientName(ing.name);
      
      // Verifica se é um ingrediente com referência visual
      const needsVisualRef = VISUAL_REFERENCE_INGREDIENTS.some(v => 
        normalized.includes(v) || v.includes(normalized)
      );
      
      if (!needsVisualRef) continue;
      
      summary.totalIngredients++;
      summary.withVisualReference++;
      
      const expectedGrams = calculateExpectedGrams(ing);
      const displayGrams = extractGramsFromDisplay(ing.household_display);
      
      if (!ing.household_display) {
        summary.missingDisplays++;
        issues.push({
          type: 'MISSING_DISPLAY',
          recipe: recipe.title,
          recipeId: recipe.id,
          ingredient: ing.name,
          normalized,
          unit: ing.unit,
          quantity: ing.quantity,
          expectedGrams,
          fix: `household_display deveria ser: "aprox. ${expectedGrams}g"`
        });
      } else if (displayGrams !== expectedGrams && expectedGrams !== null) {
        summary.incorrectDisplays++;
        issues.push({
          type: 'INCORRECT_DISPLAY',
          recipe: recipe.title,
          recipeId: recipe.id,
          ingredient: ing.name,
          normalized,
          currentDisplay: ing.household_display,
          displayGrams,
          expectedGrams,
          difference: Math.abs(displayGrams - expectedGrams),
          fix: `household_display deveria ser: "aprox. ${expectedGrams}g"`
        });
      } else {
        summary.correctDisplays++;
      }
    }
  }
  
  // Relatório
  console.log('\n📊 RESUMO DA AUDITORIA:');
  console.log('─'.repeat(80));
  console.log(`Total de receitas analisadas: ${summary.totalRecipes}`);
  console.log(`Total de ingredientes analisados: ${summary.totalIngredients}`);
  console.log(`Ingredientes com referência visual: ${summary.withVisualReference}`);
  console.log(`✅ Displays corretos: ${summary.correctDisplays}`);
  console.log(`❌ Displays incorretos: ${summary.incorrectDisplays}`);
  console.log(`⚠️  Displays faltando: ${summary.missingDisplays}`);
  
  if (issues.length > 0) {
    console.log('\n\n🔧 PROBLEMAS ENCONTRADOS:');
    console.log('─'.repeat(80));
    
    // Agrupa por tipo
    const byType = {
      MISSING_DISPLAY: issues.filter(i => i.type === 'MISSING_DISPLAY'),
      INCORRECT_DISPLAY: issues.filter(i => i.type === 'INCORRECT_DISPLAY')
    };
    
    if (byType.MISSING_DISPLAY.length > 0) {
      console.log('\n⚠️  HOUSEHOLD_DISPLAY FALTANDO:');
      byType.MISSING_DISPLAY.forEach(issue => {
        console.log(`\n  📝 Receita: ${issue.recipe}`);
        console.log(`     ID: ${issue.recipeId}`);
        console.log(`     Ingrediente: ${issue.ingredient} (${issue.normalized})`);
        console.log(`     Quantidade: ${issue.quantity} ${issue.unit || 'unidade'}`);
        console.log(`     💡 ${issue.fix}`);
      });
    }
    
    if (byType.INCORRECT_DISPLAY.length > 0) {
      console.log('\n\n❌ HOUSEHOLD_DISPLAY INCORRETO:');
      byType.INCORRECT_DISPLAY.forEach(issue => {
        console.log(`\n  📝 Receita: ${issue.recipe}`);
        console.log(`     ID: ${issue.recipeId}`);
        console.log(`     Ingrediente: ${issue.ingredient} (${issue.normalized})`);
        console.log(`     Atual: ${issue.currentDisplay} (${issue.displayGrams}g)`);
        console.log(`     Esperado: ${issue.expectedGrams}g`);
        console.log(`     Diferença: ${issue.difference}g`);
        console.log(`     💡 ${issue.fix}`);
      });
    }
    
    // Salva issues em JSON para correção
    const fs = await import('fs');
    const issuesFile = './hortifruti_issues.json';
    fs.writeFileSync(issuesFile, JSON.stringify(issues, null, 2));
    console.log(`\n\n💾 Problemas salvos em: ${issuesFile}`);
  } else {
    console.log('\n\n✅ Nenhum problema encontrado! Todos os household_display estão corretos.');
  }
  
  console.log('\n' + '='.repeat(80));
}

auditRecipes().catch(console.error);

