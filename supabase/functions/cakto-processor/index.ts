// deno-lint-ignore-file no-explicit-any
// @ts-ignore - Edge Function do Supabase
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Edge Function do Supabase
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore - Edge Function do Supabase
import { Resend } from 'https://esm.sh/resend'

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface CaktoCustomer { name: string; email: string; phone: string; docNumber: string; }
interface CaktoProduct { id: string; name: string; type: string; }
interface CaktoWebhookPayload {
  data: {
    id: string;
    refId: string;
    amount: number;
    baseAmount: number;
    paymentMethod: string;
    customer: CaktoCustomer;
    product: CaktoProduct;
    status: string;
    paidAt?: string;
  };
  event: string;
  secret: string;
}

type CaktoEventType =
  | 'purchase_approved' | 'subscription_renewed' | 'subscription_created'
  | 'purchase_refused' | 'refund' | 'chargeback' | 'subscription_canceled' | 'subscription_renewal_refused';

const EVENT_STATUS_MAPPING: Record<CaktoEventType, 'active' | 'inactive'> = {
  'purchase_approved': 'active',
  'subscription_renewed': 'active',
  'subscription_created': 'active',
  'purchase_refused': 'inactive',
  'refund': 'inactive',
  'chargeback': 'inactive',
  'subscription_canceled': 'inactive',
  'subscription_renewal_refused': 'inactive',
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function generateSecurePassword(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function determinePlanType(productName: string): 'monthly' | 'yearly' {
  const name = productName.toLowerCase();
  return name.includes('mensal') || name.includes('monthly') ? 'monthly' : 'yearly';
}

async function generateMagicLink(supabaseAdmin: SupabaseClient, email: string, isNewUser: boolean = false): Promise<string> {
  try {
    // Para usuários já registrados (mesmo que sejam "novos" na nossa lógica),
    // usamos sempre 'magiclink' pois 'signup' não funciona para emails já existentes
    const linkType = 'magiclink';
    
    console.log(`[cakto-processor] Gerando link mágico tipo '${linkType}' para ${email} (isNewUser: ${isNewUser})`);
    
    // Configuração de redirecionamento usando variável de ambiente
    // @ts-ignore - Edge Function do Supabase
    const siteUrl = Deno.env.get('SITE_URL') || 'http://192.168.0.18:5174';
    const redirectUrl = `${siteUrl}/finalizar-cadastro`;
    console.log(`[cakto-processor] URL de redirecionamento configurada: ${redirectUrl}`);
    
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: linkType,
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      throw new Error(`Erro ao gerar link mágico: ${error.message}`);
    }

    console.log(`✅ [cakto-processor] Link mágico gerado com sucesso para ${email}`);
    console.log(`🔗 [cakto-processor] Link gerado: ${data.properties.action_link}`);
    return data.properties.action_link;
  } catch (error) {
    console.error(`❌ [cakto-processor] Erro ao gerar link mágico para ${email}:`, error);
    throw error;
  }
}

async function sendWelcomeEmail(customerEmail: string, customerName: string, magicLink: string): Promise<void> {
  try {
    // @ts-ignore - Edge Function do Supabase
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    // @ts-ignore - Edge Function do Supabase
    if (!Deno.env.get('RESEND_API_KEY')) {
      console.warn(`⚠️ [cakto-processor] RESEND_API_KEY não configurada. E-mail de boas-vindas não será enviado.`);
      return;
    }

    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
  <title>Bem-vindo ao Sazonal Chef!</title>
  <style>
    body {
      font-family: 'Nunito', Arial, sans-serif;
      background-color: #F5F0E5;
      color: #333333;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      max-width: 600px;
      margin: auto;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    h1 {
      color: #2C5530; /* Verde Escuro */
      font-size: 24px;
      margin-top: 10px;
    }
    p {
      line-height: 1.6;
      font-size: 16px;
      color: #555555;
    }
    .button {
      background-color: #D35400; /* Laranja Queimado */
      color: #2C5530; /* Verde Escuro */
      padding: 16px 30px;
      text-decoration: none;
      border-radius: 8px;
      display: inline-block;
      font-weight: 700; /* Bold */
      font-size: 16px;
      border: none;
      cursor: pointer;
      margin: 30px 0;
    }
    .footer {
      font-size: 12px;
      color: #999999;
      text-align: center;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Olá, ${customerName}!</h1>
    <p>A porta da nossa cozinha está oficialmente aberta para você! Seu pagamento foi confirmado e sua jornada culinária no Sazonal Chef está prestes a começar.</p>
    <p>Para pegar suas chaves e garantir sua segurança, o próximo passo é simples: clique no botão abaixo para definir sua senha e acessar sua conta pela primeira vez.</p>
    
    <a href="${magicLink}" class="button">Finalizar Cadastro e Entrar na Cozinha</a>
    
    <p style="font-size: 14px; color: #888;">Este link é único, seguro e expira em 24 horas.</p>
    <p>Nos vemos na cozinha!<br><strong>- Equipe Sazonal Chef</strong></p>
  </div>
  <div class="footer">
    <p>Você recebeu este e-mail porque se inscreveu no Sazonal Chef.</p>
  </div>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: 'Sazonal Chef <suporte@sazonalchef.com>',
      to: customerEmail,
      subject: 'Seu acesso à cozinha do Sazonal Chef chegou! 🍳',
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Erro ao enviar e-mail: ${error.message}`);
    }

    console.log(`✅ [cakto-processor] E-mail de boas-vindas enviado com sucesso para ${customerEmail}. Message ID: ${data?.id}`);
  } catch (error) {
    console.error(`❌ [cakto-processor] Erro ao enviar e-mail de boas-vindas para ${customerEmail}:`, error);
    // Não interrompe o fluxo principal - o usuário já foi criado com sucesso
  }
}

async function logEvent(
    supabaseAdmin: SupabaseClient, 
    payload: CaktoWebhookPayload, 
    status: 'success' | 'error', 
    errorMessage?: string
) {
    const { event: eventType, data: eventData } = payload;
    const { customer, product, id: subscriptionId, refId, paymentMethod, amount, baseAmount } = eventData;

    const { error: logError } = await supabaseAdmin.from('cakto_webhook_logs').insert({
        event_type: eventType,
        customer_email: customer.email,
        product_name: product.name,
        subscription_id: subscriptionId,
        cakto_ref_id: refId,
        status: eventData.status,
        subscription_status: EVENT_STATUS_MAPPING[eventType as CaktoEventType] || 'unknown',
        amount: amount,
        base_amount: baseAmount,
        payment_method: paymentMethod,
        raw_payload: payload,
        success: status === 'success',
        error_message: errorMessage,
    });

    if (logError) {
        console.error(`CRITICAL: Failed to write to cakto_webhook_logs. Reason: ${logError.message}`);
    }
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

// @ts-ignore - Edge Function do Supabase
serve(async (req) => {
  const startTime = Date.now();
  console.log(`🚀 [cakto-processor] Webhook recebido em: ${new Date().toISOString()}`);

  const responsePayload: Record<string, unknown> = { success: true };
  let httpStatus = 200;
  let payload: CaktoWebhookPayload | null = null;
  
  // @ts-ignore - Edge Function do Supabase
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL');
  // @ts-ignore - Edge Function do Supabase
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [cakto-processor] Variáveis de ambiente do Supabase não configuradas');
      return new Response(JSON.stringify({ success: false, error: 'Internal Server Configuration Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
  });

  try {
    if (req.method !== 'POST') throw new Error('Method Not Allowed');

    payload = await req.json();
    
    // Verificação de tipo para garantir que payload não é null
    if (!payload) {
      throw new Error('Payload inválido ou vazio');
    }
    
    // @ts-ignore - Edge Function do Supabase
    const caktoSecret = Deno.env.get('CAKTO_WEBHOOK_SECRET');
    if (!caktoSecret || payload.secret !== caktoSecret) {
      throw new Error('Unauthorized: Invalid secret');
    }

    const eventType = payload.event as CaktoEventType;
    const subscriptionStatus = EVENT_STATUS_MAPPING[eventType];
    const { data: eventData } = payload;
    const { customer, product, id: subscriptionId, refId, paymentMethod, amount, baseAmount } = eventData;
    const { name: customerName, email: customerEmail, phone: customerPhone, docNumber: customerDoc } = customer;

    responsePayload.event = eventType;

    if (!subscriptionStatus) {
      const message = `Evento não mapeado: ${eventType}. Ignorando.`;
      console.log(`⏭️ [cakto-processor] ${message}`);
      responsePayload.message = 'Evento não mapeado, ignorado intencionalmente.';
      await logEvent(supabaseAdmin, payload, 'success', message);
      return new Response(JSON.stringify(responsePayload), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    console.log(`[cakto-processor] Buscando usuário AUTH: ${customerEmail}`);
    const { data: { users }, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers({ email: customerEmail });

    if (listUsersError) {
      throw new Error(`Erro ao buscar usuário AUTH: ${listUsersError.message}`);
    }

    const existingAuthUser = users ? users.find(u => u.email === customerEmail) : null;

    // IMPORTANTE: Verificação robusta para inconsistência de dados no Supabase Auth
    // Se o e-mail do usuário encontrado não corresponder ao e-mail do payload, tratamos como NOVO USUÁRIO.
    const finalExistingAuthUser = existingAuthUser;

    let userId: string;
    let isNewUser = false;

    if (finalExistingAuthUser) {
      userId = finalExistingAuthUser.id;
      console.log(`[cakto-processor] Usuário AUTH encontrado: ${userId}. Verificando e atualizando perfil.`);

      const { data: existingProfile, error: findError } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (findError) {
        throw new Error(`Erro ao verificar perfil existente para ${userId}: ${findError.message}`);
      }

      const profileData = {
        subscription_status: subscriptionStatus,
        subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      };

      if (existingProfile) {
        console.log(`[cakto-processor] Perfil encontrado para ${userId}. Atualizando.`);
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', userId);
        if (updateError) {
          throw new Error(`Erro ao ATUALIZAR perfil para usuário ${userId}: ${updateError.message}`);
        }
      } else {
        console.warn(`[cakto-processor] PERFIL NÃO ENCONTRADO para usuário AUTH ${userId}. Criando um novo registro de perfil para corrigir inconsistência.`);
        const { error: insertError } = await supabaseAdmin
          .from('user_profiles')
          .insert({ ...profileData, user_id: userId, email: customerEmail, full_name: customerName });
        if (insertError) {
          throw new Error(`Erro ao INSERIR perfil para usuário órfão ${userId}: ${insertError.message}`);
        }
      }
      console.log(`[cakto-processor] Perfil de ${userId} sincronizado com sucesso.`);

    } else {
      if (subscriptionStatus === 'inactive') {
        const message = `Evento de inativação para usuário não existente: ${customerEmail}. Ignorando.`;
        console.log(`[cakto-processor] ${message}`);
        responsePayload.message = message;
        await logEvent(supabaseAdmin, payload, 'success', message);
        return new Response(JSON.stringify(responsePayload), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      console.log(`[cakto-processor] Criando novo usuário AUTH para: ${customerEmail}`);
      
      // Refatoração: Substituindo a chamada bugada da biblioteca por chamada direta à API REST
      // @ts-ignore - Edge Function do Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL');
      // @ts-ignore - Edge Function do Supabase
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      // @ts-ignore - Edge Function do Supabase
      const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
      
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        throw new Error('Variáveis de ambiente do Supabase não configuradas para criação de usuário');
      }
      
      const createUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': anonKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          password: generateSecurePassword(),
          email_confirm: true,
          user_metadata: { source: 'cakto', full_name: customerName },
        }),
      });

      if (!createUserResponse.ok) {
        const errorData = await createUserResponse.text();
        if (errorData.includes('already been registered')) {
          throw new Error(`CONDIÇÃO DE CORRIDA: Usuário ${customerEmail} criado por outra requisição. Reenviar webhook.`);
        }
        throw new Error(`Erro ao criar usuário AUTH via API REST: ${createUserResponse.status} - ${errorData}`);
      }
      
      const newUserResponse = await createUserResponse.json();
      userId = newUserResponse.id;
      isNewUser = true;
      console.log(`[cakto-processor] Novo usuário AUTH criado: ${userId}. Populando perfil e preferências.`);

      const { error: profileUpsertError } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
          user_id: userId,
          email: customerEmail,
          full_name: customerName,
          phone: customerPhone,
          document_number: customerDoc,
          subscription_status: subscriptionStatus,
          plan_type: determinePlanType(product.name),
          subscription_id: subscriptionId,
          cakto_ref_id: refId,
          subscription_start_date: new Date().toISOString(),
          payment_method: paymentMethod,
          amount: amount / 100,
          base_amount: baseAmount / 100,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (profileUpsertError) {
        throw new Error(`Erro ao SINCRONIZAR (upsert) perfil para novo usuário ${userId}: ${profileUpsertError.message}`);
      }
      console.log(`[cakto-processor] Perfil para novo usuário ${userId} populado.`);

      const { error: settingsError } = await supabaseAdmin.from('user_settings').update({ email: customerEmail }).eq('user_id', userId);
      if (settingsError) {
        console.warn(`[cakto-processor] Erro ao ATUALIZAR preferências para ${userId}: ${settingsError.message}`);
      } else {
        console.log(`✅ [cakto-processor] Preferências para novo usuário ${userId} atualizadas.`);
      }
    }

    if (isNewUser && subscriptionStatus === 'active') {
      // Lógica de envio de e-mail de boas-vindas APENAS para usuários NOVOS
      console.log(`[cakto-processor] Usuário NOVO criado. Enviando e-mail de boas-vindas para: ${customerEmail}`);
      try {
        const magicLink = await generateMagicLink(supabaseAdmin, customerEmail, isNewUser);
        await sendWelcomeEmail(customerEmail, customerName, magicLink);
        console.log(`✅ [cakto-processor] E-mail de boas-vindas enviado com sucesso para NOVO usuário: ${customerEmail}`);
      } catch (emailError) {
        console.error(`❌ [cakto-processor] Erro ao enviar e-mail de boas-vindas para NOVO usuário ${customerEmail}:`, emailError);
        // Não interrompe o fluxo principal - apenas loga o erro
      }
    } else if (subscriptionStatus === 'active') {
      // Usuário existente com assinatura ativa - NÃO envia e-mail de boas-vindas
      console.log(`[cakto-processor] Usuário EXISTENTE com assinatura ativa: ${customerEmail}. E-mail de boas-vindas NÃO enviado (renovação de assinatura).`);
    }

    console.log(`[cakto-processor] Processamento bem-sucedido para: ${customerEmail} | User ID: ${userId}`);
    await logEvent(supabaseAdmin, payload, 'success');

    responsePayload.user_id = userId;
    responsePayload.customer_email = customerEmail;
    responsePayload.subscription_status = subscriptionStatus;

  } catch (error) {
    console.error('❌ [cakto-processor] Erro fatal no webhook:', error instanceof Error ? error.message : 'Erro desconhecido');
    httpStatus = 500;
    responsePayload.success = false;
    responsePayload.error = error instanceof Error ? error.message : 'Erro desconhecido';
    
    if (payload) {
        await logEvent(supabaseAdmin, payload, 'error', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  
  } finally {
    const responseTime = Date.now() - startTime;
    console.log(`✅ [cakto-processor] Processamento finalizado em ${responseTime}ms com status ${httpStatus}`);
    return new Response(JSON.stringify(responsePayload), {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});