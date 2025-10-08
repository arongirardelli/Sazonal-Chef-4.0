import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function auditCarnesPeixes() {
  console.log('🔍 AUDITORIA - CARNES E PEIXES\n');
  console.log('=' .repeat(80));
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
    .not('structured_ingredients', 'is', null);
  
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  const carnesPeixesMap = new Map();
  
  for (const recipe of recipes) {
    for (const ing of recipe.structured_ingredients) {
      if (ing.category === 'Carnes e Peixes') {
        const key = ing.name.toLowerCase().trim();
        
        if (!carnesPeixesMap.has(key)) {
          carnesPeixesMap.set(key, {
            name: ing.name,
            occurrences: [],
            units: new Set(),
            hasGrams: false,
            hasUnits: false
          });
        }
        
        const data = carnesPeixesMap.get(key);
        data.occurrences.push({
          recipe: recipe.title,
          quantity: ing.quantity,
          unit: ing.unit || '',
          household_display: ing.household_display || null
        });
        data.units.add(ing.unit || '');
        
        if (ing.unit === 'g' || ing.unit === 'gramas') {
          data.hasGrams = true;
        }
        if (ing.unit === 'unidade' || ing.unit === 'unidades' || ing.unit === 'filé' || ing.unit === 'filés') {
          data.hasUnits = true;
        }
      }
    }
  }
  
  console.log(`\n📊 Total de ingredientes únicos: ${carnesPeixesMap.size}\n`);
  
  const sortedIngredients = Array.from(carnesPeixesMap.entries())
    .sort((a, b) => b[1].occurrences.length - a[1].occurrences.length);
  
  console.log('📋 TOP 15 INGREDIENTES POR FREQUÊNCIA:\n');
  
  for (const [key, data] of sortedIngredients.slice(0, 15)) {
    console.log(`\n${data.name} (${data.occurrences.length} receitas)`);
    console.log(`   Unidades usadas: ${Array.from(data.units).join(', ')}`);
    
    // Verificar consistência
    const needsLogic = data.hasGrams && data.hasUnits;
    if (needsLogic) {
      console.log(`   ⚠️  USA GRAMAS E UNIDADES - precisa lógica específica`);
    }
    
    // Verificar household_display
    const withDisplay = data.occurrences.filter(o => o.household_display).length;
    const withoutDisplay = data.occurrences.length - withDisplay;
    
    if (withoutDisplay > 0) {
      console.log(`   ❌ ${withoutDisplay}/${data.occurrences.length} sem household_display`);
    } else {
      console.log(`   ✅ Todos com household_display`);
    }
    
    // Mostrar exemplos
    console.log(`   Exemplos:`);
    for (const occ of data.occurrences.slice(0, 3)) {
      console.log(`     • ${occ.quantity} ${occ.unit} - ${occ.household_display || '(sem display)'}`);
    }
  }
  
  console.log('\n\n🎯 INGREDIENTES QUE PRECISAM DE LÓGICA ESPECÍFICA:\n');
  
  for (const [key, data] of sortedIngredients) {
    if (data.hasGrams && data.hasUnits) {
      console.log(`   • ${data.name} - Unidades: ${Array.from(data.units).join(', ')}`);
    }
  }
  
  console.log('\n' + '=' .repeat(80));
}

auditCarnesPeixes().catch(console.error);

