#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAzeiteDisplay() {
  console.log('🔍 Buscando receitas com "Azeite" no display...')
  
  // Buscar todas as receitas
  const { data: allRecipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
  
  if (error) {
    console.error('❌ Erro ao buscar receitas:', error)
    return
  }
  
  // Filtrar apenas as receitas que têm "Azeite de oliva" com display incorreto
  const recipes = allRecipes.filter(recipe => {
    return recipe.structured_ingredients.some(ingredient => 
      ingredient.name === 'Azeite de oliva' && 
      ingredient.display && 
      ingredient.display.includes('de Azeite') && 
      !ingredient.display.includes('de Azeite de oliva')
    )
  })
  
  console.log(`📊 Encontradas ${recipes.length} receitas com "de Azeite" no display`)
  
  let updatedCount = 0
  
  for (const recipe of recipes) {
    let needsUpdate = false
    const updatedIngredients = recipe.structured_ingredients.map(ingredient => {
      // Se o name é "Azeite de oliva" mas o display mostra apenas "de Azeite" (sem "de oliva")
      if (ingredient.name === 'Azeite de oliva' && 
          ingredient.display && 
          ingredient.display.includes('de Azeite') && 
          !ingredient.display.includes('de Azeite de oliva')) {
        
        needsUpdate = true
        return {
          ...ingredient,
          display: ingredient.display.replace('de Azeite', 'de Azeite de oliva')
        }
      }
      return ingredient
    })
    
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ structured_ingredients: updatedIngredients })
        .eq('id', recipe.id)
      
      if (updateError) {
        console.error(`❌ Erro ao atualizar receita "${recipe.title}":`, updateError)
      } else {
        console.log(`✅ Atualizada: "${recipe.title}"`)
        updatedCount++
        
        // Log de debug para verificar a atualização
        const azeiteIngredient = updatedIngredients.find(ing => ing.name === 'Azeite de oliva')
        if (azeiteIngredient) {
          console.log(`   📝 Display atualizado: "${azeiteIngredient.display}"`)
        }
      }
    }
  }
  
  console.log(`🎉 Processo concluído! ${updatedCount} receitas foram atualizadas.`)
}

fixAzeiteDisplay().catch(console.error)
