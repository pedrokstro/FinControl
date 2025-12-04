import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, Category, FilterOptions } from '@/types'
import toast from 'react-hot-toast'
import transactionService from '@/services/transaction.service'
import categoryService from '@/services/category.service'

interface FinancialState {
  transactions: Transaction[]
  categories: Category[]
  currentUserId: string | null
  isLoading: boolean
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getFilteredTransactions: (filters: FilterOptions) => Transaction[]
  setUserId: (userId: string | null) => void
  clearUserData: () => void
  fetchTransactions: () => Promise<void>
  fetchCategories: () => Promise<void>
  syncWithBackend: () => Promise<void>
}

// Categorias padrão removidas - sempre buscar do backend

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      currentUserId: null,
      isLoading: false,


      addTransaction: async (transaction) => {
        try {
          set({ isLoading: true })
          
          // Garantir que a data seja sempre string no formato YYYY-MM-DD
          const dateValue: any = transaction.date;
          const recurrenceEndDateValue: any = transaction.recurrenceEndDate;
          
          const transactionData = {
            ...transaction,
            date: typeof dateValue === 'string' 
              ? dateValue 
              : dateValue instanceof Date
                ? `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}-${String(dateValue.getDate()).padStart(2, '0')}`
                : dateValue,
            recurrenceEndDate: recurrenceEndDateValue
              ? (typeof recurrenceEndDateValue === 'string'
                  ? recurrenceEndDateValue
                  : recurrenceEndDateValue instanceof Date
                    ? `${recurrenceEndDateValue.getFullYear()}-${String(recurrenceEndDateValue.getMonth() + 1).padStart(2, '0')}-${String(recurrenceEndDateValue.getDate()).padStart(2, '0')}`
                    : recurrenceEndDateValue)
              : undefined
          };
          
          console.log('💾 [STORE] Enviando transação:', transactionData);
          
          const result = await transactionService.create(transactionData)
          // Converter category de objeto para string e amount para número
          const newTransaction = {
            ...result,
            amount: Number(result.amount),
            category: typeof result.category === 'string' ? result.category : result.category?.name || '',
          }
          set((state) => ({
            transactions: [newTransaction as any, ...state.transactions],
            isLoading: false,
          }))
          toast.success('Transação adicionada com sucesso')
        } catch (error) {
          set({ isLoading: false })
          toast.error('Erro ao adicionar transação')
          throw error
        }
      },

      updateTransaction: async (id, updatedData) => {
        try {
          set({ isLoading: true })
          const result = await transactionService.update(id, updatedData)
          // Converter category de objeto para string e amount para número
          const updated = {
            ...result,
            amount: Number(result.amount),
            category: result.category.name,
          }
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? (updated as any) : t
            ),
            isLoading: false,
          }))
          toast.success('Transação atualizada com sucesso')
        } catch (error) {
          set({ isLoading: false })
          toast.error('Erro ao atualizar transação')
          throw error
        }
      },

      deleteTransaction: async (id) => {
        try {
          set({ isLoading: true })
          console.log('🗑️ Excluindo transação:', id)
          
          await transactionService.delete(id)
          console.log('✅ Transação excluída do backend')
          
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            isLoading: false,
          }))
          console.log('✅ Transação removida do store')
          
          toast.success('Transação excluída com sucesso')
        } catch (error: any) {
          set({ isLoading: false })
          
          console.error('❌ Erro ao excluir transação:', error)
          console.error('❌ Status:', error.response?.status)
          console.error('❌ Mensagem:', error.response?.data)
          
          // Tratar erro 429 (Too Many Requests)
          if (error.response?.status === 429) {
            toast.error('Muitas requisições. Aguarde alguns segundos e tente novamente.')
          } else {
            toast.error('Erro ao excluir transação')
          }
          
          throw error
        }
      },

      addCategory: async (category) => {
        try {
          set({ isLoading: true })
          console.log('➕ Criando categoria no backend:', category)
          
          const newCategory = await categoryService.create(category)
          console.log('✅ Categoria criada:', newCategory)
          
          set((state) => ({
            categories: [...state.categories, newCategory],
            isLoading: false,
          }))
          toast.success('Categoria criada com sucesso')
        } catch (error) {
          console.error('❌ Erro ao criar categoria:', error)
          set({ isLoading: false })
          toast.error('Erro ao criar categoria')
          throw error
        }
      },

      updateCategory: async (id, updatedData) => {
        try {
          set({ isLoading: true })
          console.log('✏️ Atualizando categoria no backend:', id, updatedData)
          
          const updatedCategory = await categoryService.update(id, updatedData)
          console.log('✅ Categoria atualizada:', updatedCategory)
          
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? updatedCategory : c
            ),
            isLoading: false,
          }))
          toast.success('Categoria atualizada com sucesso')
        } catch (error) {
          console.error('❌ Erro ao atualizar categoria:', error)
          set({ isLoading: false })
          toast.error('Erro ao atualizar categoria')
          throw error
        }
      },

      deleteCategory: async (id) => {
        try {
          const state = get()
          const hasTransactions = state.transactions.some(t => t.categoryId === id)
          
          if (hasTransactions) {
            toast.error('Não é possível excluir uma categoria com transações')
            return
          }

          set({ isLoading: true })
          console.log('🗑️ Excluindo categoria do backend:', id)
          
          await categoryService.delete(id)
          console.log('✅ Categoria excluída do backend')
          
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            isLoading: false,
          }))
          toast.success('Categoria excluída com sucesso')
        } catch (error) {
          console.error('❌ Erro ao excluir categoria:', error)
          set({ isLoading: false })
          toast.error('Erro ao excluir categoria')
          throw error
        }
      },

      getFilteredTransactions: (filters) => {
        const { transactions } = get()
        let filtered = [...transactions]

        if (filters.type && filters.type !== 'all') {
          filtered = filtered.filter((t) => t.type === filters.type)
        }

        if (filters.categoryId) {
          filtered = filtered.filter((t) => t.categoryId === filters.categoryId)
        }

        if (filters.startDate) {
          filtered = filtered.filter((t) => t.date >= filters.startDate!)
        }

        if (filters.endDate) {
          filtered = filtered.filter((t) => t.date <= filters.endDate!)
        }

        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase()
          filtered = filtered.filter(
            (t) =>
              t.description.toLowerCase().includes(term) ||
              t.category.toLowerCase().includes(term)
          )
        }

        return filtered
      },

      setUserId: (userId) => {
        const state = get()
        
        // Se mudou de usuário, limpar dados
        if (state.currentUserId && state.currentUserId !== userId) {
          set({
            transactions: [],
            categories: [],
            currentUserId: userId,
          })
        } else {
          set({ currentUserId: userId })
        }
      },

      clearUserData: () => {
        set({
          transactions: [],
          categories: [],
          currentUserId: null,
        })
      },

      fetchTransactions: async () => {
        try {
          set({ isLoading: true })
          console.log('🔄 Buscando transações do backend...')
          const data = await transactionService.getAll()
          console.log('📦 Transações recebidas do backend:', data.transactions.length)
          
          // Converter transações do backend para o formato do store
          const transactions = data.transactions.map(t => ({
            ...t,
            amount: Number(t.amount), // Converter string para número
            category: t.category.name, // Converter objeto category para string
          }))
          
          console.log('✅ Transações processadas:', transactions.length)
          console.log('📋 IDs das transações:', transactions.map(t => t.id))
          
          set({ transactions: transactions as any, isLoading: false })
        } catch (error) {
          console.error('❌ Erro ao buscar transações:', error)
          set({ isLoading: false })
        }
      },

      fetchCategories: async () => {
        try {
          console.log('🔄 Buscando categorias do backend...')
          const data = await categoryService.getAll()
          console.log('📦 Categorias recebidas:', data.length)
          set({ categories: data })
        } catch (error) {
          console.error('❌ Erro ao buscar categorias:', error)
        }
      },

      syncWithBackend: async () => {
        const { fetchTransactions, fetchCategories } = get()
        await Promise.all([
          fetchTransactions(),
          fetchCategories(),
        ])
      },
    }),
    {
      name: 'financial-storage',
      // Criar storage key dinâmico baseado no userId
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          
          try {
            const { state } = JSON.parse(str)
            const userId = state?.currentUserId
            
            // Se não houver userId, retornar estado vazio
            if (!userId) {
              return {
                state: {
                  transactions: [],
                  categories: [],
                  currentUserId: null,
                },
              }
            }
            
            // Buscar dados específicos do usuário
            const userKey = `${name}_user_${userId}`
            const userStr = localStorage.getItem(userKey)
            
            if (userStr) {
              return JSON.parse(userStr)
            }
            
            // Se não houver dados do usuário, retornar estado vazio
            return {
              state: {
                transactions: [],
                categories: [],
                currentUserId: userId,
              },
            }
          } catch (error) {
            return null
          }
        },
        setItem: (name: string, value: any) => {
          try {
            const state = value?.state || value
            const userId = state?.currentUserId
            
            // Salvar currentUserId no storage principal
            localStorage.setItem(name, JSON.stringify({
              state: { currentUserId: userId },
            }))
            
            // Se houver userId, salvar dados do usuário separadamente
            if (userId) {
              const userKey = `${name}_user_${userId}`
              localStorage.setItem(userKey, JSON.stringify(value))
            }
          } catch (error) {
            console.error('Erro ao salvar no storage:', error)
          }
        },
        removeItem: (name: string) => {
          // Remover storage principal
          localStorage.removeItem(name)
          
          // Remover todos os storages de usuários
          const keys = Object.keys(localStorage)
          keys.forEach(key => {
            if (key.startsWith(`${name}_user_`)) {
              localStorage.removeItem(key)
            }
          })
        },
      },
    }
  )
)
