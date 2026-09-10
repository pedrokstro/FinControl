import React from 'react'
import { Target, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import CategoryIcon from '@/components/common/CategoryIcon'
import { type IconName } from '@/utils/iconMapping'
import { parseISO } from 'date-fns'

interface Budget {
  id: string
  categoryId: string
  amount: number
  month?: number
  year?: number
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

interface Transaction {
  id: string
  categoryId: string
  amount: number
  type: string
  date: string
}

interface MobileBudgetsCarouselProps {
  budgets: Budget[]
  categories: Category[]
  transactions: Transaction[]
  selectedDate: { year: number; month: number }
  formatCurrency: (val: number) => string
  onManageBudgets?: () => void
}

export const MobileBudgetsCarousel: React.FC<MobileBudgetsCarouselProps> = ({
  budgets,
  categories,
  transactions,
  selectedDate,
  formatCurrency,
  onManageBudgets,
}) => {
  if (!budgets || budgets.length === 0) return null

  const computedBudgets = budgets
    .map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId)
      if (!category) return null

      const spent = transactions
        .filter((t) => {
          if (t.categoryId !== budget.categoryId || t.type !== 'expense') return false
          if (!t.date) return false
          const date = parseISO(t.date)
          return (
            date.getFullYear() === selectedDate.year &&
            date.getMonth() + 1 === selectedDate.month
          )
        })
        .reduce((sum, t) => sum + t.amount, 0)

      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
      const remaining = budget.amount - spent
      const isExceeded = spent > budget.amount

      return {
        budget,
        category,
        spent,
        percentage: Math.min(percentage, 100),
        rawPercentage: percentage,
        remaining,
        isExceeded,
      }
    })
    .filter(Boolean) as Array<{
    budget: Budget
    category: Category
    spent: number
    percentage: number
    rawPercentage: number
    remaining: number
    isExceeded: boolean
  }>

  if (computedBudgets.length === 0) return null

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Widget */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Meus Limites de Gastos
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Orçamentos definidos
            </p>
          </div>
        </div>

        {onManageBudgets && (
          <button
            type="button"
            onClick={onManageBudgets}
            className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Carrossel Horizontal Deslizável (Snap Scroll) */}
      <div className="flex gap-3 overflow-x-auto pb-1 pt-1 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
        {computedBudgets.map(({ budget, category, spent, percentage, rawPercentage, remaining, isExceeded }) => {
          let statusColor = 'bg-emerald-500'
          let statusBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          if (rawPercentage >= 100) {
            statusColor = 'bg-rose-500'
            statusBg = 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          } else if (rawPercentage >= 80) {
            statusColor = 'bg-amber-500'
            statusBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }

          return (
            <div
              key={budget.id}
              className="snap-start flex-shrink-0 w-[230px] p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col justify-between"
            >
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <CategoryIcon
                      icon={category.icon as IconName}
                      color={category.color}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                    {category.name}
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusBg}`}>
                  {Math.round(rawPercentage)}%
                </span>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden my-1.5">
                <div
                  className={`h-full ${statusColor} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Informações de Valores */}
              <div className="flex items-center justify-between text-[11px] mt-1 text-neutral-500 dark:text-neutral-400">
                <span>Gasto: <strong className="text-neutral-900 dark:text-white font-mono">{formatCurrency(spent)}</strong></span>
                <span>Teto: <span className="font-mono">{formatCurrency(budget.amount)}</span></span>
              </div>

              {/* Aviso de Status */}
              <div className="mt-2 pt-1.5 border-t border-neutral-200/50 dark:border-neutral-700/40 flex items-center gap-1 text-[10px]">
                {isExceeded ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="text-rose-600 dark:text-rose-400 font-semibold truncate">
                      Excedido em {formatCurrency(Math.abs(remaining))}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-neutral-600 dark:text-neutral-400 truncate">
                      Resta {formatCurrency(remaining)}
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBudgetsCarousel
