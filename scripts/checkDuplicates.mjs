import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE
if (!url || !serviceRole) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE')
  process.exit(1)
}
const admin = createClient(url, serviceRole)

function normalizeTitle(title) {
  return (title || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function toReport(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

function hasAnomalyIngredient(ings) {
  const anomalies = []
  const arr = Array.isArray(ings) ? ings : []
  for (const ing of arr) {
    const n = (ing?.name || '').toLowerCase()
    const u = (ing?.unit || '').toLowerCase()
    if (!n) continue
    // ingredientes alvo que queremos em gramas
    const wantsGrams = (
      n.includes('brócolis') || n.includes('brocolis') ||
      n.includes('gengibre') ||
      n.includes('peito de frango') ||
      n.includes('salmão fresco') || n.includes('salmao fresco') ||
      (n.includes('salmão') || n.includes('salmao'))
    )
    if (wantsGrams && u !== 'g') {
      anomalies.push({ name: ing.name, unit: ing.unit, quantity: ing.quantity })
      continue
    }
    // leite de coco deve ser Mercearia; não temos categoria aqui sempre, então ignoramos
  }
  return anomalies
}

async function main() {
  const { data, error } = await admin
    .from('recipes')
    .select('id,title,updated_at,structured_ingredients')
  if (error) throw error

  const byNorm = new Map()
  for (const r of data || []) {
    const key = normalizeTitle(r.title)
    if (!byNorm.has(key)) byNorm.set(key, [])
    byNorm.get(key).push(r)
  }

  const duplicateGroups = []
  for (const [key, list] of byNorm.entries()) {
    if (list.length > 1) {
      duplicateGroups.push({ normalizedTitle: key, count: list.length, recipes: list.map(x => ({ id: x.id, title: x.title, updated_at: x.updated_at })) })
    }
  }

  const anomalies = []
  for (const r of data || []) {
    const a = hasAnomalyIngredient(r.structured_ingredients)
    if (a.length > 0) anomalies.push({ id: r.id, title: r.title, issues: a })
  }

  toReport({
    summary: {
      totalRecipes: (data || []).length,
      duplicateTitleGroups: duplicateGroups.length,
      recipesWithIngredientAnomalies: anomalies.length,
    },
    duplicateTitleGroups: duplicateGroups,
    ingredientAnomalies: anomalies,
  })
}

main().catch((e) => { console.error(e); process.exit(1) })


