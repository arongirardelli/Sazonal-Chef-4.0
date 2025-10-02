import { test, expect } from '@testsprite/testsprite';

test.describe('Teste Simples - Sazonal Chef', () => {
  
  test('Deve carregar a página inicial', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se a página carregou
    await expect(page).toHaveURL('/inicio');
    
    // Verificar se há elementos básicos
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Página inicial carregada com sucesso!');
  });

  test('Deve exibir título da página', async ({ page }) => {
    await page.goto('/inicio');
    
    // Verificar se há um título na página
    const title = page.locator('h1, .page-title, [data-testid="page-title"]');
    await expect(title).toBeVisible();
    
    console.log('✅ Título da página encontrado!');
  });

  test('Deve ter navegação inferior', async ({ page }) => {
    await page.goto('/inicio');
    
    // Verificar se há navegação inferior
    const bottomNav = page.locator('.bottom-nav, [data-testid="bottom-nav"], nav');
    await expect(bottomNav).toBeVisible();
    
    console.log('✅ Navegação inferior encontrada!');
  });
});
