import React, { useState } from 'react'
import { ChevronDown, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { haptics } from '@/utils/haptics'
import {
  CashFlowChart,
  SavingsRateChart,
  TopExpensesChart,
  ExpensesByWeekdayChart,
  BudgetVsActualChart,
} from '@/components/charts/AdvancedCharts'
import { type AnalyticsData } from '@/services/analytics.service'

interface MobileAnalyticsAccordionProps {
  analytics: AnalyticsData | null
  isLoading: boolean
  isEmpty: boolean
  formatCurrency: (val: number) => string
}

export const MobileAnalyticsAccordion: React.FC<MobileAnalyticsAccordionProps> = ({
  analytics,
  isLoading,
  isEmpty,
  formatCurrency,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    haptics.light()
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Botão de Expansão / Header */}
      <button
        type="button"
        onClick={toggleAccordion}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Análises & Insights Avançados
              </h3>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Fluxo diário, taxa de poupança e projeções
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            {isOpen ? 'Ocultar' : 'Explorar'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
              isOpen ? 'transform rotate-180 text-primary-500' : ''
            }`}
          />
        </div>
      </button>

      {/* Conteúdo Expansível */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-neutral-100 dark:border-neutral-800 p-4 space-y-5 bg-neutral-50/50 dark:bg-neutral-950/20"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-neutral-400 text-xs">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary-500" />
                <span>Carregando análises detalhadas...</span>
              </div>
            ) : isEmpty || !analytics ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                Nenhum dado analítico disponível para este mês.
              </div>
            ) : (
              <>
                {/* 1. Fluxo de Caixa Diário */}
                <div className="space-y-1">
                  <CashFlowChart
                    data={analytics.dailyCashFlow}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* 2. Taxa de Poupança */}
                <div className="space-y-1">
                  <SavingsRateChart
                    data={analytics.savingsRate}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* 3. Top 10 Maiores Despesas */}
                <div className="space-y-1">
                  <TopExpensesChart
                    data={analytics.topExpenses}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* 4. Despesas por Dia da Semana */}
                <div className="space-y-1">
                  <ExpensesByWeekdayChart
                    data={analytics.expensesByWeekday}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* 5. Orçamento vs Real */}
                <div className="space-y-1">
                  <BudgetVsActualChart
                    data={analytics.budgetVsActual}
                    formatCurrency={formatCurrency}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileAnalyticsAccordion
