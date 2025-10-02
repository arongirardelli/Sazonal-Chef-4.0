import fetch from 'node-fetch'

// Configurações
const SUPABASE_URL = 'https://yspxyqrehhibogspctck.supabase.co'
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/cakto-processor`

// Evento de compra aprovada - COMPLETAMENTE NOVO para beautiesbang@gmail.com
const webhookPayload = {
  "data": {
    "id": "c3d4e5f6-g7h8-9012-cdef-g34567890123", // ID único novo
    "pix": {
      "qrCode": "pix_qr_beautiesbang_novo_2025_57916",
      "expirationDate": "2025-02-23"
    },
    "card": {
      "brand": "hipercard",
      "holderName": "Maria Beatriz Santos",
      "lastDigits": "2345"
    },
    "offer": {
      "id": "OfertaBeautiesBangNovo2025",
      "name": "Plano Mensal Premium Beleza Plus",
      "price": 79.90
    },
    "refId": "ref_beautiesbang_novo_57916", // Referência única nova
    "amount": 7990, // R$ 79,90 em centavos
    "boleto": {
      "barcode": "03399853012970000154708032001011596630000007990",
      "boletoUrl": "https://boleto.beautiesbang.com.br/novo_plus",
      "expirationDate": "2025-02-28"
    },
    "paidAt": "2025-02-23T18:20:00.000000+00:00", // Data futura
    "picpay": {
      "qrCode": "picpay_beautiesbang_novo_qr_57916",
      "paymentURL": "https://picpay.beautiesbang.com.br/novo_plus",
      "expirationDate": "2025-02-23 23:20:00-03:00"
    },
    "reason": null, // Sem motivo de recusa para compra aprovada
    "status": "waiting_payment",
    "product": {
      "id": "produto_beautiesbang_novo_2025_904",
      "name": "Sazonal Chef Mensal Premium Beleza Plus",
      "type": "subscription", // Assinatura mensal
      "short_id": "SCMPBP2025",
      "supportEmail": "suporte@sazonalchef.com",
      "invoiceDescription": "Assinatura Mensal Premium Beleza Plus Sazonal Chef"
    },
    "customer": {
      "name": "Maria Beatriz Santos",
      "email": "beautiesbang@gmail.com", // Email para teste
      "phone": "11977665544", // Telefone existente
      "docNumber": "87654321098" // CPF existente
    },
    "discount": 15, // Desconto de 15%
    "affiliate": "beauty_plus@beautiesbang.com", // Com afiliado novo
    "createdAt": "2025-02-23T18:20:00.000000+00:00", // Data futura
    "baseAmount": 9400, // Valor base com desconto aplicado
    "offer_type": "main",
    "checkoutUrl": "https://pay.cakto.com.br/BEAUTIESBANG_NOVO_2025",
    "commissions": [
      {
        "type": "producer",
        "user": "beautiesbang@exemplo.com",
        "percentage": 80,
        "totalAmount": 15.98
      },
      {
        "type": "affiliate",
        "user": "beauty_plus@beautiesbang.com",
        "percentage": 15,
        "totalAmount": 11.99
      }
    ],
    "installments": 1, // Parcelado em 1x
    "parent_order": "OrdemBeautiesBangNovo2025",
    "paymentMethod": "credit_card",
    "refund_reason": null, // Sem motivo de reembolso
    "paymentMethodName": "Cartão de Crédito"
  },
  "event": "purchase_approved", // Evento de compra aprovada
  "secret": "10264f7a-5c6c-4864-b6db-cde9b493d872" // Secret da Cakto
}

async function testCaktoWebhook() {
  console.log('🧪 Testando webhook da Cakto para beautiesbang@gmail.com (NOVO EVENTO)')
  console.log('📧 Email de teste:', webhookPayload.data.customer.email)
  console.log('💰 Valor:', `R$ ${(webhookPayload.data.amount / 100).toFixed(2)}`)
  console.log('📦 Produto:', webhookPayload.data.product.name)
  console.log('🎯 Tipo de plano:', webhookPayload.data.product.type)
  console.log('💳 Parcelas:', webhookPayload.data.installments)
  console.log('💄 Área de atuação:', 'Beleza e Estética Plus')
  console.log('🔗 URL da função:', EDGE_FUNCTION_URL)
  console.log('🧹 Status do banco:', 'TESTE DE NOVO EVENTO PARA USUÁRIO EXISTENTE')
  
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTg5ODcsImV4cCI6MjA3MDA5NDk4N30.u5aVfaTEtaSGD56giPYahcFrTpts3GjsVL0e5dMGDpo'}`
      },
      body: JSON.stringify(webhookPayload)
    })

    const responseText = await response.text()
    
    console.log('📊 Resposta da Edge Function:')
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    console.log('Body:', responseText)
    
    if (response.ok) {
      console.log('✅ Webhook processado com sucesso!')
      
      // Aguardar um pouco para o processamento assíncrono
      console.log('⏳ Aguardando 3 segundos para processamento...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Verificar se o usuário foi atualizado
      console.log('🔍 Verificando se o usuário foi atualizado...')
      await checkUserUpdate()
      
    } else {
      console.log('❌ Erro no webhook:', response.status, responseText)
    }
    
  } catch (error) {
    console.error('💥 Erro ao enviar webhook:', error.message)
  }
}

