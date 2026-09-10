import React, { useState } from 'react'
import { ChevronDown, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { haptics } from '@/utils/haptics'
import { MobileCashFlowCard } from './MobileCashFlowCard'
import { MobileSavingsRateCard } from './MobileSavingsRateCard'
import { MobileTopExpensesCard } from './MobileTopExpensesCard'
import { MobileWeekdayExpensesCard } from './MobileWeekdayExpensesCard'
import { MobileBudgetVsActualCard } from './MobileBudgetVsActualCard'
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
            {isOpen ? 'Ocultar' : 'Explorar (5)'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
              isOpen ? 'transform rotate-180 text-primary-500' : ''
            }`}
          />
        </div>
      </button>

      {/* Conteúdo Expansível com Cards Nativos Mobile */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-neutral-100 dark:border-neutral-800 p-3 space-y-3.5 bg-neutral-50/50 dark:bg-neutral-950/20"
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
                {/* 1. Fluxo de Caixa Diário Mobile */}
                <MobileCashFlowCard
                  data={analytics.dailyCashFlow}
                  formatCurrency={formatCurrency}
                />

                {/* 2. Taxa de Poupança Mobile */}
                <MobileSavingsRateCard
                  data={analytics.savingsRate}
                  formatCurrency={formatCurrency}
                />

                {/* 3. Top 10 Maiores Despesas Mobile */}
                <MobileTopExpensesCard
                  data={analytics.topExpenses}
                  formatCurrency={formatCurrency}
                />

                {/* 4. Despesas por Dia da Semana Mobile */}
                <MobileWeekdayExpensesCard
                  data={analytics.expensesByWeekday}
                  formatCurrency={formatCurrency}
                />

                {/* 5. Orçamento vs Real Mobile */}
                <MobileBudgetVsActualCard
                  data={analytics.budgetVsActual}
                  formatCurrency={formatCurrency}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileAnalyticsAccordion
