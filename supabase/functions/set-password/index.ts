import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Lista de endereços que podem acessar esta função
const allowedOrigins = [
  'http://localhost:5174',       // Para desenvolvimento local
  'http://192.168.1.181:5174',   // Para testes na sua rede local
  'https://www.sazonalchef.com'  // Para produção (adicione a URL correta quando tiver)
];

serve(async (req) => {
  const origin = req.headers.get('Origin');

  // Prepara os headers de CORS
  const corsHeaders = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  // Se a requisição for do tipo OPTIONS (o navegador fazendo uma checagem),
  // retorne imediatamente com os headers de permissão.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Pega o ID do usuário a partir do token JWT da requisição
    const { data: { user } } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization').replace('Bearer ', ''))
    if (!user) throw new Error('Usuário não encontrado ou token inválido.')

    const { newPassword, displayName } = await req.json()

    // Validação
    if (!newPassword || newPassword.length < 8) {
      throw new Error('A senha precisa ter no mínimo 8 caracteres.')
    }
    // O displayName é opcional para manter a compatibilidade com a chamada antiga (só senha)
    if (displayName && displayName.trim().length < 2) {
      throw new Error('O nome de exibição precisa ter no mínimo 2 caracteres.')
    }

    // 1. Atualiza a senha na tabela auth.users
    const { data: updatedUser, error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    )
    if (updateAuthError) {
      console.error(`[set-password] Erro ao atualizar auth.users para ${user.id}:`, updateAuthError.message);
      throw new Error(`Erro Crítico: Não foi possível atualizar a senha. ${updateAuthError.message}`);
    }

    // 2. Se o displayName foi fornecido, atualiza na tabela user_profiles
    if (displayName) {
        const { error: updateProfileError } = await supabaseAdmin
          .from('user_profiles')
          .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
          .eq('user_id', user.id)

        if (updateProfileError) {
            console.error(`[set-password] AVISO: Senha do usuário ${user.id} foi atualizada, mas falhou ao salvar o display_name:`, updateProfileError.message);
            // Não joga o erro, mas avisa no log. O principal (senha) funcionou.
        }
    }

    // 3. Atualiza a flag has_set_password na tabela user_settings
    const { error: updateSettingsError } = await supabaseAdmin
      .from('user_settings')
      .update({ has_set_password: true })
      .eq('user_id', user.id)

    if (updateSettingsError) {
        console.error(`[set-password] AVISO: Senha do usuário ${user.id} foi atualizada, mas falhou ao atualizar a flag has_set_password:`, updateSettingsError.message);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})