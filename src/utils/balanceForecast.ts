import { parseISO, endOfMonth, isAfter } from 'date-fns'
import { Transaction, CreditCard } from '@/types'

export interface PendingCommitment {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  dueDate: string
  origin: 'subscription' | 'card_invoice' | 'recurring' | 'scheduled'
}

export interface BalanceForecast {
  currentBalance: number
  pendingIncome: number
  pendingExpenses: number
  projectedBalance: number
  pendingItems: PendingCommitment[]
  status: 'positive' | 'warning' | 'negative'
}

/**
 * Calcula a previsão de saldo financeiro até o último dia do mês corrente,
 * considerando receitas pendentes, assinaturas, contas a vencer e faturas de cartão.
 */
export function calculateBalanceForecast(
  transactions: Transaction[],
  creditCards: CreditCard[],
  currentDate: Date = new Date()
): BalanceForecast {
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  const todayDay = today.getDate()
  const monthEnd = endOfMonth(today)
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // 1. Filtrar transações do mês corrente
  const monthTransactions = transactions.filter((t) => {
    if (t.isCancelled) return false
    const d = parseISO(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  // Saldo realizado até hoje (excluindo compras diretas no cartão de crédito para evitar soma dupla com a fatura)
  const realizedIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const realizedExpense = monthTransactions
    .filter((t) => t.type === 'expense' && t.paymentMethod !== 'credit')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const currentBalance = realizedIncome - realizedExpense

  const pendingItems: PendingCommitment[] = []

  // 2. Transações futuras já agendadas para este mês (data > hoje)
  monthTransactions.forEach((t) => {
    const d = parseISO(t.date)
    if (isAfter(d, today)) {
      pendingItems.push({
        id: `sched-${t.id}`,
        description: t.description,
        amount: Number(t.amount),
        type: t.type,
        dueDate: t.date.split('T')[0],
        origin: t.isRecurring ? 'recurring' : 'scheduled',
      })
    }
  })

  // 3. Faturas de Cartão de Crédito com vencimento até o fim do mês
  creditCards.forEach((card) => {
    const dueDay = card.dueDay
    if (!dueDay) return

    // Se o dia de vencimento for depois de hoje e dentro do mês corrente
    if (dueDay > todayDay && dueDay <= monthEnd.getDate()) {
      // Calcular gastos no cartão que compõem a fatura
      const cardExpenses = monthTransactions.filter(
        (t) => t.creditCardId === card.id && t.type === 'expense' && !t.isCancelled
      )
      const invoiceAmount = cardExpenses.reduce((sum, t) => sum + Number(t.amount), 0)

      // Verificar se já não foi paga uma despesa de fatura deste cartão neste mês
      const isAlreadyPaid = monthTransactions.some(
        (t) =>
          t.type === 'expense' &&
          t.description.toLowerCase().includes(`fatura - ${card.name.toLowerCase()}`)
      )

      if (invoiceAmount > 0 && !isAlreadyPaid) {
        const dueMonth = String(currentMonth + 1).padStart(2, '0')
        const dueDayStr = String(dueDay).padStart(2, '0')
        pendingItems.push({
          id: `card-inv-${card.id}`,
          description: `Fatura Cartão ${card.name}`,
          amount: invoiceAmount,
          type: 'expense',
          dueDate: `${currentYear}-${dueMonth}-${dueDayStr}`,
          origin: 'card_invoice',
        })
      }
    }
  })

  // 4. Assinaturas e Recorrências ativas que ainda vencem este mês e não foram lançadas
  const recurringTemplates = transactions.filter(
    (t) => t.isRecurring && !t.parentTransactionId && !t.isCancelled
  )

  recurringTemplates.forEach((rec) => {
    const recDate = parseISO(rec.date)
    const billingDay = recDate.getDate()

    // Se o dia de cobrança for depois de hoje e antes do fim do mês
    if (billingDay > todayDay && billingDay <= monthEnd.getDate()) {
      // Verificar se já existe uma transação gerada para este mês
      const alreadyHasChildThisMonth = monthTransactions.some(
        (t) =>
          t.parentTransactionId === rec.id ||
          (t.description.toLowerCase().trim() === rec.description.toLowerCase().trim() &&
            Math.abs(Number(t.amount) - Number(rec.amount)) < 0.01)
      )

      if (!alreadyHasChildThisMonth) {
        const dueMonth = String(currentMonth + 1).padStart(2, '0')
        const dueDayStr = String(billingDay).padStart(2, '0')
        pendingItems.push({
          id: `rec-${rec.id}`,
          description: rec.description,
          amount: Number(rec.amount),
          type: rec.type,
          dueDate: `${currentYear}-${dueMonth}-${dueDayStr}`,
          origin: 'subscription',
        })
      }
    }
  })

  // Ordenar itens pendentes por data de vencimento crescente
  pendingItems.sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  // 5. Totalizar pendências
  const pendingIncome = pendingItems
    .filter((i) => i.type === 'income')
    .reduce((sum, i) => sum + i.amount, 0)

  const pendingExpenses = pendingItems
    .filter((i) => i.type === 'expense')
    .reduce((sum, i) => sum + i.amount, 0)

  const projectedBalance = currentBalance + pendingIncome - pendingExpenses

  let status: 'positive' | 'warning' | 'negative' = 'positive'
  if (projectedBalance < 0) {
    status = 'negative'
  } else if (projectedBalance < 500 || projectedBalance < currentBalance * 0.2) {
    status = 'warning'
  }

  return {
    currentBalance,
    pendingIncome,
    pendingExpenses,
    projectedBalance,
    pendingItems,
    status,
  }
}
