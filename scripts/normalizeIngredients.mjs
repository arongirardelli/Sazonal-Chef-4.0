import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE
if (!url || !serviceRole) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE')
  process.exit(1)
}
const admin = createClient(url, serviceRole)

const ONE_BROCCOLI_BUNCH_G = 300
const ONE_CHICKEN_BREAST_G = 300
const ONE_SALMON_FILLET_G = 180
const ONE_CUP_BROCCOLI_G = 192
const ONE_CENTIMETER_GINGER_G = 5

function normalizeUnitString(unit) {
  const s = (unit || '').toLowerCase()
  if (s.includes('xícara') || s.includes('xicara')) return 'xícara'
  if (s.includes('colher de sopa') || s === 'c.s.' || s.includes('c. sopa') || s === 'cs' || s === 'c.s') return 'colher de sopa'
  if (s.includes('colher de chá') || s === 'c.c.' || s.includes('c. chá') || s.includes('c. cha')) return 'colher de chá'
  if (s.includes('unid')) return 'unidade'
  if (s.includes('maço') || s.includes('maco')) return 'maço'
  if (s.includes('filé') || s.includes('file')) return 'filé'
  return s
}

function setCategoryByName(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('leite de ')) return 'Mercearia'
  if (n.includes('gengibre')) return 'Hortifruti'
  if (n.includes('costela')) return 'Carnes e Peixes'
  if (n.includes('berinjela')) return 'Hortifruti'
  if (n.includes('molho de tomate') || n.includes('extrato de tomate') || n.includes('passata') || n.includes('polpa de tomate')) return 'Mercearia'
  if (n.includes('tilápia') || n.includes('tilapia')) return 'Carnes e Peixes'
  return undefined
}

function transformIngredient(ing) {
  const copy = { ...ing }
  const name = (copy.name || '').toString()
  const n = name.toLowerCase()
  const u = normalizeUnitString(copy.unit || '')
  const q = Number(copy.quantity) || 0

  const catOverride = setCategoryByName(name)
  if (catOverride) copy.category = catOverride

  const isBroccoli = n.includes('brócolis') || n.includes('brocolis')
  const isChickenBreast = n.includes('peito de frango')
  const isSalmonFresh = n.includes('salmão fresco') || n.includes('salmao fresco')
  const isSalmon = !isSalmonFresh && (n.includes('salmão') || n.includes('salmao'))

  if (isBroccoli) {
    let grams = q
    let note = undefined
    if (u === 'unidade' || u === 'maço') {
      grams = q * ONE_BROCCOLI_BUNCH_G
      note = `aprox. ${Math.round(q)} maço(s)`
    } else if (u === 'xícara') {
      grams = q * ONE_CUP_BROCCOLI_G
    }
    if (u !== 'g') {
      copy.unit = 'g'
      copy.quantity = Math.round(grams)
      if (note) copy.display_note = note
    }
    return copy
  }

  if (isChickenBreast) {
    let grams = q
    let note = undefined
    if (u === 'unidade' || u === 'filé') {
      grams = q * ONE_CHICKEN_BREAST_G
      note = `aprox. ${Math.round(q)} peito(s)`
    }
    if (u !== 'g') {
      copy.unit = 'g'
      copy.quantity = Math.round(grams)
      if (note) copy.display_note = note
    }
    return copy
  }

  if (isSalmonFresh || isSalmon) {
    let grams = q
    let note = undefined
    if (u === 'unidade' || u === 'filé') {
      grams = q * ONE_SALMON_FILLET_G
      note = `aprox. ${Math.round(q)} filé(s)`
    }
    if (u !== 'g') {
      copy.unit = 'g'
      copy.quantity = Math.round(grams)
      if (note) copy.display_note = note
    }
    return copy
  }

  // Leite de coco categorização
  if (n.includes('leite de coco')) {
    copy.category = 'Mercearia'
  }

  // Gengibre categorização
  if (n.includes('gengibre')) {
    copy.category = 'Hortifruti'
    // converter unidade para g quando em cm/unidade/colher
    const u = normalizeUnitString(copy.unit || '')
    const q = Number(copy.quantity) || 0
    let grams = q
    if (u === 'cm') grams = q * ONE_CENTIMETER_GINGER_G
    if (u === 'unidade') grams = q * 20
    if (u === 'colher de chá') grams = q * 5
    if (u === 'colher de sopa') grams = q * 15
    if (u !== 'g') {
      copy.unit = 'g'
      copy.quantity = Math.round(grams)
    }
  }

  // Costela categorização
  if (n.includes('costela')) {
    copy.category = 'Carnes e Peixes'
  }

  return copy
}

async function fetchRecipesBatch(limit = 1000, offset = 0) {
  const { data, error } = await admin
    .from('recipes')
    .select('id,title,structured_ingredients')
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data || []
}

function needsUpdate(recipe) {
  const arr = Array.isArray(recipe.structured_ingredients) ? recipe.structured_ingredients : []
  return arr.some(ing => {
    const n = (ing?.name || '').toLowerCase()
    const u = (ing?.unit || '').toLowerCase()
    if (!n) return false
    if (n.includes('brócolis') || n.includes('brocolis')) return u !== 'g'
    if (n.includes('peito de frango')) return u !== 'g'
    if (n.includes('salmão fresco') || n.includes('salmao fresco')) return u !== 'g'
    if (n.includes('salmão') || n.includes('salmao')) return u !== 'g'
    if (n.includes('leite de coco')) return (ing?.category || '').toLowerCase() !== 'mercearia'
    if (n.includes('gengibre')) return u !== 'g' || (ing?.category || '').toLowerCase() !== 'hortifruti'
    if (n.includes('costela')) return (ing?.category || '').toLowerCase() !== 'carnes e peixes'
    return false
  })
}

async function updateRecipe(recipe) {
  const arr = Array.isArray(recipe.structured_ingredients) ? recipe.structured_ingredients : []
  const next = arr.map(transformIngredient)
  const { error } = await admin.from('recipes').update({ structured_ingredients: next, updated_at: new Date().toISOString() }).eq('id', recipe.id)
  if (error) throw error
}

async function main() {
  console.log('Normalizando ingredientes em receitas...')
  let offset = 0
  let totalUpdated = 0
  while (true) {
    const batch = await fetchRecipesBatch(500, offset)
    if (batch.length === 0) break
    for (const r of batch) {
      if (needsUpdate(r)) {
        await updateRecipe(r)
        totalUpdated += 1
      }
    }
    offset += batch.length
  }
  console.log(`[OK] Receitas atualizadas: ${totalUpdated}`)
}

main().catch(e => { console.error(e); process.exit(1) })


