import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  X,
  Repeat,
  CalendarCheck,
  CalendarX,
  Clock,
  Hash,
  TrendingUp,
  TrendingDown,
  Infinity,
  CircleDollarSign,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction } from '@/types'
import CustomSelect from '../common/CustomSelect'
import { useFinancialStore } from '@/store/financialStore'
import { haptics } from '@/utils/haptics'
import { toast } from 'react-hot-toast'

interface RecurrenceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

const RecurrenceDetailsModal = ({ isOpen, onClose, transaction }: RecurrenceDetailsModalProps) => {
  const [localRecurrenceType, setLocalRecurrenceType] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { updateTransaction } = useFinancialStore()

  useEffect(() => {
    if (transaction) {
      setLocalRecurrenceType(transaction.recurrenceType || '')
    }
  }, [transaction])

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
      let dateToFormat = dateString
      if (dateString.includes('T')) {
        dateToFormat = dateString.split('T')[0]
      }
      const [year, month, day] = dateToFormat.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return 'Data inválida'
    }
  }

  const handleFrequencyChange = async (newType: string) => {
    if (newType === localRecurrenceType) return

    setLocalRecurrenceType(newType)
    setIsUpdating(true)

    try {
      await updateTransaction(transaction.parentTransactionId || transaction.id, {
        recurrenceType: newType as any
      })
      haptics.success()
      toast.success('Frequência atualizada!')
    } catch (error) {
      setLocalRecurrenceType(transaction.recurrenceType || '')
      haptics.error()
    } finally {
      setIsUpdating(false)
    }
  }

  const getRecurrenceTypeIcon = (type?: string) => {
    switch (type) {
      case 'daily': return '📅'
      case 'weekly': return '📆'
      case 'monthly': return '🗓️'
      case 'yearly': return '🎯'
      default: return '🔄'
    }
  }

  const isInfinite = !transaction.recurrenceEndDate && !transaction.totalInstallments

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
                <div className={`px-6 py-4 ${transaction.type === 'income' ? 'bg-gradient-to-r from-success-500 to-success-600' : 'bg-gradient-to-r from-danger-500 to-danger-600'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Repeat className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Detalhes da Recorrência</h2>
                        <p className="text-sm text-white/80">{transaction.description}</p>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
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
                      <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -top-2 left-4 px-2 bg-white dark:bg-neutral-950 text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-tighter z-10">
                      Ajustar Frequência
                    </div>
                    <div className={`p-1 rounded-2xl border-2 transition-all ${isUpdating ? 'border-primary-400 opacity-70 animate-pulse' : 'border-primary-100 dark:border-primary-900/30'}`}>
                      <CustomSelect
                        options={[
                          { value: 'daily', label: 'Diária', icon: '📅' },
                          { value: 'weekly', label: 'Semanal', icon: '📆' },
                          { value: 'monthly', label: 'Mensal', icon: '🗓️' },
                          { value: 'yearly', label: 'Anual', icon: '🎯' }
                        ]}
                        value={localRecurrenceType}
                        onChange={handleFrequencyChange}
                        dropdownTitle="Mudar Frequência"
                        placeholder="Escolher frequência"
                        className="w-full !border-0 !shadow-none !bg-transparent"
                        icon={<div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xl">
                          {isUpdating ? <Loader2 className="w-5 h-5 animate-spin text-primary-600" /> : getRecurrenceTypeIcon(localRecurrenceType)}
                        </div>}
                      />
                    </div>
                    {isInfinite && (
                      <div className="mt-2 flex items-center justify-center gap-1 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-full border border-primary-100 dark:border-primary-800">
                        <Infinity className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">Recorrência Infinita</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarCheck className="w-4 h-4 text-success-500" />
                        <span className="text-xs text-gray-500 dark:text-neutral-400">Início</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarX className="w-4 h-4 text-danger-500" />
                        <span className="text-xs text-gray-500 dark:text-neutral-400">Fim</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {isInfinite ? <span className="text-primary-600">Sem limite</span> : formatDate(transaction.recurrenceEndDate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {transaction.nextOccurrence && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-neutral-400">Próxima</span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{formatDate(transaction.nextOccurrence)}</span>
                      </div>
                    )}
                    {transaction.totalInstallments && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-neutral-400">Parcelas</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{transaction.currentInstallment || 1}/{transaction.totalInstallments}x</span>
                      </div>
                    )}
                    {transaction.totalInstallments && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-neutral-400">Total Estimado</span>
                        </div>
                        <span className={`text-sm font-bold ${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'}`}>
                          {formatCurrency(transaction.amount * transaction.totalInstallments)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
                  <button onClick={onClose} className="w-full btn-secondary rounded-full py-2.5">Fechar</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default RecurrenceDetailsModal
