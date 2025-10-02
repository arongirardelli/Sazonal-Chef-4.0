export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('Origin')
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers })
  }

  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Função funcionando!',
    origin: origin,
    method: req.method 
  }), { headers })
}