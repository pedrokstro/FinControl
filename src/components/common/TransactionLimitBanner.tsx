import { useEffect, useState } from 'react'
import { AlertCircle, Sparkles, TrendingUp } from 'lucide-react'
import { subscriptionService, type MonthlyUsage } from '@/services/subscription.service'
import { useNavigate } from 'react-router-dom'

const TransactionLimitBanner = () => {
  const [usage, setUsage] = useState<MonthlyUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadUsage()
  }, [])

  const loadUsage = async () => {
    try {
      const data = await subscriptionService.getMonthlyUsage()
      setUsage(data)
    } catch (error) {
      console.error('Erro ao carregar uso mensal:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !usage || usage.isPremium) {
    return null
  }

  const isNearLimit = usage.percentage >= 70
  const isAtLimit = usage.currentCount >= usage.limit

  if (!isNearLimit && !isAtLimit) {
    return null
  }

  return (
    <div
      className={`rounded-lg p-4 mb-6 border-2 ${
        isAtLimit
          ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800'
          : 'bg-amber-50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
            isAtLimit
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-amber-100 dark:bg-amber-900/30'
          }`}
        >
          {isAtLimit ? (
            <AlertCircle
              className={`w-5 h-5 ${
                isAtLimit ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            />
          ) : (
            <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-semibold mb-1 ${
              isAtLimit
                ? 'text-red-900 dark:text-red-200'
                : 'text-amber-900 dark:text-amber-200'
            }`}
          >
            {isAtLimit
              ? '🚫 Limite de transações atingido'
              : '⚠️ Você está próximo do limite'}
          </h4>
          <p
            className={`text-sm mb-3 ${
              isAtLimit
                ? 'text-red-700 dark:text-red-300'
                : 'text-amber-700 dark:text-amber-300'
            }`}
          >
            {isAtLimit
              ? `Você atingiu o limite de ${usage.limit} transações mensais do plano gratuito.`
              : `Você usou ${usage.currentCount} de ${usage.limit} transações este mês (${Math.round(usage.percentage)}%).`}
          </p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span
                className={
                  isAtLimit
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : 'text-amber-600 dark:text-amber-400 font-medium'
                }
              >
                {usage.currentCount} / {usage.limit} transações
              </span>
              <span
                className={
                  isAtLimit
                    ? 'text-red-600 dark:text-red-400 font-bold'
                    : 'text-amber-600 dark:text-amber-400 font-bold'
                }
              >
                {Math.round(usage.percentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isAtLimit
                    ? 'bg-red-500 dark:bg-red-600'
                    : 'bg-amber-500 dark:bg-amber-600'
                }`}
                style={{ width: `${Math.min(usage.percentage, 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/plans')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade para Premium
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionLimitBanner
