# Testes do Sazonal Chef com TestSprite

Este diretório contém todos os testes automatizados para o projeto Sazonal Chef usando TestSprite.

## 📁 Estrutura dos Testes

```
tests/
├── e2e/                    # Testes end-to-end
│   ├── auth.spec.js        # Testes de autenticação
│   ├── navigation.spec.js  # Testes de navegação
│   ├── recipes.spec.js     # Testes de receitas
│   ├── shopping-list.spec.js # Testes de lista de compras
│   └── profile.spec.js     # Testes de perfil e preferências
├── fixtures/               # Dados de teste
│   └── test-data.js       # Dados centralizados para testes
└── README.md              # Este arquivo
```

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Servidor de desenvolvimento rodando:**
   ```bash
   npm run dev
   ```

2. **TestSprite configurado:**
   - O TestSprite já está configurado no arquivo `mcp.json`
   - A configuração está em `testsprite.config.js`

### Comandos de Teste

```bash
# Executar todos os testes
npm run test

# Executar testes específicos
npm run test:auth        # Testes de autenticação
npm run test:navigation  # Testes de navegação
npm run test:recipes     # Testes de receitas
npm run test:shopping    # Testes de lista de compras
npm run test:profile     # Testes de perfil

# Executar teste específico
node run-tests.js tests/e2e/auth.spec.js
```

## 📋 Cobertura de Testes

### ✅ Funcionalidades Testadas

#### Autenticação (`auth.spec.js`)
- ✅ Navegação para página de login
- ✅ Validação de credenciais inválidas
- ✅ Navegação para página de registro
- ✅ Navegação para recuperação de senha
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato de email

#### Navegação (`navigation.spec.js`)
- ✅ Navegação entre páginas principais
- ✅ Exibição da navegação inferior
- ✅ Estado ativo da navegação
- ✅ Navegação por URL direta
- ✅ Redirecionamento para rota inválida
- ✅ Funcionamento do botão voltar

#### Receitas (`recipes.spec.js`)
- ✅ Exibição de receitas na página inicial
- ✅ Abertura de modal de receita
- ✅ Fechamento de modal
- ✅ Navegação para página de receita individual
- ✅ Filtro por categoria
- ✅ Salvar receita nos favoritos
- ✅ Exibição de receitas salvas

#### Lista de Compras (`shopping-list.spec.js`)
- ✅ Navegação para página de lista de compras
- ✅ Exibição de lista vazia
- ✅ Geração de lista a partir de receitas
- ✅ Marcar ingrediente como comprado
- ✅ Remover ingrediente da lista
- ✅ Limpar toda a lista
- ✅ Agrupamento por categoria
- ✅ Cálculo de quantidade total
- ✅ Edição de quantidade

#### Perfil e Preferências (`profile.spec.js`)
- ✅ Navegação para página de perfil
- ✅ Exibição de informações do usuário
- ✅ Configurações de notificação
- ✅ Preferências do usuário
- ✅ Privacidade e segurança
- ✅ Ajuda e suporte
- ✅ Alteração de senha
- ✅ Estatísticas do usuário
- ✅ Logout
- ✅ Validação de campos obrigatórios
- ✅ Validação de confirmação de senha
- ✅ Configurações de dieta
- ✅ Salvamento de preferências

## 🔧 Configuração

### Arquivo de Configuração (`testsprite.config.js`)

```javascript
module.exports = {
  projectName: "Sazonal Chef 4.0",
  baseUrl: "http://localhost:5174",
  browser: {
    headless: false, // Para visualizar os testes
    viewport: { width: 375, height: 812 }
  },
  timeouts: {
    default: 30000,
    navigation: 10000,
    action: 5000
  },
  // ... outras configurações
};
```

### Dados de Teste (`fixtures/test-data.js`)

Centraliza todos os dados utilizados nos testes:
- Usuários válidos e inválidos
- Receitas de exemplo
- Ingredientes por categoria
- URLs das páginas
- Seletores CSS comuns
- Mensagens esperadas

## 📊 Relatórios

Os relatórios de teste são gerados em:
- **HTML:** `./test-reports/index.html`
- **JSON:** `./test-reports/results.json`
- **Screenshots:** `./test-screenshots/` (em caso de falha)

## 🐛 Debugging

### Visualizar Testes
Por padrão, os testes rodam com `headless: false` para visualizar a execução.

### Screenshots
Screenshots são capturados automaticamente em caso de falha.

### Logs
Use as ferramentas do TestSprite para verificar logs do navegador:
- Console logs
- Console errors
- Network logs
- Network errors

## 🔄 Integração Contínua

Para integrar com CI/CD, modifique o `testsprite.config.js`:

```javascript
browser: {
  headless: true, // Para CI/CD
  // ...
}
```

## 📝 Adicionando Novos Testes

1. Crie um novo arquivo `.spec.js` em `tests/e2e/`
2. Use a estrutura base:
   ```javascript
   const { test, expect } = require('@testsprite/testsprite');
   
   test.describe('Nome do Teste', () => {
     test('Deve fazer algo', async ({ page }) => {
       // Seu teste aqui
     });
   });
   ```
3. Adicione o comando no `package.json` se necessário
4. Execute com `npm run test:nome-do-teste`

## 🆘 Solução de Problemas

### Servidor não está rodando
```bash
npm run dev
```

### TestSprite não encontrado
Verifique se o TestSprite está configurado no `mcp.json`.

### Testes falhando
1. Verifique se o servidor está rodando na porta 5174
2. Verifique se os seletores CSS estão corretos
3. Execute um teste específico para debug
4. Verifique os screenshots em caso de falha

### Timeout de testes
Aumente os valores de timeout no `testsprite.config.js`.

## 📚 Recursos Adicionais

- [Documentação do TestSprite](https://testsprite.com/docs)
- [Playwright Documentation](https://playwright.dev/) (base do TestSprite)
- [Best Practices para E2E Testing](https://playwright.dev/docs/best-practices)
