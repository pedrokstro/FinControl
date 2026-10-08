import React from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { haptics } from '@/utils/haptics'

interface MobileTransactionsSummaryProps {
  balance: number
  income: number
  expense: number
  count: number
  formatCurrency: (value: number) => string
}

export const MobileTransactionsSummary: React.FC<MobileTransactionsSummaryProps> = ({
  balance,
  income,
  expense,
  count,
  formatCurrency,
}) => {
  // Proporção de despesas em relação às receitas
  const expenseRatio = income > 0 ? (expense / income) * 100 : expense > 0 ? 100 : 0

  return (
    <div className="space-y-3 select-none">
      {/* 1. Hero Card: Saldo do Mês (Fundo Branco Limpo) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-4 sm:p-5 shadow-sm border border-neutral-200/80 dark:border-neutral-800"
      >
        <div className="relative z-10">
          {/* Topo do Hero: Identificador */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 dark:text-primary-400 border border-primary-100/60 dark:border-primary-900/40">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 font-display">
                Saldo do Mês
              </span>
            </div>
          </div>

          {/* Valor do Saldo */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-neutral-900 dark:text-white leading-tight">
              {formatCurrency(balance)}
            </h2>
          </div>

          {/* Barra de Consumo das Receitas ou Rodapé de Status */}
          {(income > 0 || expense > 0) ? (
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                <span>
                  {income > 0
                    ? `${Math.min(expenseRatio, 100).toFixed(0)}% das receitas consumidas`
                    : 'Sem receitas no período'}
                </span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300 font-bold">
                  {income > expense ? `Sobra: ${formatCurrency(balance)}` : 'Limite ultrapassado'}
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden p-0.5 border border-neutral-200/50 dark:border-neutral-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    expenseRatio > 100
                      ? 'bg-rose-500'
                      : expenseRatio > 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(Math.max(expenseRatio, 0), 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
              Balanço líquido do período
            </p>
          )}
        </div>
      </motion.div>

      {/* 2. Grid de Receitas e Despesas (2 Colunas Nativas) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card Receitas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => haptics.light()}
          className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-3.5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/40">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display">
              Receitas
            </span>
          </div>

          <div className="text-lg font-black font-display tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
            {formatCurrency(income)}
          </div>

          <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-700/80 dark:text-emerald-400/80">
            <ArrowUpRight className="w-3 h-3" />
            <span>Total recebido</span>
          </div>
        </motion.div>

        {/* Card Despesas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => haptics.light()}
          className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-3.5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/50 dark:border-rose-800/40">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display">
              Despesas
            </span>
          </div>

          <div className="text-lg font-black font-display tracking-tight text-rose-600 dark:text-rose-400 truncate">
            {formatCurrency(expense)}
          </div>

          <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-rose-700/80 dark:text-rose-400/80">
            <ArrowDownRight className="w-3 h-3" />
            <span>Total gasto</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Card Lançamentos: Barra de Atividade Estilo Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => haptics.light()}
        className="bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-100/60 dark:border-primary-900/40">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white font-display">
              Lançamentos no Mês
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Registros no período selecionado
            </p>
          </div>
        </div>

        {/* Quantidade em Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-black text-sm font-mono">
          <span>{count}</span>
          <span className="text-[10px] font-sans font-medium text-neutral-500 dark:text-neutral-400">
            {count === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default MobileTransactionsSummary
