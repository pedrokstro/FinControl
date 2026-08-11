import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useFinancialStore } from '@/store/financialStore'
import { useAuthStore } from '@/store/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  Crown,
  Sparkles,
  ArrowRight,
  Grid3x3,
  List,
  LayoutGrid,
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import IconPicker from '@/components/common/IconPicker'
import CategoryIcon from '@/components/common/CategoryIcon'
import ColorPicker from '@/components/common/ColorPicker'
import BentoGridCategories from '@/components/categories/BentoGridCategories'
import { type IconName } from '@/utils/iconMapping'
import PageTransition from '@/components/common/PageTransition'
import { motion, AnimatePresence, useDragControls, type Variants } from 'framer-motion'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import BudgetModal from '@/components/modals/BudgetModal'
import BudgetProgressBar from '@/components/common/BudgetProgressBar'
import { haptics } from '@/utils/haptics'
import { Target } from 'lucide-react'
import { useIsMobile } from '@/hooks'

const categorySchema = z.object({
  name: z.string().min(3, 'Nome deve ter no minimo 3 caracteres'),
  type: z.enum(['income', 'expense']),
  color: z.string().min(1, 'Cor e obrigatoria').regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal'),
  icon: z.string().min(1, 'Icone e obrigatorio'),
})

type CategoryFormData = z.infer<typeof categorySchema>

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
}

