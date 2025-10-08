import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fix() {
  const recipes = [
    'Salada Grega Completa', 
    'Arroz de Forno Cremoso com Frango e "Maionese" de Abacate', 
    'Guacamole com Chips de Batata-Doce Assada'
  ];
  
  for (const title of recipes) {
    const { data, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('title', title)
      .single();
    
    if (fetchError || !data) {
      console.log('❌ Erro ao buscar:', title);
      continue;
    }
    
    // Reconstruir o array adicionando household_display ao Limão
    const ingredients = data.structured_ingredients.map((ing, idx) => {
      if (ing.name === 'Limão' && ing.quantity === 1) {
        console.log(`   Adicionando household_display ao Limão em ${title}`);
        return { ...ing, household_display: 'aprox. 90g' };
      }
      return ing;
    });
    
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ structured_ingredients: ingredients })
      .eq('id', data.id);
    
    if (updateError) {
      console.log('❌', title, updateError.message);
    } else {
      console.log('✅', title);
    }
  }
}

fix().catch(console.error);

