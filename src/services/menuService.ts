import { supabase } from '@/integrations/supabase'
import type { Recipe, Ingredient } from '@/types/supabase'
import { addMenuActionsPoints } from '@/services/gamificationService'

export type MenuData = Record<string, Record<string, string>>

// Cache em memória para o catálogo de receitas
let recipeCatalogCache: Recipe[] | null = null;

export async function saveOrUpdateMenu(userId: string, name: string, menuData: MenuData, options?: { allowRepeats?: boolean, startDate?: string|null, endDate?: string|null }): Promise<string | null> {
  const { data: existing } = await supabase.from('user_menus').select('id').eq('user_id', userId).single()
  let menuId: string | null = existing?.id || null

  if (menuId) {
    const { error } = await supabase
      .from('user_menus')
      .update({ name, allow_repeats: !!options?.allowRepeats, start_date: options?.startDate || null, end_date: options?.endDate || null, updated_at: new Date().toISOString() })
      .eq('id', menuId)
    if (error) throw error
  } else {
    const { data, error } = await supabase
      .from('user_menus')
      .insert({ user_id: userId, name, allow_repeats: !!options?.allowRepeats, start_date: options?.startDate || null, end_date: options?.endDate || null })
      .select('id')
      .single()
    if (error) throw error
    menuId = data!.id
  }

  if (!menuId) return null

  await supabase.from('menu_recipes').delete().eq('menu_id', menuId)

  const rows: { menu_id: string, recipe_id: string, day_of_week: string, meal_type: string }[] = []
  Object.entries(menuData).forEach(([day, meals]) => {
    Object.entries(meals).forEach(([meal, recipeId]) => {
      if (recipeId) rows.push({ menu_id: menuId!, recipe_id: recipeId, day_of_week: day, meal_type: meal })
    })
  })
  if (rows.length > 0) {
    const { error } = await supabase.from('menu_recipes').insert(rows as any)
    if (error) throw error
  }

  const { error: rpcErr } = await supabase.rpc('refresh_menu_shopping_source', { p_menu_id: menuId })
  if (rpcErr) throw rpcErr

  // gamificação: pontos por adicionar receitas + bônus semanal
  try {
    await addMenuActionsPoints(userId, rows.length, true)
  } catch {}

  return menuId
}

export async function getShoppingSource(userId: string): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('user_menus')
    .select('shopping_source')
    .eq('user_id', userId)
    .single()
  if (error || !data) return []
  return (data.shopping_source || []) as Ingredient[]
}

export async function loadRecipesByCategory(category: string): Promise<Recipe[]> {
  const { data, error } = await supabase.from('recipes').select('*').ilike('category', category)
  if (error) return []
  return (data || []) as Recipe[]
}

export async function loadAllRecipes(): Promise<Recipe[]> {
  // Se o cache já existe, retorna-o imediatamente
  if (recipeCatalogCache) {
    return recipeCatalogCache;
  }

  const { data, error } = await supabase.from('recipes').select('*')
  if (error) {
    return []
  }
  
  // Armazena no cache para futuras chamadas e retorna
  recipeCatalogCache = (data || []) as Recipe[];
  return recipeCatalogCache;
}

export async function loadRecipesByIds(ids: string[]): Promise<Recipe[]> {
  if (!ids || ids.length === 0) return []
  
  // Buscar todas as receitas de uma vez
  const { data, error } = await supabase.from('recipes').select('*').in('id', ids)
  if (error) return []
  
  // Criar um mapa para acesso rápido
  const recipeMap = new Map<string, Recipe>()
  data?.forEach(recipe => {
    recipeMap.set(recipe.id, recipe as Recipe)
  })
  
  // Retornar as receitas na ordem exata dos IDs fornecidos
  const orderedRecipes: Recipe[] = []
  for (const id of ids) {
    const recipe = recipeMap.get(id)
    if (recipe) {
      orderedRecipes.push(recipe)
    }
  }
  
  return orderedRecipes
}

export async function getSavedRecipeIds(userId: string): Promise<string[]> {
  const { data } = await supabase.from('user_settings').select('saved_recipes, updated_at').eq('user_id', userId).maybeSingle()
  const saved = (data?.saved_recipes || []) as string[]
  
  // Se não há receitas salvas, retorna array vazio
  if (!Array.isArray(saved) || saved.length === 0) return []
  
  // Para garantir a ordem cronológica, vamos usar uma abordagem diferente
  // Vamos buscar cada receita individualmente para obter informações de quando foi salva
  // Mas primeiro, vamos tentar uma abordagem mais simples: manter a ordem de inserção
  
  // Como as receitas são adicionadas no final do array, a ordem natural já é cronológica
  // Mas vamos verificar se há algum problema na ordem
  return saved
}

// Nova função que retorna receitas com informações de quando foram salvas
export async function getSavedRecipesWithOrder(userId: string): Promise<Array<{ id: string; order: number }>> {
  const { data } = await supabase.from('user_settings').select('saved_recipes, updated_at').eq('user_id', userId).maybeSingle()
  const saved = (data?.saved_recipes || []) as string[]
  
  if (!Array.isArray(saved) || saved.length === 0) return []
  
  // Retorna as receitas com sua posição no array (ordem de inserção)
  return saved.map((id, index) => ({
    id,
    order: index
  }))
}

