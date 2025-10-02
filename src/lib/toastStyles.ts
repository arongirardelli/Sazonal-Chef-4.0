// Configurações centralizadas para estilos de toast
// Este arquivo garante consistência visual em toda a aplicação

export const toastStyles = {
  // Estilo padrão para todos os toasts
  default: {
    width: '100%',
    maxWidth: '400px',
    padding: '16px 24px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 auto',
    boxSizing: 'border-box' as const
  },
  
  // Estilo para toasts de sucesso
  success: {
    width: '100%',
    maxWidth: '400px',
    padding: '16px 24px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 auto',
    boxSizing: 'border-box' as const
  },
  
  // Estilo para toasts de erro
  error: {
    width: '100%',
    maxWidth: '400px',
    padding: '16px 24px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 auto',
    boxSizing: 'border-box' as const
  },
  
  // Estilo para toasts de informação
  info: {
    width: '100%',
    maxWidth: '400px',
    padding: '16px 24px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 auto',
    boxSizing: 'border-box' as const
  }
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
  
  info: (message: string) => ({
    content: message,
    style: toastStyles.info
  }),
  
  default: (message: string) => ({
    content: message,
    style: toastStyles.default
  })
}
