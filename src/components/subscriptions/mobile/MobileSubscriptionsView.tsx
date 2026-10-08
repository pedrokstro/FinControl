import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  CalendarClock,
  Wallet,
  TrendingUp,
  Pencil,
  XCircle,
  Check,
  Loader2,
  CreditCard,
  ChevronRight,
} from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import BrandIcon from '@/components/common/BrandIcon'
import NativeBottomSheet from '@/components/common/NativeBottomSheet'
import CategorySelect from '@/components/common/CategorySelect'
import CustomDatePicker from '@/components/common/CustomDatePicker'
import CustomSelect, { type SelectOption } from '@/components/common/CustomSelect'
import { haptics } from '@/utils/haptics'
import { useFinancialStore } from '@/store/financialStore'
import { toast } from 'react-hot-toast'
import api from '@/config/api'
import ConfirmCancelRecurrenceModal from '@/components/modals/ConfirmCancelRecurrenceModal'

interface MobileSubscriptionsViewProps {
  subscriptions: any[]
  categories: any[]
  monthlyTotal: number
  yearlyTotal: number
  currentMonthIncome: number
  onRefresh?: () => void
}

const FREQUENCY_OPTIONS: SelectOption[] = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'quarterly', label: 'Trimestral' },
]

const EDIT_FREQUENCY_OPTIONS: SelectOption[] = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'anual', label: 'Anual' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'trimestral', label: 'Trimestral' },
]

const POPULAR_PRESETS = [
  { name: 'Netflix', amount: '44.90' },
  { name: 'Spotify', amount: '21.90' },
  { name: 'Amazon Prime', amount: '19.90' },
  { name: 'Disney+', amount: '43.90' },
  { name: 'YouTube Premium', amount: '24.90' },
  { name: 'ChatGPT Plus', amount: '110.00' },
  { name: 'Apple iCloud', amount: '14.90' },
  { name: 'Max', amount: '39.90' },
]

