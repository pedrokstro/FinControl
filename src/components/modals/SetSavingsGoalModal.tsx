import { X, Target, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import savingsGoalService, { SavingsGoal } from '@/services/savingsGoal.service'

interface SetSavingsGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentGoal?: SavingsGoal | null
}

const SetSavingsGoalModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentGoal,
}: SetSavingsGoalModalProps) => {
  const [targetAmount, setTargetAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Preencher campos se houver meta existente
  useEffect(() => {
    if (currentGoal) {
      setTargetAmount(currentGoal.targetAmount.toString())
      setDescription(currentGoal.description || '')
    } else {
      setTargetAmount('')
      setDescription('')
    }
  }, [currentGoal, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(targetAmount)
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Digite um valor válido')
      return
    }

    setIsLoading(true)

    try {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()

      await savingsGoalService.upsertGoal({
        targetAmount: amount,
        month,
        year,
        description: description.trim() || undefined,
      })

      toast.success(currentGoal ? 'Meta atualizada com sucesso!' : 'Meta definida com sucesso!')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar meta:', error)
      toast.error(error.response?.data?.message || 'Erro ao salvar meta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentGoal ? 'Atualizar Meta' : 'Definir Meta de Economia'}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        Meta para {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Valor da Meta (R$) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    Quanto você deseja economizar este mês?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Viagem de férias, Fundo de emergência..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white resize-none"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    {description.length}/500 caracteres
                  </p>
                </div>

                {currentGoal && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>💡 Dica:</strong> Você já economizou{' '}
                      <strong>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(currentGoal.currentAmount)}
                      </strong>{' '}
                      este mês!
                    </p>
                  </div>
                )}

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    <strong>ℹ️ Como funciona:</strong> A meta é calculada automaticamente baseada no seu saldo mensal (receitas - despesas). Atualize suas transações para ver o progresso!
                  </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        {currentGoal ? 'Atualizar Meta' : 'Definir Meta'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SetSavingsGoalModal
