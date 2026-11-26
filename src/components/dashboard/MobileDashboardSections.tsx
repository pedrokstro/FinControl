import { Link } from 'react-router-dom'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import CategoryIcon from '@/components/common/CategoryIcon'
import { type IconName } from '@/utils/iconMapping'
import {
  MobileAnalyticsAccordion,
  MobileBudgetsCarousel,
  MobileCategoryBreakdown,
  MobileMonthlyHistoryCard,
  MobileSavingsGoalCard,
  MobileYearlyAccumulatedCard,
} from '@/components/dashboard/mobile'
import { type MobileCategoryItem } from '@/components/dashboard/mobile/MobileCategoryBreakdown'
import { Budget, Category, Transaction } from '@/types'
import { SavingsGoal } from '@/services/savingsGoal.service'
import { AnalyticsData } from '@/services/analytics.service'

interface MobileDashboardSectionsProps {
  budgets: Budget[]
  categories: Category[]
  transactions: Transaction[]
  recentTransactions: Transaction[]
  selectedDate: { month: number; year: number }
  categoryData: MobileCategoryItem[]
  monthlyData: { month: string; receitas: number; despesas: number }[]
  yearlyMonthlyData: { month: string; receitas: number; despesas: number; saldo: number }[]
  accumulatedBalanceData: { month: string; saldoAcumulado: number }[]
  currentGoal: SavingsGoal | null
  isLoadingGoal: boolean
  analytics: AnalyticsData | null
  isLoadingAnalytics: boolean
  analyticsEmpty: boolean
  formatCurrency: (value: number) => string
  formatDate: (value: string) => string
  onManageBudgets: () => void
  onManageCategories: () => void
  onEditGoal: () => void
  onDeleteGoal: () => void
}

const MobileDashboardSections = ({
  budgets,
  categories,
  transactions,
  recentTransactions,
  selectedDate,
  categoryData,
  monthlyData,
  yearlyMonthlyData,
  accumulatedBalanceData,
  currentGoal,
  isLoadingGoal,
  analytics,
  isLoadingAnalytics,
  analyticsEmpty,
  formatCurrency,
  formatDate,
  onManageBudgets,
  onManageCategories,
  onEditGoal,
  onDeleteGoal,
}: MobileDashboardSectionsProps) => {
  return (
    <div className="block sm:hidden space-y-4 mb-8">
      <MobileBudgetsCarousel
        budgets={budgets}
        categories={categories}
        transactions={transactions}
        selectedDate={selectedDate}
        formatCurrency={formatCurrency}
        onManageBudgets={onManageBudgets}
      />

      <MobileCategoryBreakdown
        data={categoryData}
        formatCurrency={formatCurrency}
        onManageCategories={onManageCategories}
      />

      <MobileMonthlyHistoryCard
        data={monthlyData}
        formatCurrency={formatCurrency}
      />

      <MobileSavingsGoalCard
        goal={currentGoal}
        formatCurrency={formatCurrency}
        onEditGoal={onEditGoal}
        onDeleteGoal={currentGoal ? onDeleteGoal : undefined}
        isLoading={isLoadingGoal}
      />

      <MobileYearlyAccumulatedCard
        yearlyData={yearlyMonthlyData}
        accumulatedData={accumulatedBalanceData}
        formatCurrency={formatCurrency}
      />

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Transações Recentes
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Últimas movimentações
            </p>
          </div>
          <Link
            to="/app/transactions"
            className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Ver todas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.slice(0, 5).map((transaction) => {
              const category = categories.find((c) => c.id === transaction.categoryId)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        transaction.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {category ? (
                        <CategoryIcon
                          icon={category.icon as IconName}
                          color={category.color}
                          size="sm"
                        />
                      ) : transaction.type === 'income' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                        {transaction.description}
                      </p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold font-mono text-xs tabular-figures shrink-0 ml-2 ${
                      transaction.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-neutral-400">
            Nenhuma transação registrada
          </div>
        )}
      </div>

      <MobileAnalyticsAccordion
        analytics={analytics}
        isLoading={isLoadingAnalytics}
        isEmpty={analyticsEmpty}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}

export default MobileDashboardSections
