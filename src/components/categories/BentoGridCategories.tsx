import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Pencil,
  Trash2,
  Target,
  GripVertical,
  RotateCcw,
  Sparkles,
  Receipt,
  Percent
} from 'lucide-react'
import CategoryIcon from '@/components/common/CategoryIcon'
import BudgetProgressBar from '@/components/common/BudgetProgressBar'
import { type IconName } from '@/utils/iconMapping'
import { haptics } from '@/utils/haptics'

export interface CategoryItem {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  userId?: string
}

interface BentoGridCategoriesProps {
  categories: CategoryItem[]
  budgets: any[]
  currentMonthTransactions: any[]
  onOpenModal: (category?: CategoryItem) => void
  onDelete: (category: CategoryItem) => void
  onOpenBudgetModal: (category: CategoryItem) => void
  getCategorySpent: (categoryId: string) => number
}

const STORAGE_KEY = 'fincontrol_category_bento_order'

export const BentoGridCategories: React.FC<BentoGridCategoriesProps> = ({
  categories,
  budgets,
  currentMonthTransactions,
  onOpenModal,
  onDelete,
  onOpenBudgetModal,
  getCategorySpent,
}) => {
  // Ordenação local com persistência
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  // Total geral de despesas e receitas para cálculo de porcentagens
  const totals = useMemo(() => {
    let expense = 0
    let income = 0
    currentMonthTransactions.forEach((t) => {
      if (t.type === 'expense') expense += t.amount
      else if (t.type === 'income') income += t.amount
    })
    return { expense, income }
  }, [currentMonthTransactions])

  // Contagem de transações por categoria
  const transactionCounts = useMemo(() => {
    const counts = new Map<string, number>()
    currentMonthTransactions.forEach((t) => {
      if (t.categoryId) {
        counts.set(t.categoryId, (counts.get(t.categoryId) || 0) + 1)
      }
    })
    return counts
  }, [currentMonthTransactions])

  // Lista ordenada de categorias
  const sortedCategories = useMemo(() => {
    if (orderedIds.length === 0) return categories

    const idMap = new Map(categories.map((c) => [c.id, c]))
    const result: CategoryItem[] = []

    // Adiciona na ordem salva
    orderedIds.forEach((id) => {
      const item = idMap.get(id)
      if (item) {
        result.push(item)
        idMap.delete(id)
      }
    })

    // Adiciona novas categorias que ainda não estavam no storage
    idMap.forEach((item) => {
      result.push(item)
    })

    return result
  }, [categories, orderedIds])

  const handleDragStart = (id: string, e: React.DragEvent) => {
    setDraggedId(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    haptics.light()
  }

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverId !== targetId) {
      setDragOverId(targetId)
    }
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const currentOrder = sortedCategories.map((c) => c.id)
    const fromIndex = currentOrder.indexOf(draggedId)
    const toIndex = currentOrder.indexOf(targetId)

    if (fromIndex !== -1 && toIndex !== -1) {
      const newOrder = [...currentOrder]
      const [moved] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, moved)

      setOrderedIds(newOrder)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder))
      } catch (err) {
        console.error('Erro ao salvar ordem das categorias:', err)
      }
      haptics.medium()
    }

    setDraggedId(null)
    setDragOverId(null)
  }

  const handleResetOrder = () => {
    setOrderedIds([])
    localStorage.removeItem(STORAGE_KEY)
    haptics.light()
  }

  const hasCustomOrder = orderedIds.length > 0

  return (
    <div className="space-y-4">
      {/* Barra de Ações do Bento Grid */}
      <div className="flex items-center justify-between px-1 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="font-medium">
            Arraste os cartões para personalizar a disposição
          </span>
        </div>

        {hasCustomOrder && (
          <button
            onClick={handleResetOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition-all text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Ordem</span>
          </button>
        )}
      </div>

      {/* Grid Bento Responsivo com Suporte a Drag and Drop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-auto">
        <AnimatePresence>
          {sortedCategories.map((category, index) => {
            const spent = getCategorySpent(category.id)
            const budget = budgets.find((b) => b.categoryId === category.id)
            const txCount = transactionCounts.get(category.id) || 0
            const totalForType = category.type === 'expense' ? totals.expense : totals.income
            const pctOfTotal = totalForType > 0 ? (spent / totalForType) * 100 : 0

            // Definir se é um cartão expandido no Bento Grid (ex: itens principais ou com orçamento)
            const isFeatured = (index === 0 || !!budget) && index < 3
            const isBeingDragged = draggedId === category.id
            const isDropTarget = dragOverId === category.id && !isBeingDragged

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isBeingDragged ? 0.4 : 1,
                  scale: isBeingDragged ? 0.98 : 1,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                draggable
                onDragStart={(e) => handleDragStart(category.id, e as any)}
                onDragOver={(e) => handleDragOver(e as any, category.id)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e as any, category.id)}
                className={`group relative rounded-3xl p-6 transition-all duration-300 select-none cursor-grab active:cursor-grabbing border ${
                  isFeatured ? 'sm:col-span-2' : 'col-span-1'
                } ${
                  isDropTarget
                    ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50/20 dark:bg-primary-950/30'
                    : 'bg-white dark:bg-neutral-900/90 border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm hover:shadow-md'
                }`}
                style={{
                  boxShadow: `0 10px 30px -10px ${category.color}15`,
                }}
              >
                {/* Linha de Destaque Superior de Cor */}
                <div
                  className="absolute top-0 left-8 right-8 h-1 rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: category.color }}
                />

                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Ícone da Categoria */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner"
                      style={{ backgroundColor: `${category.color}18` }}
                    >
                      <CategoryIcon
                        icon={category.icon as IconName}
                        color={category.color}
                        size="lg"
                      />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-display text-neutral-900 dark:text-white leading-tight">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {category.type === 'income' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                            <TrendingUp className="w-3 h-3" />
                            Receita
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/40">
                            <TrendingDown className="w-3 h-3" />
                            Despesa
                          </span>
                        )}

                        {txCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                            <Receipt className="w-3 h-3" />
                            {txCount} transaç{txCount === 1 ? 'ão' : 'ões'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas & Alça de Drag */}
                  <div className="flex items-center gap-1">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => onOpenModal(category)}
                        className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                        title="Editar Categoria"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(category)}
                        className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Excluir Categoria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Alça de Arrastar */}
                    <div
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-grab active:cursor-grabbing rounded-lg"
                      title="Arraste para reorganizar"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Métricas do Bento Grid */}
                <div className="pt-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {category.type === 'expense' ? 'Gasto no Mês' : 'Recebido no Mês'}
                    </span>
                    {totalForType > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                        <Percent className="w-3 h-3" />
                        {pctOfTotal.toFixed(1)}% do total
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-black font-display tracking-tight text-neutral-900 dark:text-white mb-3">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(spent)}
                  </div>

                  {/* Orçamento / Metas */}
                  {category.type === 'expense' && (
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                      {budget ? (
                        <div>
                          <BudgetProgressBar limit={budget.amount} spent={spent} />
                          <button
                            type="button"
                            onClick={() => onOpenBudgetModal(category)}
                            className="mt-2 text-xs font-bold text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors w-full text-right"
                          >
                            Ajustar Limite
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenBudgetModal(category)}
                          className="w-full py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center gap-2 border border-neutral-200/60 dark:border-neutral-700/60 transition-colors"
                        >
                          <Target className="w-3.5 h-3.5 text-primary-500" />
                          <span>Definir Teto de Gastos</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BentoGridCategories
