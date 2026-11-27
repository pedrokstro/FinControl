import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TrendingUp, TrendingDown, Repeat, Loader2, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFinancialStore } from '@/store/financialStore'
import { useTransactionLimit } from '@/hooks/useTransactionLimit'
import { Transaction } from '@/types'
import { haptics } from '@/utils/haptics'
import Modal from '@/components/common/Modal'
import CategorySelect from '@/components/common/CategorySelect'
import CustomDatePicker from '@/components/common/CustomDatePicker'
import CustomSelect from '@/components/common/CustomSelect'
import BrandIcon from '@/components/common/BrandIcon'

export const transactionSchema = z
  .object({
    type: z.enum(['income', 'expense']),
    amount: z.string().min(1, 'Valor é obrigatório'),
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
    description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
    date: z.string().min(1, 'Data é obrigatória'),
    isRecurring: z.boolean().optional(),
    recurrenceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    totalInstallments: z.string().optional(),
    creditCardId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      if (!data.recurrenceType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['recurrenceType'],
          message: 'Selecione a frequência',
        })
      }

      if (data.totalInstallments) {
        const installments = parseInt(data.totalInstallments, 10)
        if (isNaN(installments) || installments < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['totalInstallments'],
            message: 'Mínimo de 2 parcelas',
          })
        } else if (installments > 360) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['totalInstallments'],
            message: 'Máximo de 360 parcelas',
          })
        }
      }
    }
  })

export type TransactionFormData = z.infer<typeof transactionSchema>

const QUICK_AMOUNT_PRESETS = [50, 100, 250, 500]

const getLocalTodayIso = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

const normalizeDateForInput = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.includes('T') ? value.split('T')[0] : value
  }
  if (value instanceof Date && !isNaN(value.getTime())) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
  }
  return getLocalTodayIso()
}

interface TransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: 'income' | 'expense'
  initialDate?: string
  editingTransaction?: Transaction | null
  showQuickAmountPresets?: boolean
  onSaved?: () => Promise<void> | void
  onLimitReached?: () => void
}

