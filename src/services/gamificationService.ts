import { supabase } from '@/integrations/supabase'

// Sistema de níveis baseado no GamificationCard.tsx
const gamificationLevels = [
  { name: 'Aprendiz Culinário', minPoints: 0, maxPoints: 50 },
  { name: 'Ajudante de Cozinha', minPoints: 50, maxPoints: 125 },
  { name: 'Cozinheiro Amador', minPoints: 125, maxPoints: 250 },
  { name: 'Cozinheiro Dedicado', minPoints: 250, maxPoints: 450 },
  { name: 'Artesão Culinário', minPoints: 450, maxPoints: 750 },
  { name: 'Chef de Fim de Semana', minPoints: 750, maxPoints: 1200 },
  { name: 'Chef da Brigada', minPoints: 1200, maxPoints: 1900 },
  { name: 'Sous Chef', minPoints: 1900, maxPoints: 2900 },
  { name: 'Chef Experiente', minPoints: 2900, maxPoints: 4200 },
  { name: 'Chef de Cuisine', minPoints: 4200, maxPoints: 6000 },
  { name: 'Mestre Culinário', minPoints: 6000, maxPoints: 8500 },
  { name: 'Lenda Culinária', minPoints: 8500, maxPoints: 12000 },
  { name: 'Ícone da Gastronomia', minPoints: 12000, maxPoints: 17000 },
  { name: 'Sazonal Chef', minPoints: 17000, maxPoints: Infinity }
];

export function computeChefLevel(totalPoints: number): string {
  const currentLevel = gamificationLevels.find(level => 
    totalPoints >= level.minPoints && totalPoints < level.maxPoints
  ) || gamificationLevels[gamificationLevels.length - 1];
  
  return currentLevel.name;
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
  const prevLevel = settings?.chef_level
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
  // Pontos fixos por cardápio gerado: 25 pontos
  const menuPoints = 25
  const delta = menuPoints
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
    const chefLevel = computeChefLevel(totalPoints)
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


