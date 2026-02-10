import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { imageStorage } from '@/utils/imageStorage'
import { authService, userService } from '@/services/api'
import { supabase } from '@/lib/supabaseClient'
import { useFinancialStore } from './financialStore'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isPremium?: boolean
  isTrial?: boolean
  isAdmin?: boolean
  createdAt?: string
  emailVerified?: boolean
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean // Novo estado para saber se a verificação inicial terminou
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<void>
  completeSocialLogin: (supabaseAccessToken: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  updateAvatar: (avatarUrl: string) => Promise<void>
  loadAvatar: () => Promise<void>
  refreshUserData: () => Promise<void>
  refreshPremiumStatus: () => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitialized: false, // Começa como falso

      login: async (email: string, password: string) => {
        try {
          // Tentar login via API
          const response = await authService.login({ email, password })

          console.log('🔍 [AuthStore] Resposta do backend:', response.user)
          console.log('🔍 [AuthStore] isPremium do backend:', response.user.isPremium)

          const user: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            avatar: response.user.avatar || undefined,
            isPremium: response.user.isPremium || false,
            isTrial: (response.user as any).isTrial || false,
            isAdmin: (response.user as any).isAdmin || false,
            emailVerified: (response.user as any).emailVerified || false,
          }

          console.log('🔍 [AuthStore] User criado:', user)
          console.log('🔍 [AuthStore] isPremium final:', user.isPremium)
          console.log('🔍 [AuthStore] emailVerified:', user.emailVerified)

          // ⚠️ VERIFICAÇÃO DE EMAIL OBRIGATÓRIA
          if (!user.emailVerified) {
            console.log('❌ Email não verificado, bloqueando acesso')
            // Não salvar no estado, apenas retornar erro específico
            throw new Error('EMAIL_NOT_VERIFIED')
          }

          set({
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true
          })

          // Definir userId no financialStore para isolar dados
          useFinancialStore.getState().setUserId(user.id)

          // Tentar carregar avatar do IndexedDB (se houver um customizado)
          try {
            const savedAvatar = await imageStorage.loadImage(user.id)
            if (savedAvatar) {
              set({ user: { ...user, avatar: savedAvatar } })
            }
          } catch (error) {
            console.error('Erro ao carregar avatar do IndexedDB:', error)
          }

          return true
        } catch (error: any) {
          console.error('Erro no login:', error)

          // Se for erro 401 (não autorizado), retornar false
          if (error.response?.status === 401) {
            console.log('Credenciais inválidas')
            return false
          }

          // Fallback para login demo APENAS se a API não estiver disponível (erro de rede)
          if (!error.response && email === 'demo@financeiro.com' && password === 'demo123') {
            console.log('API indisponível, usando modo demo')
            const user = {
              id: '1',
              name: 'Usuário Demo',
              email: 'demo@financeiro.com',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
              isPremium: true, // Demo user é premium
            }

            set({ user, isAuthenticated: true, accessToken: 'demo-token', refreshToken: 'demo-refresh' })

            // Definir userId no financialStore para isolar dados
            useFinancialStore.getState().setUserId(user.id)

            // Tentar carregar avatar do IndexedDB
            try {
              const savedAvatar = await imageStorage.loadImage(user.id)
              if (savedAvatar) {
                set({ user: { ...user, avatar: savedAvatar } })
              }
            } catch (error) {
              console.error('Erro ao carregar avatar:', error)
            }

            return true
          }

          return false
        }
      },

      loginWithGoogle: async () => {
        const redirectTo =
          import.meta.env.VITE_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/auth/callback`

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              prompt: 'select_account',
            },
          },
        })

        console.log('🔗 [Auth] Iniciando OAuth Google com redirect para:', redirectTo)

        if (error) {
          throw error
        }
      },

      completeSocialLogin: async (supabaseAccessToken: string) => {
        try {
          const response = await authService.loginWithGoogle(supabaseAccessToken)

          const user: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            avatar: response.user.avatar || undefined,
            isPremium: response.user.isPremium || false,
            isTrial: (response.user as any).isTrial || false,
            isAdmin: (response.user as any).isAdmin || false,
            emailVerified: true,
          }

          set({
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
          })

          useFinancialStore.getState().setUserId(user.id)

          try {
            const savedAvatar = await imageStorage.loadImage(user.id)
            if (savedAvatar) {
              set({ user: { ...user, avatar: savedAvatar } })
            }
          } catch (error) {
            console.error('Erro ao carregar avatar do IndexedDB:', error)
          }

          return true
        } catch (error) {
          console.error('Erro ao concluir login social:', error)
          throw error
        }
      },

      logout: async () => {
        const state = get()

        // Tentar fazer logout na API
        if (state.refreshToken && state.refreshToken !== 'demo-refresh') {
          try {
            await authService.logout(state.refreshToken)
          } catch (error) {
            console.error('Erro ao fazer logout na API:', error)
          }
        }

        // Limpar dados financeiros do usuário
        useFinancialStore.getState().clearUserData()

        // Logout do Supabase (para remover sessão do localStorage/cookies)
        await supabase.auth.signOut()

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        })
      },

      updateUser: async (data: Partial<User>) => {
        const state = get()
        if (!state.user) return

        try {
          // Se não for demo, atualizar via API
          if (state.accessToken && state.accessToken !== 'demo-token') {
            console.log('🔄 Atualizando perfil via API...', data)

            const updatedUser = await userService.updateProfile({
              name: data.name,
              email: data.email,
            })

            console.log('✅ Perfil atualizado com sucesso:', updatedUser)

            set((state) => ({
              user: state.user ? {
                ...state.user,
                name: updatedUser.name,
                email: updatedUser.email,
                // Manter campos que não vêm da API de atualização
                isPremium: state.user.isPremium,
                isAdmin: state.user.isAdmin,
              } : null,
            }))
          } else {
            // Modo demo: apenas atualizar localmente
            console.log('📝 Modo demo: atualizando localmente', data)

            set((state) => ({
              user: state.user ? { ...state.user, ...data } : null,
            }))
          }
        } catch (error: any) {
          console.error('❌ Erro ao atualizar perfil:', error)
          console.error('Detalhes do erro:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          })
          throw error
        }
      },

      updateAvatar: async (avatarUrl: string) => {
        const state = get()
        if (!state.user) return

        try {
          // Salvar no IndexedDB (cache local)
          await imageStorage.saveImage(state.user.id, avatarUrl)

          // Atualizar estado local imediatamente
          set({
            user: { ...state.user, avatar: avatarUrl },
          })

          // Converter base64 para File e enviar para o backend
          if (avatarUrl.startsWith('data:image')) {
            const blob = await fetch(avatarUrl).then(r => r.blob())
            const file = new File([blob], 'avatar.png', { type: blob.type })

            // Enviar para o backend
            const updatedUser = await userService.uploadAvatar(file)

            // Atualizar com a resposta do backend (se retornou avatar)
            if (updatedUser.avatar) {
              set({
                user: { ...state.user, avatar: updatedUser.avatar },
              })
            }
          }
        } catch (error) {
          console.error('Erro ao salvar avatar:', error)
          throw error
        }
      },

      loadAvatar: async () => {
        const state = get()
        if (!state.user) return

        try {
          const savedAvatar = await imageStorage.loadImage(state.user.id)
          if (savedAvatar) {
            set({
              user: { ...state.user, avatar: savedAvatar },
            })
          }
        } catch (error) {
          console.error('Erro ao carregar avatar:', error)
        }
      },

      refreshUserData: async () => {
        const state = get()
        if (!state.user || !state.accessToken || state.accessToken === 'demo-token') return

        try {
          const userData = await userService.getProfile()

          set((state) => ({
            user: state.user ? {
              ...state.user,
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar || state.user.avatar,
              isPremium: userData.isPremium || false,
              isAdmin: (userData as any).isAdmin || state.user.isAdmin || false,
            } : null,
          }))

          // Tentar carregar avatar customizado do IndexedDB
          try {
            const savedAvatar = await imageStorage.loadImage(userData.id)
            if (savedAvatar) {
              set((state) => ({
                user: state.user ? { ...state.user, avatar: savedAvatar } : null,
              }))
            }
          } catch (error) {
            console.error('Erro ao carregar avatar do IndexedDB:', error)
          }
        } catch (error) {
          console.error('Erro ao atualizar dados do usuário:', error)
        }
      },

      refreshPremiumStatus: async () => {
        const state = get()
        if (!state.user || !state.accessToken || state.accessToken === 'demo-token') return

        try {
          const userData = await userService.getProfile()

          set((state) => ({
            user: state.user ? {
              ...state.user,
              isPremium: userData.isPremium || false,
            } : null,
          }))
        } catch (error) {
          console.error('Erro ao atualizar status premium:', error)
        }
      },

      initializeAuth: async () => {
        console.log('🔄 Inicializando autenticação...')
        try {
          // Verificar sessão atual no Supabase (recupera do localStorage do Supabase)
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.warn('⚠️ Erro ao verificar sessão Supabase:', error)
            return
          }

          if (data.session?.access_token) {
            console.log('✅ Sessão Supabase encontrada/restaurada.')

            // Se já temos estado local autenticado, verificamos se precisa atualizar token
            const state = get()
            if (state.isAuthenticated && state.user) {
              // Apenas atualiza tokens se mudaram
              if (state.accessToken !== data.session.access_token) {
                console.log('♻️ Atualizando tokens no estado local')
                set({
                  accessToken: data.session.access_token,
                  refreshToken: data.session.refresh_token,
                })
              }
              return
            }

            // Se não temos estado local (ex: refresh com limpeza parcial), mas temos sessão do Supabase,
            // precisamos "reconstituir" o login social
            console.log('🔄 Sessão existe mas estado local vazio. Restaurando login...')
            await get().completeSocialLogin(data.session.access_token)
          } else {
            console.log('ℹ️ Nenhuma sessão Supabase ativa. Mantendo sessão local se existir.')
          }

          // Configurar listener para mudanças futuras de sessão (ex: refresh automatico de token)
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`🔔 Auth state mudou: ${event}`)
            if (event === 'TOKEN_REFRESHED' && session) {
              set({
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
              })
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false
              })
            }
          })

        } catch (err) {
          console.error('Erro ao inicializar auth:', err)
        } finally {
          set({ isInitialized: true })
        }
      },
    }),
    {
      name: 'auth-storage',
      // Não persistir avatar no localStorage (só metadados)
      partialize: (state) => ({
        user: state.user
          ? {
            id: state.user.id,
            name: state.user.name,
            email: state.user.email,
            isPremium: state.user.isPremium,
            isAdmin: state.user.isAdmin,
            // avatar será carregado do IndexedDB
          }
          : null,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
