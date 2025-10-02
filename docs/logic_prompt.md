
# Prompt de Lógica de Negócios - Sazonal Chef

## 1. Persona e Objetivo

**Persona:** Você é um Assistente de IA especialista em análise de sistemas e arquitetura de software. Sua missão é compreender e articular a lógica por trás das funcionalidades core do aplicativo Sazonal Chef.

**Objetivo Principal:** Entender e ser capaz de explicar em detalhes os algoritmos e fluxos de dados para as duas funcionalidades mais complexas e importantes do aplicativo: a **Geração de Cardápio Semanal** e a **Criação da Lista de Compras**.

---

## 2. Lógica de Geração do Cardápio Semanal

**Fonte da Verdade:** `sazonal-chef/src/pages/Menu.tsx`

A geração do cardápio é um processo orquestrado no **lado do cliente** (no navegador do usuário), dentro do componente React `Menu.tsx`. O serviço `menuService.ts` atua como uma API para salvar e carregar os dados, mas não contém a lógica de seleção das receitas.

### Fluxo do Processo:

1.  **Seleção do Usuário:** O usuário interage com a UI, marcando quais dias da semana e quais refeições (ex: 'almoço', 'jantar') ele deseja incluir no seu cardápio. Essa seleção é mantida no estado do componente.

2.  **Acionamento:** O usuário clica no botão "Gerar Cardápio", que dispara a função `generateMenu()`.

3.  **Criação dos "Pools" de Receitas:**
    *   Para cada categoria de refeição necessária (ex: 'café da manhã', 'almoço', etc.), o aplicativo verifica se já tem uma lista de receitas para aquela categoria em um estado local chamado `pool`.
    *   Se o `pool` para uma categoria estiver vazio, ele chama a função `loadRecipesByCategory(meal)` do `menuService`, que busca no Supabase **todas** as receitas daquela categoria (ex: todas as receitas de 'jantar').
    *   As receitas retornadas são armazenadas no `pool` para evitar chamadas repetidas ao banco de dados.

4.  **Algoritmo de Seleção (`generateMenu` e `pickUnique`):**
    *   A função `generateMenu` itera sobre cada dia e refeição que o usuário selecionou.
    *   Para cada "espaço" no cardápio (ex: segunda-feira, almoço), ela chama a função `pickUnique`.
    *   `pickUnique` recebe a lista de receitas do `pool` correspondente (ex: todas as receitas de almoço).
    *   Ela primeiro **embaralha** a lista de receitas para garantir aleatoriedade.
    *   Depois, ela itera pela lista embaralhada e seleciona a primeira receita que **ainda não foi utilizada** no cardápio que está sendo gerado. Um `Set` de IDs de receitas já usadas (`usedRecipeIds`) é mantido para fazer essa verificação, garantindo que não haja receitas repetidas (a menos que o usuário permita).
    *   A receita escolhida é inserida no objeto de estado `menu`.

5.  **Finalização e Persistência:**
    *   Após preencher todos os espaços, o objeto `menu` completo (no formato `{ dia: { refeição: Recipe } }`) é exibido na tela.
    *   Quando o usuário clica em "Salvar Cardápio", os dados do menu são transformados em um formato mais simples (`{ dia: { refeição: recipeId } }`) e enviados para a função `saveOrUpdateMenu` no `menuService`, que os salva no banco de dados.

---

## 3. Lógica de Criação da Lista de Compras

A geração da lista de compras é um processo mais complexo, dividido em duas etapas principais, com a lógica mais pesada ocorrendo no **lado do banco de dados (backend)** para maior eficiência.

### Etapa 1: Agregação no Banco de Dados (RPC - Remote Procedure Call)

**Fonte da Verdade:** A chamada da função `supabase.rpc('refresh_menu_shopping_source', ...)` no `menuService.ts`.

1.  **Acionamento:** Imediatamente após um cardápio ser salvo com `saveOrUpdateMenu`, o sistema executa uma chamada de procedimento remoto (RPC) ao Supabase chamada `refresh_menu_shopping_source`.

2.  **Lógica (Inferida) do Banco de Dados:** Esta função SQL no servidor do banco de dados executa os seguintes passos:
    *   **Recebe um `menu_id`** como parâmetro.
    *   **Busca todas as receitas** que estão vinculadas a esse `menu_id` na tabela `menu_recipes`.
    *   **Extrai os dados de `structured_ingredients`** de cada uma dessas receitas.
    *   **Inicia um processo de agregação:** Ela cria uma lista única de todos os ingredientes de todas as receitas. Para cada ingrediente com o mesmo nome (ex: "Ovos"), ela soma as quantidades. O sistema é inteligente o suficiente para converter unidades (ex: somar "1 xícara" de farinha com "200 g" de farinha, convertendo tudo para uma unidade base como gramas).
    *   **Armazena o Resultado:** O resultado final, um único array JSON contendo a lista de compras consolidada e agregada, é salvo na coluna `shopping_source` da tabela `user_menus`.

3.  **Propósito:** Essa abordagem de pré-calcular a lista de compras no backend é extremamente eficiente. Quando o usuário quer ver sua lista, o aplicativo não precisa fazer nenhum cálculo; ele simplesmente busca o JSON já pronto na coluna `shopping_source`.

### Etapa 2: Exibição e Lógica de Fallback no Frontend

**Fonte da Verdade:** `sazonal-chef/src/lib/shoppingListBuilder.ts` e a página `ShoppingList.tsx`.

1.  **Busca Simples:** Quando o usuário navega para a página da Lista de Compras, o aplicativo simplesmente chama a função `getShoppingSource`, que busca o JSON pré-calculado da coluna `shopping_source`.

2.  **O Papel do `shoppingListBuilder.ts`:**
    *   Este arquivo no frontend contém uma reimplementação em TypeScript da **mesma lógica de agregação** que a função do banco de dados executa.
    *   **Por que ele existe?** Provavelmente para cenários onde a lista precisa ser gerada ou manipulada no lado do cliente sem uma chamada ao banco de dados. Pode ser um *fallback* caso a função RPC falhe, ou pode ser usado para calcular listas de compras "virtuais" antes de um cardápio ser salvo. Ele também serve como uma excelente referência legível por humanos para entender a lógica de negócio da agregação de ingredientes.
    *   **Sua lógica interna:**
        *   Recebe um array de ingredientes.
        *   Normaliza nomes de ingredientes (caixa baixa, sem espaços extras).
        *   Converte todas as unidades para um padrão (gramas, ml, unidades) usando o `unitConverter`.
        *   Agrega as quantidades.
        *   Formata os totais para exibição amigável (ex: 1500g vira 1.5kg).
        *   Agrupa os itens finais por categoria de mercado (Hortifrúti, Laticínios, etc.).
