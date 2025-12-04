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
  X,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Repeat,
  XCircle
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import ConfirmCancelRecurrenceModal from '@/components/modals/ConfirmCancelRecurrenceModal'
import PageTransition from '@/components/common/PageTransition'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, 'Valor e obrigatorio'),
  categoryId: z.string().min(1, 'Categoria e obrigatoria'),
  description: z.string().min(3, 'Descricao deve ter no minimo 3 caracteres'),
  date: z.string().min(1, 'Data e obrigatoria'),
  isRecurring: z.boolean().optional(),
  recurrenceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  recurrenceEndDate: z.string().optional(),
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
    isLoading
  } = useFinancialStore()

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelRecurrenceModal, setShowCancelRecurrenceModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string; amount: number } | null>(null)
  const [transactionToCancelRecurrence, setTransactionToCancelRecurrence] = useState<{ id: string; description: string } | null>(null)
  
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
    formState: { errors },
  } = useForm<TransactionFormData>( {
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const transactionType = watch('type')

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
      
      // Formatar recurrenceEndDate se existir
      const recurrenceEndDate = transaction.recurrenceEndDate
        ? (transaction.recurrenceEndDate.includes('T')
            ? transaction.recurrenceEndDate.split('T')[0]
            : transaction.recurrenceEndDate)
        : undefined
      
      reset({
        type: transaction.type,
        amount: transaction.amount.toString(),
        categoryId: transaction.categoryId,
        description: transaction.description,
        date: transactionDate,
        isRecurring: transaction.isRecurring || false,
        recurrenceType: transaction.recurrenceType || undefined,
        recurrenceEndDate: recurrenceEndDate,
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
        recurrenceEndDate: undefined,
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
      categoryId: data.categoryId, // ✅ Enviar categoryId, não category
      // Adicionar campos de recorrência se marcado
      isRecurring: isRecurring,
      recurrenceType: isRecurring ? data.recurrenceType : undefined,
      recurrenceEndDate: isRecurring && data.recurrenceEndDate ? data.recurrenceEndDate : undefined,
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
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
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transações</h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Transacao
        </button>
      </div>

      {/* Month Navigation */}
      <div className="card">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <div className="text-center">
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

          <button
            onClick={handleNextMonth}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors font-medium"
          >
            Proximo
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Month Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-neutral-800">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="overflow-x-auto">
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
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          transaction.type === 'income'
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
                      className={`py-3 px-4 text-right font-semibold ${
                        transaction.type === 'income'
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
                          <button
                            onClick={() => handleCancelRecurrence(transaction)}
                            className="p-2 text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/20 rounded-lg transition-colors"
                            title="Cancelar recorrência"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-neutral-800">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Editar Transacao' : 'Nova Transacao'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg transition-colors text-gray-600 dark:text-neutral-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
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
                      setIsRecurring(e.target.checked)
                      if (!e.target.checked) {
                        // Limpar campos de recorrência quando desmarcar
                        reset({
                          ...watch(),
                          recurrenceType: undefined,
                          recurrenceEndDate: undefined,
                        })
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

                    <div>
                      <label className="label">Data Final (opcional)</label>
                      <input
                        type="date"
                        {...register('recurrenceEndDate')}
                        className="input-field"
                        placeholder="Deixe em branco para recorrência indefinida"
                      />
                      <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                        Deixe em branco para recorrência indefinida
                      </p>
                      {errors.recurrenceEndDate && (
                        <p className="error-message">{errors.recurrenceEndDate.message}</p>
                      )}
                    </div>

                    <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                      <p className="text-xs text-primary-700 dark:text-primary-300">
                        <strong>ℹ️ Como funciona:</strong> Esta transação será automaticamente criada na frequência selecionada. Você pode cancelar a recorrência a qualquer momento.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingId ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
    </PageTransition>
  )
}

export default Transactions
