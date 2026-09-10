import React, { useState, useMemo } from 'react'
import { PieChart as PieIcon, ArrowUpRight, ChevronRight } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { motion, AnimatePresence } from 'framer-motion'

export interface MobileCategoryItem {
  name: string
  value: number
  color: string
  type: 'income' | 'expense'
  icon?: string
}

interface MobileCategoryBreakdownProps {
  data: MobileCategoryItem[]
  formatCurrency: (val: number) => string
  onManageCategories?: () => void
}

export const MobileCategoryBreakdown: React.FC<MobileCategoryBreakdownProps> = ({
  data,
  formatCurrency,
  onManageCategories,
}) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense')
  const [showAll, setShowAll] = useState(false)

  const filteredData = useMemo(() => {
    return data
      .filter((item) => item.type === activeTab && item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [data, activeTab])

  const totalAmount = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.value, 0)
  }, [filteredData])

  const displayList = showAll ? filteredData : filteredData.slice(0, 4)

  const handleTabChange = (tab: 'expense' | 'income') => {
    haptics.light()
    setActiveTab(tab)
    setShowAll(false)
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Gastos por Categoria
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Distribuição no período
            </p>
          </div>
        </div>

        {/* Alternador Despesas / Receitas */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTabChange('expense')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'expense'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Despesas
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('income')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'income'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Receitas
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="py-6 text-center text-xs text-neutral-400 dark:text-neutral-500">
          Nenhuma {activeTab === 'expense' ? 'despesa' : 'receita'} registrada neste mês
        </div>
      ) : (
        <>
          {/* Total Acumulado */}
          <div className="flex items-baseline justify-between mt-1 mb-2.5">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Total em {activeTab === 'expense' ? 'Despesas' : 'Receitas'}
            </span>
            <span
              className={`text-base font-extrabold font-display ${
                activeTab === 'expense'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {/* Barra Multi-Segmentada Horizontal (Estilo Apple Screen Time / Nubank) */}
          <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex gap-0.5 mb-4">
            {filteredData.map((item, idx) => {
              const pct = totalAmount > 0 ? (item.value / totalAmount) * 100 : 0
              if (pct < 1) return null
              return (
                <div
                  key={idx}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color || '#6366f1',
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                  title={`${item.name}: ${pct.toFixed(1)}%`}
                />
              )
            })}
          </div>

          {/* Lista de Categorias em Cards Compactos */}
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {displayList.map((item, index) => {
                const percentage = totalAmount > 0 ? Math.round((item.value / totalAmount) * 100) : 0
                return (
                  <motion.div
                    key={item.name + index}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color || '#6366f1' }}
                      />
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300">
                        {percentage}%
                      </span>
                      <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Rodapé de Ações: Ver Mais / Gerenciar Categorias */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
            {filteredData.length > 4 ? (
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setShowAll(!showAll)
                }}
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>{showAll ? 'Mostrar menos' : `Ver todas (${filteredData.length})`}</span>
                <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            ) : <span />}

            {onManageCategories && (
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  onManageCategories()
                }}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 font-medium flex items-center gap-1"
              >
                <span>Gerenciar</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MobileCategoryBreakdown
