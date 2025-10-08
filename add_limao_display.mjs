import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const recipes = [
  'Salada Grega Completa',
  'Arroz de Forno Cremoso com Frango e "Maionese" de Abacate',
  'Guacamole com Chips de Batata-Doce Assada'
];

async function fix() {
  for (const title of recipes) {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, structured_ingredients')
      .eq('title', title)
      .single();
    
    if (error || !data) {
      console.log('❌ Erro ao buscar:', title);
      continue;
    }
    
    const updated = data.structured_ingredients.map(ing => {
      const nameLower = ing.name.toLowerCase();
      if ((nameLower.includes('limão') || nameLower.includes('limao')) && ing.quantity === 1 && ing.unit === 'unidade') {
        console.log(`   Atualizando: ${ing.name} em ${title}`);
        return { ...ing, household_display: 'aprox. 90g' };
      }
      return ing;
    });
    
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ structured_ingredients: updated })
      .eq('id', data.id);
    
    if (updateError) {
      console.log('❌ Erro ao atualizar:', title, updateError.message);
    } else {
      console.log('✅', title);
    }
  }
}

fix().catch(console.error);

