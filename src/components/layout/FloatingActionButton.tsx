import { useState } from 'react'
import { Plus, X, Receipt, FolderOpen, Calculator, Percent, TrendingUp, ChevronLeft, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showCalculators, setShowCalculators] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleAction = (action: 'transaction' | 'category' | 'calc-percent' | 'calc-interest') => {
    setIsOpen(false)
    setShowCalculators(false)
    if (action === 'transaction') {
      navigate('/app/dashboard?quickAdd=expense')
    } else if (action === 'calc-percent') {
      navigate('/app/calculadora-porcentagem')
    } else if (action === 'calc-interest') {
      navigate('/app/calculadora-juros')
    } else {
      navigate('/app/categories?add=true')
    }
  }

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false)
      // Pequeno delay para resetar o estado interno após a animação de fechar
      setTimeout(() => setShowCalculators(false), 300)
    } else {
      setIsOpen(true)
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
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key={showCalculators ? 'calculators' : 'main'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
            >
              {!showCalculators ? (
                <>
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

                  {/* Calculadora (Abre sub-menu) */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => setShowCalculators(true)}
                    className="flex items-center gap-3 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-primary-100 dark:border-primary-800 group"
                  >
                    <Calculator className="w-5 h-5" />
                    <span className="text-sm font-semibold whitespace-nowrap">Calculadoras</span>
                  </motion.button>

                  <div className="h-px bg-gray-200 dark:bg-neutral-800 my-1"></div>

                  {/* Sair do App */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={logout}
                    className="flex items-center gap-3 bg-danger-50 dark:bg-danger-900/40 text-danger-600 dark:text-danger-400 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-danger-100 dark:border-danger-800/50 group"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-bold whitespace-nowrap">Sair do App</span>
                  </motion.button>
                </>
              ) : (
                <>
                  {/* Voltar */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setShowCalculators(false)}
                    className="flex items-center gap-3 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 px-4 py-2 rounded-full shadow-md transition-all border border-gray-200 dark:border-neutral-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Voltar</span>
                  </motion.button>

                  {/* Calculadora Porcentagem */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.05 }}
                    onClick={() => handleAction('calc-percent')}
                    className="flex items-center gap-3 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-neutral-700 group"
                  >
                    <Percent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium whitespace-nowrap">Porcentagem</span>
                  </motion.button>

                  {/* Juros Compostos */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => handleAction('calc-interest')}
                    className="flex items-center gap-3 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-neutral-700 group"
                  >
                    <TrendingUp className="w-5 h-5 text-amber-500 animate-arrow-up" />
                    <span className="text-sm font-medium whitespace-nowrap">Juros Compostos</span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-bold uppercase">Pro</span>
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleOpen}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${isOpen
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
