# 🧪 Guia de Teste da API Resend

## ✅ Função Criada e Deployada

A Edge Function `test-resend` foi criada e deployada com sucesso no projeto Supabase.

## 🚀 Como Executar o Teste

### **1. Acessar a Função de Teste**

**URL da Função:**
```
https://yspxyqrehhibogspctck.supabase.co/functions/v1/test-resend
```

**Método:** Simplesmente abra esta URL no seu navegador ou faça uma requisição GET.

### **2. O que Acontece**

Quando você acessar a URL, a função irá:

1. ✅ Verificar se `RESEND_API_KEY` está configurada
2. ✅ Tentar conectar com a API da Resend
3. ✅ Enviar um e-mail de teste para `arongirardelli@gmail.com`
4. ✅ Retornar o resultado da operação

## 📧 E-mail de Teste

### **Detalhes do E-mail:**
- **De:** `Sazonal Chef <suporte@sazonalchef.com>`
- **Para:** `arongirardelli@gmail.com`
- **Assunto:** "Teste de Conexão - Sazonal Chef & Resend"
- **Conteúdo:** Confirmação de que a API está funcionando

## 🔍 Interpretando os Resultados

### **✅ Sucesso (Status 200)**
```json
{
  "success": true,
  "message": "E-mail de teste enviado com sucesso!",
  "data": { ... }
}
```

**O que significa:**
- Sua chave `RESEND_API_KEY` está correta ✅
- A API da Resend está funcionando ✅
- O domínio está verificado ✅
- Você receberá o e-mail de teste ✅

### **❌ Erro (Status 500)**
```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

**Possíveis erros:**
- `RESEND_API_KEY não foi encontrado` → Variável não configurada
- `A API da Resend retornou um erro` → Chave inválida ou domínio não verificado
- Outros erros de conectividade

## 🛠️ Solução de Problemas

### **Problema: RESEND_API_KEY não encontrada**
**Solução:**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **Settings** > **Edge Functions**
3. Adicione a variável `RESEND_API_KEY` com sua chave da Resend

### **Problema: Erro da API da Resend**
**Solução:**
1. Verifique se a chave está correta no [Resend Dashboard](https://resend.com)
2. Confirme se o domínio `sazonalchef.com` está verificado
3. Verifique se não excedeu a quota gratuita

### **Problema: E-mail não recebido**
**Solução:**
1. Verifique a pasta de spam
2. Confirme se o e-mail está correto: `arongirardelli@gmail.com`
3. Aguarde alguns minutos (às vezes há delay)

## 📊 Logs de Monitoramento

### **Logs de Sucesso:**
```
Tentando enviar e-mail de teste...
E-mail de teste enviado com sucesso: { id: "abc123", ... }
```

### **Logs de Erro:**
```
Erro retornado pela API da Resend: { message: "Invalid API key" }
Erro fatal na função de teste: Error: A API da Resend retornou um erro: Invalid API key
```

## 🧹 Limpeza Após o Teste

### **Remover a Função de Teste:**
```bash
supabase functions delete test-resend
```

**⚠️ Importante:** Execute este comando após confirmar que tudo está funcionando.

## 🎯 Próximos Passos

### **Se o Teste Passou:**
1. ✅ A API da Resend está funcionando
2. ✅ O e-mail de boas-vindas da função `cakto-processor` funcionará
3. ✅ Pode remover a função de teste
4. ✅ Está pronto para produção

### **Se o Teste Falhou:**
1. ❌ Configure a `RESEND_API_KEY` corretamente
2. ❌ Verifique o domínio na Resend
3. ❌ Execute o teste novamente
4. ❌ Só remova a função após o sucesso

## 🔗 Links Úteis

- **Supabase Dashboard:** https://supabase.com/dashboard/project/yspxyqrehhibogspctck
- **Resend Dashboard:** https://resend.com
- **Função de Teste:** https://yspxyqrehhibogspctck.supabase.co/functions/v1/test-resend

## 📝 Notas Importantes

- A função de teste é **apenas para diagnóstico**
- **NÃO use em produção**
- **Sempre remova** após confirmar o funcionamento
- O e-mail será enviado para `arongirardelli@gmail.com` (seu e-mail)

---

**🎯 Status:** Função criada e deployada ✅  
**🚀 Pronto para:** Teste da API Resend  
**📧 E-mail de teste:** `arongirardelli@gmail.com`
