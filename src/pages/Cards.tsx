import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  CreditCard as CardIcon, 
  Edit2, 
  Trash2, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react'
import { useFinancialStore } from '@/store/financialStore'
import PageTransition from '@/components/common/PageTransition'
import { haptics } from '@/utils/haptics'
import { CreditCard as CreditCardType, Transaction } from '@/types'
import CreditCardModal from '@/components/modals/CreditCardModal'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import BrandIcon from '@/components/common/BrandIcon'

const Cards = () => {
  const { creditCards, fetchCreditCards, transactions, currentMonthTransactions, deleteCreditCard, isLoading } = useFinancialStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCardType | null>(null)
  const [cardToDelete, setCardToDelete] = useState<CreditCardType | null>(null)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  useEffect(() => {
    fetchCreditCards()
  }, [fetchCreditCards])

  const handleAddCard = () => {
    haptics.medium()
    setEditingCard(null)
    setIsModalOpen(true)
  }

  const handleEditCard = (card: CreditCardType) => {
    haptics.medium()
    setEditingCard(card)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (card: CreditCardType) => {
    haptics.warning()
    setCardToDelete(card)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (cardToDelete) {
      await deleteCreditCard(cardToDelete.id)
      setIsDeleteModalOpen(false)
      setCardToDelete(null)
    }
  }

  const toggleExpand = (cardId: string) => {
    haptics.light()
    setExpandedCardId(expandedCardId === cardId ? null : cardId)
  }

  // Calculate current invoice breakdown per card
  const getCardBreakdown = (cardId: string) => {
    const cardTransactions = currentMonthTransactions.filter(
      t => t.creditCardId === cardId && t.type === 'expense' && !t.isCancelled
    )

    const total = cardTransactions.reduce((sum, t) => sum + t.amount, 0)
    const subscriptions = cardTransactions
      .filter(t => t.isRecurring)
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      total,
      subscriptions,
      casual: total - subscriptions
    }
  }

  // Get active subscriptions for a card
  const getCardSubscriptions = (cardId: string) => {
    const subs = transactions.filter(
      t => t.creditCardId === cardId && t.isRecurring && !t.isCancelled && t.type === 'expense'
    )
    
    // Group by description to get the most recent amount and avoid historical noise
    const subMap = new Map<string, Transaction>()
    subs.forEach(s => {
      const key = `${s.description.toLowerCase().trim()}`
      if (!subMap.has(key) || new Date(s.date) > new Date(subMap.get(key)!.date)) {
        subMap.set(key, s)
      }
    })
    
    return Array.from(subMap.values())
  }

  // Calculate alert for due date proximity
  const getDueDateStatus = (dueDay: number) => {
    if (!dueDay) return null
    
    const now = new Date()
    const today = now.getDate()
    
    // Simplistic check for current month
    const diff = dueDay - today
    
    if (diff === 0) return { label: 'Vence Hoje', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' }
    if (diff > 0 && diff <= 5) return { label: `Vence em ${diff} dias`, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' }
    if (diff < 0) return { label: 'Vencido', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' }
    
    return null
  }

  // Estimate next invoice based on active subscriptions
  const getNextInvoiceEstimate = (cardId: string) => {
    const subs = transactions.filter(
      t => t.creditCardId === cardId && t.isRecurring && !t.isCancelled && t.type === 'expense'
    )
    
    // Group by description to avoid historical duplicates in the same month calculation
    const uniqueSubs = new Map()
    subs.forEach(s => {
      const key = `${s.description.toLowerCase().trim()}-${s.categoryId}`
      if (!uniqueSubs.has(key)) {
        uniqueSubs.set(key, s.amount)
      }
    })
    
    let total = 0
    uniqueSubs.forEach(amount => total += amount)
    return total
  }

  const getCardGradient = (brand: string) => {
    const b = brand.toLowerCase()
    if (b.includes('visa')) return 'from-blue-600 to-indigo-700'
    if (b.includes('master')) return 'from-orange-500 to-red-600'
    if (b.includes('nubank')) return 'from-purple-600 to-indigo-800'
    if (b.includes('inter')) return 'from-orange-400 to-orange-600'
    if (b.includes('elo')) return 'from-sky-400 via-blue-500 to-indigo-600'
    return 'from-gray-700 to-gray-900'
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pb-32 md:pb-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <CardIcon className="w-8 h-8 text-primary-500" />
              Meus Cartões
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Cadastre suas faturas para acompanhar os gastos e registrar na despesa de fatura.
            </p>
          </div>
          
          <button
            onClick={handleAddCard}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Novo Cartão
          </button>
        </header>

        {isLoading && creditCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Carregando seus cartões...</p>
          </div>
        ) : creditCards.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-neutral-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CardIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sem cartões cadastrados</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Adicione seu primeiro cartão para organizar gastos futuros e assinaturas recorrentes sem somar duas vezes.
            </p>
            <button
              onClick={handleAddCard}
              className="bg-primary-50 text-primary-600 px-6 py-2 rounded-xl font-bold hover:bg-primary-100 transition-colors"
            >
              Adicionar Agora
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {creditCards.map((card, index) => {
                const { total: spent, subscriptions, casual } = getCardBreakdown(card.id)
                const cardSubs = getCardSubscriptions(card.id)
                const hasLimit = Number(card.limit) > 0
                const progress = hasLimit ? Math.min((spent / Number(card.limit)) * 100, 100) : 0
                const progressColor = progress > 90 ? 'bg-red-500' : progress > 75 ? 'bg-yellow-500' : 'bg-primary-500'
                const dueStatus = getDueDateStatus(card.dueDay)
                const cardGradient = getCardGradient(card.brand)
                const isExpanded = expandedCardId === card.id

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-neutral-800 relative group overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500"
                  >
                    {/* Background Glossy Effect */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${cardGradient.split(' ')[0]} ${cardGradient.split(' ')[1]} blur-3xl opacity-20 rounded-full group-hover:scale-150 transition-transform duration-700`} />
                    
                    <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10 translate-y-0 md:translate-y-[-10px] md:group-hover:translate-y-0">
                      <button
                        onClick={() => handleEditCard(card)}
                        className="p-2.5 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md shadow-sm border border-gray-100 dark:border-neutral-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(card)}
                        className="p-2.5 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md shadow-sm border border-gray-100 dark:border-neutral-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-10 bg-gray-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden p-2 shadow-inner border border-gray-100 dark:border-neutral-700">
                        <BrandIcon brand={card.brand} className="h-full w-auto object-contain" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white truncate pr-16">{card.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{card.brand}</span>
                          {dueStatus && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${dueStatus.color} animate-pulse-slow`}>
                              {dueStatus.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fatura / Limite section */}
                    <div className="bg-gray-50/50 dark:bg-neutral-800/30 backdrop-blur-sm rounded-[24px] p-5 mb-4 border border-gray-100/50 dark:border-white/5 shadow-inner">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fatura Atual</p>
                          <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spent)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Limite Livre</p>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                            {hasLimit 
                              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(card.limit) - spent)
                              : '∞'}
                          </p>
                        </div>
                      </div>

                      {/* Breakdown Visual */}
                      {spent > 0 && (
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/40" />
                              Assinaturas
                            </span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscriptions)}
                            </span>
                          </div>
                          
                          <div className="w-full h-2.5 bg-gray-200/50 dark:bg-neutral-700/50 rounded-full overflow-hidden flex p-0.5 border border-white/10 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(subscriptions / spent) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" 
                            />
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(casual / spent) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-sky-500 to-sky-300 rounded-full ml-0.5 opacity-80" 
                            />
                          </div>
                        </div>
                      )}
                      
                      {hasLimit && (
                        <div className="pt-4 border-t border-gray-200/50 dark:border-white/5">
                          <div className="flex justify-between text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">
                            <span>Uso do Limite</span>
                            <span className={progress > 90 ? 'text-red-500' : ''}>{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200/50 dark:bg-neutral-700/50 rounded-full h-1.5 overflow-hidden shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1.2, ease: "circOut" }}
                              className={`h-full rounded-full ${progressColor} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expandable Details Button */}
                    <button
                      onClick={() => toggleExpand(card.id)}
                      className="flex items-center justify-center gap-2 w-full py-2 mb-4 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800 text-gray-400 hover:text-primary-600 hover:border-primary-200 dark:hover:border-primary-900/50 transition-all text-xs font-bold"
                    >
                      {isExpanded ? (
                        <>
                          Ocultar Detalhes <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Ver Assinaturas e Detalhes <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 mb-6 pt-2">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <Zap className="w-3 h-3 text-yellow-500" />
                              Assinaturas Vinculadas
                            </h4>
                            {cardSubs.length > 0 ? (
                              <div className="space-y-2">
                                {cardSubs.map((sub) => (
                                  <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center shadow-sm border border-gray-100 dark:border-neutral-700">
                                        <span className="text-lg font-black text-primary-500">{sub.description.slice(0, 1).toUpperCase()}</span>
                                      </div>
                                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{sub.description}</span>
                                    </div>
                                    <span className="text-sm font-black text-gray-900 dark:text-white">
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sub.amount)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic py-2">Nenhuma assinatura recorrente.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dates section */}
                    <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-neutral-800 pt-5 mt-auto">
                      <div className="flex gap-4">
                        {card.closingDay && (
                          <div className="flex items-center gap-3 flex-1 bg-gray-50/50 dark:bg-neutral-800/30 p-2 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-colors">
                            <div className="w-9 h-9 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fecha</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">Dia {card.closingDay}</p>
                            </div>
                          </div>
                        )}
                        {card.dueDay && (
                          <div className="flex items-center gap-3 flex-1 bg-red-50/30 dark:bg-red-900/10 p-2 rounded-2xl border border-transparent hover:border-red-100 dark:hover:border-red-900/20 transition-colors">
                            <div className="w-9 h-9 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm">
                              <DollarSign className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vence</p>
                              <p className="text-sm font-bold text-red-500 dark:text-red-400">Dia {card.dueDay}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Next Invoice Projection */}
                      <motion.div 
                        className="bg-indigo-600 dark:bg-indigo-600 rounded-[20px] p-4 flex items-center justify-between shadow-lg shadow-indigo-500/20 border border-indigo-400/20"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                            <TrendingUp className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-xs font-bold text-indigo-50 tracking-tight">Próxima Fatura (Est.)</span>
                        </div>
                        <span className="text-base font-black text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getNextInvoiceEstimate(card.id))}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <CreditCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          card={editingCard}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Excluir Cartão"
          description={
            cardToDelete 
              ? `Tem certeza que deseja excluir o cartão "${cardToDelete.name}"? As transações vinculadas a ele ficarão sem cartão referenciado.`
              : 'Tem certeza que deseja excluir?'
          }
          itemName={cardToDelete?.name}
          isLoading={isLoading}
        />
      </div>
    </PageTransition>
  )
}

export default Cards
