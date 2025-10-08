// Configurações centralizadas para estilos de toast
// Este arquivo garante consistência visual em toda a aplicação

// Função para obter estilos responsivos baseados no tamanho da tela
const getResponsiveToastStyles = () => {
  // Detectar se é mobile baseado na largura da tela
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  
  return {
    width: 'auto',
    maxWidth: isMobile ? 'calc(100vw - 32px)' : '420px',
    minWidth: isMobile ? '260px' : '300px',
    padding: isMobile ? '12px 16px' : '14px 20px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: 600 as const,
    margin: '0 auto',
    boxSizing: 'border-box' as const
  }
}

export const toastStyles = {
  // Estilo padrão para todos os toasts
  default: getResponsiveToastStyles(),
  
  // Estilo para toasts de sucesso
  success: getResponsiveToastStyles(),
  
  // Estilo para toasts de erro
  error: getResponsiveToastStyles(),
  
  // Estilo para toasts de aviso
  warning: getResponsiveToastStyles(),
  
  // Estilo para toasts de informação
  info: getResponsiveToastStyles()
}

// Funções utilitárias para criar toasts padronizados
export const createToast = {
  success: (message: string) => ({
    content: message,
    style: toastStyles.success
  }),
  
  error: (message: string) => ({
    content: message,
    style: toastStyles.error
  }),
  
  warning: (message: string) => ({
    content: message,
    style: toastStyles.warning
  }),
  
  info: (message: string) => ({
    content: message,
    style: toastStyles.info
  }),
  
  default: (message: string) => ({
    content: message,
    style: toastStyles.default
  })
}
