import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFinancialStore } from '@/store/financialStore'
import transactionService from '@/services/transaction.service'
import categoryService from '@/services/category.service'
import creditCardService from '@/services/creditCard.service'
import { budgetService } from '@/services/budget.service'

describe('Financial Store sync deduplication and persist partialize', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    useFinancialStore.setState({
      transactions: [],
      currentMonthTransactions: [],
      categories: [],
      budgets: [],
      creditCards: [],
      currentUserId: 'user-1',
      isLoading: false,
    })
  })

  it('deduplica chamadas simultâneas a syncWithBackend e não persiste flags transitórias', async () => {
    const txSpy = vi.spyOn(transactionService, 'getAll').mockResolvedValue({
      transactions: [],
      totalPages: 1,
      total: 0,
      page: 1,
      limit: 100,
    } as any)
    const catSpy = vi.spyOn(categoryService, 'getAll').mockResolvedValue([])
    const budgetSpy = vi.spyOn(budgetService, 'getBudgets').mockResolvedValue([])
    const cardSpy = vi.spyOn(creditCardService, 'getAll').mockResolvedValue([])

    await Promise.all([
      useFinancialStore.getState().syncWithBackend(),
      useFinancialStore.getState().syncWithBackend(),
    ])

    expect(txSpy).toHaveBeenCalledTimes(1)
    expect(catSpy).toHaveBeenCalledTimes(1)
    expect(budgetSpy).toHaveBeenCalledTimes(1)
    expect(cardSpy).toHaveBeenCalledTimes(1)

    const saved = localStorage.getItem('financial-storage_user_user-1')
    expect(saved).not.toBeNull()
    const parsed = JSON.parse(saved!)
    expect(parsed.state).not.toHaveProperty('isLoading')
    expect(parsed.state).not.toHaveProperty('isCreatingTransaction')
    expect(parsed.state).not.toHaveProperty('isSyncingAllTransactions')
  })
})
