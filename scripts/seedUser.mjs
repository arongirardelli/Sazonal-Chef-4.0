import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE

if (!url || !serviceRole) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const adminClient = createClient(url, serviceRole)

const EMAIL = process.env.SUPABASE_SEED_EMAIL || 'arongirardelli@gmail.com'
const PASSWORD = process.env.SUPABASE_SEED_PASSWORD || '123456'

async function findUserByEmail(email) {
  // Try to create; if exists, we'll list to find it
  const created = await adminClient.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true })
  if (!created.error && created.data?.user) return created.data.user

  let page = 1
  const perPage = 200
  while (page < 20) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const match = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (match) return match
    if (data.users.length < perPage) break
    page += 1
  }
  throw new Error('User not found and could not be created')
}

async function upsertProfileAndSettings(userId) {
  const profiles = adminClient.from('user_profiles')
  const settings = adminClient.from('user_settings')

  const p = await profiles.upsert([
    {
      user_id: userId,
      email: EMAIL,
      subscription_status: 'active',
      plan_type: 'monthly',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ], { onConflict: 'user_id' })
  if (p.error) throw p.error

  const s = await settings.upsert([
    {
      user_id: userId,
      email: EMAIL,
      notifications_enabled: true,
      new_recipes_notifications: true,
      cooking_reminders: true,
      font_size: 'medium',
      dark_mode: false,
      recipes_viewed: 0,
      recipes_saved_count: 0,
      saved_recipes: [],
      cooking_days: 0,
      total_points: 0,
      chef_level: 'Iniciante',
      first_access_date: new Date().toISOString().slice(0,10),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ], { onConflict: 'user_id' })
  if (s.error) throw s.error
}

async function ensurePassword(userId) {
  const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { plan_type: 'monthly', subscription_status: 'active' },
  })
  if (error) throw error
  return data
}

async function main() {
  console.log('Seeding user and settings...')
  const user = await findUserByEmail(EMAIL)
  await ensurePassword(user.id)
  await upsertProfileAndSettings(user.id)
  console.log(`[OK] Seed completed for user ${EMAIL} (${user.id})`)
}

main().catch((e) => { console.error(e); process.exit(1) })


