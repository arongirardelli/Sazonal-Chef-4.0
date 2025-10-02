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

async function fixAzeiteDisplaySQL() {
  console.log('🔍 Executando correção via SQL...')
  
  // Query SQL para corrigir todas as receitas de uma vez
  const query = `
    WITH updated_recipes AS (
      SELECT 
        id,
        jsonb_agg(
          CASE 
            WHEN ingredient->>'name' = 'Azeite de oliva' 
                 AND ingredient->>'display' LIKE '%de Azeite'
                 AND ingredient->>'display' NOT LIKE '%de Azeite de oliva%'
            THEN ingredient || jsonb_build_object('display', replace(ingredient->>'display', 'de Azeite', 'de Azeite de oliva'))
            ELSE ingredient
          END
          ORDER BY ordinality
        ) as new_structured_ingredients
      FROM recipes,
           jsonb_array_elements(structured_ingredients) WITH ORDINALITY AS ingredient
      WHERE structured_ingredients::text LIKE '%"name":"Azeite de oliva"%' 
        AND structured_ingredients::text LIKE '%"display":"%de Azeite"%'
        AND structured_ingredients::text NOT LIKE '%"display":"%de Azeite de oliva%'
      GROUP BY id
    )
    UPDATE recipes 
    SET structured_ingredients = updated_recipes.new_structured_ingredients
    FROM updated_recipes
    WHERE recipes.id = updated_recipes.id;
  `
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: query })
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error)
      // Tentar com query direta
      const { error: directError } = await supabase.from('recipes').select('id').limit(1)
      if (directError) {
        console.error('❌ Problema de conexão:', directError)
        return
      }
      
      console.log('🔄 Tentando abordagem alternativa...')
      await alternativeApproach()
    } else {
      console.log('✅ Correção SQL concluída!')
      await verifyFix()
    }
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
    await alternativeApproach()
  }
}

async function alternativeApproach() {
  console.log('📝 Usando abordagem alternativa com múltiplas queries...')
  
  // Buscar IDs das receitas que precisam de correção
  const { data: recipeIds, error } = await supabase
    .from('recipes')
    .select('id')
    .filter('structured_ingredients', 'cs', '{"name":"Azeite de oliva"}')
  
  if (error) {
    console.error('❌ Erro ao buscar receitas:', error)
    return
  }
  
  console.log(`📊 Encontradas ${recipeIds.length} receitas para verificar...`)
  
  let updatedCount = 0
  
  for (const { id } of recipeIds) {
    // Executar update individual para cada receita
    const updateQuery = `
      UPDATE recipes 
      SET structured_ingredients = (
        SELECT jsonb_agg(
          CASE 
            WHEN ingredient->>'name' = 'Azeite de oliva' 
                 AND ingredient->>'display' LIKE '%de Azeite'
                 AND ingredient->>'display' NOT LIKE '%de Azeite de oliva%'
            THEN ingredient || jsonb_build_object('display', replace(ingredient->>'display', 'de Azeite', 'de Azeite de oliva'))
            ELSE ingredient
          END
          ORDER BY ordinality
        )
        FROM jsonb_array_elements(structured_ingredients) WITH ORDINALITY AS ingredient
      )
      WHERE id = '${id}'
        AND structured_ingredients::text LIKE '%"name":"Azeite de oliva"%' 
        AND structured_ingredients::text LIKE '%"display":"%de Azeite"%'
        AND structured_ingredients::text NOT LIKE '%"display":"%de Azeite de oliva%';
    `
    
    try {
      const { error: updateError } = await supabase.rpc('exec_sql', { sql: updateQuery })
      if (updateError) {
        console.error(`❌ Erro ao atualizar receita ${id}:`, updateError)
      } else {
        updatedCount++
        if (updatedCount % 10 === 0) {
          console.log(`📈 Progresso: ${updatedCount} receitas processadas...`)
        }
      }
    } catch (err) {
      console.error(`❌ Erro inesperado na receita ${id}:`, err)
    }
  }
  
  console.log(`🎉 Processo alternativo concluído! ${updatedCount} receitas foram processadas.`)
  await verifyFix()
}

async function verifyFix() {
  console.log('🔍 Verificando resultado...')
  
  const { data, error } = await supabase
    .from('recipes')
    .select('title')
    .filter('structured_ingredients', 'cs', '{"name":"Azeite de oliva"}')
    .filter('structured_ingredients', 'cs', '{"display":"1 colher de sopa de Azeite de oliva"}')
    .limit(5)
  
  if (error) {
    console.error('❌ Erro ao verificar:', error)
  } else {
    console.log(`✅ Encontradas ${data.length} receitas com display correto (amostra):`)
    data.forEach(recipe => console.log(`   - ${recipe.title}`))
  }
}

fixAzeiteDisplaySQL().catch(console.error)
