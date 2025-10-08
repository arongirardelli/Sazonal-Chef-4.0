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
      if (ing.name.toLowerCase().includes('limão') && !ing.household_display && ing.quantity === 1) {
        return { ...ing, household_display: 'aprox. 90g' };
      }
      return ing;
    });
    
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ structured_ingredients: updated })
      .eq('id', data.id);
    
    if (updateError) {
      console.log('❌ Erro ao atualizar:', title);
    } else {
      console.log('✅', title);
    }
  }
}

fix().catch(console.error);

