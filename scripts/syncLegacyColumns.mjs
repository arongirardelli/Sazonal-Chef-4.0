import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw'

const supabase = createClient(url, serviceRoleKey)

// Função para gerar tags baseadas na categoria e dieta
function generateTags(recipe) {
  const tags = []
  
  // Adiciona categoria como tag
  if (recipe.category) {
    tags.push(recipe.category.toLowerCase())
  }
  
  // Adiciona dieta como tag
  if (recipe.diet) {
    tags.push(recipe.diet.toLowerCase())
  }
  
  // Adiciona tags baseadas na dificuldade
  if (recipe.difficulty) {
    if (recipe.difficulty === 'Fácil') tags.push('fácil', 'rápido')
    if (recipe.difficulty === 'Médio') tags.push('médio', 'intermediário')
    if (recipe.difficulty === 'Difícil') tags.push('difícil', 'avançado')
  }
  
  // Adiciona tags baseadas no tempo
  if (recipe.time) {
    if (recipe.time <= 15) tags.push('rápido', 'express')
    if (recipe.time <= 30) tags.push('médio-tempo')
    if (recipe.time > 30) tags.push('elaborado')
  }
  
  // Adiciona tags baseadas no título
  const title = recipe.title.toLowerCase()
  if (title.includes('salada')) tags.push('salada', 'fresco')
  if (title.includes('sopa')) tags.push('sopa', 'quente')
  if (title.includes('sobremesa')) tags.push('sobremesa', 'doce')
  if (title.includes('vegano')) tags.push('vegano', 'plant-based')
  if (title.includes('vegetariano')) tags.push('vegetariano')
  if (title.includes('frango')) tags.push('frango', 'proteína')
  if (title.includes('peixe')) tags.push('peixe', 'frutos-do-mar')
  if (title.includes('carne')) tags.push('carne', 'proteína')
  
  // Remove duplicatas e retorna array único
  return [...new Set(tags)]
}

// Função para converter structured_ingredients para formato legacy
function convertToLegacyIngredients(structuredIngredients) {
  if (!structuredIngredients || !Array.isArray(structuredIngredients)) return []
  
  return structuredIngredients.map(ing => {
    const { quantity, unit, name } = ing
    if (unit === 'unidade' || unit === 'unidades') {
      return `${quantity} ${unit} de ${name}`
    } else if (unit === 'colher de chá' || unit === 'colheres de chá') {
      return `${quantity} ${unit} de ${name}`
    } else if (unit === 'colher de sopa' || unit === 'colheres de sopa') {
      return `${quantity} ${unit} de ${name}`
    } else {
      return `${quantity}${unit} de ${name}`
    }
  })
}

async function syncLegacyColumns() {
  console.log('🔄 Sincronizando colunas legacy_ingredients e tags...')
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, category, diet, difficulty, time, structured_ingredients, legacy_ingredients, tags')
  
  if (error) {
    console.error('❌ Erro ao buscar receitas:', error)
    return
  }
  
  console.log(`📊 Total de receitas para sincronizar: ${recipes.length}`)
  
  let updatedCount = 0
  
  for (const recipe of recipes) {
    try {
      // Gera tags baseadas nos dados da receita
      const newTags = generateTags(recipe)
      
      // Converte structured_ingredients para formato legacy
      const newLegacyIngredients = convertToLegacyIngredients(recipe.structured_ingredients)
      
      // Verifica se precisa atualizar
      const needsUpdate = 
        JSON.stringify(recipe.tags || []) !== JSON.stringify(newTags) ||
        JSON.stringify(recipe.legacy_ingredients || []) !== JSON.stringify(newLegacyIngredients)
      
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('recipes')
          .update({
            tags: newTags,
            legacy_ingredients: newLegacyIngredients,
            updated_at: new Date().toISOString()
          })
          .eq('id', recipe.id)
        
        if (updateError) {
          console.error(`❌ Erro ao atualizar ${recipe.title}:`, updateError.message)
        } else {
          console.log(`✅ Sincronizada: ${recipe.title}`)
          updatedCount++
        }
      }
      
      // Delay para não sobrecarregar o banco
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${recipe.title}:`, error.message)
    }
  }
  
  console.log(`\n🎉 Sincronização concluída!`)
  console.log(`📊 Receitas atualizadas: ${updatedCount}`)
  console.log(`📊 Receitas já sincronizadas: ${recipes.length - updatedCount}`)
}

syncLegacyColumns().catch(console.error)
