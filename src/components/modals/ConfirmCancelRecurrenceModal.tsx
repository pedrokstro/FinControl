import { AlertCircle, Repeat } from 'lucide-react'
import Modal from '@/components/common/Modal'

interface ConfirmCancelRecurrenceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transactionDescription?: string
  isLoading?: boolean
}

const ConfirmCancelRecurrenceModal = ({
  isOpen,
  onClose,
  onConfirm,
  transactionDescription,
  isLoading = false,
}: ConfirmCancelRecurrenceModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancelar Recorrência"
      size="sm"
      footer={
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelando...
              </>
            ) : (
              'Confirmar Cancelamento'
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Tem certeza de que deseja interromper a geração automática dos próximos lançamentos desta assinatura?
        </p>

        {transactionDescription && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2.5">
            <Repeat className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
              {transactionDescription}
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl">
          <AlertCircle className="w-4 h-4 text-gray-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 dark:text-neutral-400">
            Os registros passados permanecerão intactos no seu histórico financeiro.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmCancelRecurrenceModal
