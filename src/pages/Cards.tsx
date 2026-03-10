import { useEffect, useState } from 'react'
import { Plus, CreditCard as CardIcon, Edit2, Trash2, Calendar, DollarSign } from 'lucide-react'
import { useFinancialStore } from '@/store/financialStore'
import PageTransition from '@/components/common/PageTransition'
import { haptics } from '@/utils/haptics'
import { CreditCard } from '@/types'
import CreditCardModal from '@/components/modals/CreditCardModal'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import BrandIcon from '@/components/common/BrandIcon'

const Cards = () => {
  const { creditCards, fetchCreditCards, currentMonthTransactions, deleteCreditCard, isLoading } = useFinancialStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)
  const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null)

  useEffect(() => {
    fetchCreditCards()
  }, [fetchCreditCards])

  const handleAddCard = () => {
    haptics.medium()
    setEditingCard(null)
    setIsModalOpen(true)
  }

  const handleEditCard = (card: CreditCard) => {
    haptics.medium()
    setEditingCard(card)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (card: CreditCard) => {
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

  // Calculate current invoice amount per card
  const getCardSpent = (cardId: string) => {
    return currentMonthTransactions
      .filter(t => t.creditCardId === cardId && t.type === 'expense' && !t.isCancelled)
      .reduce((sum, t) => sum + t.amount, 0)
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map(card => {
              const spent = getCardSpent(card.id)
              const hasLimit = Number(card.limit) > 0
              const progress = hasLimit ? Math.min((spent / Number(card.limit)) * 100, 100) : 0
              const progressColor = progress > 90 ? 'bg-red-500' : progress > 75 ? 'bg-yellow-500' : 'bg-primary-500'

              return (
                <div key={card.id} className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800 relative group overflow-hidden">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditCard(card)}
                      className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(card)}
                      className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gray-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center overflow-hidden p-1.5">
                    <BrandIcon brand={card.brand} className="h-8 w-auto max-w-[52px]" />
                  </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{card.name}</h3>
                      <p className="text-sm text-gray-500">{card.brand}</p>
                    </div>
                  </div>

                  {/* Fatura / Limite section */}
                  <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-4 mb-4">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fatura Atual</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spent)}
                        </p>
                      </div>
                      {hasLimit && (
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Limite Restante</p>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(card.limit) - spent)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {hasLimit && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Limite Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(card.limit))}</span>
                          <span>{progress.toFixed(0)}% Utilizado</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${progressColor}`} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dates section */}
                  <div className="flex gap-4 border-t border-gray-100 dark:border-neutral-800 pt-4 mt-2">
                    {card.closingDay && (
                      <div className="flex items-center gap-2 flex-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Fechamento</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Dia {card.closingDay}</p>
                        </div>
                      </div>
                    )}
                    {card.dueDay && (
                      <div className="flex items-center gap-2 flex-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Vencimento</p>
                          <p className="text-sm font-semibold text-red-500 dark:text-red-400">Dia {card.dueDay}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
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
