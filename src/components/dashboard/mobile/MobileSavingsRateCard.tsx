import React from 'react'
import { PiggyBank, CheckCircle2, AlertTriangle } from 'lucide-react'

export interface SavingsRateData {
  income: number
  expense: number
  savings: number
  savingsRate: number
  goal: number
}

interface MobileSavingsRateCardProps {
  data: SavingsRateData
  formatCurrency: (val: number) => string
}

export const MobileSavingsRateCard: React.FC<MobileSavingsRateCardProps> = ({
  data,
  formatCurrency,
}) => {
  if (!data) return null

  const { savingsRate, goal, income, expense, savings } = data
  const normalizedRate = Math.max(0, Math.min(savingsRate, 100))
  const isGood = savingsRate >= goal
  const isWarning = savingsRate >= goal * 0.7 && savingsRate < goal

  // SVG Gauge Circular Ring
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedRate / 100) * circumference

  let strokeColor = '#10b981' // emerald
  let statusText = 'Meta superada'
  let statusBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'

  if (!isGood) {
    if (isWarning) {
      strokeColor = '#f59e0b' // amber
      statusText = 'Próximo da meta'
      statusBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    } else {
      strokeColor = '#f43f5e' // rose
      statusText = 'Abaixo da meta'
      statusBg = 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Taxa de Poupança
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Economia real sobre a renda
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBg}`}>
          {statusText}
        </span>
      </div>

      {/* Centro: Anel de Progresso Circular + Informação da Meta */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 mb-3">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Círculo Fundo */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              fill="transparent"
              className="text-neutral-200 dark:text-neutral-700"
            />
            {/* Círculo Progresso */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={strokeColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold font-display text-neutral-900 dark:text-white">
              {savingsRate.toFixed(1)}%
            </span>
            <span className="text-[9px] font-semibold text-neutral-400">poupado</span>
          </div>
        </div>

        {/* Informações da Meta ao lado */}
        <div className="flex-1 ml-4 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Meta Fixada:</span>
            <strong className="text-neutral-900 dark:text-white font-mono">{goal}%</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Economia Gerada:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(savings)}
            </strong>
          </div>
          <div className="pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60 text-[10px] text-neutral-400">
            {isGood ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Parabéns pelo controle!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                <AlertTriangle className="w-3 h-3" /> Reavalie despesas supérfluas
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid de 3 Cards de Resumo */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold block">
            Entradas
          </span>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs truncate block">
            {formatCurrency(income)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold block">
            Saídas
          </span>
          <span className="font-bold font-mono text-rose-600 dark:text-rose-400 text-xs truncate block">
            {formatCurrency(expense)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold block">
            Líquido
          </span>
          <span className="font-bold font-mono text-sky-600 dark:text-sky-400 text-xs truncate block">
            {formatCurrency(savings)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MobileSavingsRateCard
