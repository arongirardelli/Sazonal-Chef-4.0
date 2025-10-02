import { supabase } from '@/integrations/supabase'

export type ChefLevel = 'Ajudante de Cozinha' | 'Cozinheiro Amador' | 'Chef de Partida' | 'Sous Chef' | 'Chef Executivo' | 'Chef Michelin'

export function computeChefLevel(totalPoints: number): ChefLevel {
  if (totalPoints >= 7001) return 'Chef Michelin'
  if (totalPoints >= 5001) return 'Chef Executivo'
  if (totalPoints >= 3001) return 'Sous Chef'
  if (totalPoints >= 1501) return 'Chef de Partida'
  if (totalPoints >= 501) return 'Cozinheiro Amador'
  return 'Ajudante de Cozinha'
}

export async function getUserSettings(userId: string) {
  const { data } = await supabase.from('user_settings').select('*').eq('user_id', userId).single()
  return data
}

export async function ensureUserSettings(userId: string, email?: string) {
  const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).single()
  if (!error && data) return data
  const { data: created } = await supabase.from('user_settings').insert({ user_id: userId, email }).select('*').single()
  return created
}

export async function awardPoints(userId: string, deltaPoints: number, options?: {
  incViewed?: number
  setSavedCountTo?: number
  incCookingDays?: number
}) {
  const settings = await ensureUserSettings(userId)
  const basePoints = settings?.total_points || 0
  const nextPoints = basePoints + (deltaPoints || 0)
  const nextLevel = computeChefLevel(nextPoints)
  const prevLevel = settings?.chef_level as ChefLevel | undefined
  const updates: any = { total_points: nextPoints, chef_level: nextLevel, updated_at: new Date().toISOString() }
  if (options?.incViewed) updates.recipes_viewed = (settings?.recipes_viewed || 0) + options.incViewed
  if (typeof options?.setSavedCountTo === 'number') updates.recipes_saved_count = options.setSavedCountTo
  if (options?.incCookingDays) updates.cooking_days = (settings?.cooking_days || 0) + options.incCookingDays
  await supabase.from('user_settings').update(updates).eq('user_id', userId)
  return { total_points: nextPoints, chef_level: nextLevel, leveledUp: prevLevel !== nextLevel }
}

export async function addRecipeViewPoint(userId: string) {
  return awardPoints(userId, 5, { incViewed: 1 })
}

export async function addSavedRecipePoint(userId: string, savedCount: number) {
  // Atribui pontos apenas ao salvar (não ao desfavoritar)
  return awardPoints(userId, 10, { setSavedCountTo: savedCount })
}

export async function updateSavedRecipeCount(userId: string, savedCount: number) {
  // Apenas atualiza o contador sem dar pontos (usado ao remover receitas)
  return awardPoints(userId, 0, { setSavedCountTo: savedCount })
}

export async function addMenuActionsPoints(userId: string, recipesAddedCount: number, grantWeeklyBonus: boolean) {
  const perRecipe = 15 * Math.max(0, recipesAddedCount)
  const weekly = grantWeeklyBonus ? 50 : 0
  const delta = perRecipe + weekly
  if (delta <= 0) return getUserSettings(userId)
  return awardPoints(userId, delta)
}

export async function addCookedDayPoint(userId: string) {
  return awardPoints(userId, 25, { incCookingDays: 1 })
}


export async function registerDailyAccessServer() {
  try {
    // Obter sessão atual
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado')
    }

    const userId = session.user.id
    const userEmail = session.user.email
    const today = new Date().toISOString().split('T')[0]

    // Verificar se já acessou hoje
    const { data: settings, error: fetchError } = await supabase
      .from('user_settings')
      .select('total_points, chef_level, cooking_days, last_access_date')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    // Se já acessou hoje, retornar dados atuais
    if (settings?.last_access_date === today) {
      return {
        success: true,
        skipped: true,
        total_points: settings.total_points,
        chef_level: settings.chef_level,
        cooking_days: settings.cooking_days,
        message: 'Acesso diário já registrado hoje'
      }
    }

    // Calcular novos valores
    const totalPoints = (settings?.total_points || 0) + 25
    const chefLevel = totalPoints >= 7001 ? 'Chef Michelin'
      : totalPoints >= 5001 ? 'Chef Executivo'
      : totalPoints >= 3001 ? 'Sous Chef'
      : totalPoints >= 1501 ? 'Chef de Partida'
      : totalPoints >= 501 ? 'Cozinheiro Amador'
      : 'Ajudante de Cozinha'
    const cookingDays = (settings?.cooking_days || 0) + 1

    // Atualizar ou criar configurações
    const { error: updateError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        email: userEmail, // Adicionar email obrigatório
        total_points: totalPoints,
        chef_level: chefLevel,
        cooking_days: cookingDays,
        last_access_date: today,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id' // Especificar a coluna de conflito
      })

    if (updateError) {
      throw updateError
    }

    return {
      success: true,
      skipped: false,
      total_points: totalPoints,
      chef_level: chefLevel,
      cooking_days: cookingDays,
      message: 'Acesso diário registrado com sucesso!'
    }

  } catch (error) {
    console.error('Erro ao registrar acesso diário:', error)
    throw error
  }
}


