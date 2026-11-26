import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { format, parseISO } from 'date-fns'
import TransactionFormModal, { transactionSchema } from '@/components/transactions/TransactionFormModal'
import { useFinancialStore } from '@/store/financialStore'

vi.mock('@/hooks/useTransactionLimit', () => ({
  useTransactionLimit: () => ({
    checkLimit: vi.fn().mockResolvedValue(true),
    refreshUsage: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/components/common/CategorySelect', () => ({
  default: ({ categories, value, onChange }: any) => (
    <select
      aria-label="Categoria"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecione</option>
      {categories.map((c: any) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  ),
}))

vi.mock('@/components/common/CustomDatePicker', () => ({
  default: ({ value, onChange }: any) => (
    <input
      aria-label="Data"
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

vi.mock('@/components/common/CustomSelect', () => ({
  default: ({ options, value, onChange, dropdownTitle, placeholder }: any) => (
    <select
      aria-label={dropdownTitle || placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || 'Selecione'}</option>
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}))

describe('TransactionFormModal and date parsing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFinancialStore.setState({
      categories: [
        {
          id: 'cat-1',
          name: 'Alimentação',
          type: 'expense',
          icon: 'Utensils',
          color: '#ef4444',
          userId: '1',
        },
      ],
      creditCards: [],
      isCreatingTransaction: false,
      fetchCreditCards: vi.fn().mockResolvedValue(undefined),
    } as any)
  })

  it('formata data ISO sem deslocamento de fuso horário UTC-3', () => {
    const formatted = format(parseISO('2026-11-26'), 'dd/MM/yyyy')
    expect(formatted).toBe('26/11/2026')
  })

  it('exige tipo de recorrência quando transação recorrente está marcada no schema', () => {
    const invalid = transactionSchema.safeParse({
      type: 'expense',
      amount: '120',
      categoryId: 'cat-1',
      description: 'Internet Fibra',
      date: '2026-11-26',
      isRecurring: true,
    })

    expect(invalid.success).toBe(false)
    if (!invalid.success) {
      expect(invalid.error.issues.some((i) => i.path.includes('recurrenceType'))).toBe(true)
    }
  })

  it('valida campos obrigatórios e envia recurrenceMonths corretamente ao criar transação recorrente', async () => {
    const addTransaction = vi.fn().mockResolvedValue(undefined)
    useFinancialStore.setState({ addTransaction } as any)
    const onClose = vi.fn()

    render(
      <TransactionFormModal
        isOpen={true}
        onClose={onClose}
        initialType="expense"
        initialDate="2026-11-26"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await screen.findByText('Valor é obrigatório')).toBeTruthy()
    expect(screen.getByText('Categoria é obrigatória')).toBeTruthy()
    expect(screen.getByText('Descrição deve ter no mínimo 3 caracteres')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '89.90' } })
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'cat-1' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: Compra no supermercado'), {
      target: { value: 'Streaming Mensal' },
    })

    const recurringCheckbox = screen.getByRole('checkbox')
    fireEvent.click(recurringCheckbox)
    fireEvent.change(screen.getByLabelText('Frequência'), { target: { value: 'monthly' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: 12 (vazio para tempo indeterminado)'), {
      target: { value: '12' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(addTransaction).toHaveBeenCalledTimes(1)
    })

    expect(addTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'expense',
        amount: 89.9,
        description: 'Streaming Mensal',
        date: '2026-11-26',
        categoryId: 'cat-1',
        isRecurring: true,
        recurrenceType: 'monthly',
        recurrenceMonths: 12,
      })
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
