import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw'

const supabase = createClient(url, serviceRoleKey)

async function fixLastInconsistency() {
  console.log('🔧 Corrigindo a última inconsistência...')
  
  const { data: recipes, error: searchError } = await supabase
    .from('recipes')
    .select('id, title')
    .ilike('title', 'Salada de Lentilha com Rúcula')
  
  if (searchError) {
    console.error('❌ Erro ao buscar a receita:', searchError.message)
    return
  }
  
  if (!recipes || recipes.length === 0) {
    console.log('⚠️  Receita não encontrada')
    return
  }
  
  const recipe = recipes[0]
  console.log(`🔍 Encontrada receita: ${recipe.title} (ID: ${recipe.id})`)
  
  // Corrigindo os ingredientes para incluir o vinagrete balsâmico
  const correctedIngredients = [
    { name: 'Lentilhas', quantity: 1, unit: 'xícara' },
    { name: 'Rúcula', quantity: 2, unit: 'xícaras' },
    { name: 'Tomate cereja', quantity: 200, unit: 'g' },
    { name: 'Vinagre balsâmico', quantity: 30, unit: 'ml' },
    { name: 'Azeite', quantity: 30, unit: 'ml' },
    { name: 'Sal', quantity: 1, unit: 'colher de chá' },
    { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
  ]
  
  const { error: updateError } = await supabase
    .from('recipes')
    .update({
      structured_ingredients: correctedIngredients,
      updated_at: new Date().toISOString()
    })
    .eq('id', recipe.id)
  
  if (updateError) {
    console.error('❌ Erro ao atualizar:', updateError.message)
  } else {
    console.log('✅ Última inconsistência corrigida!')
  }
}

fixLastInconsistency().catch(console.error)
