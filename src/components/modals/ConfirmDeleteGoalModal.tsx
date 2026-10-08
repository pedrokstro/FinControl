import { AlertTriangle } from 'lucide-react'
import Modal from '@/components/common/Modal'

interface ConfirmDeleteGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  goalAmount: number
  isLoading?: boolean
}

const ConfirmDeleteGoalModal = ({
  isOpen,
  onClose,
  onConfirm,
  goalAmount,
  isLoading = false,
}: ConfirmDeleteGoalModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir Meta de Economia"
      size="sm"
      footer={
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-danger-600 hover:bg-danger-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir Meta'
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Tem certeza de que deseja excluir sua meta de economia deste mês?
        </p>

        {goalAmount > 0 && (
          <div className="p-3.5 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl">
            <p className="text-xs text-gray-600 dark:text-neutral-400 mb-1">
              Valor da meta:
            </p>
            <p className="font-bold text-gray-900 dark:text-white text-base">
              {formatCurrency(goalAmount)}
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>Atenção:</strong> Seu histórico e progresso vinculado serão apagados.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDeleteGoalModal
