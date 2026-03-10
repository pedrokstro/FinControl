import { useMemo, useState } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { CalendarClock, Search, CreditCard, CalendarDays, Wallet } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import CategoryIcon from '@/components/common/CategoryIcon'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/common/PageTransition'
import { haptics } from '@/utils/haptics'

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
  const { transactions, categories } = useFinancialStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Process and group recurring subscriptions
  const subscriptions = useMemo(() => {
    // Filter only recurring expenses
    const recurringExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.isRecurring
    )

    // Group by description and category to avoid duplicates from multiple months
    const uniqueSubsMap = new Map()

    // Sort by date descending to get the most recent ones first
    const sorted = [...recurringExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    sorted.forEach((t) => {
      const key = `${t.description.toLowerCase().trim()}-${t.categoryId}`
      if (!uniqueSubsMap.has(key)) {
        uniqueSubsMap.set(key, t)
      }
    })

    return Array.from(uniqueSubsMap.values()).map(sub => {
      const category = categories.find((c) => c.id === sub.categoryId)
      return {
        ...sub,
        category,
        brandName: sub.description
      }
    }).filter(sub => sub.brandName.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [transactions, categories, searchTerm])

  const monthlyTotal = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)
  const yearlyTotal = monthlyTotal * 12

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

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800">
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

          <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 p-6 rounded-2xl shadow-sm border border-primary-600 text-white relative overflow-hidden">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {subscriptions.map((sub, index) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex flex-col p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => haptics.light()}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-neutral-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors shadow-sm border border-gray-200 dark:border-neutral-700">
                          <CategoryIcon icon={getBrandIcon(sub.brandName, sub.category?.icon)} color={sub.category?.color || '#9ca3af'} size="md" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={sub.brandName}>
                            {sub.brandName}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                            {sub.category?.name || 'Sem categoria'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 font-medium uppercase tracking-wider mb-1">Custo Mensal</p>
                          <p className="font-bold text-gray-900 dark:text-white text-lg leading-none">
                            {formatCurrency(sub.amount)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Custo Anual</p>
                          <p className="font-semibold text-gray-500 dark:text-neutral-400 text-sm leading-none">
                            {formatCurrency(sub.amount * 12)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Subscriptions
