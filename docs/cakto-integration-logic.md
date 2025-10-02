# Lógica da Integração Cakto (Função `cakto-processor`)

Este documento detalha a lógica atualizada da função `cakto-processor` localizada em `supabase/functions/cakto-processor/index.ts`, responsável por processar webhooks da Cakto para gerenciar a criação de novos usuários e a atualização de suas assinaturas no Sazonal Chef.

## 1. Visão Geral e Fluxo de Comunicação

A função `cakto-processor` atua como um endpoint para receber eventos da Cakto via webhooks. Cada evento aciona uma lógica específica para manter o banco de dados do Sazonal Chef sincronizado com o status dos clientes e suas assinaturas na Cakto.

**Caminho do Webhook:**
Cakto (Evento) -> Webhook (POST Request) -> `cakto-processor` (Supabase Function) -> Supabase Database (Atualização de `user_profiles` e `user_settings`)

## 2. Recebimento e Validação do Webhook

- **Método:** A função espera requisições `POST`.
- **Autenticação/Segurança:** Todas as requisições são validadas usando o campo `secret` no payload. Este campo é verificado contra um segredo (`CAKTO_WEBHOOK_SECRET`) para garantir a integridade e a origem da requisição. Requisições com segredo inválido são rejeitadas.
- **Parsing:** O corpo da requisição (JSON) é parseado para extrair os dados do evento.

## 3. Estrutura de Dados e Tipos

### Interfaces TypeScript
```typescript
interface CaktoCustomer {
  name: string;
  email: string;
  phone: string;
  docNumber: string;
}

interface CaktoProduct {
  id: string;
  name: string;
  type: string;
}

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
```

### Tipos de Eventos Suportados
```typescript
type CaktoEventType =
  | 'purchase_approved' | 'subscription_renewed' | 'subscription_created'
  | 'purchase_refused' | 'refund' | 'chargeback' | 'subscription_canceled' | 'subscription_renewal_refused';
```

### Mapeamento de Status
```typescript
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
```

## 4. Lógica de Tratamento de Eventos

A função utiliza uma estrutura baseada no `event` enviado pela Cakto para processar diferentes tipos de eventos:

### a) Eventos de Ativação (`active`)
- **Eventos:** `purchase_approved`, `subscription_renewed`, `subscription_created`
- **Ação:** Define o status da assinatura como `active`

### b) Eventos de Inativação (`inactive`)
- **Eventos:** `purchase_refused`, `refund`, `chargeback`, `subscription_canceled`, `subscription_renewal_refused`
- **Ação:** Define o status da assinatura como `inactive`

## 5. Processamento de Usuários

### Verificação de Usuário Existente
1. **Busca no Supabase Auth:** A função busca o usuário pelo e-mail usando `supabaseAdmin.auth.admin.listUsers()`
2. **Verificação de Perfil:** Verifica se existe um perfil na tabela `user_profiles`
3. **Tratamento de Inconsistências:** Se o usuário AUTH existir mas não tiver perfil, cria um novo perfil para corrigir a inconsistência

### Criação de Novo Usuário
1. **Criação via API REST:** Utiliza a API REST do Supabase para criar o usuário (evitando bugs da biblioteca)
2. **População de Perfil:** Cria um perfil completo com todos os dados da Cakto
3. **Configuração de Preferências:** Atualiza a tabela `user_settings`

### Atualização de Usuário Existente
1. **Sincronização de Status:** Atualiza o status da assinatura e informações relacionadas
2. **Manutenção de Dados:** Preserva dados existentes enquanto atualiza informações da Cakto

## 6. Organização do Banco de Dados (Supabase)

A integração com a Cakto depende principalmente de três tabelas no Supabase:

### **`auth.users` (Supabase Auth)**
- Armazena informações de autenticação do usuário
- **`id`:** ID único do usuário (UUID)
- **`email`:** E-mail do usuário
- **`user_metadata`:** Metadados incluindo origem (`source: 'cakto'`) e nome completo

### **`user_profiles`**
- Armazena informações detalhadas do perfil do usuário
- **`user_id`:** Chave estrangeira para `auth.users`
- **`email`:** E-mail do usuário
- **`name`:** Nome completo do usuário
- **`phone`:** Telefone do usuário
- **`document_number`:** Número do documento (CPF/CNPJ)
- **`subscription_status`:** Status atual da assinatura (`active`/`inactive`)
- **`subscription_id`:** ID da assinatura na Cakto
- **`cakto_ref_id`:** ID de referência da Cakto
- **`plan_type`:** Tipo de plano (`monthly`/`yearly`)
- **`subscription_start_date`:** Data de início da assinatura
- **`payment_method`:** Método de pagamento
- **`amount`:** Valor da assinatura (em reais)
- **`base_amount`:** Valor base da assinatura (em reais)

### **`user_settings`**
- Armazena preferências e configurações do usuário
- **`user_id`:** Chave estrangeira para `auth.users`
- **`email`:** E-mail do usuário

### **`cakto_webhook_logs`**
- Armazena logs detalhados de todos os webhooks processados
- **`event_type`:** Tipo do evento recebido
- **`customer_email`:** E-mail do cliente
- **`product_name`:** Nome do produto
- **`subscription_id`:** ID da assinatura
- **`cakto_ref_id`:** ID de referência da Cakto
- **`status`:** Status do evento na Cakto
- **`subscription_status`:** Status mapeado da assinatura
- **`amount`:** Valor do evento
- **`base_amount`:** Valor base do evento
- **`payment_method`:** Método de pagamento
- **`raw_payload`:** Payload completo do webhook
- **`success`:** Indica se o processamento foi bem-sucedido
- **`error_message`:** Mensagem de erro (se houver)

