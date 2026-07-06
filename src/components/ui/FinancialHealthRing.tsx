import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, AlertTriangle, Flame } from 'lucide-react'

type FinancialHealthRingProps = {
  income: number
  expense: number
  budgets?: Array<{ categoryId: string; amount: number }>
  transactions?: Array<{ categoryId: string; amount: number; type: 'income' | 'expense'; date: string }>
  selectedDate: { month: number; year: number }
}

export const FinancialHealthRing = ({
  income,
  expense,
  budgets = [],
  transactions = [],
  selectedDate,
}: FinancialHealthRingProps) => {
  const healthScore = useMemo(() => {
    if (income === 0 && expense === 0) return 100 // Neutro, sem transações
    if (income === 0 && expense > 0) return 0 // Gastou sem ganhar nada

    // 1. Relação Despesa/Receita
    const expenseRatio = (expense / income) * 100
    let score = 100 - expenseRatio

    // Ajustar limites de score
    if (score < 0) score = 0
    if (score > 100) score = 100

    // 2. Penalidade por Orçamentos Estourados
    if (budgets.length > 0 && transactions.length > 0) {
      let overBudgetsCount = 0

      budgets.forEach((budget) => {
        const spent = transactions
          .filter((t) => {
            if (t.categoryId !== budget.categoryId || t.type !== 'expense') return false
            const date = new Date(t.date)
            // Verificar se a transação pertence ao mês selecionado (ajustado para timezone local)
            const txMonth = date.getUTCMonth() + 1
            const txYear = date.getUTCFullYear()
            return txMonth === selectedDate.month && txYear === selectedDate.year
          })
          .reduce((sum, t) => sum + t.amount, 0)

        if (spent > budget.amount) {
          overBudgetsCount++
        }
      })

      // Reduzir 8 pontos para cada orçamento estourado, até um máximo de 32 pontos de penalidade
      score -= Math.min(overBudgetsCount * 8, 32)
      if (score < 0) score = 0
    }

    return Math.round(score)
  }, [income, expense, budgets, transactions, selectedDate])

  const status = useMemo(() => {
    if (income === 0 && expense === 0) return { label: 'Sem atividade', color: 'text-gray-400 dark:text-neutral-500', stroke: '#9ca3af', bg: 'bg-gray-50 dark:bg-neutral-900', icon: Activity, desc: 'Adicione transações para ver sua pontuação.' }
    if (healthScore >= 80) return { label: 'Excelente', color: 'text-success-600 dark:text-success-400', stroke: 'url(#health-grad-success)', bg: 'bg-success-50/50 dark:bg-success-950/20 border-success-100 dark:border-success-900/10', icon: ShieldCheck, desc: 'Parabéns! Suas finanças estão muito equilibradas.' }
    if (healthScore >= 60) return { label: 'Saudável', color: 'text-primary-600 dark:text-primary-400', stroke: 'url(#health-grad-primary)', bg: 'bg-primary-50/50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/10', icon: ShieldCheck, desc: 'Você está no caminho certo. Continue monitorando!' }
    if (healthScore >= 40) return { label: 'Atenção', color: 'text-warning-600 dark:text-warning-400', stroke: 'url(#health-grad-warning)', bg: 'bg-warning-50/50 dark:bg-warning-950/20 border-warning-100 dark:border-warning-900/10', icon: AlertTriangle, desc: 'Gastos elevados neste mês. Reavalie despesas supérfluas.' }
    return { label: 'Crítico', color: 'text-danger-600 dark:text-danger-400', stroke: 'url(#health-grad-danger)', bg: 'bg-danger-50/50 dark:bg-danger-950/20 border-danger-100 dark:border-danger-900/10', icon: Flame, desc: 'Alerta! Suas despesas superaram o limite saudável.' }
  }, [healthScore, income, expense])

  // Parâmetros do SVG circular
  const radius = 50
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (healthScore / 100) * circumference

  const StatusIcon = status.icon

  return (
    <div className={`card overflow-hidden transition-all duration-300 border ${status.bg} flex flex-col items-center p-6 text-center h-full relative`}>
      <div className="flex items-center gap-2 mb-4 self-start">
        <Activity className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-neutral-300 font-display">
          Saúde Financeira
        </h3>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="health-grad-success" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="health-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="health-grad-warning" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="health-grad-danger" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Anel de fundo */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-gray-200 dark:text-neutral-800"
            strokeWidth={strokeWidth}
          />

          {/* Anel de progresso animado */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={status.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Informações internas do anel */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight">
            {healthScore}
          </span>
          <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mt-0.5">
            Pontos
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center w-full">
        <div className="flex items-center gap-1.5 mb-1">
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-base font-bold font-display ${status.color}`}>
            {status.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-[200px] leading-relaxed">
          {status.desc}
        </p>
      </div>
    </div>
  )
}
