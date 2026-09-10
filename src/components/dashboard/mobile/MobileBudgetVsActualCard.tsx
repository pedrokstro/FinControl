import React, { useState } from 'react'
import { Scale, CheckCircle2, AlertTriangle, AlertOctagon, ChevronRight } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { motion, AnimatePresence } from 'framer-motion'

export interface BudgetVsActualItem {
  category: string
  budget: number
  actual: number
  status: 'good' | 'warning' | 'over'
}

interface MobileBudgetVsActualCardProps {
  data: BudgetVsActualItem[]
  formatCurrency: (val: number) => string
}

export const MobileBudgetVsActualCard: React.FC<MobileBudgetVsActualCardProps> = ({
  data,
  formatCurrency,
}) => {
  const [showAll, setShowAll] = useState(false)

  if (!data || data.length === 0) return null

  const displayList = showAll ? data : data.slice(0, 4)

  const totalBudget = data.reduce((acc, d) => acc + d.budget, 0)
  const totalActual = data.reduce((acc, d) => acc + d.actual, 0)
  const overallDiff = totalBudget - totalActual

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Orçamento vs. Realizado
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Aderência aos tetos por categoria
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            overallDiff >= 0
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          {overallDiff >= 0 ? 'Dentro do plano' : 'Acima do plano'}
        </span>
      </div>

      {/* Caixa de Resumo Global */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 mb-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-neutral-400">
            Total Previsto
          </span>
          <div className="font-bold font-mono text-neutral-700 dark:text-neutral-300">
            {formatCurrency(totalBudget)}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-neutral-400">
            Total Gasto
          </span>
          <div
            className={`font-bold font-mono ${
              totalActual <= totalBudget
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(totalActual)}
          </div>
        </div>
      </div>

      {/* Lista de Comparação por Categoria */}
      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {displayList.map((item, index) => {
            const pct = item.budget > 0 ? (item.actual / item.budget) * 100 : 0
            const isOver = item.status === 'over'
            const isWarning = item.status === 'warning'

            let badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            let barColor = 'bg-emerald-500'
            let statusIcon = <CheckCircle2 className="w-3 h-3 text-emerald-500" />

            if (isOver) {
              badgeStyle = 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              barColor = 'bg-rose-500'
              statusIcon = <AlertOctagon className="w-3 h-3 text-rose-500" />
            } else if (isWarning) {
              badgeStyle = 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              barColor = 'bg-amber-500'
              statusIcon = <AlertTriangle className="w-3 h-3 text-amber-500" />
            }

            return (
              <motion.div
                key={item.category + index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {statusIcon}
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                      {item.category}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeStyle}`}>
                    {Math.round(pct)}%
                  </span>
                </div>

                {/* Barra de Progresso Comparativa */}
                <div className="w-full bg-neutral-200/80 dark:bg-neutral-700/60 rounded-full h-2 overflow-hidden my-0.5">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                {/* Valores Lado a Lado */}
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  <span>Gasto: <strong className="text-neutral-900 dark:text-white">{formatCurrency(item.actual)}</strong></span>
                  <span>Teto: {formatCurrency(item.budget)}</span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Botão Ver Mais */}
      {data.length > 4 && (
        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-center">
          <button
            type="button"
            onClick={() => {
              haptics.light()
              setShowAll(!showAll)
            }}
            className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>{showAll ? 'Mostrar menos' : `Ver todas (${data.length})`}</span>
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

export default MobileBudgetVsActualCard
