import React, { useState } from 'react'
import { CalendarDays, AlertCircle } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { motion } from 'framer-motion'

export interface WeekdayExpenseItem {
  weekday: string
  total: number
}

interface MobileWeekdayExpensesCardProps {
  data: WeekdayExpenseItem[]
  formatCurrency: (val: number) => string
}

export const MobileWeekdayExpensesCard: React.FC<MobileWeekdayExpensesCardProps> = ({
  data,
  formatCurrency,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const maxVal = Math.max(...data.map((d) => d.total), 1)
  const totalWeek = data.reduce((acc, curr) => acc + curr.total, 0)

  const peakDay = data.reduce(
    (max, d) => (d.total > max.total ? d : max),
    data[0] || { weekday: '-', total: 0 }
  )

  const activeDay =
    selectedDayIndex !== null && data[selectedDayIndex]
      ? data[selectedDayIndex]
      : peakDay

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Gastos por Dia da Semana
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Padrão semanal de consumo
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
          Pico: {peakDay.weekday.slice(0, 3)}
        </span>
      </div>

      {/* Caixa do Dia Selecionado */}
      <div className="flex items-baseline justify-between p-2.5 rounded-xl bg-purple-50/40 dark:bg-neutral-800/40 border border-purple-100/50 dark:border-neutral-700/40 mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
            {activeDay.weekday}
          </span>
          <div className="text-base font-extrabold font-display text-purple-600 dark:text-purple-400">
            {formatCurrency(activeDay.total)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
            Participação
          </span>
          <div className="text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300">
            {totalWeek > 0 ? Math.round((activeDay.total / totalWeek) * 100) : 0}% da semana
          </div>
        </div>
      </div>

      {/* 7 Colunas Verticais Interativas */}
      <div className="h-28 flex items-end justify-between gap-1.5 pt-2 pb-1">
        {data.map((item, index) => {
          const heightPct = Math.max((item.total / maxVal) * 100, 8)
          const isPeak = item.total === peakDay.total && peakDay.total > 0
          const isSelected =
            selectedDayIndex === index || (selectedDayIndex === null && isPeak)

          return (
            <div
              key={index}
              onClick={() => {
                haptics.light()
                setSelectedDayIndex(index)
              }}
              className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className={`w-full max-w-[24px] rounded-t-lg transition-all ${
                  isPeak
                    ? isSelected
                      ? 'bg-rose-500 shadow-md shadow-rose-500/30'
                      : 'bg-rose-500/80 hover:bg-rose-500'
                    : isSelected
                    ? 'bg-purple-500 shadow-md shadow-purple-500/30'
                    : 'bg-purple-500/30 hover:bg-purple-500/50'
                }`}
              />
              <span
                className={`text-[10px] mt-1.5 font-medium truncate ${
                  isSelected
                    ? 'text-purple-600 dark:text-purple-400 font-bold'
                    : 'text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {item.weekday.slice(0, 3)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Rodapé Informativo */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Maior concentração: <strong>{peakDay.weekday}</strong></span>
        </div>
        <span className="text-[10px] text-neutral-400">Toque para ver</span>
      </div>
    </div>
  )
}

export default MobileWeekdayExpensesCard
