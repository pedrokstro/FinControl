import { describe, it, expect, beforeEach } from 'vitest'
import { useFinancialStore } from '@/store/financialStore'
import type { Transaction, Category } from '@/types'

describe('Financial Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useFinancialStore.setState({
      transactions: [],
      categories: [],
    })
  })

  describe('Transactions', () => {
    it('should add a new transaction', () => {
      const { addTransaction } = useFinancialStore.getState()
      
      const newTransaction: Omit<Transaction, 'id' | 'createdAt'> = {
        type: 'expense',
        amount: 100,
        category: 'Alimentação',
        categoryId: '1',
        description: 'Almoço',
        date: '2024-01-15',
        userId: '1',
      }
      
      addTransaction(newTransaction)
      
      const state = useFinancialStore.getState()
      expect(state.transactions).toHaveLength(1)
      expect(state.transactions[0].description).toBe('Almoço')
      expect(state.transactions[0].amount).toBe(100)
    })

    it('should update a transaction', () => {
      const { addTransaction, updateTransaction } = useFinancialStore.getState()
      
      const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
        type: 'expense',
        amount: 100,
        category: 'Alimentação',
        categoryId: '1',
        description: 'Almoço',
        date: '2024-01-15',
        userId: '1',
      }
      
      addTransaction(transaction)
      
      const state = useFinancialStore.getState()
      const transactionId = state.transactions[0].id
      
      updateTransaction(transactionId, { amount: 150 })
      
      const updatedState = useFinancialStore.getState()
      expect(updatedState.transactions[0].amount).toBe(150)
    })

    it('should delete a transaction', () => {
      const { addTransaction, deleteTransaction } = useFinancialStore.getState()
      
      const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
        type: 'expense',
        amount: 100,
        category: 'Alimentação',
        categoryId: '1',
        description: 'Almoço',
        date: '2024-01-15',
        userId: '1',
      }
      
      addTransaction(transaction)
      
      const state = useFinancialStore.getState()
      const transactionId = state.transactions[0].id
      
      deleteTransaction(transactionId)
      
      const updatedState = useFinancialStore.getState()
      expect(updatedState.transactions).toHaveLength(0)
    })

    it('should filter transactions by type', () => {
      const { addTransaction, getFilteredTransactions } = useFinancialStore.getState()
      
      addTransaction({
        type: 'income',
        amount: 1000,
        category: 'Salário',
        categoryId: '1',
        description: 'Salário Janeiro',
        date: '2024-01-01',
        userId: '1',
      })
      
      addTransaction({
        type: 'expense',
        amount: 100,
        category: 'Alimentação',
        categoryId: '2',
        description: 'Almoço',
        date: '2024-01-15',
        userId: '1',
      })
      
      const incomeTransactions = getFilteredTransactions({ type: 'income' })
      const expenseTransactions = getFilteredTransactions({ type: 'expense' })
      
      expect(incomeTransactions).toHaveLength(1)
      expect(expenseTransactions).toHaveLength(1)
      expect(incomeTransactions[0].type).toBe('income')
      expect(expenseTransactions[0].type).toBe('expense')
    })
  })

  describe('Categories', () => {
    it('should add a new category', () => {
      const { addCategory } = useFinancialStore.getState()
      
      const newCategory: Omit<Category, 'id'> = {
        name: 'Nova Categoria',
        type: 'expense',
        color: '#22c55e',
        icon: 'DollarSign',
        userId: '1',
      }
      
      addCategory(newCategory)
      
      const state = useFinancialStore.getState()
      expect(state.categories).toHaveLength(1)
      expect(state.categories[0].name).toBe('Nova Categoria')
    })

    it('should update a category', () => {
      const { addCategory, updateCategory } = useFinancialStore.getState()
      
      const category: Omit<Category, 'id'> = {
        name: 'Categoria Test',
        type: 'expense',
        color: '#22c55e',
        icon: 'DollarSign',
        userId: '1',
      }
      
      addCategory(category)
      
      const state = useFinancialStore.getState()
      const categoryId = state.categories[0].id
      
      updateCategory(categoryId, { name: 'Categoria Atualizada' })
      
      const updatedState = useFinancialStore.getState()
      expect(updatedState.categories[0].name).toBe('Categoria Atualizada')
    })

    it('should not delete category with transactions', () => {
      const { addCategory, addTransaction, deleteCategory } = useFinancialStore.getState()
      
      const category: Omit<Category, 'id'> = {
        name: 'Alimentação',
        type: 'expense',
        color: '#22c55e',
        icon: 'DollarSign',
        userId: '1',
      }
      
      addCategory(category)
      
      const state = useFinancialStore.getState()
      const categoryId = state.categories[0].id
      
      addTransaction({
        type: 'expense',
        amount: 100,
        category: 'Alimentação',
        categoryId: categoryId,
        description: 'Almoço',
        date: '2024-01-15',
        userId: '1',
      })
      
      deleteCategory(categoryId)
      
      const updatedState = useFinancialStore.getState()
      // Category should not be deleted because it has transactions
      expect(updatedState.categories).toHaveLength(1)
    })
  })
})
