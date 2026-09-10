import React, { useState } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { motion } from 'framer-motion'

export interface MonthHistoryItem {
  month: string
  receitas: number
  despesas: number
  saldo?: number
}

interface MobileMonthlyHistoryCardProps {
  data: MonthHistoryItem[]
  formatCurrency: (val: number) => string
}

export const MobileMonthlyHistoryCard: React.FC<MobileMonthlyHistoryCardProps> = ({
  data,
  formatCurrency,
}) => {
  const [activeView, setActiveView] = useState<'balance' | 'flow'>('balance')
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  // Processamento dos dados
  const processedData = data.map((d) => ({
    ...d,
    saldo: d.saldo !== undefined ? d.saldo : d.receitas - d.despesas,
  }))

  const maxVal = Math.max(
    ...processedData.map((d) =>
      activeView === 'balance'
        ? Math.abs(d.saldo)
        : Math.max(d.receitas, d.despesas)
    ),
    1
  )

  const activeMonth =
    selectedMonthIndex !== null && processedData[selectedMonthIndex]
      ? processedData[selectedMonthIndex]
      : processedData[processedData.length - 1]

  const totalReceitas = processedData.reduce((acc, d) => acc + d.receitas, 0)
  const totalDespesas = processedData.reduce((acc, d) => acc + d.despesas, 0)
  const avgSaldo = (totalReceitas - totalDespesas) / (processedData.length || 1)

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Histórico Mensal
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Últimos {processedData.length} meses
            </p>
          </div>
        </div>

        {/* Alternador de Visão: Saldo vs Entradas/Saídas */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              haptics.light()
              setActiveView('balance')
            }}
            className={`px-2 py-1 rounded-lg transition-all ${
              activeView === 'balance'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Saldo
          </button>
          <button
            type="button"
            onClick={() => {
              haptics.light()
              setActiveView('flow')
            }}
            className={`px-2 py-1 rounded-lg transition-all ${
              activeView === 'flow'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Fluxo
          </button>
        </div>
      </div>

      {/* Destaque do Mês Selecionado / Recente */}
      {activeMonth && (
        <div className="flex items-center justify-between p-2.5 mb-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
              {activeMonth.month}
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-sm font-extrabold font-display ${
                  activeMonth.saldo >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {activeMonth.saldo >= 0 ? '+' : ''}
                {formatCurrency(activeMonth.saldo)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="text-right">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                +{formatCurrency(activeMonth.receitas)}
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-bold block">
                -{formatCurrency(activeMonth.despesas)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Barras Mobile Touch-Friendly */}
      <div className="h-32 flex items-end justify-between gap-2 pt-4 pb-1">
        {processedData.map((item, index) => {
          const isSelected =
            selectedMonthIndex === index ||
            (selectedMonthIndex === null && index === processedData.length - 1)

          if (activeView === 'balance') {
            const heightPct = Math.max((Math.abs(item.saldo) / maxVal) * 100, 8)
            const isPositive = item.saldo >= 0

            return (
              <div
                key={index}
                onClick={() => {
                  haptics.light()
                  setSelectedMonthIndex(index)
                }}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                    isPositive
                      ? isSelected
                        ? 'bg-emerald-500 shadow-md shadow-emerald-500/30'
                        : 'bg-emerald-500/40 hover:bg-emerald-500/60'
                      : isSelected
                      ? 'bg-rose-500 shadow-md shadow-rose-500/30'
                      : 'bg-rose-500/40 hover:bg-rose-500/60'
                  }`}
                />
                <span
                  className={`text-[10px] mt-1.5 font-medium truncate ${
                    isSelected
                      ? 'text-primary-600 dark:text-primary-400 font-bold'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {item.month.slice(0, 3)}
                </span>
              </div>
            )
          }

          // Visão de Fluxo (Barras Duplas Receita vs Despesa)
          const recHeight = Math.max((item.receitas / maxVal) * 100, 6)
          const despHeight = Math.max((item.despesas / maxVal) * 100, 6)

          return (
            <div
              key={index}
              onClick={() => {
                haptics.light()
                setSelectedMonthIndex(index)
              }}
              className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer"
            >
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${recHeight}%` }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className={`w-2.5 rounded-t-sm transition-all ${
                    isSelected
                      ? 'bg-emerald-500 shadow-sm'
                      : 'bg-emerald-500/40 hover:bg-emerald-500/60'
                  }`}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${despHeight}%` }}
                  transition={{ duration: 0.4, delay: index * 0.04 + 0.02 }}
                  className={`w-2.5 rounded-t-sm transition-all ${
                    isSelected
                      ? 'bg-rose-500 shadow-sm'
                      : 'bg-rose-500/40 hover:bg-rose-500/60'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1.5 font-medium truncate ${
                  isSelected
                    ? 'text-primary-600 dark:text-primary-400 font-bold'
                    : 'text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {item.month.slice(0, 3)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Resumo Estatístico do Rodapé */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px]">
        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
          <TrendingUp className="w-3.5 h-3.5 text-primary-500" />
          <span>Média Saldo:</span>
          <strong className={`font-mono ${avgSaldo >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(avgSaldo)}
          </strong>
        </div>
        <div className="flex items-center justify-end gap-1 text-neutral-400 text-[10px]">
          <span>Toque nas barras para filtrar</span>
        </div>
      </div>
    </div>
  )
}

export default MobileMonthlyHistoryCard
