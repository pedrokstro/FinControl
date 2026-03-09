import { formatCurrency } from '@/utils/helpers'

interface BudgetProgressBarProps {
    spent: number
    limit: number
}

const BudgetProgressBar = ({ spent, limit }: BudgetProgressBarProps) => {
    const percentage = limit > 0 ? (spent / limit) * 100 : 0

    // Cores dinâmicas com base no status (percentual de consumo)
    let statusColor = 'bg-success-500' // < 70%
    let statusTextColor = 'text-success-700 dark:text-success-400'
    let label = 'Sustentável'

    if (percentage >= 90) {
        statusColor = 'bg-danger-500'
        statusTextColor = 'text-danger-700 dark:text-danger-400'
        label = 'Crítico'
    } else if (percentage >= 70) {
        statusColor = 'bg-amber-500'
        statusTextColor = 'text-amber-700 dark:text-amber-400'
        label = 'Atenção'
    }

    // Previne a barra de passar de 100% visualmente
    const visualPercentage = Math.min(percentage, 100)

    return (
        <div className="mt-4 flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600 dark:text-neutral-400">
                    Gasto: <strong className="text-gray-900 dark:text-white">{formatCurrency(spent)}</strong>
                </span>
                <span className="text-gray-600 dark:text-neutral-400">
                    Limite: <strong className="text-gray-900 dark:text-white">{formatCurrency(limit)}</strong>
                </span>
            </div>

            <div className="relative w-full h-2.5 sm:h-3 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                    style={{ width: `${visualPercentage}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-xs mt-0.5">
                <span className={`font-semibold ${statusTextColor}`}>
                    {label}
                </span>
                <span className="text-gray-500 dark:text-neutral-500 font-medium">
                    {percentage.toFixed(0)}%
                </span>
            </div>
        </div>
    )
}

export default BudgetProgressBar
