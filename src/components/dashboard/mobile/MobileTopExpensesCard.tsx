import React, { useState } from 'react'
import { Flame, ChevronRight } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { motion, AnimatePresence } from 'framer-motion'

export interface TopExpenseItem {
  description: string
  amount: number
  category: string
}

interface MobileTopExpensesCardProps {
  data: TopExpenseItem[]
  formatCurrency: (val: number) => string
}

export const MobileTopExpensesCard: React.FC<MobileTopExpensesCardProps> = ({
  data,
  formatCurrency,
}) => {
  const [showAll, setShowAll] = useState(false)

  if (!data || data.length === 0) return null

  const maxAmount = Math.max(...data.map((d) => d.amount), 1)
  const displayList = showAll ? data.slice(0, 10) : data.slice(0, 5)

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-amber-500 text-white shadow-sm'
    if (rank === 2) return 'bg-slate-400 text-white'
    if (rank === 3) return 'bg-amber-700 text-white'
    return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Maiores Despesas do Mês
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Ranking dos maiores impactos
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
          Top {data.length > 10 ? 10 : data.length}
        </span>
      </div>

      {/* Lista de Ranking */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {displayList.map((item, index) => {
            const rank = index + 1
            const percentage = (item.amount / maxAmount) * 100

            return (
              <motion.div
                key={item.description + index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${getRankBadge(
                        rank
                      )}`}
                    >
                      {rank}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {item.description}
                    </span>
                  </div>

                  <span className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                    {formatCurrency(item.amount)}
                  </span>
                </div>

                {/* Barra de Relevância Proporcional */}
                <div className="w-full bg-neutral-200/80 dark:bg-neutral-700/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      rank === 1
                        ? 'bg-rose-500'
                        : rank <= 3
                        ? 'bg-amber-500'
                        : 'bg-primary-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Botão Ver Mais / Menos */}
      {data.length > 5 && (
        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-center">
          <button
            type="button"
            onClick={() => {
              haptics.light()
              setShowAll(!showAll)
            }}
            className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>{showAll ? 'Mostrar top 5' : `Ver top 10 completo (${data.length})`}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 transform transition-transform ${
                showAll ? '-rotate-90' : 'rotate-90'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  )
}

export default MobileTopExpensesCard