## 7. Funções Auxiliares

### **`generateSecurePassword()`**
- Gera senhas seguras de 16 caracteres para novos usuários
- Inclui letras maiúsculas, minúsculas, números e caracteres especiais

### **`determinePlanType(productName: string)`**
- Determina se o plano é mensal ou anual baseado no nome do produto
- Retorna `'monthly'` ou `'yearly'`

### **`logEvent()`**
- Registra todos os eventos processados na tabela `cakto_webhook_logs`
- Facilita auditoria e depuração de problemas

## 8. Tratamento de Erros e Resiliência

### **Validações de Segurança**
- Verificação de método HTTP (apenas POST)
- Validação de segredo do webhook
- Verificação de variáveis de ambiente

### **Tratamento de Condições de Corrida**
- Detecção de usuários já criados por outras requisições
- Tratamento de inconsistências de dados entre AUTH e perfis

### **Logs e Monitoramento**
- Logs detalhados em todas as operações
- Registro de tempo de processamento
- Captura e registro de todos os erros

### **Respostas HTTP**
- **200 OK:** Processamento bem-sucedido
- **400 Bad Request:** Erro de validação ou dados inválidos
- **500 Internal Server Error:** Erro interno do servidor

## 9. Melhorias Implementadas

### **Refatoração da Criação de Usuários**
- Substituição da biblioteca bugada por chamadas diretas à API REST
- Melhor tratamento de erros e validações

### **Sistema de Logs Robusto**
- Tabela dedicada para logs de webhooks
- Captura de payloads completos para auditoria
- Rastreamento de sucesso/erro de cada evento

### **Tratamento de Inconsistências**
- Detecção automática de usuários órfãos (AUTH sem perfil)
- Criação automática de perfis para corrigir inconsistências
- Sincronização bidirecional entre AUTH e perfis

### **Mapeamento Inteligente de Status**
- Sistema flexível para novos tipos de eventos
- Mapeamento automático para status internos
- Suporte a eventos não mapeados (ignorados intencionalmente)

### **E-mail de Boas-Vindas Automático**
- Envio automático de e-mail de boas-vindas para novos usuários
- Geração de link mágico seguro para finalização do cadastro
- Template HTML responsivo e personalizado com identidade visual do Sazonal Chef
- Integração com Resend para envio transacional profissional
- Tratamento de erros sem interrupção do fluxo principal

## 10. E-mail de Boas-Vindas

### **Funcionalidade**
Quando um novo usuário é criado via webhook da Cakto, a função automaticamente:

1. **Gera um Link Mágico:** Utiliza `supabaseAdmin.auth.admin.generateLink()` para criar um link seguro de signup
2. **Envia E-mail de Boas-Vindas:** Integra com a API da Resend para envio transacional
3. **Template Personalizado:** E-mail com identidade visual do Sazonal Chef e call-to-action claro

### **Fluxo de Implementação**
```typescript
if (isNewUser && subscriptionStatus === 'active') {
  const magicLink = await generateMagicLink(supabaseAdmin, customerEmail);
  await sendWelcomeEmail(customerEmail, customerName, magicLink);
}
```

### **Configuração Necessária**
- **`RESEND_API_KEY`:** Chave de API da Resend (obrigatória)
- **`FRONTEND_URL`:** URL do frontend para redirecionamento (opcional, padrão: `https://sazonalchef.com`)

### **Características do E-mail**
- **Remetente:** `Sazonal Chef <suporte@sazonalchef.com>`
- **Assunto:** "Seu acesso à cozinha do Sazonal Chef chegou! 🍳"
- **Design:** HTML responsivo com estilos inline para compatibilidade máxima
- **Call-to-Action:** Botão destacado para finalizar cadastro
- **Segurança:** Link mágico único com expiração de 24 horas

### **Tratamento de Erros**
- Falhas no envio de e-mail não interrompem o fluxo principal
- Logs detalhados para monitoramento e debugging
- Fallback gracioso quando `RESEND_API_KEY` não está configurada

## 11. Considerações de Segurança

- **Validação de Segredo:** Todos os webhooks são validados via `CAKTO_WEBHOOK_SECRET`
- **Autenticação Admin:** Uso de `SUPABASE_SERVICE_ROLE_KEY` para operações privilegiadas
- **Sanitização de Dados:** Validação de tipos e estrutura do payload
- **Logs Seguros:** Payloads completos são armazenados para auditoria

## Conclusão

A função `cakto-processor` foi significativamente aprimorada para fornecer uma integração robusta, segura e auditável com a Cakto. As principais melhorias incluem:

1. **Arquitetura mais robusta** com melhor tratamento de erros
2. **Sistema de logs abrangente** para auditoria e depuração
3. **Tratamento automático de inconsistências** de dados
4. **Refatoração da criação de usuários** para maior confiabilidade
5. **Mapeamento flexível de eventos** para suportar novos tipos de webhooks

A função agora estabelece uma comunicação mais confiável e monitorável com a Cakto, garantindo que o estado dos usuários e suas assinaturas seja consistentemente refletido no banco de dados do Sazonal Chef, com capacidade completa de auditoria e recuperação de erros.
