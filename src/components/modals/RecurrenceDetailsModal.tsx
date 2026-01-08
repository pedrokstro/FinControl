import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  X,
  Repeat,
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
  Hash,
  TrendingUp,
  TrendingDown,
  Infinity,
  CircleDollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction } from '@/types'

interface RecurrenceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

const RecurrenceDetailsModal = ({ isOpen, onClose, transaction }: RecurrenceDetailsModalProps) => {
  if (!transaction) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definido'
    try {
      // Se a data vier no formato ISO com timezone (ex: 2026-08-01T00:00:00.000Z)
      // Extraímos apenas a parte da data para evitar problemas de timezone
      let dateToFormat = dateString
      if (dateString.includes('T')) {
        dateToFormat = dateString.split('T')[0]
      }

      // Criar a data usando os componentes para evitar timezone issues
      const [year, month, day] = dateToFormat.split('-').map(Number)
      const date = new Date(year, month - 1, day)

      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return 'Data inválida'
    }
  }

  const getRecurrenceTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      daily: 'Diária',
      weekly: 'Semanal',
      monthly: 'Mensal',
      yearly: 'Anual',
    }
    return types[type || ''] || 'Não definido'
  }

  const getRecurrenceTypeIcon = (type?: string) => {
    switch (type) {
      case 'daily':
        return '📅'
      case 'weekly':
        return '📆'
      case 'monthly':
        return '🗓️'
      case 'yearly':
        return '🎯'
      default:
        return '🔄'
    }
  }

  const isInfinite = !transaction.recurrenceEndDate && !transaction.totalInstallments

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
              <div className={`px-6 py-4 ${transaction.type === 'income'
                ? 'bg-gradient-to-r from-success-500 to-success-600'
                : 'bg-gradient-to-r from-danger-500 to-danger-600'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Repeat className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Detalhes da Recorrência
                      </h2>
                      <p className="text-sm text-white/80">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Tipo e Valor */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    {transaction.type === 'income' ? (
                      <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">Tipo</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-neutral-400">Valor por parcela</p>
                    <p className={`text-lg font-bold ${transaction.type === 'income'
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-danger-600 dark:text-danger-400'
                      }`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>

                {/* Frequência */}
                <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-950/30 rounded-xl border border-primary-200 dark:border-primary-800">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-2xl">
                    {getRecurrenceTypeIcon(transaction.recurrenceType)}
                  </div>
                  <div>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">Frequência</p>
                    <p className="text-lg font-bold text-primary-700 dark:text-primary-300">
                      {getRecurrenceTypeLabel(transaction.recurrenceType)}
                    </p>
                  </div>
                  {isInfinite && (
                    <div className="ml-auto flex items-center gap-1 px-3 py-1 bg-primary-200 dark:bg-primary-800/50 rounded-full">
                      <Infinity className="w-4 h-4 text-primary-700 dark:text-primary-300" />
                      <span className="text-xs font-medium text-primary-700 dark:text-primary-300">Infinita</span>
                    </div>
                  )}
                </div>

                {/* Datas */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Data de Início */}
                  <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarCheck className="w-4 h-4 text-success-500" />
                      <span className="text-xs text-gray-500 dark:text-neutral-400">Data de Início</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(transaction.date)}
                    </p>
                  </div>

                  {/* Data de Fim */}
                  <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarX className="w-4 h-4 text-danger-500" />
                      <span className="text-xs text-gray-500 dark:text-neutral-400">Data de Fim</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {isInfinite ? (
                        <span className="text-primary-600 dark:text-primary-400">Sem limite</span>
                      ) : (
                        formatDate(transaction.recurrenceEndDate)
                      )}
                    </p>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="space-y-3">
                  {/* Próxima ocorrência */}
                  {transaction.nextOccurrence && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Próxima ocorrência</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDate(transaction.nextOccurrence)}
                      </span>
                    </div>
                  )}

                  {/* Número de parcelas */}
                  {transaction.totalInstallments && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Total de parcelas</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {transaction.currentInstallment || 1}/{transaction.totalInstallments}x
                      </span>
                    </div>
                  )}

                  {/* Valor total estimado */}
                  {transaction.totalInstallments && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Valor total estimado</span>
                      </div>
                      <span className={`text-sm font-bold ${transaction.type === 'income'
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-danger-600 dark:text-danger-400'
                        }`}>
                        {formatCurrency(transaction.amount * transaction.totalInstallments)}
                      </span>
                    </div>
                  )}

                  {/* Data de criação */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-neutral-400">Criado em</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
                <button
                  onClick={onClose}
                  className="w-full btn-secondary"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default RecurrenceDetailsModal
