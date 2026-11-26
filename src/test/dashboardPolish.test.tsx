import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MonthTransactionsListModal from '@/components/dashboard/MonthTransactionsListModal'

describe('MonthTransactionsListModal', () => {
  const categories = [
    {
      id: 'cat-1',
      name: 'Salário',
      type: 'income' as const,
      icon: 'Wallet',
      color: '#22c55e',
      userId: '1',
    },
  ]

  const transactions = [
    {
      id: 'tx-1',
      type: 'income' as const,
      amount: 5500,
      description: 'Salário Mensal',
      date: '2026-11-05',
      category: 'Salário',
      categoryId: 'cat-1',
      userId: '1',
      createdAt: '2026-11-05T00:00:00Z',
    },
  ]

  it('renderiza receitas do mês e botão Fechar em formato pill (rounded-full)', () => {
    const onClose = vi.fn()
    render(
      <MonthTransactionsListModal
        isOpen={true}
        onClose={onClose}
        type="income"
        transactions={transactions}
        categories={categories}
        totalAmount={5500}
        formatCurrency={(v) => `R$ ${v.toFixed(2)}`}
        formatDate={(d) => d}
      />
    )

    expect(screen.getByText('Receitas do Mês')).toBeInTheDocument()
    expect(screen.getByText('Salário Mensal')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: 'Fechar' })
    expect(closeButton.className).toContain('rounded-full')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renderiza estado vazio para despesas do mês', () => {
    render(
      <MonthTransactionsListModal
        isOpen={true}
        onClose={vi.fn()}
        type="expense"
        transactions={[]}
        categories={categories}
        totalAmount={0}
        formatCurrency={(v) => `R$ ${v.toFixed(2)}`}
        formatDate={(d) => d}
      />
    )

    expect(screen.getByText('Despesas do Mês')).toBeInTheDocument()
    expect(screen.getByText('Nenhuma despesa registrada neste mês.')).toBeInTheDocument()
  })
})
