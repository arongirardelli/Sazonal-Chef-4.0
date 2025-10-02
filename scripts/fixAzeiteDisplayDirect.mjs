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

async function fixAzeiteDisplayDirect() {
  console.log('🔍 Executando correção direta via SQL...')
  
  // Usar uma query SQL direta mais eficiente
  const { error } = await supabase.rpc('fix_azeite_display')
  
  if (error) {
    console.error('❌ Erro ao executar função:', error)
    
    // Fallback: usar abordagem manual
    console.log('🔄 Tentando abordagem manual...')
    await manualFix()
  } else {
    console.log('✅ Correção via função SQL concluída!')
  }
}

async function manualFix() {
  // Buscar todas as receitas que precisam de correção
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, structured_ingredients')
  
  if (error) {
    console.error('❌ Erro ao buscar receitas:', error)
    return
  }
  
  let updatedCount = 0
  
  for (const recipe of recipes) {
    const ingredients = recipe.structured_ingredients
    let needsUpdate = false
    
    // Encontrar o índice do ingrediente de azeite de oliva que precisa de correção
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i]
      if (ingredient.name === 'Azeite de oliva' && 
          ingredient.display && 
          ingredient.display.includes('de Azeite') && 
          !ingredient.display.includes('de Azeite de oliva')) {
        
        // Atualizar diretamente no banco usando o índice específico
        const newDisplay = ingredient.display.replace('de Azeite', 'de Azeite de oliva')
        
        const { error: updateError } = await supabase
          .rpc('update_ingredient_display', {
            recipe_id: recipe.id,
            ingredient_index: i,
            new_display: newDisplay
          })
        
        if (updateError) {
          // Se a função não existe, usar UPDATE direto
          const { error: directError } = await supabase
            .from('recipes')
            .update({
              structured_ingredients: supabase.raw(`jsonb_set(structured_ingredients, '{${i},display}', '"${newDisplay}"')`)
            })
            .eq('id', recipe.id)
          
          if (directError) {
            console.error(`❌ Erro ao atualizar "${recipe.title}":`, directError)
          } else {
            console.log(`✅ Atualizada: "${recipe.title}" (índice ${i})`)
            updatedCount++
            needsUpdate = true
          }
        } else {
          console.log(`✅ Atualizada: "${recipe.title}" (índice ${i})`)
          updatedCount++
          needsUpdate = true
        }
        
        break // Só atualizar o primeiro encontrado por receita
      }
    }
  }
  
  console.log(`🎉 Processo manual concluído! ${updatedCount} receitas foram atualizadas.`)
}

fixAzeiteDisplayDirect().catch(console.error)
