import { motion, AnimatePresence } from 'framer-motion'
import { X, Receipt, Repeat } from 'lucide-react'

interface TransactionTypeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: 'normal' | 'recurring') => void
}

const TransactionTypeSelectionModal = ({
  isOpen,
  onClose,
  onSelectType,
}: TransactionTypeSelectionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Nova Transação
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                  Escolha o tipo de transação que deseja criar
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                {/* Transação Normal */}
                <button
                  onClick={() => {
                    onSelectType('normal')
                    onClose()
                  }}
                  className="w-full p-5 rounded-xl border-2 border-gray-200 dark:border-neutral-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-neutral-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 flex items-center justify-center transition-colors">
                      <Receipt className="w-6 h-6 text-gray-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Transação Normal
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Registre uma receita ou despesa única
                      </p>
                    </div>
                  </div>
                </button>

                {/* Transação Recorrente */}
                <button
                  onClick={() => {
                    onSelectType('recurring')
                    onClose()
                  }}
                  className="w-full p-5 rounded-xl border-2 border-gray-200 dark:border-neutral-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-neutral-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 flex items-center justify-center transition-colors">
                      <Repeat className="w-6 h-6 text-gray-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Transação Recorrente
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Configure pagamentos ou recebimentos que se repetem
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
                <button onClick={onClose} className="w-full btn-secondary">
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TransactionTypeSelectionModal
