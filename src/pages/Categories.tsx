import { useState, useMemo, useEffect } from 'react'
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
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import IconPicker from '@/components/common/IconPicker'
import CategoryIcon from '@/components/common/CategoryIcon'
import ColorPicker from '@/components/common/ColorPicker'
import { type IconName } from '@/utils/iconMapping'
import PageTransition from '@/components/common/PageTransition'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'

const categorySchema = z.object({
  name: z.string().min(3, 'Nome deve ter no minimo 3 caracteres'),
  type: z.enum(['income', 'expense']),
  color: z.string().min(1, 'Cor e obrigatoria').regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal'),
  icon: z.string().min(1, 'Icone e obrigatorio'),
})

type CategoryFormData = z.infer<typeof categorySchema>

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useFinancialStore()
  const navigate = useNavigate()
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
  
  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list' | null>(null)
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
        if (mode && (mode === 'grid' || mode === 'list')) {
          setViewMode(mode as 'grid' | 'list')
        } else {
          setViewMode('grid')
        }
      } catch (error) {
        console.error('Erro ao carregar modo de visualização:', error)
        setViewMode('grid')
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

  // Salvar preferência de visualização no backend
  const handleViewModeChange = async (mode: 'grid' | 'list') => {
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
      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
    }
  }

  const handleDelete = (category: {
    id: string
    name: string
    type: 'income' | 'expense'
    color: string
  }) => {
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
    } catch (error) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categorias</h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Organize suas transações em categorias personalizadas
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {/* Toggle View Mode */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => handleViewModeChange('grid')}
              disabled={isViewModeLoading}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
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
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
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
            className="hidden sm:flex btn-primary items-center justify-center gap-2 w-full sm:w-auto"
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
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            Todas ({categories.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'income'
                ? 'bg-success-600 dark:bg-success-500 text-white'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            Receitas ({categories.filter(c => c.type === 'income').length})
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'expense'
                ? 'bg-danger-600 dark:bg-danger-500 text-white'
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
                    <TrendingUp className="w-3.5 h-3.5" />
                    Receita
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Despesa
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && !isViewModeLoading && !isCategoriesLoading && (
        <div className="card divide-y divide-gray-200 dark:divide-neutral-800">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1">
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
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    {category.type === 'income' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                        <TrendingUp className="w-3 h-3" />
                        Receita
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300">
                        <TrendingDown className="w-3 h-3" />
                        Despesa
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs text-gray-500 dark:text-neutral-400">
                        {category.color.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
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
          ))}
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
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
            Crie sua primeira categoria para começar a organizar suas finanças
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Criar Categoria
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Editar Categoria' : 'Nova Categoria'}
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
                <label className="label">Nome da Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Alimentacao, Transporte, Salario..."
                  {...register('name')}
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && (
                  <p className="error-message">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="label">Tipo</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:border-success-500 has-[:checked]:bg-success-50 dark:has-[:checked]:bg-success-900/20 hover:bg-gray-50 dark:hover:bg-neutral-900 dark:border-neutral-700">
                    <input
                      type="radio"
                      value="income"
                      {...register('type')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 mx-auto text-success-600 dark:text-success-400 mb-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Receita</span>
                    </div>
                  </label>
                  <label className="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:border-danger-500 has-[:checked]:bg-danger-50 dark:has-[:checked]:bg-danger-900/20 hover:bg-gray-50 dark:hover:bg-neutral-900 dark:border-neutral-700">
                    <input
                      type="radio"
                      value="expense"
                      {...register('type')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <TrendingDown className="w-6 h-6 mx-auto text-danger-600 dark:text-danger-400 mb-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Despesa</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Ícone</label>
                <IconPicker
                  selectedIcon={selectedIcon}
                  onSelectIcon={(icon) => setValue('icon', icon as string)}
                  type={selectedType}
                  isPremium={isPremium}
                  onUpgradeClick={() => setShowUpgradeModal(true)}
                />
                {errors.icon && (
                  <p className="error-message">{errors.icon.message}</p>
                )}
              </div>

              <div>
                <label className="label">Cor</label>
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
              <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4 border border-transparent dark:border-neutral-800">
                <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase mb-3">
                  Visualizacao
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    <CategoryIcon
                      icon={selectedIcon as IconName}
                      color={selectedColor}
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {watch('name') || 'Nome da Categoria'}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedType === 'income'
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300'
                    }`}>
                      {selectedType === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {selectedType === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </div>
                </div>
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
                  {editingId ? 'Salvar Alteracoes' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    // Redirecionar para página de planos
                    window.location.href = '/plans'
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
    </div>
    </PageTransition>
  )
}

export default Categories
