import { X, Sparkles, TrendingUp, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { MonthlyUsage } from '@/services/subscription.service'

interface TransactionLimitModalProps {
  isOpen: boolean
  onClose: () => void
  usage: MonthlyUsage | null
}

const TransactionLimitModal = ({ isOpen, onClose, usage }: TransactionLimitModalProps) => {
  const navigate = useNavigate()

  if (!isOpen || !usage) return null

  const handleUpgrade = () => {
    onClose()
    navigate('/plans')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-2xl z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com gradiente */}
        <div className="relative bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Limite Atingido</h3>
              <p className="text-white/90 text-sm">Plano Gratuito</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 dark:text-neutral-300 mb-4">
              Você atingiu o limite de <strong>{usage.limit} transações mensais</strong> do plano
              gratuito.
            </p>

            {/* Progress Bar */}
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-neutral-400">Uso mensal</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {usage.currentCount} / {usage.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-red-500 dark:bg-red-600"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Faça upgrade para o <strong className="text-primary-600 dark:text-primary-400">Plano Premium</strong> e tenha:
            </p>
          </div>

          {/* Premium Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-gray-700 dark:text-neutral-300 text-sm">
                <strong>Transações ilimitadas</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-gray-700 dark:text-neutral-300 text-sm">
                Ícones exclusivos e recursos avançados
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-gray-700 dark:text-neutral-300 text-sm">
                Exportação de relatórios e dados
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgrade}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Fazer Upgrade Agora
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 font-medium rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransactionLimitModal
