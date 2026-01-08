import { useState } from 'react'
import { Plus, X, Receipt, FolderOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleAction = (action: 'transaction' | 'category') => {
    setIsOpen(false)
    if (action === 'transaction') {
      navigate('/app/dashboard?quickAdd=expense')
    } else {
      navigate('/app/categories?add=true')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className="fixed bottom-24 right-6 z-50 lg:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
            >
              {/* Nova Transação */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.05 }}
                onClick={() => handleAction('transaction')}
                className="flex items-center gap-3 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-neutral-700 group"
              >
                <Receipt className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium whitespace-nowrap">Nova Transação</span>
              </motion.button>

              {/* Nova Categoria */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleAction('category')}
                className="flex items-center gap-3 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-neutral-700 group"
              >
                <FolderOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium whitespace-nowrap">Nova Categoria</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
            isOpen
              ? 'bg-gray-900 dark:bg-white rotate-45'
              : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white dark:text-gray-900" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>
    </>
  )
}

export default FloatingActionButton