async function checkUserUpdate() {
  try {
    // Verificar se o usuário foi atualizado no Supabase
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?email=eq.beautiesbang@gmail.com`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTg5ODcsImV4cCI6MjA3MDA5NDk4N30.u5aVfaTEtaSGD56giPYahcFrTpts3GjsVL0e5dMGDpo',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTg5ODcsImV4cCI6MjA3MDA5NDk4N30.u5aVfaTEtaSGD56giPYahcFrTpts3GjsVL0e5dMGDpo'}`
      }
    })
    
    if (checkResponse.ok) {
      const userData = await checkResponse.json()
      console.log('👤 Usuário encontrado:', userData)
      
      if (userData && userData.length > 0) {
        const user = userData[0]
        console.log('🎉 SUCESSO: Usuário atualizado para beautiesbang@gmail.com!')
        console.log('📊 Dados atualizados do usuário:')
        console.log('- ID:', user.user_id)
        console.log('- Email:', user.email)
        console.log('- Nome:', user.full_name)
        console.log('- Status:', user.subscription_status)
        console.log('- Plano:', user.plan_type)
        console.log('- Valor:', user.amount)
        console.log('- Valor base:', user.base_amount)
        console.log('- Criado em:', user.created_at)
        console.log('- Atualizado em:', user.updated_at)
        console.log('- Referência Cakto:', user.cakto_ref_id)
        
        // Verificar se o usuário está no banco de dados
        console.log('🔍 Verificando status completo no banco...')
        await checkDatabaseStatus()
        
      } else {
        console.log('⚠️ Usuário não encontrado após processamento do webhook')
      }
    } else {
      console.log('❌ Erro ao verificar usuário:', checkResponse.status)
    }
    
  } catch (error) {
    console.error('💥 Erro ao verificar atualização do usuário:', error.message)
  }
}

async function checkDatabaseStatus() {
  try {
    // Verificar status geral do banco
    const statusResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?select=email,subscription_status,plan_type,amount&limit=10`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTg5ODcsImV4cCI6MjA3MDA5NDk4N30.u5aVfaTEtaSGD56giPYahcFrTpts3GjsVL0e5dMGDpo',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTg5ODcsImV4cCI6MjA3MDA5NDk4N30.u5aVfaTEtaSGD56giPYahcFrTpts3GjsVL0e5dMGDpo'}`
      }
    })
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json()
      console.log('📊 Status atual do banco de dados:')
      console.log('Total de usuários:', statusData.length)
      statusData.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - ${user.subscription_status} - ${user.plan_type} - R$ ${user.amount}`)
      })
    }
    
  } catch (error) {
    console.error('💥 Erro ao verificar status do banco:', error.message)
  }
}

// Executar teste
console.log('🚀 Iniciando teste do webhook para beautiesbang@gmail.com (NOVO EVENTO)...')
console.log('🎯 Objetivo: Testar fluxo de novo evento para usuário existente após identificação do problema crítico')
testCaktoWebhook()

