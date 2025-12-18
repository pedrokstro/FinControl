import { AlertTriangle } from 'lucide-react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/common/Modal'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isLoading?: boolean
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  description = 'Esta ação não pode ser desfeita.',
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel={title}
      closeOnOverlay={!isLoading}
    >
      <ModalHeader
        title={title}
        icon={<AlertTriangle className="w-5 h-5" />}
        onClose={!isLoading ? onClose : undefined}
      />

      <ModalBody>
        <p className="text-gray-600 dark:text-neutral-400">{description}</p>

        {itemName && (
          <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Você está prestes a excluir:</p>
            <p className="font-semibold text-gray-900 dark:text-white">{itemName}</p>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Atenção:</strong> Esta ação é permanente e não pode ser desfeita.
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-danger-600 hover:bg-danger-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Excluindo...
            </>
          ) : (
            'Excluir'
          )}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDeleteModal
