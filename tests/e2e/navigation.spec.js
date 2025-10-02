import { test, expect } from '@testsprite/testsprite';

test.describe('Navegação - Sazonal Chef', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve navegar entre todas as páginas principais', async ({ page }) => {
    // Verificar redirecionamento inicial
    await expect(page).toHaveURL('/inicio');
    
    // Testar navegação para Menu
    await page.click('text=Menu');
    await expect(page).toHaveURL('/menu');
    await expect(page.locator('h1')).toContainText('Menu');
    
    // Testar navegação para Categorias
    await page.click('text=Categorias');
    await expect(page).toHaveURL('/categorias');
    await expect(page.locator('h1')).toContainText('Categorias');
    
    // Testar navegação para Salvos
    await page.click('text=Salvos');
    await expect(page).toHaveURL('/salvos');
    await expect(page.locator('h1')).toContainText('Salvos');
    
    // Testar navegação para Perfil
    await page.click('text=Perfil');
    await expect(page).toHaveURL('/perfil');
    await expect(page.locator('h1')).toContainText('Perfil');
  });

  test('Deve exibir navegação inferior corretamente', async ({ page }) => {
    // Verificar se a navegação inferior está visível
    const bottomNav = page.locator('.bottom-nav, [data-testid="bottom-nav"]');
    await expect(bottomNav).toBeVisible();
    
    // Verificar se todos os ícones estão presentes
    await expect(bottomNav.locator('text=Início')).toBeVisible();
    await expect(bottomNav.locator('text=Menu')).toBeVisible();
    await expect(bottomNav.locator('text=Categorias')).toBeVisible();
    await expect(bottomNav.locator('text=Salvos')).toBeVisible();
    await expect(bottomNav.locator('text=Perfil')).toBeVisible();
  });

  test('Deve manter estado de navegação ativa', async ({ page }) => {
    // Navegar para uma página específica
    await page.click('text=Categorias');
    await expect(page).toHaveURL('/categorias');
    
    // Verificar se o item ativo está destacado
    const activeItem = page.locator('.bottom-nav .active, [data-testid="bottom-nav"] .active');
    await expect(activeItem).toBeVisible();
  });

  test('Deve funcionar navegação por URL direta', async ({ page }) => {
    // Testar acesso direto às páginas
    const pages = [
      { url: '/inicio', title: 'Início' },
      { url: '/menu', title: 'Menu' },
      { url: '/categorias', title: 'Categorias' },
      { url: '/salvos', title: 'Salvos' },
      { url: '/perfil', title: 'Perfil' }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await expect(page).toHaveURL(pageInfo.url);
      await expect(page.locator('h1')).toContainText(pageInfo.title);
    }
  });

  test('Deve redirecionar para página inicial em rota inválida', async ({ page }) => {
    await page.goto('/pagina-inexistente');
    await expect(page).toHaveURL('/inicio');
  });

  test('Deve funcionar botão de voltar do navegador', async ({ page }) => {
    // Navegar para uma página
    await page.click('text=Categorias');
    await expect(page).toHaveURL('/categorias');
    
    // Usar botão voltar do navegador
    await page.goBack();
    await expect(page).toHaveURL('/inicio');
  });
});
