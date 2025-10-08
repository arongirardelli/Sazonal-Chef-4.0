import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '@/integrations/supabase'

export type ThemeType = 'light' | 'dark'
export type FontSizeType = 'small' | 'medium' | 'large'

interface AppPreferencesContextType {
  theme: ThemeType
  fontSize: FontSizeType
  setTheme: (theme: ThemeType) => void
  setFontSize: (fontSize: FontSizeType) => void
  colors: {
    background: string
    surface: string
    primary: string
    secondary: string
    text: string
    textSecondary: string
    border: string
    accent: string
  }
  fontSizes: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
}

const AppPreferencesContext = createContext<AppPreferencesContextType | undefined>(undefined)

interface AppPreferencesProviderProps {
  children: ReactNode
}

export function AppPreferencesProvider({ children }: AppPreferencesProviderProps) {
  const [theme, setThemeState] = useState<ThemeType>('light')
  const [fontSize, setFontSizeState] = useState<FontSizeType>('medium')
  const [userId, setUserId] = useState<string | null>(null)

  // Carregar preferências do localStorage e banco de dados
  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      // 1. Carrega do localStorage primeiro (para UX imediata)
      const savedTheme = localStorage.getItem('app-theme') as ThemeType
      const savedFontSize = localStorage.getItem('app-font-size') as FontSizeType
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeState(savedTheme)
      }
      
      if (savedFontSize && ['small', 'medium', 'large'].includes(savedFontSize)) {
        setFontSizeState(savedFontSize)
      }

      // 2. Tenta carregar do banco de dados (para sincronização)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        setUserId(session.user.id)
        
        const { data: userSettings } = await supabase
          .from('user_settings')
          .select('font_size, dark_mode')
          .eq('user_id', session.user.id)
          .single()
        
        if (userSettings) {
          // Sincroniza com o banco se houver dados
          if (userSettings.font_size && ['small', 'medium', 'large'].includes(userSettings.font_size)) {
            setFontSizeState(userSettings.font_size as FontSizeType)
            localStorage.setItem('app-font-size', userSettings.font_size)
          }
          
          if (userSettings.dark_mode !== null) {
            const dbTheme: ThemeType = userSettings.dark_mode ? 'dark' : 'light'
            setThemeState(dbTheme)
            localStorage.setItem('app-theme', dbTheme)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
      // Em caso de erro, mantém as preferências do localStorage
    }
  }

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme)
    localStorage.setItem('app-theme', newTheme)
    
    // Sincroniza com o banco de dados
    if (userId) {
      try {
        await supabase
          .from('user_settings')
          .update({ 
            dark_mode: newTheme === 'dark',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
      } catch (error) {
        console.error('Erro ao salvar tema no banco:', error)
      }
    }
  }

  const setFontSize = async (newFontSize: FontSizeType) => {
    setFontSizeState(newFontSize)
    localStorage.setItem('app-font-size', newFontSize)
    
    // Sincroniza com o banco de dados
    if (userId) {
      try {
        await supabase
          .from('user_settings')
          .update({ 
            font_size: newFontSize,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
      } catch (error) {
        console.error('Erro ao salvar tamanho da fonte no banco:', error)
      }
    }
  }

  // Cores do tema
  const colors = {
    light: {
      background: '#F5F5DC',  // Branco Osso/Giz
      surface: '#ffffff',
      primary: '#CD853F',  // Laranja Terracota
      secondary: '#8B4513',  // Marrom Terracota escuro
      text: '#2F2F2F',  // Cinza Escuro (quase preto)
      textSecondary: '#555555',  // Cinza médio
      border: '#E0E0E0',  // Cinza claro
      accent: '#F8F8F8'  // Cinza muito claro
    },
    dark: {
      background: '#1a1a1a',
      surface: '#2d2d2d',
      primary: '#CD853F',  // Laranja Terracota (mantém para modo escuro)
      secondary: '#8B4513',  // Marrom Terracota escuro
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151',
      accent: '#374151'
    }
  }[theme]

  // Tamanhos de fonte
  const fontSizes = {
    small: {
      xs: '10px',
      sm: '12px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px'
    },
    medium: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px'
    },
    large: {
      xs: '14px',
      sm: '16px',
      base: '18px',
      lg: '20px',
      xl: '24px',
      '2xl': '28px',
      '3xl': '32px'
    }
  }[fontSize]

  return (
    <AppPreferencesContext.Provider
      value={{
        theme,
        fontSize,
        setTheme,
        setFontSize,
        colors,
        fontSizes
      }}
    >
      <div style={{ 
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        {children}
      </div>
    </AppPreferencesContext.Provider>
  )
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext)
  if (context === undefined) {
    throw new Error('useAppPreferences must be used within an AppPreferencesProvider')
  }
  return context
}
