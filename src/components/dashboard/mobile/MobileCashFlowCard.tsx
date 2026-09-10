import React, { useState } from 'react'
import { TrendingUp, Zap } from 'lucide-react'
import { haptics } from '@/utils/haptics'

export interface DailyCashFlowItem {
  day: number
  dailyBalance: number
  cumulativeBalance: number
}

interface MobileCashFlowCardProps {
  data: DailyCashFlowItem[]
  formatCurrency: (val: number) => string
}

export const MobileCashFlowCard: React.FC<MobileCashFlowCardProps> = ({
  data,
  formatCurrency,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const values = data.map((d) => d.cumulativeBalance)
  const minVal = Math.min(...values, 0)
  const maxVal = Math.max(...values, 1)
  const range = maxVal - minVal || 1

  const svgW = 320
  const svgH = 80
  const paddingY = 8

  const coords = data.map((d, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * (svgW - 16) + 8
    const y = svgH - paddingY - ((d.cumulativeBalance - minVal) / range) * (svgH - paddingY * 2)
    return { x, y, item: d }
  })

  const pathD = coords.length > 1
    ? coords.reduce((acc, coord, idx, arr) => {
        if (idx === 0) return `M ${coord.x} ${coord.y}`
        const prev = arr[idx - 1]
        const cX = (prev.x + coord.x) / 2
        return `${acc} C ${cX} ${prev.y}, ${cX} ${coord.y}, ${coord.x} ${coord.y}`
      }, '')
    : ''

  const areaD = pathD
    ? `${pathD} L ${coords[coords.length - 1].x} ${svgH} L ${coords[0].x} ${svgH} Z`
    : ''

  const latestItem = data[data.length - 1]
  const activeItem =
    activeDayIndex !== null && data[activeDayIndex]
      ? data[activeDayIndex]
      : latestItem

  const highestDay = data.reduce(
    (max, d) => (d.cumulativeBalance > max.cumulativeBalance ? d : max),
    data[0]
  )

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Fluxo de Caixa Diário
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Evolução diária acumulada
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
          Dia {activeItem.day} de {data.length}
        </span>
      </div>

      {/* Caixa do Saldo Selecionado / Atual */}
      <div className="flex items-baseline justify-between p-2.5 rounded-xl bg-sky-50/50 dark:bg-neutral-800/50 border border-sky-100/60 dark:border-neutral-700/40 mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
            {activeDayIndex !== null ? `Saldo no Dia ${activeItem.day}` : 'Saldo Acumulado no Mês'}
          </span>
          <div className="text-lg font-extrabold font-display text-sky-600 dark:text-sky-400">
            {formatCurrency(activeItem.cumulativeBalance)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
            Movimento do Dia
          </span>
          <div
            className={`text-xs font-bold font-mono ${
              activeItem.dailyBalance >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {activeItem.dailyBalance >= 0 ? '+' : ''}
            {formatCurrency(activeItem.dailyBalance)}
          </div>
        </div>
      </div>

      {/* Gráfico SVG Curvo com Amostragem Touch */}
      <div className="relative w-full h-24 my-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="mobileCashFlowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Área Gradiente */}
          <path d={areaD} fill="url(#mobileCashFlowGrad)" />

          {/* Linha Curva */}
          <path
            d={pathD}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pontos de Toque */}
          {coords.map((c, i) => {
            const isActive = activeDayIndex === i
            return (
              <g
                key={i}
                onClick={() => {
                  haptics.light()
                  setActiveDayIndex(i)
                }}
                className="cursor-pointer"
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isActive ? 5 : 2}
                  fill={isActive ? '#0284c7' : '#0ea5e9'}
                  stroke="#ffffff"
                  strokeWidth={isActive ? 2 : 1}
                  className="transition-all"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Rodapé: Ponto Máximo do Mês */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Pico: Dia {highestDay.day}</span>
        </div>
        <strong className="text-neutral-800 dark:text-neutral-200 font-mono">
          {formatCurrency(highestDay.cumulativeBalance)}
        </strong>
      </div>
    </div>
  )
}

export default MobileCashFlowCard
