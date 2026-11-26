import Modal from '@/components/common/Modal'
import CategoryIcon from '@/components/common/CategoryIcon'
import { type IconName } from '@/utils/iconMapping'
import { Category, Transaction } from '@/types'

interface MonthTransactionsListModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'income' | 'expense'
  transactions: Transaction[]
  categories: Category[]
  totalAmount: number
  formatCurrency: (value: number) => string
  formatDate: (value: string) => string
}

const MonthTransactionsListModal = ({
  isOpen,
  onClose,
  type,
  transactions,
  categories,
  totalAmount,
  formatCurrency,
  formatDate,
}: MonthTransactionsListModalProps) => {
  const isIncome = type === 'income'
  const title = isIncome ? 'Receitas do Mês' : 'Despesas do Mês'
  const countLabel = isIncome
    ? transactions.length === 1
      ? 'receita'
      : 'receitas'
    : transactions.length === 1
      ? 'despesa'
      : 'despesas'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={`${transactions.length} ${countLabel} • ${formatCurrency(totalAmount)}`}
      size="lg"
      footer={
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] font-medium text-sm cursor-pointer"
          >
            Fechar
          </button>
        </div>
      }
    >
      <div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
            {isIncome ? 'Nenhuma receita registrada neste mês.' : 'Nenhuma despesa registrada neste mês.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {transactions.map((transaction) => {
              const category = categories.find((cat) => cat.id === transaction.categoryId)
              return (
                <div key={transaction.id} className="py-3 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? 'bg-success-50 dark:bg-success-900/20'
                        : 'bg-danger-50 dark:bg-danger-900/20'
                    }`}
                  >
                    <CategoryIcon
                      icon={(category?.icon as IconName) || 'Wallet'}
                      color={category?.color || (isIncome ? '#22c55e' : '#ef4444')}
                      size="md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      {category?.name || 'Sem categoria'} • {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`font-bold tabular-figures ${
                        isIncome
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-danger-600 dark:text-danger-400'
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default MonthTransactionsListModal
