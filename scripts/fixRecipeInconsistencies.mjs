import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw'

const supabase = createClient(url, serviceRoleKey)

// Correções para as receitas com inconsistências
const recipeFixes = [
  {
    title: 'Cheesecake de Frutas Vermelhas',
    structured_ingredients: [
      { name: 'Biscoito maizena', quantity: 200, unit: 'g' },
      { name: 'Manteiga', quantity: 80, unit: 'g' },
      { name: 'Cream cheese', quantity: 600, unit: 'g' },
      { name: 'Açúcar', quantity: 150, unit: 'g' },
      { name: 'Ovos', quantity: 3, unit: 'unidades' },
      { name: 'Frutas vermelhas', quantity: 300, unit: 'g' }
    ]
  },
  {
    title: 'Curry de Grão-de-Bico',
    structured_ingredients: [
      { name: 'Grão-de-bico', quantity: 2, unit: 'xícaras' },
      { name: 'Cebola', quantity: 1, unit: 'unidade' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Óleo de coco', quantity: 30, unit: 'ml' },
      { name: 'Leite de coco', quantity: 400, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Risotto de Cogumelos',
    structured_ingredients: [
      { name: 'Arroz arbóreo', quantity: 300, unit: 'g' },
      { name: 'Cogumelos variados', quantity: 400, unit: 'g' },
      { name: 'Cebola', quantity: 1, unit: 'unidade' },
      { name: 'Manteiga', quantity: 60, unit: 'g' },
      { name: 'Caldo de legumes', quantity: 1000, unit: 'ml' },
      { name: 'Queijo parmesão', quantity: 100, unit: 'g' },
      { name: 'Vinho branco', quantity: 120, unit: 'ml' }
    ]
  },
  {
    title: 'Omelete de Queijo e Ervas',
    structured_ingredients: [
      { name: 'Ovos', quantity: 3, unit: 'unidades' },
      { name: 'Queijo gruyère', quantity: 50, unit: 'g' },
      { name: 'Cebolinha', quantity: 1, unit: 'maço' },
      { name: 'Manteiga', quantity: 20, unit: 'g' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.25, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Wrap de Hummus e Vegetais',
    structured_ingredients: [
      { name: 'Tortilhas', quantity: 2, unit: 'unidades' },
      { name: 'Grão-de-bico', quantity: 1, unit: 'xícara' },
      { name: 'Cenoura', quantity: 1, unit: 'unidade' },
      { name: 'Tahine', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Suco de limão', quantity: 30, unit: 'ml' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Pepino', quantity: 0.5, unit: 'unidade' },
      { name: 'Alface', quantity: 4, unit: 'folhas' }
    ]
  },
  {
    title: 'Poke Bowl de Salmão',
    structured_ingredients: [
      { name: 'Salmão fresco', quantity: 300, unit: 'g' },
      { name: 'Arroz japonês', quantity: 1, unit: 'xícara' },
      { name: 'Abacate', quantity: 1, unit: 'unidade' },
      { name: 'Edamame', quantity: 100, unit: 'g' },
      { name: 'Molho ponzu', quantity: 60, unit: 'ml' },
      { name: 'Gergelim', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Alga nori', quantity: 2, unit: 'folhas' }
    ]
  },
  {
    title: 'Frango Assado com Batata Doce',
    structured_ingredients: [
      { name: 'Frango inteiro', quantity: 1.5, unit: 'kg' },
      { name: 'Batata doce', quantity: 500, unit: 'g' },
      { name: 'Cebola', quantity: 2, unit: 'unidades' },
      { name: 'Azeite', quantity: 60, unit: 'ml' },
      { name: 'Alho', quantity: 4, unit: 'dentes' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' },
      { name: 'Sal', quantity: 2, unit: 'colheres de chá' },
      { name: 'Pimenta do reino', quantity: 1, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Salada de Camarão com Manga',
    structured_ingredients: [
      { name: 'Camarão', quantity: 300, unit: 'g' },
      { name: 'Manga', quantity: 1, unit: 'unidade' },
      { name: 'Rúcula', quantity: 100, unit: 'g' },
      { name: 'Azeite', quantity: 30, unit: 'ml' },
      { name: 'Suco de limão', quantity: 20, unit: 'ml' },
      { name: 'Vinagre balsâmico', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Salada de Quinoa com Legumes',
    structured_ingredients: [
      { name: 'Quinoa', quantity: 100, unit: 'g' },
      { name: 'Pimentão', quantity: 80, unit: 'g' },
      { name: 'Abobrinha', quantity: 100, unit: 'g' },
      { name: 'Cebola', quantity: 50, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Suco de limão', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Água', quantity: 200, unit: 'ml' }
    ]
  },
  {
    title: 'Bife com Ovos e Aspargos',
    structured_ingredients: [
      { name: 'Bife de contrafilé', quantity: 200, unit: 'g' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Aspargos', quantity: 150, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Azeite', quantity: 15, unit: 'ml' }
    ]
  }
]

async function updateRecipeIngredients(recipeData) {
  try {
    const { data: recipes, error: searchError } = await supabase
      .from('recipes')
      .select('id, title')
      .ilike('title', recipeData.title)
    
    if (searchError) {
      console.error(`❌ Erro ao buscar ${recipeData.title}:`, searchError.message)
      return
    }
    
    if (!recipes || recipes.length === 0) {
      console.log(`⚠️  Receita não encontrada: ${recipeData.title}`)
      return
    }
    
    const recipe = recipes[0]
    console.log(`🔍 Encontrada receita: ${recipe.title} (ID: ${recipe.id})`)
    
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        structured_ingredients: recipeData.structured_ingredients,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipe.id)
    
    if (updateError) {
      console.error(`❌ Erro ao atualizar ${recipeData.title}:`, updateError.message)
    } else {
      console.log(`✅ Corrigida: ${recipeData.title}`)
    }
    
  } catch (error) {
    console.error(`❌ Erro geral ao processar ${recipeData.title}:`, error.message)
  }
}

async function main() {
  console.log(`🔧 Corrigindo ${recipeFixes.length} receitas com inconsistências...`)
  
  for (const recipe of recipeFixes) {
    await updateRecipeIngredients(recipe)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('✅ Correções de inconsistências concluídas!')
}

main().catch(console.error)