const TransactionFormModal = ({
  isOpen,
  onClose,
  initialType = 'expense',
  initialDate,
  editingTransaction = null,
  showQuickAmountPresets = false,
  onSaved,
  onLimitReached,
}: TransactionFormModalProps) => {
  const categories = useFinancialStore((s) => s.categories)
  const creditCards = useFinancialStore((s) => s.creditCards)
  const isCreatingTransaction = useFinancialStore((s) => s.isCreatingTransaction)
  const addTransaction = useFinancialStore((s) => s.addTransaction)
  const updateTransaction = useFinancialStore((s) => s.updateTransaction)
  const fetchCreditCards = useFinancialStore((s) => s.fetchCreditCards)

  const { checkLimit, refreshUsage } = useTransactionLimit()
  const [isRecurring, setIsRecurring] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialType,
      date: initialDate || getLocalTodayIso(),
    },
  })

  const transactionType = watch('type')
  const availableCategories = categories.filter((c) => c.type === transactionType)

  useEffect(() => {
    if (!isOpen) return

    fetchCreditCards()

    if (editingTransaction) {
      const txRecurring = editingTransaction.isRecurring || false
      setIsRecurring(txRecurring)
      reset({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        categoryId: editingTransaction.categoryId,
        description: editingTransaction.description,
        date: normalizeDateForInput(editingTransaction.date),
        isRecurring: txRecurring,
        recurrenceType: editingTransaction.recurrenceType || undefined,
        totalInstallments: editingTransaction.totalInstallments?.toString() || '',
        creditCardId: editingTransaction.creditCardId || '',
      })
    } else {
      setIsRecurring(false)
      reset({
        type: initialType,
        amount: '',
        categoryId: '',
        description: '',
        date: initialDate || getLocalTodayIso(),
        isRecurring: false,
        recurrenceType: undefined,
        totalInstallments: '',
        creditCardId: '',
      })
    }
  }, [isOpen, editingTransaction, initialType, initialDate, fetchCreditCards, reset])

  const handleSafeClose = () => {
    if (isCreatingTransaction) return
    setIsRecurring(false)
    onClose()
  }

  const onSubmit = async (data: TransactionFormData) => {
    if (!editingTransaction) {
      const canCreate = await checkLimit()
      if (!canCreate) {
        haptics.warning()
        onLimitReached?.()
        return
      }
    }

    const category = categories.find((c) => c.id === data.categoryId)
    const dateString = normalizeDateForInput(data.date)

    const transactionData = {
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      date: dateString,
      categoryId: data.categoryId,
      isRecurring,
      recurrenceType: isRecurring ? data.recurrenceType : undefined,
      recurrenceMonths: isRecurring && data.totalInstallments ? Number(data.totalInstallments) : undefined,
      creditCardId: data.type === 'expense' && data.creditCardId ? data.creditCardId : null,
    }

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData as any)
      } else {
        await addTransaction({
          ...(transactionData as any),
          category: category?.name || '',
          userId: '1',
        })
        await refreshUsage()
      }

      haptics.success()
      setIsRecurring(false)
      await onSaved?.()
      onClose()
    } catch (error) {
      haptics.error()
      console.error('Erro na transação', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSafeClose}
      title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
      size="md"
      closeOnBackdrop={!isCreatingTransaction}
      contentClassName="space-y-5"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSafeClose}
            className="flex-1 btn-secondary rounded-full"
            disabled={isCreatingTransaction}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="unified-transaction-form"
            className="flex-1 btn-primary flex items-center justify-center gap-2 rounded-full shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isCreatingTransaction}
          >
            {isCreatingTransaction ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              editingTransaction ? 'Atualizar' : 'Salvar'
            )}
          </button>
        </div>
      }
    >
      <div className="relative">
        {isCreatingTransaction && (
          <div className="absolute inset-0 bg-white/85 dark:bg-neutral-950/85 flex flex-col items-center justify-center gap-3 z-10 rounded-xl">
            <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300 text-center px-6">
              Criando transação e gerando parcelas...
            </p>
          </div>
        )}

        <form id="unified-transaction-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block font-display">
              Tipo de Lançamento
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative flex items-center justify-center p-5 border rounded-2xl cursor-pointer transition-all duration-300 border-gray-200 dark:border-neutral-800/80 hover:border-success-400/60 has-[:checked]:border-success-500 has-[:checked]:bg-success-50/20 dark:has-[:checked]:bg-success-950/15 has-[:checked]:shadow-md has-[:checked]:shadow-success-500/5 active:scale-[0.97] select-none">
                <input type="radio" value="income" {...register('type')} className="sr-only" />
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-success-50/60 dark:bg-success-950/20 flex items-center justify-center mx-auto mb-2 transition-colors">
                    <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white font-display">Receita</span>
                </div>
              </label>

              <label className="relative flex items-center justify-center p-5 border rounded-2xl cursor-pointer transition-all duration-300 border-gray-200 dark:border-neutral-800/80 hover:border-danger-400/60 has-[:checked]:border-danger-500 has-[:checked]:bg-danger-50/20 dark:has-[:checked]:bg-danger-950/15 has-[:checked]:shadow-md has-[:checked]:shadow-danger-500/5 active:scale-[0.97] select-none">
                <input type="radio" value="expense" {...register('type')} className="sr-only" />
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-danger-50/60 dark:bg-danger-950/20 flex items-center justify-center mx-auto mb-2 transition-colors">
                    <TrendingDown className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white font-display">Despesa</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6 bg-gray-50/60 dark:bg-neutral-900/40 rounded-2xl border border-gray-200/70 dark:border-neutral-800/60 relative overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 font-display">
              Valor do Lançamento
            </span>
            <div className="flex items-baseline justify-center gap-1.5 w-full px-4">
              <span className="text-xl font-bold text-gray-400 dark:text-neutral-500 font-display">R$</span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0,00"
                {...register('amount')}
                className={`w-full max-w-[220px] text-center text-4xl font-extrabold font-display bg-transparent border-none outline-none focus:ring-0 p-0 text-gray-900 dark:text-white ${
                  errors.amount ? 'text-danger-500 dark:text-danger-400' : ''
                }`}
              />
            </div>
            {showQuickAmountPresets && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {QUICK_AMOUNT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setValue('amount', preset.toString(), { shouldDirty: true, shouldValidate: true })}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:border-primary-400 transition-colors"
                  >
                    + R$ {preset}
                  </button>
                ))}
              </div>
            )}
            {errors.amount && (
              <p className="text-xs text-danger-500 dark:text-danger-400 font-semibold mt-2 font-sans">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">
              Categoria
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <CategorySelect
                  categories={availableCategories}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.categoryId?.message}
                />
              )}
            />
            {errors.categoryId && <p className="error-message">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">
              Descrição
            </label>
            <input
              type="text"
              placeholder="Ex: Compra no supermercado"
              {...register('description')}
              className={`input-field rounded-xl ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">
                Data
              </label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.date?.message}
                    align="top"
                  />
                )}
              />
              {errors.date && <p className="error-message">{errors.date.message}</p>}
            </div>

            {transactionType === 'expense' ? (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">
                  Cartão de Crédito (Opcional)
                </label>
                <Controller
                  name="creditCardId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      options={[
                        { value: '', label: 'Nenhum cartão' },
                        ...creditCards.map((card) => ({
                          value: card.id,
                          label: card.name,
                          icon: <BrandIcon brand={card.brand} className="w-5 h-5" />,
                        })),
                      ]}
                      value={field.value || ''}
                      onChange={field.onChange}
                      dropdownTitle="Selecione um Cartão"
                      className="w-full"
                    />
                  )}
                />
                <p className="text-[9px] text-gray-400 dark:text-neutral-500 mt-1 leading-tight">
                  Se marcado, a despesa não será somada ao total mensal para evitar redundância com a fatura.
                </p>
              </div>
            ) : (
              <div className="hidden sm:block opacity-0 pointer-events-none" />
            )}
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              isRecurring
                ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10 shadow-sm'
                : 'border-gray-200 dark:border-neutral-800/85 bg-white dark:bg-neutral-900/40'
            }`}
          >
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    isRecurring
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'bg-gray-50 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 border border-gray-200/40 dark:border-neutral-700/40'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block font-sans">
                    Transação Recorrente
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-neutral-500">
                    Repetir automaticamente este lançamento
                  </span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setIsRecurring(checked)
                    setValue('isRecurring', checked)
                    if (!checked) {
                      setValue('recurrenceType', undefined)
                      setValue('totalInstallments', '')
                    }
                    haptics.light()
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 rounded-full transition-colors duration-300 relative ${
                    isRecurring ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                      isRecurring ? 'left-5' : 'left-1'
                    }`}
                  />
                </div>
              </div>
            </label>

            {isRecurring && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="mt-4 pt-4 border-t border-primary-100/50 dark:border-primary-900/10 space-y-4"
              >
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">
                    Frequência
                  </label>
                  <Controller
                    name="recurrenceType"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { value: 'daily', label: 'Diária', icon: <Calendar className="w-4 h-4 text-primary-500" /> },
                          { value: 'weekly', label: 'Semanal', icon: <Calendar className="w-4 h-4 text-primary-500" /> },
                          { value: 'monthly', label: 'Mensal', icon: <Calendar className="w-4 h-4 text-primary-500" /> },
                          { value: 'yearly', label: 'Anual', icon: <Calendar className="w-4 h-4 text-primary-500" /> },
                        ]}
                        value={field.value || ''}
                        onChange={(val) => {
                          field.onChange(val)
                          haptics.light()
                        }}
                        placeholder="Selecione a frequência..."
                        dropdownTitle="Frequência"
                        className="w-full"
                      />
                    )}
                  />
                  {errors.recurrenceType && <p className="error-message">{errors.recurrenceType.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">
                    Número de Parcelas
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="360"
                    placeholder="Ex: 12 (vazio para tempo indeterminado)"
                    {...register('totalInstallments')}
                    className={`input-field rounded-xl ${errors.totalInstallments ? 'input-error' : ''}`}
                  />
                  {errors.totalInstallments && (
                    <p className="error-message">{errors.totalInstallments.message}</p>
                  )}
                </div>

                <div className="bg-primary-500/5 border border-primary-500/15 rounded-xl p-3">
                  <p className="text-[11px] text-primary-700 dark:text-primary-300 font-sans leading-relaxed">
                    <strong>Como funciona:</strong> As parcelas serão geradas automaticamente. Deixe o campo "Número de Parcelas" vazio para uma transação recorrente fixa por tempo indeterminado.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default TransactionFormModal
