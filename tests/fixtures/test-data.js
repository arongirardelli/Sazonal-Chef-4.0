export default {
  // Dados de usuário para testes
  users: {
    valid: {
      email: "test@sazonalchef.com",
      password: "TestPassword123!",
      name: "Usuário Teste",
      confirmPassword: "TestPassword123!"
    },
    invalid: {
      email: "invalid@test.com",
      password: "wrongpassword",
      name: "",
      confirmPassword: "differentpassword"
    },
    newUser: {
      email: "newuser@sazonalchef.com",
      password: "NewPassword123!",
      name: "Novo Usuário",
      confirmPassword: "NewPassword123!"
    }
  },

  // Dados de receitas para testes
  recipes: {
    sample: {
      title: "Receita de Teste",
      ingredients: [
        { name: "Tomate", quantity: "2", unit: "unidades" },
        { name: "Cebola", quantity: "1", unit: "unidade" },
        { name: "Azeite", quantity: "2", unit: "colheres de sopa" }
      ],
      instructions: [
        "Corte os tomates em cubos",
        "Pique a cebola finamente",
        "Refogue tudo no azeite"
      ],
      category: "Vegetariano",
      prepTime: "15 minutos",
      servings: "2 pessoas"
    }
  },

  // Dados de ingredientes para lista de compras
  ingredients: {
    vegetables: [
      { name: "Tomate", quantity: "2", unit: "unidades", category: "Vegetais" },
      { name: "Cebola", quantity: "1", unit: "unidade", category: "Vegetais" },
      { name: "Alho", quantity: "2", unit: "dentes", category: "Vegetais" }
    ],
    proteins: [
      { name: "Frango", quantity: "500", unit: "g", category: "Carnes" },
      { name: "Peixe", quantity: "300", unit: "g", category: "Carnes" }
    ],
    dairy: [
      { name: "Leite", quantity: "1", unit: "litro", category: "Laticínios" },
      { name: "Queijo", quantity: "200", unit: "g", category: "Laticínios" }
    ]
  },

  // URLs das páginas
  urls: {
    base: "http://localhost:5174",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    updatePassword: "/update-password",
    inicio: "/inicio",
    menu: "/menu",
    categories: "/categorias",
    saved: "/salvos",
    profile: "/perfil",
    shopping: "/shopping",
    notifications: "/notifications",
    preferences: "/preferences",
    privacy: "/privacy",
    help: "/help"
  },

  // Seletores CSS comuns
  selectors: {
    recipeCard: ".recipe-card, [data-testid='recipe-card']",
    recipeModal: ".modal, [data-testid='recipe-modal']",
    bottomNav: ".bottom-nav, [data-testid='bottom-nav']",
    ingredientItem: ".ingredient-item, [data-testid='ingredient-item']",
    userInfo: ".user-info, [data-testid='user-info']",
    emptyState: ".empty-state, [data-testid='empty-state']",
    toast: ".toast, .toast-success, .toast-error",
    errorMessage: ".error-message, [role='alert']"
  },

  // Configurações de timeout
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  },

  // Mensagens esperadas
  messages: {
    success: {
      recipeSaved: "Receita salva com sucesso",
      ingredientAdded: "Ingrediente adicionado à lista",
      preferencesSaved: "Preferências salvas com sucesso"
    },
    error: {
      invalidCredentials: "Credenciais inválidas",
      emailRequired: "Email é obrigatório",
      passwordRequired: "Senha é obrigatória",
      passwordsDontMatch: "Senhas não coincidem"
    },
    empty: {
      noRecipes: "Nenhuma receita encontrada",
      noSavedRecipes: "Nenhuma receita salva",
      emptyShoppingList: "Lista de compras vazia"
    }
  }
};