export async function getSavedRecipeIdsWithTimestamps(userId: string): Promise<Array<{ id: string; savedAt: string }>> {
  const { data } = await supabase.from('user_settings').select('saved_recipes_with_timestamps').eq('user_id', userId).maybeSingle()
  const saved = (data?.saved_recipes_with_timestamps || []) as Array<{ id: string; savedAt: string }>
  return Array.isArray(saved) ? saved : []
}

export async function setSavedRecipeIdsWithTimestamps(userId: string, recipeId: string, isAdding: boolean): Promise<void> {
  // Busca os dados atuais
  const { data: existing } = await supabase
    .from('user_settings')
    .select('saved_recipes_with_timestamps, saved_recipes')
    .eq('user_id', userId)
    .maybeSingle()
  
  let currentSaved = (existing?.saved_recipes_with_timestamps || []) as Array<{ id: string; savedAt: string }>
  
  // Migração automática: se não existir saved_recipes_with_timestamps mas existir saved_recipes
  if (!existing?.saved_recipes_with_timestamps && existing?.saved_recipes) {
    const oldSavedRecipes = existing.saved_recipes as string[]
    if (Array.isArray(oldSavedRecipes) && oldSavedRecipes.length > 0) {
      // Converter receitas antigas para o novo formato com timestamp atual
      currentSaved = oldSavedRecipes.map(id => ({ 
        id, 
        savedAt: new Date().toISOString() 
      }))
    }
  }
  
  if (isAdding) {
    // Adiciona nova receita com timestamp atual
    const newEntry = { id: recipeId, savedAt: new Date().toISOString() }
    currentSaved = [...currentSaved, newEntry]
  } else {
    // Remove a receita
    currentSaved = currentSaved.filter(item => item.id !== recipeId)
  }
  
  // Atualiza o banco
  const payload = { 
    saved_recipes_with_timestamps: currentSaved, 
    updated_at: new Date().toISOString() 
  }
  
  const { data: existingUser, error: selErr } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  
  if (selErr) throw selErr

  if (existingUser?.user_id) {
    const { error: updErr } = await supabase
      .from('user_settings')
      .update(payload)
      .eq('user_id', userId)
    if (updErr) throw updErr
  } else {
    const { error: insErr } = await supabase
      .from('user_settings')
      .insert({ user_id: userId, ...payload })
    if (insErr) throw insErr
  }
}

export async function setSavedRecipeIds(userId: string, ids: string[]): Promise<void> {
  const payload = { saved_recipes: ids, updated_at: new Date().toISOString() }
  // Tenta update; se não existir, faz insert
  const { data: existing, error: selErr } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (selErr) throw selErr

  if (existing?.user_id) {
    const { error: updErr } = await supabase
      .from('user_settings')
      .update(payload)
      .eq('user_id', userId)
    if (updErr) throw updErr
  } else {
    const { error: insErr } = await supabase
      .from('user_settings')
      .insert({ user_id: userId, ...payload })
    if (insErr) throw insErr
  }
}

// Função para adicionar uma receita mantendo a ordem cronológica
export async function addSavedRecipe(userId: string, recipeId: string): Promise<void> {
  const currentSaved = await getSavedRecipeIds(userId)
  
  // Se a receita já está salva, não faz nada
  if (currentSaved.includes(recipeId)) return
  
  // Adiciona a nova receita no final (mais recente)
  const newSaved = [...currentSaved, recipeId]
  
  await setSavedRecipeIds(userId, newSaved)
}

// Função para remover uma receita
export async function removeSavedRecipe(userId: string, recipeId: string): Promise<void> {
  const currentSaved = await getSavedRecipeIds(userId)
  
  // Remove a receita
  const newSaved = currentSaved.filter(id => id !== recipeId)
  
  await setSavedRecipeIds(userId, newSaved)
}

export async function loadSavedMenu(userId: string): Promise<{ menuId: string | null; data: Record<string, Record<string, Recipe>>; name: string }> {
  // 1) get latest/only menu for user
  const { data: menuRow } = await supabase
    .from('user_menus')
    .select('id, name')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const menuId = menuRow?.id || null
  const menuName = menuRow?.name || 'Cardápio Semanal'
  if (!menuId) return { menuId: null, data: {}, name: menuName }

  // 2) fetch bindings with recipe details
  const { data: rows, error } = await supabase
    .from('menu_recipes')
    .select(`
      day_of_week, 
      meal_type, 
      recipes:recipe_id(*)
    `)
    .eq('menu_id', menuId)

  if (error || !rows) return { menuId, data: {}, name: menuName }

  const map: Record<string, Record<string, Recipe>> = {}
  for (const r of rows as any[]) {
    const day = r.day_of_week as string
    const meal = r.meal_type as string
    const recipe = r.recipes as Recipe
    if (!map[day]) map[day] = {}
    if (recipe) map[day][meal] = recipe
  }
  return { menuId, data: map, name: menuName }
}


