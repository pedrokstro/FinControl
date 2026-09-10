import React from 'react'
import { Calendar, TrendingUp, Award, Activity } from 'lucide-react'

interface YearlyMonthData {
  month: string
  receitas: number
  despesas: number
  saldo: number
}

interface AccumulatedData {
  month: string
  saldoAcumulado: number
}

interface MobileYearlyAccumulatedCardProps {
  yearlyData: YearlyMonthData[]
  accumulatedData: AccumulatedData[]
  formatCurrency: (val: number) => string
}

export const MobileYearlyAccumulatedCard: React.FC<MobileYearlyAccumulatedCardProps> = ({
  yearlyData,
  accumulatedData,
  formatCurrency,
}) => {
  if (!yearlyData || yearlyData.length === 0) return null

  const totalYearlyIncome = yearlyData.reduce((acc, curr) => acc + curr.receitas, 0)
  const totalYearlyExpense = yearlyData.reduce((acc, curr) => acc + curr.despesas, 0)
  const totalYearlyNet = totalYearlyIncome - totalYearlyExpense

  const latestAccumulated =
    accumulatedData.length > 0
      ? accumulatedData[accumulatedData.length - 1].saldoAcumulado
      : totalYearlyNet

  // Melhor mês e mês mais ativo
  const bestMonth = yearlyData.reduce(
    (max, m) => (m.saldo > max.saldo ? m : max),
    yearlyData[0] || { month: '-', saldo: 0 }
  )

  const activeMonthsCount = yearlyData.filter((m) => m.receitas > 0 || m.despesas > 0).length

  // Coordenadas SVG da Sparkline de Saldo Acumulado
  const values = accumulatedData.map((d) => d.saldoAcumulado)
  const minVal = values.length ? Math.min(...values) : 0
  const maxVal = values.length ? Math.max(...values) : 1
  const range = maxVal - minVal || 1
  const svgW = 280
  const svgH = 45

  const points = accumulatedData.map((d, i) => {
    const x = (i / Math.max(accumulatedData.length - 1, 1)) * (svgW - 10) + 5
    const y = svgH - 6 - ((d.saldoAcumulado - minVal) / range) * (svgH - 12)
    return `${x},${y}`
  })
  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : ''

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Resumo do Ano
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Visão consolidada anual
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
          {activeMonthsCount} meses ativos
        </span>
      </div>

      {/* Saldo Acumulado / Patrimônio */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-neutral-800/60 dark:to-neutral-800/30 border border-blue-100/60 dark:border-neutral-700/50 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            Saldo Acumulado no Ano
          </span>
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              latestAccumulated >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {latestAccumulated >= 0 ? '↑ Superávit' : '↓ Déficit'}
          </span>
        </div>
        <div className="text-xl font-extrabold font-display text-neutral-900 dark:text-white mt-1">
          {formatCurrency(latestAccumulated)}
        </div>

        {/* Mini Sparkline Curva Patrimonial */}
        {points.length > 1 && (
          <div className="w-full h-10 mt-2">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full overflow-visible">
              <path
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {accumulatedData.map((_, i) => {
                const [x, y] = points[i].split(',').map(Number)
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Grid de Métricas Rápidas */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Receitas Totais</span>
          </div>
          <span className="font-bold font-mono text-neutral-900 dark:text-white text-xs">
            {formatCurrency(totalYearlyIncome)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold mb-0.5 text-[11px]">
            <Activity className="w-3.5 h-3.5" />
            <span>Despesas Totais</span>
          </div>
          <span className="font-bold font-mono text-neutral-900 dark:text-white text-xs">
            {formatCurrency(totalYearlyExpense)}
          </span>
        </div>
      </div>

      {/* Destaque do Melhor Mês */}
      {bestMonth && bestMonth.saldo > 0 && (
        <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Melhor Mês:</span>
            <strong className="text-neutral-900 dark:text-white">{bestMonth.month}</strong>
          </div>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(bestMonth.saldo)}
          </span>
        </div>
      )}
    </div>
  )
}

export default MobileYearlyAccumulatedCard
