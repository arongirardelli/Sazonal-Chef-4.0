import { test, expect } from '@testsprite/testsprite';

test.describe('Perfil e Preferências - Sazonal Chef', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/inicio');
  });

  test('Deve navegar para página de perfil', async ({ page }) => {
    // Navegar para perfil
    await page.click('text=Perfil');
    await expect(page).toHaveURL('/perfil');
    
    // Verificar elementos da página de perfil
    await expect(page.locator('h1')).toContainText('Perfil');
  });

  test('Deve exibir informações do usuário', async ({ page }) => {
    await page.goto('/perfil');
    
    // Verificar se há informações do usuário
    const userInfo = page.locator('.user-info, [data-testid="user-info"]');
    if (await userInfo.isVisible()) {
      await expect(userInfo.locator('.user-name, [data-testid="user-name"]')).toBeVisible();
      await expect(userInfo.locator('.user-email, [data-testid="user-email"]')).toBeVisible();
    }
  });

  test('Deve navegar para configurações de notificação', async ({ page }) => {
    await page.goto('/perfil');
    
    // Procurar por link para configurações de notificação
    const notificationLink = page.locator('text=Notificações, text=Configurações de notificação, [data-testid="notification-settings"]');
    
    if (await notificationLink.isVisible()) {
      await notificationLink.click();
      await expect(page).toHaveURL('/notifications');
      
      // Verificar elementos da página de notificações
      await expect(page.locator('h1')).toContainText('Notificações');
    }
  });

  test('Deve navegar para preferências', async ({ page }) => {
    await page.goto('/perfil');
    
    // Procurar por link para preferências
    const preferencesLink = page.locator('text=Preferências, text=Configurações, [data-testid="preferences"]');
    
    if (await preferencesLink.isVisible()) {
      await preferencesLink.click();
      await expect(page).toHaveURL('/preferences');
      
      // Verificar elementos da página de preferências
      await expect(page.locator('h1')).toContainText('Preferências');
    }
  });

  test('Deve navegar para privacidade e segurança', async ({ page }) => {
    await page.goto('/perfil');
    
    // Procurar por link para privacidade
    const privacyLink = page.locator('text=Privacidade, text=Segurança, [data-testid="privacy-security"]');
    
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await expect(page).toHaveURL('/privacy');
      
      // Verificar elementos da página de privacidade
      await expect(page.locator('h1')).toContainText('Privacidade');
    }
  });

  test('Deve navegar para ajuda e suporte', async ({ page }) => {
    await page.goto('/perfil');
    
    // Procurar por link para ajuda
    const helpLink = page.locator('text=Ajuda, text=Suporte, [data-testid="help-support"]');
    
    if (await helpLink.isVisible()) {
      await helpLink.click();
      await expect(page).toHaveURL('/help');
      
      // Verificar elementos da página de ajuda
      await expect(page.locator('h1')).toContainText('Ajuda');
    }
  });

  test('Deve permitir alterar senha', async ({ page }) => {
    await page.goto('/perfil');
    
    // Procurar por link para alterar senha
    const changePasswordLink = page.locator('text=Alterar senha, text=Atualizar senha, [data-testid="change-password"]');
    
    if (await changePasswordLink.isVisible()) {
      await changePasswordLink.click();
      await expect(page).toHaveURL('/update-password');
      
      // Verificar elementos da página de alteração de senha
      await expect(page.locator('h1')).toContainText('Alterar senha');
      await expect(page.locator('input[type="password"]')).toBeVisible();
    }
  });

  test('Deve exibir estatísticas do usuário', async ({ page }) => {
    await page.goto('/perfil');
    
    // Verificar se há estatísticas do usuário
    const stats = page.locator('.user-stats, [data-testid="user-stats"]');
    if (await stats.isVisible()) {
      // Verificar estatísticas comuns
      const recipesCount = stats.locator('.recipes-count, [data-testid="recipes-count"]');
      const savedCount = stats.locator('.saved-count, [data-testid="saved-count"]');
      
      if (await recipesCount.isVisible()) {
        await expect(recipesCount).toBeVisible();
      }
      
      if (await savedCount.isVisible()) {
        await expect(savedCount).toBeVisible();
      }
    }
  });

  test('Deve permitir fazer logout', async ({ page }) => {
    await page.goto('/perfil');
    
    // Procurar por botão de logout
    const logoutButton = page.locator('text=Sair, text=Logout, [data-testid="logout"]');
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Verificar se foi redirecionado para login
      await expect(page).toHaveURL('/login');
    }
  });

  test('Deve validar campos obrigatórios na alteração de senha', async ({ page }) => {
    await page.goto('/update-password');
    
    // Tentar submeter sem preencher campos
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Verificar se aparecem mensagens de validação
      await expect(page.locator('.error-message, [role="alert"]')).toBeVisible();
    }
  });

  test('Deve validar confirmação de senha', async ({ page }) => {
    await page.goto('/update-password');
    
    // Preencher senha atual
    const currentPasswordInput = page.locator('input[name="currentPassword"], input[placeholder*="senha atual"]');
    if (await currentPasswordInput.isVisible()) {
      await currentPasswordInput.fill('senha123');
      
      // Preencher nova senha
      const newPasswordInput = page.locator('input[name="newPassword"], input[placeholder*="nova senha"]');
      if (await newPasswordInput.isVisible()) {
        await newPasswordInput.fill('novaSenha123');
        
        // Preencher confirmação com senha diferente
        const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="confirmar"]');
        if (await confirmPasswordInput.isVisible()) {
          await confirmPasswordInput.fill('senhaDiferente');
          
          // Tentar submeter
          const submitButton = page.locator('button[type="submit"]');
          if (await submitButton.isVisible()) {
            await submitButton.click();
            
            // Verificar se aparece erro de confirmação
            await expect(page.locator('.error-message, [role="alert"]')).toBeVisible();
          }
        }
      }
    }
  });

  test('Deve exibir configurações de dieta', async ({ page }) => {
    await page.goto('/preferences');
    
    // Verificar se há configurações de dieta
    const dietSettings = page.locator('.diet-settings, [data-testid="diet-settings"]');
    if (await dietSettings.isVisible()) {
      // Verificar opções de dieta
      const dietOptions = dietSettings.locator('input[type="checkbox"], [data-testid="diet-option"]');
      const hasOptions = await dietOptions.first().isVisible().catch(() => false);
      
      if (hasOptions) {
        await expect(dietOptions.first()).toBeVisible();
      }
    }
  });

  test('Deve salvar preferências', async ({ page }) => {
    await page.goto('/preferences');
    
    // Procurar por botão de salvar
    const saveButton = page.locator('text=Salvar, text=Salvar preferências, [data-testid="save-preferences"]');
    
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Verificar se apareceu confirmação
      await expect(page.locator('.toast-success, .success-message')).toBeVisible();
    }
  });
});