const Categories = () => {
  const { categories, budgets, currentMonthTransactions, addCategory, updateCategory, deleteCategory, fetchCategories } = useFinancialStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobile()
  const dragControls = useDragControls()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string
    name: string
    type: 'income' | 'expense'
    color: string
  } | null>(null)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)

  // Budget states
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [categoryForBudget, setCategoryForBudget] = useState<any>(null)

  // View mode state
  const [viewMode, setViewMode] = useState<'bento' | 'grid' | 'list' | null>(null)
  const [isViewModeLoading, setIsViewModeLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)

  // Obter status premium do usuário autenticado
  const { user } = useAuthStore()
  const isPremium = user?.isPremium || false

  // Debug: Log do status premium
  useEffect(() => {
    console.log('🔍 [Categories] User:', user)
    console.log('🔍 [Categories] isPremium:', isPremium)
  }, [user, isPremium])

  // Carregar preferência de visualização do backend
  useEffect(() => {
    const loadViewMode = async () => {
      try {
        const { default: userPreferenceService } = await import('@/services/userPreference.service')
        const mode = await userPreferenceService.get('categoriesViewMode')
        if (mode && (mode === 'bento' || mode === 'grid' || mode === 'list')) {
          setViewMode(mode as 'bento' | 'grid' | 'list')
        } else {
          setViewMode('bento')
        }
      } catch (error) {
        console.error('Erro ao carregar modo de visualização:', error)
        setViewMode('bento')
      } finally {
        setIsViewModeLoading(false)
      }
    }

    loadViewMode()
  }, [])

  // Garantir que categorias sejam carregadas quando a página abre
  useEffect(() => {
    const loadCategories = async () => {
      if (categories.length > 0) {
        setIsCategoriesLoading(false)
        return
      }
      try {
        setIsCategoriesLoading(true)
        await fetchCategories()
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      } finally {
        setIsCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [categories.length, fetchCategories])

  // Checar se deve abrir o modal via parametro na URL
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenModal()

      // Limpar parametro da URL sem causar re-render na pagina inteira
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('add')
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  // Salvar preferência de visualização no backend
  const handleViewModeChange = async (mode: 'bento' | 'grid' | 'list') => {
    setViewMode(mode)

    try {
      const { default: userPreferenceService } = await import('@/services/userPreference.service')
      await userPreferenceService.set('categoriesViewMode', mode)
    } catch (error) {
      console.error('Erro ao salvar modo de visualização:', error)
    }
  }

  // Obter cores já utilizadas (exceto a categoria sendo editada)
  const usedColors = useMemo(() => {
    return categories
      .filter(cat => cat.id !== editingId)
      .map(cat => cat.color)
  }, [categories, editingId])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: 'expense',
      color: '#22c55e',
      icon: 'DollarSign',
    },
  })

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')
  const selectedType = watch('type')

  const filteredCategories = categories.filter(
    (cat) => filterType === 'all' || cat.type === filterType
  )

  const getCategorySpent = (categoryId: string) => {
    return currentMonthTransactions
      .filter(t => t.categoryId === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const handleOpenBudgetModal = (category: any) => {
    setCategoryForBudget(category)
    setShowBudgetModal(true)
  }

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingId(category.id)
      reset({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      })
    } else {
      setEditingId(null)
      reset({
        name: '',
        type: 'expense',
        color: '#ef4444',
        icon: 'Package',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    reset()
  }

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingId) {
        await updateCategory(editingId, data)
      } else {
        await addCategory({ ...data, userId: '1' })
      }
      haptics.success()
      handleCloseModal()
    } catch (error) {
      haptics.error()
      console.error('Erro ao salvar categoria:', error)
    }
  }

  const handleDelete = (category: {
    id: string
    name: string
    type: 'income' | 'expense'
    color: string
  }) => {
    haptics.warning()
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    if (isDeletingCategory) return
    setShowDeleteModal(false)
    setCategoryToDelete(null)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      setIsDeletingCategory(true)
      await deleteCategory(categoryToDelete.id)
      haptics.success()
    } catch (error) {
      haptics.error()
      console.error('Erro ao excluir categoria:', error)
    } finally {
      setIsDeletingCategory(false)
      setShowDeleteModal(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <PageTransition>
      <div className="responsive-page">
        {/* Header */}
        <div className="responsive-header gap-4">
          <div className="hidden sm:block">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categorias</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              Organize suas transações em categorias personalizadas
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {/* Toggle View Mode */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl">
              <button
                onClick={() => handleViewModeChange('bento')}
                disabled={isViewModeLoading}
                className={`p-2 rounded-lg transition-all ${viewMode === 'bento'
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                  } ${isViewModeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                title="Visualização Bento Grid (com arraste)"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleViewModeChange('grid')}
                disabled={isViewModeLoading}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                  } ${isViewModeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                title="Visualização em Grade"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                disabled={isViewModeLoading}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                  } ${isViewModeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                title="Visualização em Lista"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto rounded-full shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nova Categoria
            </button>
          </div>
        </div>

        {/* Premium Banner */}
        {!isPremium && (
          <div className="mb-6">
            <button
              onClick={() => navigate('/plans')}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl group relative overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">Torne-se Premium</h3>
                      <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
                    </div>
                    <p className="text-white text-opacity-95 text-sm">
                      Desbloqueie <strong>emojis exclusivos</strong>, personalização avançada e muito mais!
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <div className="text-right">
                    <p className="text-xs text-white text-opacity-80">A partir de</p>
                    <p className="text-2xl font-bold text-white">R$ 14,99<span className="text-sm font-normal">/mês</span></p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                </div>

                <div className="md:hidden">
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="card">
          <div className="mobile-scroll-buttons">
            <button
              onClick={() => setFilterType('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm whitespace-nowrap ${filterType === 'all'
                ? 'bg-primary-600 dark:bg-primary-500 text-white ring-2 ring-primary-600/20 dark:ring-primary-400/20'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
            >
              Todas ({categories.length})
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm whitespace-nowrap ${filterType === 'income'
                ? 'bg-success-600 dark:bg-success-500 text-white ring-2 ring-success-600/20 dark:ring-success-400/20'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
            >
              Receitas ({categories.filter(c => c.type === 'income').length})
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm whitespace-nowrap ${filterType === 'expense'
                ? 'bg-danger-600 dark:bg-danger-500 text-white ring-2 ring-danger-600/20 dark:ring-danger-400/20'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
            >
              Despesas ({categories.filter(c => c.type === 'expense').length})
            </button>
          </div>
        </div>

        {(isViewModeLoading || isCategoriesLoading) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="card animate-pulse border border-transparent dark:border-neutral-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-neutral-800" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800" />
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800" />
                  </div>
                </div>
                <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {viewMode === 'bento' && !isViewModeLoading && !isCategoriesLoading && (
          <BentoGridCategories
            categories={filteredCategories}
            budgets={budgets}
            currentMonthTransactions={currentMonthTransactions}
            onOpenModal={handleOpenModal}
            onDelete={handleDelete}
            onOpenBudgetModal={handleOpenBudgetModal}
            getCategorySpent={getCategorySpent}
          />
        )}

        {viewMode === 'grid' && !isViewModeLoading && !isCategoriesLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="card hover:shadow-md dark:hover:shadow-dark transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <CategoryIcon
                      icon={category.icon as IconName}
                      color={category.color}
                      size="lg"
                    />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>

                <div className="flex items-center gap-2">
                  {category.type === 'income' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                      <TrendingUp className="w-3.5 h-3.5 animate-arrow-up" />
                      Receita
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300">
                      <TrendingDown className="w-3.5 h-3.5 animate-arrow-down" />
                      Despesa
                    </span>
                  )}
                </div>

                {/* Integração do Budget ProgressBar apenas para Despesas */}
                {category.type === 'expense' && budgets.find(b => b.categoryId === category.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                    <BudgetProgressBar
                      limit={budgets.find(b => b.categoryId === category.id)!.amount}
                      spent={getCategorySpent(category.id)}
                    />
                  </div>
                )}

                {/* Botão de Orçamento - Fica visível sempre que for Despesa, ajudando na gamificação */}
                {category.type === 'expense' && !budgets.find(b => b.categoryId === category.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                    <button
                      onClick={() => handleOpenBudgetModal(category)}
                      className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 w-full justify-center py-1.5 transition-colors"
                    >
                      <Target className="w-4 h-4" />
                      Definir Orçamento
                    </button>
                  </div>
                )}
                {/* Modificar para abrir edição de orçamento se ele existir */}
                {category.type === 'expense' && budgets.find(b => b.categoryId === category.id) && (
                  <button
                    onClick={() => handleOpenBudgetModal(category)}
                    className="mt-2 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors w-full text-center"
                  >
                    Ajustar Limite
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && !isViewModeLoading && !isCategoriesLoading && (
          <div className="bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 shadow-md rounded-2xl overflow-hidden mb-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-150 dark:divide-neutral-800/60"
            >
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between py-3.5 pl-7 pr-6 hover:bg-gray-50/40 dark:hover:bg-neutral-850/20 transition-all duration-300 gap-4"
                >
                  {/* Indicador de Tipo Lateral (estilo Sidebar/Transações) */}
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 group-hover:h-10 rounded-r-full transition-all duration-300 ${
                    category.type === 'income'
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                      : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`} />

                  <div className="flex items-center gap-4 flex-1 min-w-0 transition-transform duration-300 group-hover:translate-x-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <CategoryIcon
                        icon={category.icon as IconName}
                        color={category.color}
                        size="lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        {category.type === 'income' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 dark:bg-success-950/20 text-success-700 dark:text-success-300 border border-success-100/50 dark:border-success-900/10">
                            <TrendingUp className="w-3 h-3 animate-arrow-up" />
                            Receita
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-50 dark:bg-danger-950/20 text-danger-700 dark:text-danger-300 border border-danger-100/50 dark:border-danger-900/10">
                            <TrendingDown className="w-3 h-3 animate-arrow-down" />
                            Despesa
                          </span>
                        )}
                      </div>

                      {category.type === 'expense' && budgets.find(b => b.categoryId === category.id) && (
                        <div className="mt-3">
                          <BudgetProgressBar
                            limit={budgets.find(b => b.categoryId === category.id)!.amount}
                            spent={getCategorySpent(category.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {category.type === 'expense' && (
                      <button
                        onClick={() => handleOpenBudgetModal(category)}
                        className="w-8.5 h-8.5 rounded-xl transition-all duration-200 hover:scale-115 active:scale-90 flex items-center justify-center text-gray-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 cursor-pointer bg-gray-50 dark:bg-neutral-800 sm:bg-transparent"
                        title={budgets.find(b => b.categoryId === category.id) ? "Ajustar Orçamento" : "Definir Orçamento"}
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="w-8.5 h-8.5 rounded-xl transition-all duration-200 hover:scale-115 active:scale-90 flex items-center justify-center text-gray-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 cursor-pointer bg-gray-50 dark:bg-neutral-800 sm:bg-transparent"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="w-8.5 h-8.5 rounded-xl transition-all duration-200 hover:scale-115 active:scale-90 flex items-center justify-center text-gray-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer bg-gray-50 dark:bg-neutral-800 sm:bg-transparent"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400 dark:text-neutral-500" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma categoria encontrada
            </p>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6 max-w-sm mx-auto">
              Crie sua primeira categoria para começar a organizar suas finanças
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary inline-flex items-center gap-2 rounded-full shadow-sm px-6"
            >
              <Plus className="w-5 h-5" />
              Criar Categoria
            </button>
          </div>
        )}

        {/* Modal — portal direto no body para garantir z-index global */}
        {createPortal(
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex"
                onClick={handleCloseModal}
              />
              <div className={`fixed inset-0 flex justify-center z-[200] pointer-events-none ${isMobile ? 'items-end' : 'items-center p-4 sm:p-6'}`}>
                <motion.div
                  initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.96, y: 16 }}
                  animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.96, y: 16 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                  drag={isMobile ? 'y' : false}
                  dragControls={dragControls}
                  dragListener={false}
                  dragConstraints={isMobile ? { top: 0, bottom: 0 } : undefined}
                  dragElastic={isMobile ? { top: 0, bottom: 0.4 } : undefined}
                  onDragEnd={isMobile ? ((_, { offset, velocity }) => {
                    if (offset.y > 60 || velocity.y > 200) {
                      handleCloseModal()
                    }
                  }) : undefined}
                  className={`bg-white dark:bg-neutral-950 z-[200] shadow-2xl flex flex-col overflow-hidden pointer-events-auto transition-all ${
                    isMobile
                      ? 'w-full max-w-lg border-t border-gray-100 dark:border-neutral-800 rounded-t-[2rem] max-h-[92vh]'
                      : 'w-full max-w-4xl lg:max-w-5xl border border-gray-100 dark:border-neutral-800 rounded-[28px] max-h-[88vh] h-[640px]'
                  }`}
                >
                  {/* Top Header / Mobile Drag Handle */}
                  {isMobile ? (
                    <div
                      className="pt-3 pb-3 px-6 border-b border-gray-100 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-950 touch-none select-none cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
                      onPointerDown={(e) => dragControls.start(e)}
                    >
                      <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full mb-2.5" />
                      <h2 className="text-base font-bold text-gray-900 dark:text-white font-display text-center">
                        {editingId ? 'Editar Categoria' : 'Nova Categoria'}
                      </h2>
                    </div>
                  ) : (
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-950 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                          {editingId ? 'Editar Categoria' : 'Nova Categoria'}
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                          Personalize as informações da categoria e escolha um ícone na biblioteca ao lado.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Body: 2 Columns on Desktop, 1 Column on Mobile */}
                  {isMobile ? (
                    /* Mobile Form Layout */
                    <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-left">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Nome da Categoria</label>
                        <input
                          type="text"
                          placeholder="Ex: Alimentação, Transporte, Salário..."
                          {...register('name')}
                          className={`input-field rounded-xl ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && (
                          <p className="error-message">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block font-display">Tipo</label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className={`relative flex items-center justify-center p-3.5 border rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.97] select-none ${
                            selectedType === 'income'
                              ? 'border-success-500 bg-success-50/20 dark:bg-success-950/15 shadow-md shadow-success-500/5'
                              : 'border-gray-200 dark:border-neutral-800/80 hover:border-success-400/60'
                          }`}>
                            <input
                              type="radio"
                              name="category-type"
                              value="income"
                              checked={selectedType === 'income'}
                              onChange={() => { haptics.light(); setValue('type', 'income') }}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1 transition-colors ${
                                selectedType === 'income' ? 'bg-success-100/60 dark:bg-success-900/30' : 'bg-gray-50 dark:bg-neutral-850/40'
                              }`}>
                                <TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" />
                              </div>
                              <span className="text-xs font-bold text-gray-900 dark:text-white font-display">Receita</span>
                            </div>
                          </label>
                          <label className={`relative flex items-center justify-center p-3.5 border rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.97] select-none ${
                            selectedType === 'expense'
                              ? 'border-danger-500 bg-danger-50/20 dark:bg-danger-950/15 shadow-md shadow-danger-500/5'
                              : 'border-gray-200 dark:border-neutral-800/80 hover:border-danger-400/60'
                          }`}>
                            <input
                              type="radio"
                              name="category-type"
                              value="expense"
                              checked={selectedType === 'expense'}
                              onChange={() => { haptics.light(); setValue('type', 'expense') }}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1 transition-colors ${
                                selectedType === 'expense' ? 'bg-danger-100/60 dark:bg-danger-900/30' : 'bg-gray-50 dark:bg-neutral-850/40'
                              }`}>
                                <TrendingDown className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                              </div>
                              <span className="text-xs font-bold text-gray-900 dark:text-white font-display">Despesa</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Ícone</label>
                        <IconPicker
                          selectedIcon={selectedIcon}
                          onSelectIcon={(icon) => setValue('icon', icon as string)}
                          type={selectedType}
                          isPremium={isPremium}
                          onUpgradeClick={() => setShowUpgradeModal(true)}
                          inline={false}
                        />
                        {errors.icon && (
                          <p className="error-message">{errors.icon.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Cor</label>
                        <ColorPicker
                          selectedColor={selectedColor}
                          onSelectColor={(color) => setValue('color', color)}
                          usedColors={usedColors}
                          showCustomPicker={true}
                        />
                        {errors.color && (
                          <p className="error-message mt-2">{errors.color.message}</p>
                        )}
                      </div>

                      {/* Preview */}
                      <div className="bg-gray-50/50 dark:bg-neutral-900/40 border border-gray-150 dark:border-neutral-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-[4px] transition-all duration-300" 
                          style={{ 
                            backgroundColor: selectedColor,
                            boxShadow: `0 0 10px ${selectedColor}`
                          }} 
                        />
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                            style={{ backgroundColor: `${selectedColor}18` }}
                          >
                            <CategoryIcon
                              icon={selectedIcon as IconName}
                              color={selectedColor}
                              size="md"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-base text-gray-900 dark:text-white font-display leading-tight">
                              {watch('name') || 'Nome da Categoria'}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedType === 'income'
                                ? 'bg-success-50 text-success-700 dark:bg-success-950/20 dark:text-success-350 border-success-100/50 dark:border-success-900/10'
                                : 'bg-danger-50 text-danger-700 dark:bg-danger-950/20 dark:text-danger-350 border-danger-100/50 dark:border-danger-900/10'
                                }`}>
                                {selectedType === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {selectedType === 'income' ? 'Receita' : 'Despesa'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3 pb-1 border-t border-gray-100 dark:border-neutral-800/50">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="flex-1 btn-secondary rounded-full text-xs"
                        >
                          Cancelar
                        </button>
                        <button type="submit" className="flex-1 btn-primary rounded-full shadow-md text-xs">
                          {editingId ? 'Salvar' : 'Criar Categoria'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Desktop 2-Column Split Layout */
                    <div className="grid grid-cols-12 flex-1 overflow-hidden text-left">
                      {/* Left Column: Form Details & Color & Preview */}
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="col-span-5 p-6 border-r border-gray-100 dark:border-neutral-800 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-5"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Nome da Categoria</label>
                            <input
                              type="text"
                              placeholder="Ex: Alimentação, Transporte, Salário..."
                              {...register('name')}
                              className={`input-field rounded-xl ${errors.name ? 'input-error' : ''}`}
                            />
                            {errors.name && (
                              <p className="error-message">{errors.name.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block font-display">Tipo</label>
                            <div className="grid grid-cols-2 gap-3">
                              <label className={`relative flex items-center justify-center p-3 border rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.97] select-none ${
                                selectedType === 'income'
                                  ? 'border-success-500 bg-success-50/30 dark:bg-success-950/20 shadow-md shadow-success-500/5'
                                  : 'border-gray-200 dark:border-neutral-800/80 hover:border-success-400/60'
                              }`}>
                                <input
                                  type="radio"
                                  name="category-type"
                                  value="income"
                                  checked={selectedType === 'income'}
                                  onChange={() => { haptics.light(); setValue('type', 'income') }}
                                  className="sr-only"
                                />
                                <div className="text-center">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1 transition-colors ${
                                    selectedType === 'income' ? 'bg-success-100/60 dark:bg-success-900/30' : 'bg-gray-50 dark:bg-neutral-850/40'
                                  }`}>
                                    <TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" />
                                  </div>
                                  <span className="text-xs font-bold text-gray-900 dark:text-white font-display">Receita</span>
                                </div>
                              </label>
                              <label className={`relative flex items-center justify-center p-3 border rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.97] select-none ${
                                selectedType === 'expense'
                                  ? 'border-danger-500 bg-danger-50/30 dark:bg-danger-950/20 shadow-md shadow-danger-500/5'
                                  : 'border-gray-200 dark:border-neutral-800/80 hover:border-danger-400/60'
                              }`}>
                                <input
                                  type="radio"
                                  name="category-type"
                                  value="expense"
                                  checked={selectedType === 'expense'}
                                  onChange={() => { haptics.light(); setValue('type', 'expense') }}
                                  className="sr-only"
                                />
                                <div className="text-center">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1 transition-colors ${
                                    selectedType === 'expense' ? 'bg-danger-100/60 dark:bg-danger-900/30' : 'bg-gray-50 dark:bg-neutral-850/40'
                                  }`}>
                                    <TrendingDown className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                                  </div>
                                  <span className="text-xs font-bold text-gray-900 dark:text-white font-display">Despesa</span>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Cor da Categoria</label>
                            <ColorPicker
                              selectedColor={selectedColor}
                              onSelectColor={(color) => setValue('color', color)}
                              usedColors={usedColors}
                              showCustomPicker={true}
                            />
                            {errors.color && (
                              <p className="error-message mt-2">{errors.color.message}</p>
                            )}
                          </div>

                          {/* Live Preview Card */}
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Pré-visualização</label>
                            <div className="bg-gray-50/60 dark:bg-neutral-900/50 border border-gray-200/70 dark:border-neutral-800/70 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                              <div 
                                className="absolute right-0 top-0 bottom-0 w-[4px] transition-all duration-300" 
                                style={{ 
                                  backgroundColor: selectedColor,
                                  boxShadow: `0 0 10px ${selectedColor}`
                                }} 
                              />
                              <div className="flex items-center gap-3.5">
                                <div
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 border border-black/5 dark:border-white/5 shadow-sm"
                                  style={{ backgroundColor: `${selectedColor}20` }}
                                >
                                  <CategoryIcon
                                    icon={selectedIcon as IconName}
                                    color={selectedColor}
                                    size="md"
                                  />
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-base text-gray-900 dark:text-white font-display truncate leading-tight">
                                    {watch('name') || 'Nome da Categoria'}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                      selectedType === 'income'
                                        ? 'bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-350 border-success-200/60 dark:border-success-900/30'
                                        : 'bg-danger-50 text-danger-700 dark:bg-danger-950/30 dark:text-danger-350 border-danger-200/60 dark:border-danger-900/30'
                                    }`}>
                                      {selectedType === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                      {selectedType === 'income' ? 'Receita' : 'Despesa'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
                          <button
                            type="button"
                            onClick={handleCloseModal}
                            className="flex-1 btn-secondary rounded-xl py-2.5 text-xs font-bold"
                          >
                            Cancelar
                          </button>
                          <button type="submit" className="flex-1 btn-primary rounded-xl py-2.5 text-xs font-bold shadow-md shadow-primary-500/20">
                            {editingId ? 'Salvar Alterações' : 'Criar Categoria'}
                          </button>
                        </div>
                      </form>

                      {/* Right Column: Embedded Icon & Emoji Library */}
                      <div className="col-span-7 flex flex-col h-full overflow-hidden bg-gray-50/30 dark:bg-neutral-900/20">
                        <IconPicker
                          selectedIcon={selectedIcon}
                          onSelectIcon={(icon) => setValue('icon', icon as string)}
                          type={selectedType}
                          isPremium={isPremium}
                          onUpgradeClick={() => setShowUpgradeModal(true)}
                          inline={true}
                          className="h-full border-0 rounded-none shadow-none"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
        , document.body)}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-neutral-800">
              <div className="p-6 border-b border-gray-200 dark:border-neutral-800 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-xl">
                <h3 className="text-2xl font-bold text-white">
                  Upgrade para Premium
                </h3>
                <p className="text-white text-opacity-90 mt-1">
                  Desbloqueie recursos exclusivos
                </p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-neutral-300 mb-6">
                  O plano Premium oferece acesso a emojis personalizados, relatórios avançados, e muito mais!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-2.5 text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      setShowUpgradeModal(false)
                      navigate('/plans')
                    }}
                    className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    Ver Planos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Category Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={confirmDeleteCategory}
          title="Excluir Categoria"
          description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
          itemName={categoryToDelete?.name}
          isLoading={isDeletingCategory}
        />

        {/* Modal de Orçamento (Budget) */}
        <BudgetModal
          isOpen={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          category={categoryForBudget}
          existingBudget={
            categoryForBudget
              ? budgets.find(b => b.categoryId === categoryForBudget.id)
              : undefined
          }
        />
      </div>
    </PageTransition>
  )
}

export default Categories
