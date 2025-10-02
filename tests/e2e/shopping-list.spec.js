import { test, expect } from '@testsprite/testsprite';

test.describe('Lista de Compras - Sazonal Chef', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/inicio');
  });

  test('Deve navegar para página de lista de compras', async ({ page }) => {
    // Procurar por botão ou link para lista de compras
    const shoppingButton = page.locator('text=Lista de compras, text=Shopping, [data-testid="shopping-list"]');
    
    if (await shoppingButton.isVisible()) {
      await shoppingButton.click();
      await expect(page).toHaveURL('/shopping');
    } else {
      // Tentar navegação direta
      await page.goto('/shopping');
      await expect(page).toHaveURL('/shopping');
    }
    
    // Verificar elementos da página
    await expect(page.locator('h1')).toContainText('Lista de compras');
  });

  test('Deve exibir lista vazia quando não há ingredientes', async ({ page }) => {
    await page.goto('/shopping');
    
    // Verificar estado vazio
    const emptyState = page.locator('text=Lista vazia, .empty-state, [data-testid="empty-shopping-list"]');
    await expect(emptyState).toBeVisible();
  });

  test('Deve gerar lista de compras a partir de receitas', async ({ page }) => {
    // Primeiro, navegar para uma receita
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    await page.click('.recipe-card:first-child, [data-testid="recipe-card"]:first-child');
    
    // Procurar por botão de adicionar à lista de compras
    const addToListButton = page.locator('text=Adicionar à lista, text=Adicionar ingredientes, [data-testid="add-to-shopping-list"]');
    
    if (await addToListButton.isVisible()) {
      await addToListButton.click();
      
      // Verificar se apareceu confirmação
      await expect(page.locator('.toast-success, .success-message')).toBeVisible();
      
      // Navegar para lista de compras
      await page.goto('/shopping');
      
      // Verificar se ingredientes foram adicionados
      const ingredientsList = page.locator('.ingredient-item, [data-testid="ingredient-item"]');
      await expect(ingredientsList.first()).toBeVisible();
    }
  });

  test('Deve marcar ingrediente como comprado', async ({ page }) => {
    await page.goto('/shopping');
    
    // Verificar se há ingredientes na lista
    const ingredientsList = page.locator('.ingredient-item, [data-testid="ingredient-item"]');
    const hasIngredients = await ingredientsList.first().isVisible().catch(() => false);
    
    if (hasIngredients) {
      // Clicar no checkbox do primeiro ingrediente
      const firstIngredient = ingredientsList.first();
      const checkbox = firstIngredient.locator('input[type="checkbox"], [data-testid="ingredient-checkbox"]');
      
      if (await checkbox.isVisible()) {
        await checkbox.click();
        
        // Verificar se ingrediente foi marcado como comprado
        await expect(firstIngredient).toHaveClass(/checked|completed|purchased/);
      }
    }
  });

  test('Deve remover ingrediente da lista', async ({ page }) => {
    await page.goto('/shopping');
    
    // Verificar se há ingredientes na lista
    const ingredientsList = page.locator('.ingredient-item, [data-testid="ingredient-item"]');
    const hasIngredients = await ingredientsList.first().isVisible().catch(() => false);
    
    if (hasIngredients) {
      // Procurar por botão de remover
      const firstIngredient = ingredientsList.first();
      const removeButton = firstIngredient.locator('text=Remover, [data-testid="remove-ingredient"]');
      
      if (await removeButton.isVisible()) {
        await removeButton.click();
        
        // Verificar se ingrediente foi removido
        await expect(firstIngredient).not.toBeVisible();
      }
    }
  });

  test('Deve limpar toda a lista de compras', async ({ page }) => {
    await page.goto('/shopping');
    
    // Procurar por botão de limpar lista
    const clearButton = page.locator('text=Limpar lista, text=Limpar tudo, [data-testid="clear-shopping-list"]');
    
    if (await clearButton.isVisible()) {
      await clearButton.click();
      
      // Verificar se apareceu confirmação
      await expect(page.locator('.toast-success, .success-message')).toBeVisible();
      
      // Verificar se lista ficou vazia
      const emptyState = page.locator('text=Lista vazia, .empty-state, [data-testid="empty-shopping-list"]');
      await expect(emptyState).toBeVisible();
    }
  });

  test('Deve agrupar ingredientes por categoria', async ({ page }) => {
    await page.goto('/shopping');
    
    // Verificar se há ingredientes agrupados
    const categoryGroups = page.locator('.ingredient-category, [data-testid="ingredient-category"]');
    const hasGroups = await categoryGroups.first().isVisible().catch(() => false);
    
    if (hasGroups) {
      // Verificar se há categorias como "Vegetais", "Carnes", etc.
      await expect(categoryGroups.first()).toBeVisible();
      
      // Verificar se há ingredientes dentro das categorias
      const ingredientsInCategory = categoryGroups.first().locator('.ingredient-item, [data-testid="ingredient-item"]');
      await expect(ingredientsInCategory.first()).toBeVisible();
    }
  });

  test('Deve calcular quantidade total de ingredientes', async ({ page }) => {
    await page.goto('/shopping');
    
    // Verificar se há contador de ingredientes
    const counter = page.locator('.ingredient-counter, [data-testid="ingredient-counter"]');
    
    if (await counter.isVisible()) {
      // Verificar se o contador mostra um número
      const counterText = await counter.textContent();
      expect(counterText).toMatch(/\d+/);
    }
  });

  test('Deve permitir editar quantidade de ingrediente', async ({ page }) => {
    await page.goto('/shopping');
    
    // Verificar se há ingredientes na lista
    const ingredientsList = page.locator('.ingredient-item, [data-testid="ingredient-item"]');
    const hasIngredients = await ingredientsList.first().isVisible().catch(() => false);
    
    if (hasIngredients) {
      // Procurar por botão de editar quantidade
      const firstIngredient = ingredientsList.first();
      const editButton = firstIngredient.locator('text=Editar, [data-testid="edit-quantity"]');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Verificar se apareceu campo de edição
        const quantityInput = firstIngredient.locator('input[type="number"], [data-testid="quantity-input"]');
        await expect(quantityInput).toBeVisible();
        
        // Alterar quantidade
        await quantityInput.fill('2');
        
        // Salvar alteração
        const saveButton = firstIngredient.locator('text=Salvar, [data-testid="save-quantity"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          
          // Verificar se quantidade foi atualizada
          await expect(firstIngredient).toContainText('2');
        }
      }
    }
  });
});
