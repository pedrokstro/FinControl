import { Loader2 } from 'lucide-react'
import {
  MobileBudgetVsActualCard,
  MobileCashFlowCard,
  MobileSavingsRateCard,
  MobileTopExpensesCard,
  MobileWeekdayExpensesCard,
} from '@/components/dashboard/mobile'
import { AnalyticsData } from '@/services/analytics.service'

interface DesktopAnalyticsColumnProps {
  column: 'left' | 'right'
  analytics: AnalyticsData | null
  isLoading: boolean
  isEmpty: boolean
  formatCurrency: (value: number) => string
}

const DesktopAnalyticsColumn = ({
  column,
  analytics,
  isLoading,
  isEmpty,
  formatCurrency,
}: DesktopAnalyticsColumnProps) => {
  if (column === 'left') {
    if (isLoading || isEmpty || !analytics) return null

    return (
      <>
        <MobileTopExpensesCard
          data={analytics.topExpenses}
          formatCurrency={formatCurrency}
        />
        <MobileBudgetVsActualCard
          data={analytics.budgetVsActual}
          formatCurrency={formatCurrency}
        />
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-8 flex items-center justify-center text-neutral-400 text-xs shadow-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary-500" />
        <span>Carregando análises detalhadas...</span>
      </div>
    )
  }

  if (isEmpty || !analytics) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-8 text-center text-xs text-neutral-400 shadow-sm">
        Nenhum dado analítico disponível para este mês.
      </div>
    )
  }

  return (
    <>
      <MobileCashFlowCard
        data={analytics.dailyCashFlow}
        formatCurrency={formatCurrency}
      />
      <MobileSavingsRateCard
        data={analytics.savingsRate}
        formatCurrency={formatCurrency}
      />
      <MobileWeekdayExpensesCard
        data={analytics.expensesByWeekday}
        formatCurrency={formatCurrency}
      />
    </>
  )
}

export default DesktopAnalyticsColumn
