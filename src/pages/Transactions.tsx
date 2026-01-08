import { useState, useMemo, useEffect } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/config/api'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Repeat,
  XCircle,
  Loader2,
  Info,
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import ConfirmCancelRecurrenceModal from '@/components/modals/ConfirmCancelRecurrenceModal'
import RecurrenceDetailsModal from '@/components/modals/RecurrenceDetailsModal'
import PageTransition from '@/components/common/PageTransition'
import CategoryIcon from '@/components/common/CategoryIcon'
import Modal from '@/components/common/Modal'
import { Transaction } from '@/types'



const transactionSchema = z
  .object({
    type: z.enum(['income', 'expense']),
    amount: z.string().min(1, 'Valor e obrigatorio'),
    categoryId: z.string().min(1, 'Categoria e obrigatoria'),
    description: z.string().min(3, 'Descricao deve ter no minimo 3 caracteres'),
    date: z.string().min(1, 'Data e obrigatoria'),
    isRecurring: z.boolean().optional(),
    recurrenceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    totalInstallments: z.string().optional(),
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

      // Validação do número de parcelas
      if (!data.totalInstallments) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['totalInstallments'],
          message: 'Número de parcelas é obrigatório',
        })
      } else {
        const installments = parseInt(data.totalInstallments)
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

type TransactionFormData = z.infer<typeof transactionSchema>

const Transactions = () => {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    syncWithBackend,
    isLoading,
    isCreatingTransaction,
  } = useFinancialStore()

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelRecurrenceModal, setShowCancelRecurrenceModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string; amount: number } | null>(null)
  const [transactionToCancelRecurrence, setTransactionToCancelRecurrence] = useState<{ id: string; description: string } | null>(null)
  const [showRecurrenceDetailsModal, setShowRecurrenceDetailsModal] = useState(false)
  const [selectedRecurrenceTransaction, setSelectedRecurrenceTransaction] = useState<Transaction | null>(null)

  // Sincronizar com backend ao carregar a página
  useEffect(() => {
    syncWithBackend()
  }, [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [isRecurring, setIsRecurring] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const transactionType = watch('type')

  const categoryIconMap = useMemo(() => {
    const map = new Map<string, { icon: string; name: string; color?: string }>()
    categories.forEach((cat) => {
      map.set(cat.id, { icon: cat.icon, name: cat.name, color: cat.color })
    })
    return map
  }, [categories])

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1))
  }

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date())
  }

  const filteredTransactions = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth)
    const monthEnd = endOfMonth(selectedMonth)

    console.log('🔍 Filtrando transações:')
    console.log('  Total no store:', transactions.length)
    console.log('  Mês selecionado:', format(selectedMonth, 'MMMM yyyy', { locale: ptBR }))
    console.log('  Período:', monthStart, 'até', monthEnd)

    const filtered = transactions
      .filter((t) => {
        // Usar parseISO para garantir parsing correto de datas ISO
        const transactionDate = parseISO(t.date)
        const isInSelectedMonth = transactionDate >= monthStart && transactionDate <= monthEnd

        // Debug detalhado
        if (transactions.length > 0 && transactions.indexOf(t) === 0) {
          console.log('  Exemplo de transação:')
          console.log('    Data original:', t.date)
          console.log('    Data parseada:', transactionDate)
          console.log('    monthStart:', monthStart)
          console.log('    monthEnd:', monthEnd)
          console.log('    Está no mês?', isInSelectedMonth)
        }

        const matchesSearch =
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filterType === 'all' || t.type === filterType
        const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory

        return isInSelectedMonth && matchesSearch && matchesType && matchesCategory
      })
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())

    console.log('  Transações filtradas:', filtered.length)

    return filtered
  }, [transactions, searchTerm, filterType, filterCategory, selectedMonth])

  const monthSummary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
      count: filteredTransactions.length
    }
  }, [filteredTransactions])

  const handleOpenModal = (transaction?: any) => {
    if (transaction) {
      setEditingId(transaction.id)
      // Atualizar estado de recorrência
      setIsRecurring(transaction.isRecurring || false)

      // Formatar data para yyyy-MM-dd (sem timezone)
      const transactionDate = transaction.date.includes('T')
        ? transaction.date.split('T')[0]
        : transaction.date



      reset({
        type: transaction.type,
        amount: transaction.amount.toString(),
        categoryId: transaction.categoryId,
        description: transaction.description,
        date: transactionDate,
        isRecurring: transaction.isRecurring || false,
        recurrenceType: transaction.recurrenceType || undefined,
        totalInstallments: transaction.totalInstallments?.toString() || '',
      })
    } else {
      setEditingId(null)
      setIsRecurring(false)
      reset({
        type: 'expense',
        amount: '',
        categoryId: '',
        description: '',
        date: format(selectedMonth, 'yyyy-MM-dd'),
        isRecurring: false,
        recurrenceType: undefined,
        totalInstallments: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setIsRecurring(false)
    reset()
  }

  const onSubmit = (data: TransactionFormData) => {
    const category = categories.find((c) => c.id === data.categoryId)

    const transactionData = {
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      date: data.date,
      categoryId: data.categoryId,
      isRecurring: isRecurring,
      recurrenceType: isRecurring ? data.recurrenceType : undefined,
      recurrenceMonths: isRecurring && data.totalInstallments ? Number(data.totalInstallments) : undefined,
    }

    if (editingId) {
      // ✅ Ao editar, enviar apenas os campos necessários
      updateTransaction(editingId, transactionData)
    } else {
      // ✅ Ao criar, adicionar category name e userId
      addTransaction({
        ...transactionData,
        category: category?.name || '',
        userId: '1',
      })
    }
    handleCloseModal()
    setIsRecurring(false) // Reset recorrência
  }

  const handleDelete = (transaction: any) => {
    setTransactionToDelete({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount
    })
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id)
      setTransactionToDelete(null)
    }
  }

  const handleCancelRecurrence = (transaction: any) => {
    setTransactionToCancelRecurrence({
      id: transaction.id,
      description: transaction.description
    })
    setShowCancelRecurrenceModal(true)
  }

  const confirmCancelRecurrence = async () => {
    if (!transactionToCancelRecurrence) return

    try {
      await api.patch(`/transactions/${transactionToCancelRecurrence.id}/cancel-recurrence`)

      toast.success('Recorrência cancelada com sucesso!')

      // Recarregar transações
      syncWithBackend()

      setTransactionToCancelRecurrence(null)
    } catch (error: any) {
      console.error('Erro ao cancelar recorrência:', error)
      toast.error(error.response?.data?.message || 'Erro ao cancelar recorrência')
    }
  }

  const handleViewRecurrenceDetails = (transaction: Transaction) => {
    setSelectedRecurrenceTransaction(transaction)
    setShowRecurrenceDetailsModal(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleSafeModalClose = () => {
    if (isCreatingTransaction) return
    handleCloseModal()
  }

  const availableCategories = categories.filter(
    (c) => c.type === transactionType
  )

  // Debug: verificar categorias
  console.log('📋 Total de categorias no store:', categories.length)
  console.log('📋 Categorias disponíveis para', transactionType, ':', availableCategories.length)

  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

  return (
    <PageTransition>
      <div className="responsive-page">
        <div className="responsive-header">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transações</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Nova Transacao
          </button>
        </div>

        {/* Month Navigation */}
        <div className="card space-y-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 w-full lg:w-auto">
              <button
                onClick={handlePreviousMonth}
                className="w-full sm:w-auto flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-gray-900 dark:text-white shadow-sm hover:shadow transition-all active:scale-[0.99]"
                aria-label="Ir para o mês anterior"
              >
                <div className="flex flex-col items-start text-left leading-tight">
                  <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                    Período
                  </span>
                  <span className="text-sm font-semibold">Anterior</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-300">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={handleNextMonth}
                className="w-full sm:w-auto flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-gray-900 dark:text-white shadow-sm hover:shadow transition-all active:scale-[0.99]"
                aria-label="Ir para o próximo mês"
              >
                <div className="flex flex-col items-start text-left leading-tight">
                  <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                    Período
                  </span>
                  <span className="text-sm font-semibold">Próximo</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-300">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div className="text-center lg:text-left">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                {!isCurrentMonth && (
                  <button
                    onClick={handleCurrentMonth}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mt-1"
                  >
                    Voltar para mes atual
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Month Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Total de Transacoes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{monthSummary.count}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Receitas</p>
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                {formatCurrency(monthSummary.income)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Despesas</p>
              <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                {formatCurrency(monthSummary.expense)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Saldo</p>
              <p className={`text-2xl font-bold ${monthSummary.balance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {formatCurrency(monthSummary.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="filter-grid">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar transacoes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input-field"
            >
              <option value="all">Todos os tipos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card">
          {filteredTransactions.length > 0 ? (
            <>
              <div className="hidden md:block table-wrapper">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-neutral-800">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Descricao
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Categoria
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Tipo
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Valor
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Acoes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-600 dark:text-neutral-400">
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {transaction.description}
                            </p>
                            {transaction.isRecurring && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                <Repeat className="w-3 h-3" />
                                Recorrente
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300">
                            {categoryIconMap.get(transaction.categoryId) && (
                              <CategoryIcon
                                icon={categoryIconMap.get(transaction.categoryId)!.icon}
                                color={categoryIconMap.get(transaction.categoryId)!.color}
                                size="sm"
                              />
                            )}
                            <span>{transaction.category}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${transaction.type === 'income'
                              ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                              : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300'
                              }`}
                          >
                            {transaction.type === 'income' ? (
                              <>
                                <TrendingUp className="w-4 h-4" />
                                Receita
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-4 h-4" />
                                Despesa
                              </>
                            )}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold ${transaction.type === 'income'
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-danger-600 dark:text-danger-400'
                            }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {transaction.isRecurring && (
                              <>
                                <button
                                  onClick={() => handleViewRecurrenceDetails(transaction)}
                                  className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                  title="Ver detalhes da recorrência"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCancelRecurrence(transaction)}
                                  className="p-2 text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/20 rounded-lg transition-colors"
                                  title="Cancelar recorrência"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleOpenModal(transaction)}
                              className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction)}
                              className="p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4 pb-24">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                          {transaction.description}
                        </p>
                        {transaction.isRecurring && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300 mt-1">
                            <Repeat className="w-3 h-3" />
                            Recorrente
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-right font-semibold ${transaction.type === 'income'
                          ? 'text-success-600 dark:text-success-300'
                          : 'text-danger-600 dark:text-danger-300'
                          }`}
                      >
                        <span className="block text-sm uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                          Valor
                        </span>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300">
                        {categoryIconMap.get(transaction.categoryId) && (
                          <CategoryIcon
                            icon={categoryIconMap.get(transaction.categoryId)!.icon}
                            color={categoryIconMap.get(transaction.categoryId)!.color}
                            size="sm"
                          />
                        )}
                        {transaction.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${transaction.type === 'income'
                          ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-300'
                          : 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300'
                          }`}
                      >
                        {transaction.type === 'income' ? (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            Receita
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4" />
                            Despesa
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      {transaction.isRecurring && (
                        <>
                          <button
                            onClick={() => handleViewRecurrenceDetails(transaction)}
                            className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300"
                            title="Ver detalhes da recorrência"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelRecurrence(transaction)}
                            className="p-2 rounded-full bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-300"
                            title="Cancelar recorrência"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleOpenModal(transaction)}
                        className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="p-2 rounded-full bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-300"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-neutral-500" />
              <p className="text-lg font-medium">Nenhuma transacao encontrada</p>
              <p className="text-sm mt-2">
                Nao ha transacoes para {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
              </p>
              {!isCurrentMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Voltar para mes atual
                </button>
              )}
            </div>
          )}
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleSafeModalClose}
          title={editingId ? 'Editar Transação' : 'Nova Transação'}
          size="md"
          closeOnBackdrop={!isCreatingTransaction}
          contentClassName="space-y-5"
          footer={
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 btn-secondary"
                disabled={isCreatingTransaction}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="transaction-form"
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isCreatingTransaction}
              >
                {isCreatingTransaction ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  editingId ? 'Atualizar' : 'Salvar'
                )}
              </button>
            </div>
          }
        >
          <div className="relative">
            {isCreatingTransaction && (
              <div className="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 z-10 rounded-xl">
                <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
                <p className="text-sm font-medium text-primary-700 dark:text-primary-300 text-center px-6">
                  Criando transação e gerando parcelas...
                </p>
              </div>
            )}

            <form id="transaction-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label">Tipo</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer has-[:checked]:border-success-500 has-[:checked]:bg-success-50">
                    <input
                      type="radio"
                      value="income"
                      {...register('type')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 mx-auto text-success-600 mb-1" />
                      <span className="text-sm font-medium">Receita</span>
                    </div>
                  </label>
                  <label className="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer has-[:checked]:border-danger-500 has-[:checked]:bg-danger-50">
                    <input
                      type="radio"
                      value="expense"
                      {...register('type')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <TrendingDown className="w-6 h-6 mx-auto text-danger-600 mb-1" />
                      <span className="text-sm font-medium">Despesa</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="0,00"
                  {...register('amount')}
                  className={`input-field ${errors.amount ? 'input-error' : ''}`}
                />
                {errors.amount && (
                  <p className="error-message">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="label">Categoria</label>
                <select
                  {...register('categoryId')}
                  className={`input-field ${errors.categoryId ? 'input-error' : ''}`}
                >
                  <option value="">Selecione uma categoria</option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="error-message">{errors.categoryId.message}</p>
                )}
              </div>

              <div>
                <label className="label">Descricao</label>
                <input
                  type="text"
                  placeholder="Ex: Compra no supermercado"
                  {...register('description')}
                  className={`input-field ${errors.description ? 'input-error' : ''}`}
                />
                {errors.description && (
                  <p className="error-message">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="label">Data</label>
                <input
                  type="date"
                  {...register('date')}
                  className={`input-field ${errors.date ? 'input-error' : ''}`}
                />
                {errors.date && (
                  <p className="error-message">{errors.date.message}</p>
                )}
              </div>

              {/* Transação Recorrente */}
              <div className="border-t border-gray-200 dark:border-neutral-800 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={isRecurring}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setIsRecurring(checked)
                      if (!checked) {
                        setValue('recurrenceType', undefined)
                        setValue('totalInstallments', '')
                      }
                    }}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="isRecurring" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    <Repeat className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    Transação Recorrente
                  </label>
                </div>

                {isRecurring && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary-200 dark:border-primary-800">
                    {/* Frequência */}
                    <div>
                      <label className="label">Frequência</label>
                      <select
                        {...register('recurrenceType')}
                        className="input-field"
                      >
                        <option value="">Selecione a frequência...</option>
                        <option value="daily">Diária</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                      </select>
                      {errors.recurrenceType && (
                        <p className="error-message">{errors.recurrenceType.message}</p>
                      )}
                    </div>

                    {/* Número de Parcelas */}
                    <div>
                      <label className="label">Número de Parcelas</label>
                      <input
                        type="number"
                        min="2"
                        max="360"
                        placeholder="Ex: 12"
                        {...register('totalInstallments')}
                        className={`input-field ${errors.totalInstallments ? 'input-error' : ''}`}
                      />
                      {errors.totalInstallments && (
                        <p className="error-message">{errors.totalInstallments.message}</p>
                      )}
                    </div>

                    <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                      <p className="text-xs text-primary-700 dark:text-primary-300">
                        <strong>ℹ️ Como funciona:</strong> As parcelas serão geradas automaticamente conforme a frequência selecionada até completar o total.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setTransactionToDelete(null)
          }}
          onConfirm={confirmDelete}
          title="Excluir Transação"
          description="Tem certeza que deseja excluir esta transação?"
          itemName={transactionToDelete ? `${transactionToDelete.description} - ${formatCurrency(transactionToDelete.amount)}` : ''}
          isLoading={isLoading}
        />

        {/* Modal de Confirmação de Cancelar Recorrência */}
        <ConfirmCancelRecurrenceModal
          isOpen={showCancelRecurrenceModal}
          onClose={() => {
            setShowCancelRecurrenceModal(false)
            setTransactionToCancelRecurrence(null)
          }}
          onConfirm={confirmCancelRecurrence}
          transactionDescription={transactionToCancelRecurrence?.description}
          isLoading={isLoading}
        />

        {/* Modal de Detalhes da Recorrência */}
        <RecurrenceDetailsModal
          isOpen={showRecurrenceDetailsModal}
          onClose={() => {
            setShowRecurrenceDetailsModal(false)
            setSelectedRecurrenceTransaction(null)
          }}
          transaction={selectedRecurrenceTransaction}
        />
      </div>
    </PageTransition>
  )
}

export default Transactions
