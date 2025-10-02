import { test, expect } from '@testsprite/testsprite';

test.describe('Autenticação - Sazonal Chef', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve navegar para página de login', async ({ page }) => {
    // Verificar se a página inicial redireciona para /inicio
    await expect(page).toHaveURL('/inicio');
    
    // Navegar para página de login
    await page.click('text=Entrar');
    await expect(page).toHaveURL('/login');
    
    // Verificar elementos da página de login
    await expect(page.locator('h1')).toContainText('Entrar');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    
    // Preencher com dados inválidos
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verificar se aparece mensagem de erro
    await expect(page.locator('.toast-error, .error-message')).toBeVisible();
  });

  test('Deve navegar para página de registro', async ({ page }) => {
    await page.goto('/login');
    
    // Clicar no link de registro
    await page.click('text=Criar conta');
    await expect(page).toHaveURL('/register');
    
    // Verificar elementos da página de registro
    await expect(page.locator('h1')).toContainText('Criar conta');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('Deve navegar para recuperação de senha', async ({ page }) => {
    await page.goto('/login');
    
    // Clicar no link de esqueci a senha
    await page.click('text=Esqueci minha senha');
    await expect(page).toHaveURL('/forgot-password');
    
    // Verificar elementos da página de recuperação
    await expect(page.locator('h1')).toContainText('Recuperar senha');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Deve validar campos obrigatórios no registro', async ({ page }) => {
    await page.goto('/register');
    
    // Tentar submeter sem preencher campos
    await page.click('button[type="submit"]');
    
    // Verificar se aparecem mensagens de validação
    await expect(page.locator('.error-message, [role="alert"]')).toBeVisible();
  });

  test('Deve validar formato de email', async ({ page }) => {
    await page.goto('/register');
    
    // Preencher com email inválido
    await page.fill('input[type="email"]', 'email-invalido');
    await page.fill('input[type="password"]', 'senha123');
    await page.fill('input[name="name"]', 'Nome Teste');
    await page.click('button[type="submit"]');
    
    // Verificar se aparece mensagem de email inválido
    await expect(page.locator('.error-message, [role="alert"]')).toBeVisible();
  });
});
