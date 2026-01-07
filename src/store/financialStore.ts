import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, Category, FilterOptions } from '@/types'
import toast from 'react-hot-toast'
import transactionService from '@/services/transaction.service'
import categoryService from '@/services/category.service'
import { parseISO } from 'date-fns'

const normalizeDate = (value: any): string | undefined => {
  if (!value) return undefined

  if (typeof value === 'string') {
    return value.includes('T') ? value.split('T')[0] : value
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value)

  if (isNaN(date.getTime())) {
    return undefined
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const normalizeTransaction = (tx: any) => ({
  ...tx,
  amount: Number(tx.amount),
  category: typeof tx.category === 'string' ? tx.category : tx.category?.name || '',
  date: normalizeDate(tx.date),
  // Manter campos de recorrência preservando o formato original (não normalizar datas de recorrência)
  isRecurring: tx.isRecurring,
  recurrenceType: tx.recurrenceType,
  recurrenceStartDate: tx.recurrenceStartDate,
  recurrenceEndDate: tx.recurrenceEndDate,
  nextOccurrence: tx.nextOccurrence,
  recurrenceMonths: tx.recurrenceMonths ? Number(tx.recurrenceMonths) : undefined,
  parentTransactionId: tx.parentTransactionId,
})

const getCurrentMonthRange = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

interface FinancialState {
  transactions: Transaction[]
  currentMonthTransactions: Transaction[]
  categories: Category[]
  currentUserId: string | null
  isLoading: boolean
  isCreatingTransaction: boolean
  isSyncingAllTransactions: boolean
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
  syncAllTransactions: () => Promise<void>
  fetchCategories: () => Promise<void>
  syncWithBackend: () => Promise<void>
}

// Categorias padrão removidas - sempre buscar do backend

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      transactions: [],
      currentMonthTransactions: [],
      categories: [],
      currentUserId: null,
      isLoading: false,
      isCreatingTransaction: false,
      isSyncingAllTransactions: false,


      addTransaction: async (transaction) => {
        try {
          set({ isLoading: true, isCreatingTransaction: true })

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
          const createdTransactions = Array.isArray(result) ? result : [result]

          const normalizedTransactions = createdTransactions.map(normalizeTransaction)

          set((state) => ({
            transactions: [...normalizedTransactions as any, ...state.transactions],
            isLoading: false,
            isCreatingTransaction: false,
          }))
          toast.success('Transação adicionada com sucesso')
        } catch (error) {
          set({ isLoading: false, isCreatingTransaction: false })
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
          console.log('🔄 Buscando transações recentes do backend (todas)...')

          const data = await transactionService.getAll({
            page: 1,
            limit: 100,
            sortBy: 'date',
            sortOrder: 'desc',
          })

          const normalizedTransactions = data.transactions.map(normalizeTransaction)
          const { month, year } = getCurrentMonthRange()
          const monthTransactions = normalizedTransactions.filter((tx) => {
            if (!tx.date) return false
            const date = parseISO(tx.date)
            return date.getFullYear() === year && date.getMonth() + 1 === month
          })

          console.log(`✅ Transações retornadas: ${normalizedTransactions.length} (mês atual: ${monthTransactions.length})`)

          set({
            transactions: normalizedTransactions as any,
            currentMonthTransactions: monthTransactions as any,
            isLoading: false,
          })

          // Buscar restante em background (todas as páginas)
          get().syncAllTransactions().catch((error) => {
            console.error('❌ Erro ao sincronizar todas as transações:', error)
          })
        } catch (error) {
          console.error('❌ Erro ao buscar transações:', error)
          set({ isLoading: false })
        }
      },

      syncAllTransactions: async () => {
        const state = get()
        if (state.isSyncingAllTransactions) {
          return
        }

        try {
          set({ isSyncingAllTransactions: true })
          console.log('🔄 Sincronizando todas as transações em segundo plano...')

          const pageSize = 100
          let currentPage = 1
          let totalPages = 1
          const allTransactions: any[] = []

          while (currentPage <= totalPages) {
            const data = await transactionService.getAll({
              page: currentPage,
              limit: pageSize,
              sortBy: 'date',
              sortOrder: 'desc',
            })

            console.log(`📦 Página ${currentPage}/${data.totalPages} recebida com ${data.transactions.length} itens`)

            totalPages = data.totalPages || 1
            currentPage++

            allTransactions.push(...data.transactions.map(normalizeTransaction))
          }

          console.log('✅ Total de transações sincronizadas:', allTransactions.length)
          set(() => {
            const { month, year } = getCurrentMonthRange()
            const filteredMonth = allTransactions.filter((tx) => {
              const date = parseISO(tx.date)
              return date.getFullYear() === year && date.getMonth() + 1 === month
            })

            return {
              transactions: allTransactions.length > 0 ? (allTransactions as any) : get().transactions,
              currentMonthTransactions: filteredMonth.length > 0 ? (filteredMonth as any) : get().currentMonthTransactions,
              isSyncingAllTransactions: false,
            }
          })
        } catch (error) {
          console.error('❌ Erro ao sincronizar todas as transações:', error)
          set({ isSyncingAllTransactions: false })
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
