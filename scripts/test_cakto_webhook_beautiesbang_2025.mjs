import fetch from 'node-fetch'

// Configurações
const SUPABASE_URL = 'https://yspxyqrehhibogspctck.supabase.co'
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/cakto-processor`

// Evento de compra aprovada - COMPLETAMENTE NOVO para beautiesbang@gmail.com
const webhookPayload = {
  "data": {
    "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012", // ID único novo
    "pix": {
      "qrCode": "pix_qr_beautiesbang_2025_57915",
      "expirationDate": "2025-02-22"
    },
    "card": {
      "brand": "elo",
      "holderName": "Maria Beatriz Santos",
      "lastDigits": "3456"
    },
    "offer": {
      "id": "OfertaBeautiesBang2025",
      "name": "Plano Trimestral Premium Beleza",
      "price": 99.90
    },
    "refId": "ref_beautiesbang_57915", // Referência única nova
    "amount": 9990, // R$ 99,90 em centavos
    "boleto": {
      "barcode": "03399853012970000154708032001011596630000009990",
      "boletoUrl": "https://boleto.beautiesbang.com.br/novo",
      "expirationDate": "2025-02-27"
    },
    "paidAt": "2025-02-22T16:45:00.000000+00:00", // Data futura
    "picpay": {
      "qrCode": "picpay_beautiesbang_qr_57915",
      "paymentURL": "https://picpay.beautiesbang.com.br/novo",
      "expirationDate": "2025-02-22 21:45:00-03:00"
    },
    "reason": null, // Sem motivo de recusa para compra aprovada
    "status": "waiting_payment",
    "product": {
      "id": "produto_beautiesbang_2025_903",
      "name": "Sazonal Chef Trimestral Premium Beleza",
      "type": "subscription", // Assinatura trimestral
      "short_id": "SCTPB2025",
      "supportEmail": "suporte@sazonalchef.com",
      "invoiceDescription": "Assinatura Trimestral Premium Beleza Sazonal Chef"
    },
    "customer": {
      "name": "Maria Beatriz Santos",
      "email": "beautiesbang@gmail.com", // Email para teste
      "phone": "11977665544", // Telefone novo
      "docNumber": "87654321098" // CPF novo
    },
    "discount": 20, // Desconto de 20%
    "affiliate": "beauty@beautiesbang.com", // Com afiliado
    "createdAt": "2025-02-22T16:45:00.000000+00:00", // Data futura
    "baseAmount": 12488, // Valor base com desconto aplicado
    "offer_type": "main",
    "checkoutUrl": "https://pay.cakto.com.br/BEAUTIESBANG_2025",
    "commissions": [
      {
        "type": "producer",
        "user": "beautiesbang@exemplo.com",
        "percentage": 80,
        "totalAmount": 19.98
      },
      {
        "type": "affiliate",
        "user": "beauty@beautiesbang.com",
        "percentage": 15,
        "totalAmount": 14.99
      }
    ],
    "installments": 3, // Parcelado em 3x
    "parent_order": "OrdemBeautiesBang2025",
    "paymentMethod": "credit_card",
    "refund_reason": null, // Sem motivo de reembolso
    "paymentMethodName": "Cartão de Crédito"
  },
  "event": "purchase_approved", // Evento de compra aprovada
  "secret": "10264f7a-5c6c-4864-b6db-cde9b493d872" // Secret da Cakto
}

async function testCaktoWebhook() {
  console.log('🧪 Testando webhook da Cakto para beautiesbang@gmail.com')
  console.log('📧 Email de teste:', webhookPayload.data.customer.email)
  console.log('💰 Valor:', `R$ ${(webhookPayload.data.amount / 100).toFixed(2)}`)
  console.log('📦 Produto:', webhookPayload.data.product.name)
  console.log('🎯 Tipo de plano:', webhookPayload.data.product.type)
  console.log('💳 Parcelas:', webhookPayload.data.installments)
  console.log('💄 Área de atuação:', 'Beleza e Estética')
  console.log('🔗 URL da função:', EDGE_FUNCTION_URL)
  console.log('🧹 Status do banco:', 'TESTE APÓS LIMPEZA DOS SCRIPTS ANTIGOS')
  
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
      
      // Verificar se o usuário foi criado
      console.log('🔍 Verificando se o usuário foi criado...')
      await checkUserCreation()
      
    } else {
      console.log('❌ Erro no webhook:', response.status, responseText)
    }
    
  } catch (error) {
    console.error('💥 Erro ao enviar webhook:', error.message)
  }
}

async function checkUserCreation() {
  try {
    // Verificar se o usuário foi criado no Supabase
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
        console.log('🎉 SUCESSO: Usuário criado para beautiesbang@gmail.com!')
        console.log('📊 Dados do usuário:', JSON.stringify(userData[0], null, 2))
        
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
    console.error('💥 Erro ao verificar criação do usuário:', error.message)
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
console.log('🚀 Iniciando teste do webhook para beautiesbang@gmail.com...')
console.log('🎯 Objetivo: Testar fluxo após limpeza dos scripts antigos e identificação do problema crítico')
testCaktoWebhook()

