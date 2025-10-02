import { supabase } from '@/integrations/supabase'

export interface UserProfileRow {
  id: string
  user_id: string | null
  email: string
  subscription_status: string
  plan_type: string
  created_at: string
  updated_at: string
  full_name?: string | null
  display_name?: string | null
}

export async function getUserProfile(userId: string): Promise<UserProfileRow | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return null
  return (data as UserProfileRow) || null
}


