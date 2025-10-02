# Configuração do E-mail de Boas-Vindas - Cakto Integration

Este documento explica como configurar as variáveis de ambiente necessárias para o envio automático de e-mails de boas-vindas quando novos usuários são criados via webhook da Cakto.

## Variáveis de Ambiente Necessárias

### 1. **RESEND_API_KEY** (Obrigatória)
- **Descrição:** Chave de API da Resend para envio de e-mails transacionais
- **Formato:** String alfanumérica
- **Exemplo:** `re_1234567890abcdef...`
- **Localização:** Configure no painel do Supabase > Settings > Edge Functions > Environment Variables

### 2. **FRONTEND_URL** (Opcional)
- **Descrição:** URL do frontend para redirecionamento após autenticação
- **Formato:** URL completa
- **Padrão:** `https://sazonalchef.com` (se não configurado)
- **Exemplo:** `https://app.sazonalchef.com` ou `http://localhost:3000` (desenvolvimento)

## Como Configurar no Supabase

### Passo 1: Acessar o Painel do Supabase
1. Faça login no [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Navegue para **Settings** > **Edge Functions**

### Passo 2: Adicionar Variáveis de Ambiente
1. Na seção **Environment Variables**, clique em **Add**
2. Adicione cada variável:

```
RESEND_API_KEY = re_sua_chave_aqui
FRONTEND_URL = https://seu-dominio.com
```

### Passo 3: Verificar Configuração
1. As variáveis aparecerão na lista
2. Clique em **Save** para confirmar
3. As variáveis estarão disponíveis para todas as Edge Functions

## Configuração da Resend

### Passo 1: Criar Conta na Resend
1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Verifique seu domínio de e-mail

### Passo 2: Obter API Key
1. No dashboard da Resend, vá para **API Keys**
2. Clique em **Create API Key**
3. Copie a chave gerada (começa com `re_`)

### Passo 3: Configurar Domínio
1. Vá para **Domains**
2. Adicione seu domínio (ex: `sazonalchef.com`)
3. Configure os registros DNS conforme instruído
4. Aguarde a verificação

## Teste da Funcionalidade

### 1. Verificar Logs
Após receber um webhook da Cakto, verifique os logs da Edge Function:

```bash
supabase functions logs cakto-processor
```

### 2. Logs Esperados
```
✅ [cakto-processor] E-mail de boas-vindas enviado com sucesso para usuario@email.com. Message ID: abc123
```

### 3. Logs de Erro (se houver)
```
⚠️ [cakto-processor] RESEND_API_KEY não configurada. E-mail de boas-vindas não será enviado.
❌ [cakto-processor] Erro ao enviar e-mail de boas-vindas para usuario@email.com: [erro]
```

## Solução de Problemas

### Problema: E-mail não é enviado
**Possíveis causas:**
- `RESEND_API_KEY` não configurada
- Domínio não verificado na Resend
- Quota de e-mails esgotada

**Solução:**
1. Verificar se a variável está configurada
2. Confirmar verificação do domínio na Resend
3. Verificar logs da Edge Function

### Problema: Link mágico não funciona
**Possíveis causas:**
- `FRONTEND_URL` incorreta
- Rota `/auth/callback` não implementada no frontend

**Solução:**
1. Verificar URL configurada
2. Implementar rota de callback no frontend
3. Testar redirecionamento manual

## Segurança

### Boas Práticas
- ✅ Nunca commite a `RESEND_API_KEY` no código
- ✅ Use variáveis de ambiente do Supabase
- ✅ Monitore o uso da API da Resend
- ✅ Configure rate limiting se necessário

### Monitoramento
- Verifique logs regularmente
- Monitore métricas da Resend
- Configure alertas para falhas de envio

## Exemplo de Configuração Completa

```bash
# Variáveis de ambiente no Supabase
RESEND_API_KEY=re_1234567890abcdef1234567890abcdef12345678
FRONTEND_URL=https://app.sazonalchef.com

# Variáveis já existentes (não alterar)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CAKTO_WEBHOOK_SECRET=seu-segredo-aqui
```

## Conclusão

Com essas configurações, a Edge Function `cakto-processor` enviará automaticamente e-mails de boas-vindas personalizados para todos os novos usuários criados via webhook da Cakto, proporcionando uma experiência de onboarding excepcional e profissional.
