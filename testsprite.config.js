export default {
  // Configuração base do projeto
  projectName: "Sazonal Chef 4.0",
  baseUrl: "http://localhost:5174",
  
  // Configurações de navegador
  browser: {
    headless: false, // Para visualizar os testes
    viewport: {
      width: 375,
      height: 812
    }
  },

  // Configurações de timeout
  timeouts: {
    default: 30000,
    navigation: 10000,
    action: 5000
  },

  // Configurações de retry
  retry: {
    attempts: 2,
    delay: 1000
  },

  // Configurações de screenshot
  screenshots: {
    onFailure: true,
    onSuccess: false,
    path: "./test-screenshots"
  },

  // Configurações de relatório
  reporting: {
    format: ["html", "json"],
    outputDir: "./test-reports"
  },

  // Configurações de dados de teste
  testData: {
    validUser: {
      email: "test@sazonalchef.com",
      password: "TestPassword123!",
      name: "Usuário Teste"
    },
    invalidUser: {
      email: "invalid@test.com",
      password: "wrongpassword"
    }
  },

  // Configurações de ambiente
  environment: {
    development: {
      baseUrl: "http://localhost:5174",
      apiUrl: "http://localhost:54321"
    },
    staging: {
      baseUrl: "https://staging.sazonalchef.com",
      apiUrl: "https://staging-api.sazonalchef.com"
    }
  }
};
