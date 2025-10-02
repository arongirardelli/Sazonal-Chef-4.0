import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { recipeCorrectionsBatch3 } from './recipeCorrectionsBatch3.mjs'

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw'

if (!url || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or service role key')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey)

async function updateRecipe(recipeData) {
  try {
    // Primeiro, busca a receita pelo título
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
    
    // Atualiza a receita
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        rating: recipeData.rating,
        tips: recipeData.tips,
        instructions: recipeData.instructions,
        structured_ingredients: recipeData.structured_ingredients,
        calories: recipeData.calories,
        servings: recipeData.servings,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipe.id)
    
    if (updateError) {
      console.error(`❌ Erro ao atualizar ${recipeData.title}:`, updateError.message)
      console.error('Detalhes do erro:', updateError)
    } else {
      console.log(`✅ Atualizada: ${recipeData.title}`)
    }
    
  } catch (error) {
    console.error(`❌ Erro geral ao processar ${recipeData.title}:`, error.message)
  }
}

async function main() {
  console.log(`Corrigindo ${recipeCorrectionsBatch3.length} receitas do terceiro lote...`)
  console.log('URL:', url)
  console.log('Service Role Key:', serviceRoleKey ? '✅ Configurada' : '❌ Não configurada')
  
  for (const recipe of recipeCorrectionsBatch3) {
    await updateRecipe(recipe)
    // Pequena pausa entre as atualizações
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('✅ Processo de correção do terceiro lote concluído!')
}

main().catch((e) => { 
  console.error('Erro fatal:', e)
  process.exit(1) 
})
