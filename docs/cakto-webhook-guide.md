# Guia do Webhook da Cakto - Sazonal Chef

Este documento explica como funciona o webhook da Cakto e como testá-lo para o fluxo de finalização de cadastro.

## 📋 Visão Geral

O webhook da Cakto é uma Edge Function que processa eventos de pagamento e assinatura, automaticamente criando ou atualizando usuários no sistema Sazonal Chef.

## 🎯 Eventos Suportados

### ✅ Eventos que Ativam a Assinatura
- **`purchase_approved`** - Compra aprovada
- **`subscription_created`** - Assinatura criada  
- **`subscription_renewed`** - Assinatura renovada

**Resultado:** `subscription_status` definido como `"active"`

### ❌ Eventos que Cancelam a Assinatura
- **`purchase_declined`** - Compra recusada
- **`refund`** - Reembolso
- **`chargeback`** - Chargeback
- **`subscription_cancelled`** - Assinatura cancelada
- **`subscription_renewal_declined`** - Renovação de assinatura recusada

**Resultado:** `subscription_status` definido como `"cancelled"`

## 🔄 Fluxo de Processamento

### Para Eventos Ativos:
1. ✅ Validação do secret
2. 👤 Verificação se usuário existe
3. 🆕 Criação de usuário (se não existir)
4. 📝 Criação/atualização do perfil
5. ⚙️ Criação das configurações
6. 🔗 Geração de link mágico
7. 📧 Envio de e-mail de boas-vindas
8. 📊 Log do webhook

### Para Eventos de Cancelamento:
1. ✅ Validação do secret
2. 👤 Verificação se usuário existe
3. 📝 Atualização do perfil (se existir)
4. 📧 Envio de e-mail de notificação
5. 📊 Log do webhook

## 🧪 Como Testar

### Pré-requisitos
- Supabase local rodando (`supabase start`)
- Edge Function `cakto-webhook` implantada
- Variáveis de ambiente configuradas

### 1. Teste com Script Bash
```bash
# Tornar executável
chmod +x test-cakto-webhook.sh

# Executar todos os testes
./test-cakto-webhook.sh
```

### 2. Teste com Script Node.js
```bash
# Executar todos os testes
node scripts/testCaktoWebhook.mjs

# Testar evento específico
node scripts/testCaktoWebhook.mjs --single purchase_approved
```

### 3. Teste Manual com cURL
```bash
# Exemplo de evento de compra aprovada
curl -X POST http://localhost:54321/functions/v1/cakto-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": "test_123",
      "customer": {
        "name": "Teste Usuário",
        "email": "contactvitalscoop@gmail.com",
        "phone": "+5511999999999",
        "docNumber": "12345678901"
      },
      "product": {
        "id": "prod_test_001",
        "name": "Plano Mensal Premium",
        "type": "subscription",
        "short_id": "PMP001"
      },
      "status": "completed",
      "amount": 2990,
      "baseAmount": 2990,
      "paymentMethod": "credit_card",
      "paidAt": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "event": "purchase_approved",
    "secret": "10264f7a-5c6c-4864-b6db-cde9b493d872"
  }'
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Resend (para e-mails)
RESEND_API_KEY=sua_chave_resend

# Site
SITE_URL=http://localhost:5173
```

### Secret do Webhook
```
10264f7a-5c6c-4864-b6db-cde9b493d872
```

## 📊 Monitoramento

### Logs do Webhook
Todos os eventos são registrados na tabela `cakto_webhook_logs` com:
- Tipo do evento
- E-mail do cliente
- Nome do produto
- ID da assinatura
- Status do processamento
- Payload completo
- Timestamp

### Verificação de Usuários
- **Tabela `user_profiles`**: Perfil e status da assinatura
- **Tabela `user_settings`**: Configurações do usuário
- **Autenticação**: Usuário criado com metadados da Cakto

## 🚀 Fluxo de Finalização de Cadastro

### 1. Evento Recebido
Quando um evento ativo é recebido (ex: `purchase_approved`)

### 2. Criação do Usuário
- Usuário criado na autenticação do Supabase
- Senha temporária gerada automaticamente
- Metadados incluindo origem "cakto"

### 3. Perfil e Configurações
- Perfil criado com `subscription_status: "active"`
- Configurações iniciais definidas
- Data de início da assinatura registrada

### 4. Link Mágico
- Link mágico gerado para `/finalizar-cadastro`
- Válido por 24 horas
- Redirecionamento automático após login

### 5. E-mail de Boas-vindas
- E-mail enviado com link mágico
- Informações do plano contratado
- Instruções para finalizar cadastro

### 6. Acesso ao App
- Usuário clica no link mágico
- Redirecionado para página de finalização
- Define senha pessoal
- Acesso liberado ao aplicativo

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro 401 - Unauthorized
- Verificar se o secret está correto
- Confirmar que o secret está sendo enviado no payload

#### 2. Erro 500 - Internal Server Error
- Verificar variáveis de ambiente
- Confirmar que o Supabase está rodando
- Verificar logs da Edge Function

#### 3. Usuário não criado
- Verificar permissões da service role key
- Confirmar que as tabelas existem
- Verificar logs de erro

#### 4. E-mail não enviado
- Verificar RESEND_API_KEY
- Confirmar que o Resend está configurado
- Verificar logs de envio

### Logs Úteis
```bash
# Logs da Edge Function
supabase functions logs cakto-webhook

# Logs do banco
supabase db logs

# Status das funções
supabase functions list
```

## 📱 Testando o Fluxo Completo

### 1. Simular Compra Aprovada
```bash
node scripts/testCaktoWebhook.mjs --single purchase_approved
```

### 2. Verificar no Supabase
- Usuário criado na autenticação
- Perfil com `subscription_status: "active"`
- Log salvo em `cakto_webhook_logs`

### 3. Verificar E-mail
- E-mail recebido em `contactvitalscoop@gmail.com`
- Link mágico válido
- Redirecionamento para `/finalizar-cadastro`

### 4. Testar Acesso
- Clicar no link mágico
- Definir senha
- Acessar aplicativo

## 🔐 Segurança

### Validações Implementadas
- ✅ Secret obrigatório e validado
- ✅ Método HTTP restrito a POST
- ✅ Validação de payload
- ✅ Tratamento de erros
- ✅ Logs de auditoria

### Dados Sensíveis
- Senhas temporárias são geradas automaticamente
- E-mails contêm apenas informações necessárias
- Logs não expõem dados sensíveis
- Secret não é exposto em logs

## 📈 Próximos Passos

### Melhorias Planejadas
- [ ] Retry automático para falhas de e-mail
- [ ] Webhook de confirmação para Cakto
- [ ] Métricas e alertas
- [ ] Dashboard de monitoramento
- [ ] Validação de assinaturas duplicadas

### Integrações Futuras
- [ ] Webhook para outros gateways de pagamento
- [ ] Sistema de notificações push
- [ ] Analytics de conversão
- [ ] A/B testing de e-mails

## 📞 Suporte

Para dúvidas ou problemas:
- Verificar logs da Edge Function
- Consultar tabelas de log no Supabase
- Verificar configuração das variáveis de ambiente
- Testar com scripts fornecidos

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0  
**Responsável:** Equipe de Desenvolvimento Sazonal Chef

