import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import userPreferenceService from '@/services/userPreference.service'
import { useAuthStore } from '@/store/authStore'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Carregar tema do backend quando autenticado
  useEffect(() => {
    const loadTheme = async () => {
      if (!isAuthenticated) {
        // Se não autenticado, usar light como padrão
        setThemeState('light')
        setIsLoading(false)
        return
      }

      try {
        const savedTheme = await userPreferenceService.get('theme')
        console.log('🎨 Tema carregado do backend:', savedTheme)
        
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeState(savedTheme as Theme)
        } else {
          // Se não existe tema salvo, usar light como padrão e salvar
          console.log('🎨 Nenhum tema salvo, usando light como padrão')
          setThemeState('light')
          await userPreferenceService.set('theme', 'light')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar tema:', error)
        // Em caso de erro, usar light como padrão
        setThemeState('light')
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [isAuthenticated])

  // Aplicar tema ao DOM
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('🎨 Toggle tema:', theme, '→', newTheme)
    setThemeState(newTheme)

    if (isAuthenticated) {
      try {
        console.log('🎨 Salvando tema no backend:', newTheme)
        await userPreferenceService.set('theme', newTheme)
        console.log('✅ Tema salvo com sucesso!')
      } catch (error) {
        console.error('❌ Erro ao salvar tema:', error)
      }
    } else {
      console.log('⚠️ Usuário não autenticado, tema não será salvo')
    }
  }

  const setTheme = async (newTheme: Theme) => {
    console.log('🎨 Definindo tema:', newTheme)
    setThemeState(newTheme)

    if (isAuthenticated) {
      try {
        console.log('🎨 Salvando tema no backend:', newTheme)
        await userPreferenceService.set('theme', newTheme)
        console.log('✅ Tema salvo com sucesso!')
      } catch (error) {
        console.error('❌ Erro ao salvar tema:', error)
      }
    } else {
      console.log('⚠️ Usuário não autenticado, tema não será salvo')
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}
