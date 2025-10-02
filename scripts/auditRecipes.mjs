import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw'

const supabase = createClient(url, serviceRoleKey)

// Lista de ingredientes comuns que devem estar nas instruções
const commonIngredients = [
  'sal', 'pimenta', 'azeite', 'manteiga', 'óleo', 'água', 'leite', 'ovos', 'açúcar',
  'farinha', 'cebola', 'alho', 'limão', 'vinagre', 'shoyu', 'molho', 'caldo'
]

function findMissingIngredients(ingredients, instructions) {
  const ingredientNames = ingredients.map(ing => ing.name.toLowerCase())
  const instructionText = instructions.join(' ').toLowerCase()
  const missing = []
  
  for (const ingredient of commonIngredients) {
    if (instructionText.includes(ingredient) && !ingredientNames.some(name => name.includes(ingredient))) {
      missing.push(ingredient)
    }
  }
  
  return missing
}

async function auditRecipes() {
  console.log('🔍 Auditando receitas para inconsistências...')
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients, instructions')
  
  if (error) {
    console.error('Erro ao buscar receitas:', error)
    return
  }
  
  const issues = []
  
  for (const recipe of recipes) {
    if (!recipe.structured_ingredients || !recipe.instructions) continue
    
    const missing = findMissingIngredients(recipe.structured_ingredients, recipe.instructions)
    
    if (missing.length > 0) {
      issues.push({
        id: recipe.id,
        title: recipe.title,
        missing: missing,
        ingredients: recipe.structured_ingredients.map(i => i.name),
        instructions: recipe.instructions
      })
    }
  }
  
  console.log(`\n📊 Resultado da auditoria:`)
  console.log(`Total de receitas: ${recipes.length}`)
  console.log(`Receitas com problemas: ${issues.length}`)
  
  if (issues.length > 0) {
    console.log('\n❌ Problemas encontrados:')
    issues.forEach(issue => {
      console.log(`\n🔴 ${issue.title}`)
      console.log(`   Ingredientes faltando: ${issue.missing.join(', ')}`)
      console.log(`   Ingredientes atuais: ${issue.ingredients.join(', ')}`)
    })
  } else {
    console.log('\n✅ Todas as receitas estão consistentes!')
  }
  
  return issues
}

auditRecipes().catch(console.error)
