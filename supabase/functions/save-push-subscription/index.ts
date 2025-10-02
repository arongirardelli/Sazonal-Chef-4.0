import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
  try {
    const auth = req.headers.get('Authorization') || ''
    if (!auth.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })
    const jwt = auth.replace('Bearer ', '')
    const body = await req.json().catch(() => null) as { subscription: any } | null
    if (!body?.subscription) return new Response('Bad Request', { status: 400 })

    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE')

    const user = await fetch(url + '/auth/v1/user', { headers: { Authorization: `Bearer ${jwt}`, apikey: anon } }).then(r => r.ok ? r.json() : null)
    if (!user?.id) return new Response('Unauthorized', { status: 401 })

    const payload = { user_id: user.id, subscription_object: body.subscription }
    const upsert = await fetch(url + '/rest/v1/push_subscriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${service || anon}`, 'apikey': anon, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload)
    })
    if (!upsert.ok) return new Response('DB Error', { status: 500 })
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response('Internal Error', { status: 500 })
  }
}



