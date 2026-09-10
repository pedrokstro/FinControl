import React from 'react'
import { Target, Edit3, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { haptics } from '@/utils/haptics'

export interface MobileSavingsGoal {
  id?: string
  targetAmount: number
  currentAmount: number
  month?: number
  year?: number
}

interface MobileSavingsGoalCardProps {
  goal: MobileSavingsGoal | null
  formatCurrency: (val: number) => string
  onEditGoal: () => void
  onDeleteGoal?: () => void
  isLoading?: boolean
}

export const MobileSavingsGoalCard: React.FC<MobileSavingsGoalCardProps> = ({
  goal,
  formatCurrency,
  onEditGoal,
  onDeleteGoal,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-3" />
        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2" />
        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
      </div>
    )
  }

  const percentage = goal && goal.targetAmount > 0
    ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
    : 0

  const isAchieved = goal ? goal.currentAmount >= goal.targetAmount : false
  const remaining = goal ? Math.max(goal.targetAmount - goal.currentAmount, 0) : 0

  return (
    <div
      onClick={() => {
        haptics.light()
        onEditGoal()
      }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-primary-500/40 transition-colors"
    >
      {/* Topo do Card */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Meta de Economia
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Objetivo financeiro do mês
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onEditGoal}
            className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title={goal ? 'Editar meta' : 'Definir meta'}
          >
            {goal ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {goal && onDeleteGoal && (
            <button
              type="button"
              onClick={onDeleteGoal}
              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:text-rose-700 transition-colors"
              title="Excluir meta"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {goal ? (
        <>
          <div className="flex items-baseline justify-between mt-2 mb-1.5">
            <div>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold">
                Alcançado
              </span>
              <div className="text-base font-extrabold font-display text-neutral-900 dark:text-white">
                {formatCurrency(goal.currentAmount)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold">
                Objetivo
              </span>
              <div className="text-xs font-bold font-mono text-neutral-600 dark:text-neutral-300">
                {formatCurrency(goal.targetAmount)}
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden my-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAchieved
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-primary-500 to-emerald-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Rodapé do Progresso */}
          <div className="flex items-center justify-between text-[11px] mt-1 pt-1">
            <span className="font-bold text-primary-600 dark:text-primary-400">
              {percentage}% atingido
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              {isAchieved ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Meta conquistada!
                </span>
              ) : (
                `Falta ${formatCurrency(remaining)}`
              )}
            </span>
          </div>
        </>
      ) : (
        <div className="py-3 text-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Nenhuma meta definida para este mês
          </p>
          <button
            type="button"
            onClick={onEditGoal}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-xs hover:bg-primary-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Definir Meta</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default MobileSavingsGoalCard
