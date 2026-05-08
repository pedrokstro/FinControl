import { useMemo, useState } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { CalendarClock, Search, CreditCard, CalendarDays, Wallet, TrendingUp, XCircle, Pencil, Check, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import CategoryIcon from '@/components/common/CategoryIcon'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import PageTransition from '@/components/common/PageTransition'
import { haptics } from '@/utils/haptics'
import Modal from '@/components/common/Modal'
import api from '@/config/api'
import { toast } from 'react-hot-toast'
import ConfirmCancelRecurrenceModal from '@/components/modals/ConfirmCancelRecurrenceModal'

const getBrandIcon = (name: string, defaultIcon?: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('netflix')) return 'NetflixIcon'
  if (lower.includes('spotify')) return 'SpotifyIcon'
  if (lower.includes('amazon') || lower.includes('prime')) return 'AmazonIcon'
  if (lower.includes('apple') || lower.includes('icloud') || lower.includes('mac')) return 'AppleBrandIcon'
  if (lower.includes('google') || lower.includes('youtube') || lower.includes('yt ')) return 'GoogleIcon'
  if (lower.includes('disney')) return 'DisneyPlusIcon'
  return defaultIcon || 'Receipt'
}

const Subscriptions = () => {
  const { transactions, categories, syncWithBackend, updateTransaction } = useFinancialStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [transactionToCancel, setTransactionToCancel] = useState<{ id: string; description: string } | null>(null)
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({ amount: '', categoryId: '', frequency: '' })

  const openDetails = (sub: any) => {
    setSelectedSubscription(sub)
    setEditForm({
      amount: sub.amount.toString(),
      categoryId: sub.categoryId || '',
      frequency: sub.frequency || 'mensal'
    })
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!selectedSubscription) return
    setIsSaving(true)
    
    try {
      const updateData = {
        amount: parseFloat(editForm.amount),
        categoryId: editForm.categoryId,
        description: selectedSubscription.brandName,
      } as any

      if (editForm.frequency === 'semanal') updateData.recurrenceType = 'weekly'
      else if (editForm.frequency === 'mensal') updateData.recurrenceType = 'monthly'
      else if (editForm.frequency === 'anual') updateData.recurrenceType = 'yearly'
      
      await updateTransaction(selectedSubscription.id, updateData)
      
      toast.success('Assinatura atualizada com sucesso!')
      syncWithBackend()
      setIsEditing(false)
      setSelectedSubscription({
        ...selectedSubscription,
        amount: parseFloat(editForm.amount),
        categoryId: editForm.categoryId,
        frequency: editForm.frequency
      })
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao atualizar assinatura')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelRecurrence = (transaction: any, e?: React.MouseEvent) => {
    e?.stopPropagation()
    haptics.warning()
    setTransactionToCancel({
      id: transaction.parentTransactionId || transaction.id,
      description: transaction.brandName || transaction.description
    })
    setShowCancelModal(true)
  }

  const confirmCancelRecurrence = async () => {
    if (!transactionToCancel) return

    try {
      await api.patch(`/transactions/${transactionToCancel.id}/cancel-recurrence`)

      haptics.success()
      toast.success('Assinatura cancelada com sucesso!')
      
      syncWithBackend()
      setTransactionToCancel(null)
      setShowCancelModal(false)
      setSelectedSubscription(null)
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error)
      toast.error(error.response?.data?.message || 'Erro ao cancelar assinatura')
    }
  }

  // Process and group recurring subscriptions
  const subscriptions = useMemo(() => {
    // Filter only recurring expenses
    const recurringExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.isRecurring
    )

    // Group by description and category to avoid duplicates from multiple months
    const groupedSubs = new Map()

    // Sort by date descending to get the most recent ones first
    const sorted = [...recurringExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    sorted.forEach((t) => {
      const key = `${t.description.toLowerCase().trim()}-${t.categoryId}`
      if (!groupedSubs.has(key)) {
        groupedSubs.set(key, [])
      }
      groupedSubs.get(key).push(t)
    })

    const finalSubs: any[] = []

    groupedSubs.forEach((transactionsGroup) => {
      const mostRecent = transactionsGroup[0]
      const previous = transactionsGroup.length > 1 ? transactionsGroup[1] : null
      
      let hasPriceIncrease = false
      let priceIncreaseAmount = 0
      
      if (previous && mostRecent.amount > previous.amount) {
        hasPriceIncrease = true
        priceIncreaseAmount = mostRecent.amount - previous.amount
      }
      
      let frequency = 'mensal'
      if (transactionsGroup.length > 1) {
        const diffTime = Math.abs(new Date(mostRecent.date).getTime() - new Date(previous.date).getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays >= 350) frequency = 'anual'
        else if (diffDays >= 80 && diffDays <= 100) frequency = 'trimestral'
        else if (diffDays >= 6 && diffDays <= 8) frequency = 'semanal'
      }

      const category = categories.find((c) => c.id === mostRecent.categoryId)
      
      finalSubs.push({
        ...mostRecent,
        category,
        brandName: mostRecent.description,
        hasPriceIncrease,
        priceIncreaseAmount,
        frequency,
        previousAmount: previous ? previous.amount : null
      })
    })

    return finalSubs.filter(sub => sub.brandName.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [transactions, categories, searchTerm])

  const monthlyTotal = subscriptions.reduce((sum, sub) => {
    if (sub.frequency === 'anual') return sum + (sub.amount / 12)
    if (sub.frequency === 'semanal') return sum + (sub.amount * 4)
    if (sub.frequency === 'trimestral') return sum + (sub.amount / 3)
    return sum + sub.amount
  }, 0)
  const yearlyTotal = monthlyTotal * 12

  const { currentMonthIncome, currentMonthOtherExpenses } = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    let income = 0
    let otherExpenses = 0
    
    transactions.forEach(t => {
      const tDate = new Date(t.date)
      if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        if (t.type === 'income') {
          income += t.amount
        } else if (t.type === 'expense' && !t.isRecurring) {
          otherExpenses += t.amount
        }
      }
    })
    
    return { currentMonthIncome: income, currentMonthOtherExpenses: otherExpenses }
  }, [transactions])

  const uncommittedIncome = Math.max(0, currentMonthIncome - monthlyTotal - currentMonthOtherExpenses)
  
  const donutData = currentMonthIncome > 0 ? [
    { name: 'Assinaturas', value: monthlyTotal, color: '#6366f1' },
    { name: 'Outras Despesas', value: currentMonthOtherExpenses, color: '#f43f5e' },
    { name: 'Livre', value: uncommittedIncome, color: '#10b981' }
  ].filter(d => d.value > 0) : [
    { name: 'Assinaturas', value: monthlyTotal || 1, color: '#6366f1' },
    { name: 'Sem Renda Mapeada', value: (monthlyTotal || 1) * 2, color: '#e5e7eb' }
  ]

  return (
    <PageTransition>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-primary-500" />
            Assinaturas
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Acompanhe e gerencie seus gastos fixos recorrentes.
          </p>
        </div>

        {/* Resumo e Gráfico de Descoberta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Cards de Resumo */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Total Mensal</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(monthlyTotal)}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                gasto garantido todo mês
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 p-6 rounded-2xl shadow-sm border border-primary-600 text-white relative overflow-hidden flex flex-col justify-center">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl" />
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-white/80">Projeção Anual</p>
              </div>
              <p className="text-3xl font-bold text-white relative z-10">
                {formatCurrency(yearlyTotal)}
              </p>
              <p className="text-xs text-white/70 mt-1 relative z-10">
                drenado por ano (12x)
              </p>
            </div>
          </div>

          {/* Gráfico Donut */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 flex flex-col items-center justify-center relative min-h-[220px]">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-neutral-400 absolute top-5 left-5 z-10">
              Impacto no Orçamento
            </h3>
            
            <div className="w-full h-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Central Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Comprometido</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentMonthIncome > 0 
                    ? `${Math.round((monthlyTotal / currentMonthIncome) * 100)}%`
                    : '--%'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Lista */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          {/* Barra de Pesquisa */}
          <div className="p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar assinaturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-sm transition-all"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-4 flex-1">
            {subscriptions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-neutral-400 py-12">
                <CreditCard className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma assinatura</p>
                <p className="text-sm text-center mt-2 max-w-sm">
                  Quando você criar uma despesa marcada como <strong>Recorrente</strong>, ela aparecerá automaticamente aqui.
                </p>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <AnimatePresence>
                  {subscriptions.map((sub, index) => {
                    const percentageOfTotal = monthlyTotal > 0 ? (sub.amount / monthlyTotal) * 100 : 0
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex flex-col p-4 sm:p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          haptics.light()
                          openDetails(sub)
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-neutral-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors shadow-sm border border-gray-200 dark:border-neutral-700 shrink-0">
                            <CategoryIcon icon={getBrandIcon(sub.brandName, sub.category?.icon)} color={sub.category?.color || '#9ca3af'} size="md" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-gray-900 dark:text-white truncate text-base sm:text-lg" title={sub.brandName}>
                                {sub.brandName}
                              </h3>
                              <div className="flex items-center gap-2">
                                {sub.hasPriceIncrease && (
                                  <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 px-1.5 py-0.5 rounded-md" title={`Aumentou ${formatCurrency(sub.priceIncreaseAmount)} em relação à última cobrança`}>
                                    <TrendingUp className="w-3 h-3" />
                                    +{formatCurrency(sub.priceIncreaseAmount)}
                                  </span>
                                )}
                                <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg whitespace-nowrap ml-1 sm:ml-3">
                                  {formatCurrency(sub.amount)}
                                  <span className="text-xs font-normal text-gray-400 dark:text-neutral-500">/{sub.frequency === 'anual' ? 'ano' : sub.frequency === 'semanal' ? 'sem' : sub.frequency === 'trimestral' ? 'tri' : 'mês'}</span>
                                </p>
                                <div className="opacity-0 group-hover:opacity-100 transition-all hidden sm:flex items-center -mr-2 ml-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openDetails(sub)
                                      setIsEditing(true)
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md"
                                    title="Editar Assinatura"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => handleCancelRecurrence(sub, e)}
                                    className="p-1.5 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-md"
                                    title="Cancelar Assinatura"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm mb-2">
                              <span className="text-gray-500 dark:text-neutral-400 truncate pr-4">
                                {sub.category?.name || 'Sem categoria'}
                              </span>
                              <span className="text-gray-400 dark:text-neutral-500 whitespace-nowrap">
                                {formatCurrency(sub.amount * 12)} /ano
                              </span>
                            </div>
                            
                            <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-primary-500 dark:bg-primary-400 transition-all duration-1000" 
                                style={{ width: `${Math.min(percentageOfTotal, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Detalhes (Bottom Sheet no Mobile) */}
        <Modal
          isOpen={!!selectedSubscription}
          onClose={() => {
            setSelectedSubscription(null)
            setIsEditing(false)
          }}
          title={isEditing ? "Editar Assinatura" : "Detalhes da Assinatura"}
          size="sm"
        >
          {selectedSubscription && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center mt-2">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gray-50 dark:bg-neutral-800 shadow-sm border border-gray-200 dark:border-neutral-700 mb-4">
                  <CategoryIcon 
                    icon={getBrandIcon(selectedSubscription.brandName, selectedSubscription.category?.icon)} 
                    color={selectedSubscription.category?.color || '#9ca3af'} 
                    size="lg" 
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedSubscription.brandName}
                </h2>
                {!isEditing && (
                  <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium uppercase tracking-wider">
                    {selectedSubscription.category?.name || 'Sem categoria'}
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Valor Atual</label>
                    <input 
                      type="number"
                      step="0.01"
                      className="w-full mt-1 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 dark:text-white"
                      value={editForm.amount}
                      onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Categoria</label>
                    <select
                      className="w-full mt-1 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 dark:text-white"
                      value={editForm.categoryId}
                      onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Frequência</label>
                    <select
                      className="w-full mt-1 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 dark:text-white"
                      value={editForm.frequency}
                      onChange={e => setEditForm({ ...editForm, frequency: e.target.value })}
                    >
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                      <option value="trimestral">Trimestral</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-5 space-y-4 border border-gray-100 dark:border-neutral-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Custo Atual</span>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(selectedSubscription.amount)}</span>
                      {selectedSubscription.hasPriceIncrease && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 px-1.5 py-0.5 rounded mt-1">
                          <TrendingUp className="w-3 h-3" /> Aumentou {formatCurrency(selectedSubscription.priceIncreaseAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-neutral-800 w-full" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Custo Anual Projetado</span>
                    <span className="font-semibold text-gray-700 dark:text-neutral-300">
                      {formatCurrency(
                        selectedSubscription.frequency === 'anual' ? selectedSubscription.amount :
                        selectedSubscription.frequency === 'semanal' ? selectedSubscription.amount * 52 :
                        selectedSubscription.frequency === 'trimestral' ? selectedSubscription.amount * 4 :
                        selectedSubscription.amount * 12
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-neutral-800 w-full" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Frequência</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 capitalize">
                      {selectedSubscription.frequency}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-neutral-800 w-full" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Próxima Cobrança (Prevista)</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 px-2 py-1 rounded-md">
                      Dia {new Date(selectedSubscription.date).getUTCDate()}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button 
                      className="w-full py-3 px-4 rounded-xl font-medium text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors border border-transparent"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>
                    <button 
                      className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary-500/20"
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="w-full py-3 px-4 rounded-xl font-medium text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button 
                      className="w-full py-3 px-4 rounded-xl font-medium text-sm text-danger-600 bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/20 dark:hover:bg-danger-900/30 transition-colors flex items-center justify-center gap-2"
                      onClick={() => {
                        handleCancelRecurrence(selectedSubscription)
                        setSelectedSubscription(null)
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                      Remover
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>

        <ConfirmCancelRecurrenceModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={confirmCancelRecurrence}
          transactionDescription={transactionToCancel?.description}
        />
      </div>
    </PageTransition>
  )
}

export default Subscriptions
