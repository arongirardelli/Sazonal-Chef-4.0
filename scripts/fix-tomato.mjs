
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure .env file is set up.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USER_ID = '00c2ced3-4241-4f07-a449-7adc71ab447e';
const MENU_ID = '69f57b8c-b284-4259-a39a-c98453f542e0';
const INGREDIENT_TO_FIX = 'Molho de tomate';

async function fixTomatoData() {
  console.log('Fetching menu data...');
  const { data: menuData, error: fetchError } = await supabase
    .from('user_menus')
    .select('shopping_source')
    .eq('id', MENU_ID)
    .eq('user_id', USER_ID)
    .single();

  if (fetchError || !menuData) {
    console.error('Failed to fetch menu data:', fetchError);
    return;
  }

  const originalIngredients = menuData.shopping_source || [];
  console.log(`Found ${originalIngredients.length} ingredients originally.`);

  // 1. Limpar dados
  const cleanedIngredients = originalIngredients.filter(ing => ing.name !== INGREDIENT_TO_FIX);
  console.log(`Removed ${originalIngredients.length - cleanedIngredients.length} instances of '${INGREDIENT_TO_FIX}'.`);

  // 2. Reinserir dados de forma correta
  const newTomatoEntries = [
    { name: "Molho de tomate", unit: "ml", category: "Mercearia", quantity: 200 },
    { name: "Molho de tomate", unit: "ml", category: "Mercearia", quantity: 200 },
    { name: "Molho de tomate", unit: "ml", category: "Mercearia", quantity: 400 },
    { name: "Molho de tomate", unit: "ml", category: "Mercearia", quantity: 200 }
  ];

  const finalIngredients = [...cleanedIngredients, ...newTomatoEntries];
  console.log(`Re-inserted ${newTomatoEntries.length} clean entries. Final ingredient count: ${finalIngredients.length}`);

  // 3. Atualizar no banco de dados
  console.log('Updating database with cleaned and re-inserted data...');
  const { error: updateError } = await supabase
    .from('user_menus')
    .update({ shopping_source: finalIngredients, updated_at: new Date() })
    .eq('id', MENU_ID);

  if (updateError) {
    console.error('Failed to update menu:', updateError);
  } else {
    console.log('Successfully fixed tomato data in the database!');
  }
}

fixTomatoData();
