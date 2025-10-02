import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE
if (!url || !serviceRole) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE')
  process.exit(1)
}
const admin = createClient(url, serviceRole)

async function deleteRecipeById(id) {
  const { error } = await admin.from('recipes').delete().eq('id', id)
  if (error) throw error
}

async function main() {
  // Encontrar possíveis duplicatas da lasanha de berinjela (uma com unidades, outra com g)
  const { data, error } = await admin
    .from('recipes')
    .select('id,title,structured_ingredients')
    .or("title.ilike.%lasanha%berinjela%,title.ilike.%Lasanha de Berinjela%")
  if (error) throw error

  const dupe = (data || []).find(r => Array.isArray(r.structured_ingredients) && r.structured_ingredients.some(i => (i.name || '').toLowerCase().includes('berinjela') && (i.unit || '').toLowerCase().includes('unid')))
  if (dupe) {
    await deleteRecipeById(dupe.id)
    console.log(`[OK] Deleted duplicate recipe with units: ${dupe.id} - ${dupe.title}`)
  } else {
    console.log('No duplicate lasanha de berinjela with units found')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })


