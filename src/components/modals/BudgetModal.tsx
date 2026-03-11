import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Target } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFinancialStore } from '@/store/financialStore'
import { Category, Budget } from '@/types'
import toast from 'react-hot-toast'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useIsMobile } from '@/hooks'

const budgetSchema = z.object({
    amount: z.string().min(1, 'Valor é obrigatório').refine(
        (val) => !isNaN(Number(val.replace(/\D/g, ''))) && Number(val.replace(/\D/g, '')) > 0,
        'Valor deve ser maior que zero'
    ),
})

type BudgetFormData = z.infer<typeof budgetSchema>

interface BudgetModalProps {
    isOpen: boolean
    onClose: () => void
    category: Category | null
    existingBudget?: Budget
}

const BudgetModal = ({ isOpen, onClose, category, existingBudget }: BudgetModalProps) => {
    const { saveBudget, deleteBudget } = useFinancialStore()
    const [isDeleting, setIsDeleting] = useState(false)
    const isMobile = useIsMobile()
    const dragControls = useDragControls()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            amount: '',
        },
    })

    useEffect(() => {
        if (isOpen && existingBudget) {
            // Format number to string for input
            const amountStr = (existingBudget.amount * 100).toString()
            setValue('amount', amountStr)
        } else if (isOpen) {
            reset()
        }
    }, [isOpen, existingBudget, setValue, reset])

    const formatCurrencyInput = (value: string) => {
        const numbers = value.replace(/\D/g, '')
        const amount = Number(numbers) / 100
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount)
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '')
        setValue('amount', value, { shouldValidate: true })
    }

    const onSubmit = async (data: BudgetFormData) => {
        if (!category?.id) return

        try {
            // Extrair apenas números e converter para float
            const cleanValue = data.amount.replace(/\D/g, '')
            const amount = Number(cleanValue) / 100

            console.log(`[BUDGET-UI] Submitting: Category=${category.id}, Amount=${amount}, Raw=${data.amount}`)

            if (isNaN(amount) || amount <= 0) {
                toast.error('O valor do limite deve ser maior que zero')
                return
            }

            await saveBudget({
                categoryId: category.id,
                amount
            })
            onClose()
        } catch (error) {
            console.error('Falha ao salvar orçamento:', error)
        }
    }

    const handleDelete = () => {
        if (!category?.id) return
        setIsDeleting(true)
        deleteBudget(category.id)
        setIsDeleting(false)
        onClose()
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && category && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Modal Container */}
                    <div className={`fixed inset-0 flex justify-center z-[200] pointer-events-none ${isMobile ? 'items-end' : 'items-center p-4'}`}>
                        <motion.div
                            initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                            exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            drag={isMobile ? 'y' : false}
                            dragControls={dragControls}
                            dragListener={false}
                            dragConstraints={isMobile ? { top: 0, bottom: 0 } : undefined}
                            dragElastic={isMobile ? { top: 0, bottom: 0.4 } : undefined}
                            onDragEnd={isMobile ? ((_, { offset, velocity }) => {
                                if (offset.y > 100 || velocity.y > 400) {
                                    onClose()
                                }
                            }) : undefined}
                            className={`bg-white dark:bg-neutral-900 z-[200] shadow-2xl w-full max-w-md flex flex-col overflow-hidden pointer-events-auto ${
                                isMobile ? 'rounded-t-[2rem] border-t border-gray-100 dark:border-neutral-800' : 'rounded-3xl'
                            }`}
                        >
                            <div className={`flex flex-col h-full overflow-hidden ${isMobile ? 'max-h-[85vh]' : ''}`}>
                                {/* Drag indicator no mobile */}
                                {isMobile && (
                                    <div
                                        className="py-3 w-full flex justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                                        onPointerDown={(e) => dragControls.start(e)}
                                    >
                                        <div className="w-10 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                                    </div>
                                )}

                                <div className={`flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800 flex-shrink-0 ${isMobile ? 'pt-0' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            <Target className="w-5 h-5" style={{ color: category.color }} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Limites de Gasto</h2>
                                            <p className="text-sm text-gray-500 dark:text-neutral-400">
                                                Orçamento para {category.name}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto custom-scrollbar">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                                Defina o limite mensal
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="R$ 0,00"
                                                    {...register('amount')}
                                                    onChange={(e) => {
                                                        handleCurrencyChange(e)
                                                    }}
                                                    value={formatCurrencyInput(watch('amount'))}
                                                    className="w-full px-4 py-3 sm:py-4 text-2xl font-bold bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            {errors.amount && (
                                                <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
                                                    {errors.amount.message}
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-neutral-400 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl">
                                            💡 Você receberá alertas visuais (amarelo, vermelho) ao chegar perto desse limite ao longo do mês.
                                        </p>
                                    </div>

                                    <div className="mt-8 flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-neutral-800">
                                        {existingBudget && (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="mr-auto px-4 py-2.5 text-sm font-semibold text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-colors"
                                            >
                                                Remover
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-center"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-600/20 dark:shadow-none transition-all hover:-translate-y-0.5 text-center whitespace-nowrap"
                                        >
                                            Salvar Limite
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default BudgetModal