export const MobileSubscriptionsView: React.FC<MobileSubscriptionsViewProps> = ({
  subscriptions,
  categories,
  monthlyTotal,
  yearlyTotal,
  currentMonthIncome,
  onRefresh,
}) => {
  const { addTransaction, updateTransaction, syncWithBackend } = useFinancialStore()

  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mensal' | 'anual' | 'outros'>('all')

  // Sheets
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null)
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [transactionToCancel, setTransactionToCancel] = useState<{ id: string; description: string } | null>(null)

  // Formulário de Edição
  const [editForm, setEditForm] = useState({
    amount: '',
    categoryId: '',
    frequency: 'mensal',
  })

  // Formulário de Nova Assinatura
  const [newForm, setNewForm] = useState({
    description: '',
    amount: '',
    categoryId: '',
    frequency: 'monthly',
    date: new Date().toISOString().split('T')[0],
  })

  // Filtragem da lista
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = sub.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      if (!matchesSearch) return false

      if (selectedFilter === 'all') return true
      if (selectedFilter === 'mensal') return sub.frequency === 'mensal'
      if (selectedFilter === 'anual') return sub.frequency === 'anual'
      if (selectedFilter === 'outros') return sub.frequency !== 'mensal' && sub.frequency !== 'anual'
      return true
    })
  }, [subscriptions, searchTerm, selectedFilter])

  // Contagens para badges dos filtros
  const counts = useMemo(() => {
    const mensal = subscriptions.filter((s) => s.frequency === 'mensal').length
    const anual = subscriptions.filter((s) => s.frequency === 'anual').length
    const outros = subscriptions.filter((s) => s.frequency !== 'mensal' && s.frequency !== 'anual').length
    return { all: subscriptions.length, mensal, anual, outros }
  }, [subscriptions])

  // Percentual da renda comprometido
  const commitmentPercent = currentMonthIncome > 0
    ? Math.round((monthlyTotal / currentMonthIncome) * 100)
    : null

  // Abrir detalhes de uma assinatura
  const handleOpenDetails = (sub: any) => {
    haptics.light()
    setSelectedSubscription(sub)
    setEditForm({
      amount: sub.amount.toString(),
      categoryId: sub.categoryId || (categories[0]?.id || ''),
      frequency: sub.frequency || 'mensal',
    })
    setIsEditing(false)
  }

  // Salvar edição
  const handleSaveEdit = async () => {
    if (!selectedSubscription) return
    setIsSaving(true)

    try {
      const updateData: any = {
        amount: parseFloat(editForm.amount),
        categoryId: editForm.categoryId,
        description: selectedSubscription.brandName,
      }

      if (editForm.frequency === 'semanal') updateData.recurrenceType = 'weekly'
      else if (editForm.frequency === 'mensal') updateData.recurrenceType = 'monthly'
      else if (editForm.frequency === 'anual') updateData.recurrenceType = 'yearly'
      else if (editForm.frequency === 'trimestral') updateData.recurrenceType = 'quarterly'

      await updateTransaction(selectedSubscription.id, updateData)

      haptics.success()
      toast.success('Assinatura atualizada com sucesso!')
      await syncWithBackend()
      setIsEditing(false)
      setSelectedSubscription((prev: any) => ({
        ...prev,
        amount: parseFloat(editForm.amount),
        categoryId: editForm.categoryId,
        frequency: editForm.frequency,
      }))
      onRefresh?.()
    } catch (error) {
      console.error(error)
      haptics.warning()
      toast.error('Erro ao atualizar assinatura')
    } finally {
      setIsSaving(false)
    }
  }

  // Cancelar recorrência
  const handleCancelClick = (sub: any) => {
    haptics.warning()
    setTransactionToCancel({
      id: sub.parentTransactionId || sub.id,
      description: sub.brandName || sub.description,
    })
    setShowCancelModal(true)
  }

  const confirmCancel = async () => {
    if (!transactionToCancel) return

    try {
      await api.patch(`/transactions/${transactionToCancel.id}/cancel-recurrence`)
      haptics.success()
      toast.success('Assinatura cancelada com sucesso!')
      await syncWithBackend()
      setTransactionToCancel(null)
      setShowCancelModal(false)
      setSelectedSubscription(null)
      onRefresh?.()
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error)
      haptics.warning()
      toast.error(error.response?.data?.message || 'Erro ao cancelar assinatura')
    }
  }

  // Abrir sheet de nova assinatura
  const handleOpenNewSubscription = () => {
    haptics.medium()
    setNewForm({
      description: '',
      amount: '',
      categoryId: categories[0]?.id || '',
      frequency: 'monthly',
      date: new Date().toISOString().split('T')[0],
    })
    setIsNewSheetOpen(true)
  }

  // Criar nova assinatura
  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newForm.description || !newForm.amount) {
      toast.error('Preencha a descrição e o valor')
      return
    }

    setIsSaving(true)
    try {
      const selectedCategory = categories.find(c => c.id === newForm.categoryId) || categories[0]
      await addTransaction({
        description: newForm.description,
        amount: parseFloat(newForm.amount),
        type: 'expense',
        categoryId: selectedCategory?.id || '',
        category: selectedCategory?.name || 'Assinatura',
        userId: '1',
        date: newForm.date,
        isRecurring: true,
        recurrenceType: newForm.frequency as any,
      })

      haptics.success()
      toast.success('Assinatura adicionada com sucesso!')
      await syncWithBackend()
      setIsNewSheetOpen(false)
      setNewForm({
        description: '',
        amount: '',
        categoryId: '',
        frequency: 'monthly',
        date: new Date().toISOString().split('T')[0],
      })
      onRefresh?.()
    } catch (error) {
      console.error(error)
      haptics.warning()
      toast.error('Erro ao criar assinatura')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* 1. Header & Hero de Impacto Financeiro Mobile */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-primary-950 to-neutral-950 p-5 text-white shadow-xl shadow-primary-950/25 border border-white/10">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-primary-500/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <CalendarClock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider font-display">
                Assinaturas Ativas
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 border border-white/20 text-white font-mono">
              {subscriptions.length} {subscriptions.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          <div className="my-2">
            <span className="text-[11px] text-white/70 font-medium">Gasto Mensal Garantido</span>
            <div className="text-3xl font-black font-display tracking-tight text-white mt-0.5 leading-none">
              {formatCurrency(monthlyTotal)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-white/70 mb-0.5">
                <Wallet className="w-3 h-3" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Projeção Anual</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">
                {formatCurrency(yearlyTotal)}
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-white/70 mb-0.5">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Comprometimento</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">
                {commitmentPercent !== null ? `${commitmentPercent}% da Renda` : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Busca Nativa */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar assinatura (ex: Netflix, Spotify)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            Limpar
          </button>
        )}
      </div>

      {/* 3. Filtros em Pills Horizontais */}
      <div className="overflow-x-auto flex gap-2 pb-1 scrollbar-none -mx-4 px-4">
        {[
          { key: 'all', label: 'Todas', count: counts.all },
          { key: 'mensal', label: 'Mensais', count: counts.mensal },
          { key: 'anual', label: 'Anuais', count: counts.anual },
          { key: 'outros', label: 'Outras', count: counts.outros },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              haptics.light()
              setSelectedFilter(f.key as any)
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
              selectedFilter === f.key
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30 font-bold'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedFilter === f.key
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* 4. Lista Touch-Friendly de Assinaturas */}
      {filteredSubscriptions.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <CreditCard className="w-7 h-7" />
          </div>
          <p className="font-bold text-sm text-neutral-900 dark:text-white font-display">
            Nenhuma assinatura encontrada
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
            {searchTerm
              ? 'Tente buscar com outro termo.'
              : 'Cadastre suas despesas recorrentes para controlar seus gastos fixos mensais.'}
          </p>
          {!searchTerm && (
            <button
              type="button"
              onClick={handleOpenNewSubscription}
              className="mt-4 px-4 py-2 rounded-full bg-primary-600 text-white text-xs font-bold shadow-md shadow-primary-600/20 active:scale-95 transition-transform inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Primeira Assinatura
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredSubscriptions.map((sub) => {
            const percentage = monthlyTotal > 0 ? (sub.amount / monthlyTotal) * 100 : 0
            const dayOfCharge = sub.date ? new Date(sub.date).getUTCDate() : null

            return (
              <motion.div
                key={sub.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenDetails(sub)}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border border-neutral-200/80 dark:border-neutral-800 shadow-sm active:bg-neutral-50 dark:active:bg-neutral-800/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* Ícone da Marca ou Categoria */}
                  <div className="w-11 h-11 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    <BrandIcon
                      brand={sub.brandName}
                      className="w-6 h-6 object-contain"
                    />
                  </div>

                  {/* Informações Centrais */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate font-display">
                        {sub.brandName}
                      </h4>
                      <span className="font-black font-mono text-xs sm:text-sm text-neutral-900 dark:text-white shrink-0">
                        {formatCurrency(sub.amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        <span>{sub.category?.name || 'Recorrente'}</span>
                        <span>•</span>
                        <span className="capitalize">{sub.frequency}</span>
                      </div>

                      {dayOfCharge && (
                        <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full shrink-0">
                          Dia {dayOfCharge}
                        </span>
                      )}
                    </div>

                    {/* Alerta de aumento de preço */}
                    {sub.hasPriceIncrease && (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Subiu {formatCurrency(sub.priceIncreaseAmount)}
                      </div>
                    )}

                    {/* Barra de Proporção Sutil */}
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1 mt-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500 dark:bg-primary-400"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 self-center ml-0.5" />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* 5. FAB (Floating Action Button) de Nova Assinatura */}
      <button
        type="button"
        onClick={handleOpenNewSubscription}
        className="fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-600/35 flex items-center justify-center active:scale-90 transition-transform cursor-pointer border-2 border-white dark:border-neutral-900"
        title="Nova Assinatura"
        aria-label="Nova Assinatura"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* 6. NativeBottomSheet: Detalhes & Edição */}
      <NativeBottomSheet
        isOpen={!!selectedSubscription}
        onClose={() => {
          setSelectedSubscription(null)
          setIsEditing(false)
        }}
        title={isEditing ? 'Editar Assinatura' : 'Detalhes da Assinatura'}
      >
        {selectedSubscription && (
          <div className="space-y-5">
            {/* Cabeçalho do Card */}
            <div className="flex flex-col items-center justify-center text-center pt-1">
              <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-sm mb-3">
                <BrandIcon brand={selectedSubscription.brandName} className="w-9 h-9 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
                {selectedSubscription.brandName}
              </h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {selectedSubscription.category?.name || 'Recorrente'} • {selectedSubscription.frequency}
              </span>
            </div>

            {isEditing ? (
              /* Modo Edição */
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Valor da Assinatura (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Categoria
                  </label>
                  <CategorySelect
                    categories={categories}
                    value={editForm.categoryId}
                    onChange={(val) => setEditForm({ ...editForm, categoryId: val })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Frequência de Cobrança
                  </label>
                  <CustomSelect
                    options={EDIT_FREQUENCY_OPTIONS}
                    value={editForm.frequency}
                    onChange={(val) => setEditForm({ ...editForm, frequency: val })}
                    dropdownTitle="Frequência"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="w-full py-3 rounded-full text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 active:scale-95 transition-transform"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="w-full py-3 rounded-full text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-sm shadow-primary-600/30"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              /* Modo Visualização de Detalhes */
              <div className="space-y-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-4 border border-neutral-200/70 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Valor Cobrado</span>
                    <span className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                      {formatCurrency(selectedSubscription.amount)}
                    </span>
                  </div>

                  <div className="h-px bg-neutral-200/60 dark:bg-neutral-700/60" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Projeção Anual</span>
                    <span className="text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300">
                      {formatCurrency(
                        selectedSubscription.frequency === 'anual'
                          ? selectedSubscription.amount
                          : selectedSubscription.frequency === 'semanal'
                          ? selectedSubscription.amount * 52
                          : selectedSubscription.frequency === 'trimestral'
                          ? selectedSubscription.amount * 4
                          : selectedSubscription.amount * 12
                      )}
                    </span>
                  </div>

                  <div className="h-px bg-neutral-200/60 dark:bg-neutral-700/60" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Dia de Cobrança</span>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Dia {new Date(selectedSubscription.date).getUTCDate()} de cada mês
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light()
                      setIsEditing(true)
                    }}
                    className="w-full py-3 rounded-full text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCancelClick(selectedSubscription)}
                    className="w-full py-3 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900/30"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </NativeBottomSheet>

      {/* 7. NativeBottomSheet: Nova Assinatura */}
      <NativeBottomSheet
        isOpen={isNewSheetOpen}
        onClose={() => setIsNewSheetOpen(false)}
        title="Nova Assinatura"
      >
        <form onSubmit={handleCreateSubscription} className="space-y-4">
          {/* Sugestões Rápidas de Marcas */}
          <div>
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
              Sugestões Rápidas
            </label>
            <div className="overflow-x-auto flex gap-2 pb-1 scrollbar-none -mx-2 px-2">
              {POPULAR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    haptics.light()
                    const matchedCat = categories.find((c) =>
                      c.name.toLowerCase().includes('lazer') ||
                      c.name.toLowerCase().includes('serviço') ||
                      c.name.toLowerCase().includes('streaming') ||
                      c.name.toLowerCase().includes('assinatura')
                    )
                    setNewForm((prev) => ({
                      ...prev,
                      description: p.name,
                      amount: p.amount,
                      categoryId: matchedCat ? matchedCat.id : (prev.categoryId || categories[0]?.id || ''),
                    }))
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
                >
                  <BrandIcon brand={p.name} className="w-3.5 h-3.5 object-contain" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Nome do Serviço / Assinatura
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Netflix, Spotify, Academia..."
              value={newForm.description}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Campos em grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={newForm.amount}
                onChange={(e) => setNewForm({ ...newForm, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Periodicidade
              </label>
              <CustomSelect
                options={FREQUENCY_OPTIONS}
                value={newForm.frequency}
                onChange={(val) => setNewForm({ ...newForm, frequency: val })}
                dropdownTitle="Periodicidade"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Categoria
              </label>
              <CategorySelect
                categories={categories}
                value={newForm.categoryId || (categories[0]?.id || '')}
                onChange={(val) => setNewForm({ ...newForm, categoryId: val })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Data / Vencimento
              </label>
              <CustomDatePicker
                value={newForm.date}
                onChange={(val) => setNewForm({ ...newForm, date: val })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 rounded-full text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all shadow-md shadow-primary-600/30 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Cadastrar Assinatura
          </button>
        </form>
      </NativeBottomSheet>

      {/* 8. Modal de Confirmação de Cancelamento de Recorrência */}
      <ConfirmCancelRecurrenceModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        transactionDescription={transactionToCancel?.description}
      />
    </div>
  )
}

export default MobileSubscriptionsView
