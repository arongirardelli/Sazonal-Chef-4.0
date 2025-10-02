import { test, expect } from '@testsprite/testsprite';

test.describe('Receitas - Sazonal Chef', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/inicio');
  });

  test('Deve exibir receitas na página inicial', async ({ page }) => {
    // Aguardar carregamento das receitas
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    
    // Verificar se há receitas exibidas
    const recipeCards = page.locator('.recipe-card, [data-testid="recipe-card"]');
    await expect(recipeCards.first()).toBeVisible();
    
    // Verificar elementos básicos do card de receita
    const firstCard = recipeCards.first();
    await expect(firstCard.locator('img')).toBeVisible(); // Imagem da receita
    await expect(firstCard.locator('h3, .recipe-title')).toBeVisible(); // Título
  });

  test('Deve abrir modal de receita ao clicar no card', async ({ page }) => {
    // Aguardar carregamento das receitas
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    
    // Clicar no primeiro card de receita
    await page.click('.recipe-card:first-child, [data-testid="recipe-card"]:first-child');
    
    // Verificar se o modal abre
    const modal = page.locator('.modal, [data-testid="recipe-modal"]');
    await expect(modal).toBeVisible();
    
    // Verificar elementos do modal
    await expect(modal.locator('h2, .modal-title')).toBeVisible(); // Título da receita
    await expect(modal.locator('.recipe-ingredients, [data-testid="ingredients"]')).toBeVisible(); // Ingredientes
    await expect(modal.locator('.recipe-instructions, [data-testid="instructions"]')).toBeVisible(); // Instruções
  });

  test('Deve fechar modal ao clicar no botão fechar', async ({ page }) => {
    // Abrir modal de receita
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    await page.click('.recipe-card:first-child, [data-testid="recipe-card"]:first-child');
    
    // Verificar se modal está aberto
    const modal = page.locator('.modal, [data-testid="recipe-modal"]');
    await expect(modal).toBeVisible();
    
    // Clicar no botão fechar
    await page.click('.modal-close, [data-testid="close-modal"]');
    
    // Verificar se modal foi fechado
    await expect(modal).not.toBeVisible();
  });

  test('Deve fechar modal ao clicar fora dele', async ({ page }) => {
    // Abrir modal de receita
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    await page.click('.recipe-card:first-child, [data-testid="recipe-card"]:first-child');
    
    // Verificar se modal está aberto
    const modal = page.locator('.modal, [data-testid="recipe-modal"]');
    await expect(modal).toBeVisible();
    
    // Clicar fora do modal (no overlay)
    await page.click('.modal-overlay, .modal-backdrop');
    
    // Verificar se modal foi fechado
    await expect(modal).not.toBeVisible();
  });

  test('Deve navegar para página de receita individual', async ({ page }) => {
    // Aguardar carregamento das receitas
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    
    // Clicar no primeiro card de receita
    await page.click('.recipe-card:first-child, [data-testid="recipe-card"]:first-child');
    
    // Verificar se há botão para página completa
    const viewFullButton = page.locator('text=Ver receita completa, text=Ver mais, [data-testid="view-full-recipe"]');
    if (await viewFullButton.isVisible()) {
      await viewFullButton.click();
      
      // Verificar se navegou para página de receita
      await expect(page).toHaveURL(/\/receita\/\d+/);
      
      // Verificar elementos da página de receita
      await expect(page.locator('h1, .recipe-title')).toBeVisible();
      await expect(page.locator('.recipe-ingredients, [data-testid="ingredients"]')).toBeVisible();
      await expect(page.locator('.recipe-instructions, [data-testid="instructions"]')).toBeVisible();
    }
  });

  test('Deve filtrar receitas por categoria', async ({ page }) => {
    // Navegar para página de categorias
    await page.click('text=Categorias');
    await expect(page).toHaveURL('/categorias');
    
    // Aguardar carregamento das categorias
    await page.waitForSelector('.category-card, [data-testid="category-card"]', { timeout: 10000 });
    
    // Clicar em uma categoria
    await page.click('.category-card:first-child, [data-testid="category-card"]:first-child');
    
    // Verificar se as receitas foram filtradas
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    const recipeCards = page.locator('.recipe-card, [data-testid="recipe-card"]');
    await expect(recipeCards.first()).toBeVisible();
  });

  test('Deve salvar receita nos favoritos', async ({ page }) => {
    // Aguardar carregamento das receitas
    await page.waitForSelector('.recipe-card, [data-testid="recipe-card"]', { timeout: 10000 });
    
    // Clicar no primeiro card de receita
    await page.click('.recipe-card:first-child, [data-testid="recipe-card"]:first-child');
    
    // Verificar se há botão de salvar
    const saveButton = page.locator('text=Salvar, [data-testid="save-recipe"]');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Verificar se apareceu confirmação
      await expect(page.locator('.toast-success, .success-message')).toBeVisible();
    }
  });

  test('Deve exibir receitas salvas na página Salvos', async ({ page }) => {
    // Navegar para página de salvos
    await page.click('text=Salvos');
    await expect(page).toHaveURL('/salvos');
    
    // Verificar se há receitas salvas ou mensagem de lista vazia
    const emptyState = page.locator('text=Nenhuma receita salva, .empty-state');
    const savedRecipes = page.locator('.recipe-card, [data-testid="recipe-card"]');
    
    // Deve ter pelo menos um dos dois estados
    const hasEmptyState = await emptyState.isVisible();
    const hasSavedRecipes = await savedRecipes.first().isVisible().catch(() => false);
    
    expect(hasEmptyState || hasSavedRecipes).toBeTruthy();
  });
});
