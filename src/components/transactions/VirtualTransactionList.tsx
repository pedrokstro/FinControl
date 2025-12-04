import { memo } from 'react'
import VirtualList from '../common/VirtualList'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import CategoryIcon from '@/components/common/CategoryIcon'
import { Pencil, Trash2 } from 'lucide-react'

// Tipos locais (ajustar conforme seu projeto)
interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category?: Category
}

interface VirtualTransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
  formatCurrency: (value: number) => string
}

/**
 * Lista virtualizada de transações para melhor performance
 * Renderiza apenas as transações visíveis na tela
 */
const VirtualTransactionList = memo<VirtualTransactionListProps>(
  ({ transactions, onEdit, onDelete, formatCurrency }) => {
    const renderTransaction = (transaction: Transaction, index: number) => {
      const isIncome = transaction.type === 'income'
      
      return (
        <div
          className={`flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors ${
            index === 0 ? 'rounded-t-lg' : ''
          }`}
        >
          {/* Ícone e Informações */}
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isIncome 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <CategoryIcon
                icon={transaction.category?.icon || 'Wallet'}
                className={`w-6 h-6 ${
                  isIncome 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {transaction.description}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                <span>{transaction.category?.name || 'Sem categoria'}</span>
                <span>•</span>
                <span>
                  {format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>

          {/* Valor e Ações */}
          <div className="flex items-center gap-4">
            <span className={`text-lg font-bold ${
              isIncome 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(transaction)}
                className="p-2 text-gray-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(transaction)}
                className="p-2 text-gray-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Se houver poucas transações, renderizar normalmente
    if (transactions.length < 20) {
      return (
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
          {transactions.map((transaction, index) => (
            <div key={transaction.id}>
              {renderTransaction(transaction, index)}
            </div>
          ))}
        </div>
      )
    }

    // Para muitas transações, usar virtualização
    return (
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
        <VirtualList
          items={transactions}
          height={600}
          itemHeight={80}
          renderItem={renderTransaction}
          overscan={3}
        />
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Comparação otimizada
    return (
      prevProps.transactions.length === nextProps.transactions.length &&
      prevProps.transactions[0]?.id === nextProps.transactions[0]?.id &&
      prevProps.transactions[prevProps.transactions.length - 1]?.id === 
        nextProps.transactions[nextProps.transactions.length - 1]?.id
    )
  }
)

VirtualTransactionList.displayName = 'VirtualTransactionList'

export default VirtualTransactionList
