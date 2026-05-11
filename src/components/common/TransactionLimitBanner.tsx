import { useEffect, useState } from 'react'
import { AlertCircle, Sparkles, TrendingUp, X } from 'lucide-react'
import { subscriptionService, type MonthlyUsage } from '@/services/subscription.service'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { haptics } from '@/utils/haptics'

const TransactionLimitBanner = () => {
  const [usage, setUsage] = useState<MonthlyUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
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

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptics.light()
    setIsDismissed(true)
  }

  if (loading || !usage || usage.isPremium || isDismissed) {
    return null
  }

  const isNearLimit = usage.percentage >= 70
  const isAtLimit = usage.currentCount >= usage.limit

  if (!isNearLimit && !isAtLimit) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[60]"
      >
        <div
          className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-md p-4 transition-all ${isAtLimit
            ? 'bg-red-50/90 dark:bg-red-900/20 border-red-200 dark:border-red-800/50'
            : 'bg-amber-50/90 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50'
            }`}
        >
          {/* Background Decorative Element */}
          <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 blur-2xl ${isAtLimit ? 'bg-red-500' : 'bg-amber-500'}`} />

          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className={`w-3.5 h-3.5 ${isAtLimit ? 'text-red-500' : 'text-amber-500'}`} />
          </button>

          <div className="flex gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isAtLimit
                ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                }`}
            >
              {isAtLimit ? <AlertCircle className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 animate-pulse" />}
            </div>

            <div className="flex-1">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isAtLimit ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                {isAtLimit ? 'Limite Atingido' : 'Limite Próximo'}
              </h4>
              <p className={`text-sm leading-tight mb-2 ${isAtLimit ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {isAtLimit
                  ? 'Você atingiu o limite do plano gratuito.'
                  : `Você usou ${Math.round(usage.percentage)}% do limite gratuito.`}
              </p>

              {/* Mini Progress Bar */}
              <div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-1.5 mb-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(usage.percentage, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${isAtLimit ? 'bg-red-500' : 'bg-amber-500'}`}
                />
              </div>

              <button
                onClick={() => { haptics.medium(); navigate('/plans') }}
                className="w-full py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Upgrade Premium
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TransactionLimitBanner
