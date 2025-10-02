import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment')
  process.exit(1)
}

const supabase = createClient(url, key)

function printResult(name, { data, error }) {
  if (!error) {
    console.log(`[OK] ${name}`)
  } else {
    const msg = (error?.message || '').toLowerCase()
    if (msg.includes('does not exist') || msg.includes('not found')) {
      console.log(`[MISSING] ${name} -> ${error.message}`)
    } else {
      console.log(`[PRESENT?] ${name} -> perm or other error: ${error.message}`)
    }
  }
}

async function main() {
  console.log('Checking Supabase objects using anon key...')
  const r1 = await supabase.from('user_menus').select('id').limit(1)
  printResult('table public.user_menus', r1)

  const r2 = await supabase.from('menu_recipes').select('id').limit(1)
  printResult('table public.menu_recipes', r2)

  const r3 = await supabase.from('recipes').select('id').limit(1)
  printResult('table public.recipes', r3)

  const r4 = await supabase.rpc('refresh_menu_shopping_source', { p_menu_id: '00000000-0000-0000-0000-000000000000' })
  printResult('rpc refresh_menu_shopping_source(uuid)', r4)
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})



