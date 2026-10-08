import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  CreditCard as CardIcon,
  Pencil,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  Wifi,
  Receipt,
  RotateCw,
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
  Tag,
  ArrowRight
} from 'lucide-react'
import { CreditCard as CreditCardType, Transaction } from '@/types'
import { useFinancialStore } from '@/store/financialStore'
import NativeBottomSheet from '@/components/common/NativeBottomSheet'
import BrandIcon from '@/components/common/BrandIcon'
import { haptics } from '@/utils/haptics'
import { cn } from '@/lib/utils'

interface MobileCardsViewProps {
  creditCards: CreditCardType[]
  transactions: Transaction[]
  currentMonthTransactions: Transaction[]
  onOpenDesktopModal?: () => void
}

const POPULAR_BRANDS = [
  { id: 'Nubank', name: 'Nubank', slug: 'nubank.png' },
  { id: 'Inter', name: 'Inter', slug: 'banco-inter.png' },
  { id: 'Visa', name: 'Visa', slug: 'visa.png' },
  { id: 'Mastercard', name: 'Mastercard', slug: 'Mastercard.png' },
  { id: 'C6', name: 'C6 Bank', slug: 'c6-bank.png' },
  { id: 'Itau', name: 'Itaú', slug: 'itau.png' },
  { id: 'Bradesco', name: 'Bradesco', slug: 'bradesco.png' },
  { id: 'Santander', name: 'Santander', slug: 'santander.png' },
  { id: 'Elo', name: 'Elo', slug: 'elo.png' },
  { id: 'Outro', name: 'Outro' },
]

export const MobileCardsView: React.FC<MobileCardsViewProps> = ({
  creditCards,
  transactions,
  currentMonthTransactions,
}) => {
  const { addCreditCard, updateCreditCard, deleteCreditCard, isLoading } = useFinancialStore()

  // Estado do cartão selecionado
  const [selectedCardId, setSelectedCardId] = useState<string>(() => {
    return creditCards[0]?.id || ''
  })

  // Efeito de flip no cartão
  const [isFlipped, setIsFlipped] = useState(false)

  // Modais em NativeBottomSheet
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCardType | null>(null)

  const [isOptionsSheetOpen, setIsOptionsSheetOpen] = useState(false)
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false)
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false)

  // Filtro no sheet de faturas
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'recurring' | 'casual'>('all')

  // Form State para criação/edição
  const [formName, setFormName] = useState('')
  const [formBrand, setFormBrand] = useState('Nubank')
  const [formCustomBrand, setFormCustomBrand] = useState('')
  const [formLimit, setFormLimit] = useState('')
  const [formClosingDay, setFormClosingDay] = useState('')
  const [formDueDay, setFormDueDay] = useState('')
  const [formError, setFormError] = useState('')

  // Garante que se a lista mudar ou esvaziar, o cartão ativo continue válido
  const activeCard = useMemo(() => {
    return creditCards.find(c => c.id === selectedCardId) || creditCards[0] || null
  }, [creditCards, selectedCardId])

  // Helpers de cálculos
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
      casual: Math.max(0, total - subscriptions),
      transactions: cardTransactions,
    }
  }

  const getCardSubscriptions = (cardId: string) => {
    const subs = transactions.filter(
      t => t.creditCardId === cardId && t.isRecurring && !t.isCancelled && t.type === 'expense'
    )
    const subMap = new Map<string, Transaction>()
    subs.forEach(s => {
      const key = `${s.description.toLowerCase().trim()}`
      if (!subMap.has(key) || new Date(s.date) > new Date(subMap.get(key)!.date)) {
        subMap.set(key, s)
      }
    })
    return Array.from(subMap.values())
  }

  const getDueDateStatus = (dueDay: number) => {
    if (!dueDay) return null
    const now = new Date()
    const today = now.getDate()
    const diff = dueDay - today

    if (diff === 0) {
      return {
        label: 'Vence Hoje',
        pillClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30'
      }
    }
    if (diff > 0 && diff <= 5) {
      return {
        label: `Vence em ${diff} dias`,
        pillClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
      }
    }
    if (diff < 0) {
      return {
        label: 'Vencido',
        pillClass: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
      }
    }
    return {
      label: `Dia ${dueDay}`,
      pillClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    }
  }

  const getNextInvoiceEstimate = (cardId: string) => {
    const subs = transactions.filter(
      t => t.creditCardId === cardId && t.isRecurring && !t.isCancelled && t.type === 'expense'
    )
    const uniqueSubs = new Map<string, number>()
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

  const getBrandGradient = (brand: string) => {
    const b = (brand || '').toLowerCase()
    if (b.includes('nubank')) return 'from-[#820AD1] via-[#64089E] to-[#3B0263]'
    if (b.includes('inter')) return 'from-[#FF7A00] via-[#E25C00] to-[#993A00]'
    if (b.includes('c6')) return 'from-[#2C2C2C] via-[#1A1A1A] to-[#0A0A0A]'
    if (b.includes('neon')) return 'from-[#00E5FF] via-[#0088FF] to-[#0044FF]'
    if (b.includes('itau') || b.includes('itaú')) return 'from-[#EC7000] via-[#853000] to-[#001D5C]'
    if (b.includes('bradesco')) return 'from-[#CC092F] via-[#940020] to-[#45000C]'
    if (b.includes('santander')) return 'from-[#EC0000] via-[#B30000] to-[#600000]'
    if (b.includes('visa')) return 'from-[#1A1F71] via-[#0D47A1] to-[#01579B]'
    if (b.includes('master')) return 'from-[#EB001B] via-[#D35400] to-[#C0392B]'
    if (b.includes('elo')) return 'from-[#00A4E4] via-[#006699] to-[#0B2545]'
    return 'from-slate-900 via-neutral-900 to-zinc-950'
  }

  // Abertura de formulário
  const handleOpenCreate = () => {
    haptics.medium()
    setEditingCard(null)
    setFormName('')
    setFormBrand('Nubank')
    setFormCustomBrand('')
    setFormLimit('')
    setFormClosingDay('1')
    setFormDueDay('10')
    setFormError('')
    setIsFormSheetOpen(true)
  }

  const handleOpenEdit = (card: CreditCardType) => {
    haptics.medium()
    setEditingCard(card)
    setFormName(card.name)
    const isPopular = POPULAR_BRANDS.some(b => b.id.toLowerCase() === card.brand.toLowerCase())
    if (isPopular) {
      setFormBrand(card.brand)
      setFormCustomBrand('')
    } else {
      setFormBrand('Outro')
      setFormCustomBrand(card.brand)
    }
    setFormLimit(card.limit ? card.limit.toString() : '')
    setFormClosingDay(card.closingDay ? card.closingDay.toString() : '')
    setFormDueDay(card.dueDay ? card.dueDay.toString() : '')
    setFormError('')
    setIsOptionsSheetOpen(false)
    setIsFormSheetOpen(true)
  }

  const handleSaveCard = async () => {
    if (!formName.trim()) {
      setFormError('Por favor, informe o nome do cartão.')
      haptics.error()
      return
    }

    try {
      haptics.light()
      const finalBrand = formBrand === 'Outro'
        ? (formCustomBrand.trim() || 'Outro')
        : formBrand

      const limitVal = parseFloat(formLimit.replace(',', '.') || '0')
      const closingVal = parseInt(formClosingDay || '1', 10)
      const dueVal = parseInt(formDueDay || '10', 10)

      const payload = {
        name: formName.trim(),
        brand: finalBrand,
        limit: isNaN(limitVal) ? 0 : limitVal,
        closingDay: isNaN(closingVal) ? 1 : Math.min(31, Math.max(1, closingVal)),
        dueDay: isNaN(dueVal) ? 10 : Math.min(31, Math.max(1, dueVal)),
      }

      if (editingCard) {
        await updateCreditCard(editingCard.id, payload)
      } else {
        await addCreditCard(payload)
      }

      setIsFormSheetOpen(false)
      haptics.success()
    } catch (err) {
      haptics.error()
      setFormError('Erro ao salvar o cartão. Tente novamente.')
    }
  }

  const handleConfirmDelete = async () => {
    if (!activeCard) return
    try {
      haptics.warning()
      await deleteCreditCard(activeCard.id)
      setIsDeleteSheetOpen(false)
      setIsOptionsSheetOpen(false)
      haptics.success()
    } catch (err) {
      haptics.error()
    }
  }

  // Cálculos do cartão ativo
  const breakdown = activeCard ? getCardBreakdown(activeCard.id) : { total: 0, subscriptions: 0, casual: 0, transactions: [] }
  const subscriptions = activeCard ? getCardSubscriptions(activeCard.id) : []
  const hasLimit = activeCard && Number(activeCard.limit) > 0
  const limitValue = activeCard ? Number(activeCard.limit) : 0
  const availableLimit = hasLimit ? Math.max(0, limitValue - breakdown.total) : 0
  const usagePercentage = hasLimit ? Math.min((breakdown.total / limitValue) * 100, 100) : 0
  const dueStatus = activeCard ? getDueDateStatus(activeCard.dueDay) : null
  const nextInvoiceEstimate = activeCard ? getNextInvoiceEstimate(activeCard.id) : 0
  const gradientClass = activeCard ? getBrandGradient(activeCard.brand) : 'from-slate-900 to-neutral-900'

  // Transações filtradas para o sheet de fatura
  const filteredInvoiceTransactions = useMemo(() => {
    if (!breakdown.transactions) return []
    if (invoiceFilter === 'recurring') {
      return breakdown.transactions.filter(t => t.isRecurring)
    }
    if (invoiceFilter === 'casual') {
      return breakdown.transactions.filter(t => !t.isRecurring)
    }
    return breakdown.transactions
  }, [breakdown.transactions, invoiceFilter])

  return (
    <div className="space-y-5 pb-24 select-none">
      {/* 1. CABEÇALHO NATIVO */}
      <div className="pt-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight">
            Cartões
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/40">
            {creditCards.length} {creditCards.length === 1 ? 'cartão' : 'cartões'}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
          Gerencie limites, faturas e assinaturas
        </p>
      </div>

      {/* CASO: ZERO STATE */}
      {creditCards.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 text-center border border-dashed border-gray-200 dark:border-neutral-800 shadow-sm mt-4">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CardIcon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 font-display">
            Nenhum cartão cadastrado
          </h2>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mb-6 max-w-xs mx-auto leading-relaxed">
            Cadastre seus cartões para acompanhar o fechamento de faturas e organizar seus gastos mensais.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white px-6 py-3 rounded-full text-xs font-bold shadow-md shadow-primary-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Primeiro Cartão
          </button>
        </div>
      ) : (
        <>
          {/* 2. SELETOR DE CARTÕES EM PILLS (SCROLL HORIZONTAL) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
            {creditCards.map(card => {
              const isSelected = activeCard?.id === card.id
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setSelectedCardId(card.id)
                    setIsFlipped(false)
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 border cursor-pointer active:scale-95",
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-950 dark:border-white shadow-sm"
                      : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-300 border-gray-200/80 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/60"
                  )}
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <BrandIcon brand={card.brand} className="w-4 h-4 object-contain" />
                  </div>
                  <span>{card.name}</span>
                </button>
              )
            })}

            {/* Pill Adicionar Extra */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/40 shrink-0 active:scale-95 transition-transform"
              title="Adicionar outro cartão"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>

          {/* 3. CARTÃO DIGITAL TÁTIL COM PERSPECTIVA E FLIP */}
          {activeCard && (
            <div className="perspective-1000">
              <motion.div
                onClick={() => {
                  haptics.light()
                  setIsFlipped(!isFlipped)
                }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                className="w-full relative cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* FRENTE DO CARTÃO */}
                <div
                  className={cn(
                    "w-full h-52 rounded-[28px] p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between select-none bg-gradient-to-br transition-all",
                    gradientClass,
                    isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Texturas e Brilhos Sutis */}
                  <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                  <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-black/20 blur-2xl pointer-events-none" />

                  {/* Topo do Cartão: Logo, Wifi, Status */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5 shadow-sm">
                        <BrandIcon brand={activeCard.brand} className="w-full h-full object-contain drop-shadow" />
                      </div>
                      <Wifi className="w-4 h-4 text-white/70 rotate-90" />
                    </div>

                    {/* Status de Vencimento em Pill Flutuante */}
                    {dueStatus && (
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-sm transition-colors",
                        dueStatus.pillClass
                      )}>
                        {dueStatus.label}
                      </span>
                    )}
                  </div>

                  {/* Meio: Chip EMV Metálico Realista */}
                  <div className="relative z-10 my-auto flex items-center justify-between">
                    <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-100/50 shadow-inner flex flex-col justify-around p-1">
                      <div className="w-full h-[1px] bg-amber-600/40" />
                      <div className="w-full h-[1px] bg-amber-600/40" />
                      <div className="w-full h-[1px] bg-amber-600/40" />
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Fatura Atual</p>
                      <p className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(breakdown.total)}
                      </p>
                    </div>
                  </div>

                  {/* Base: Nome do Cartão e Botão para Virar */}
                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/60 font-medium">Titular / Cartão</p>
                      <h3 className="text-base font-extrabold tracking-wide drop-shadow-sm">
                        {activeCard.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-white/80 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      <RotateCw className="w-3 h-3 animate-spin-slow" />
                      <span>Toque p/ virar</span>
                    </div>
                  </div>
                </div>

                {/* VERSO DO CARTÃO */}
                <div
                  className={cn(
                    "w-full h-52 rounded-[28px] p-5 text-white shadow-xl absolute inset-0 overflow-hidden flex flex-col justify-between select-none bg-gradient-to-br transition-all",
                    gradientClass,
                    !isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                  )}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Tarja Magnética */}
                  <div className="-mx-5 -mt-1 h-9 bg-neutral-900/90 shadow-inner" />

                  {/* Detalhes do Verso */}
                  <div className="grid grid-cols-2 gap-3 my-auto pt-2">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                      <p className="text-[9px] uppercase tracking-widest text-white/70 font-semibold mb-0.5">Fechamento</p>
                      <p className="text-sm font-black">Dia {activeCard.closingDay || 'Não def.'}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                      <p className="text-[9px] uppercase tracking-widest text-white/70 font-semibold mb-0.5">Vencimento</p>
                      <p className="text-sm font-black">Dia {activeCard.dueDay || 'Não def.'}</p>
                    </div>
                  </div>

                  {/* CVV Simulado & Botão Retorno */}
                  <div className="flex items-center justify-between border-t border-white/15 pt-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span className="text-xs font-mono tracking-widest text-white/90">CVV •••</span>
                    </div>
                    <span className="text-[11px] text-white/80 bg-black/25 px-2.5 py-1 rounded-full border border-white/10">
                      Voltar à frente
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 4. BOTÕES DE AÇÃO RÁPIDA NO ESTILO PILL */}
          {activeCard && (
            <div className="flex items-center justify-between gap-2">
              {/* Botão Pill: Extrato & Detalhes */}
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setIsInvoiceSheetOpen(true)
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/40 active:scale-95 transition-all shadow-sm"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Extrato Fatura</span>
              </button>

              {/* Botão Pill: Editar */}
              <button
                type="button"
                onClick={() => handleOpenEdit(activeCard)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-bold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-neutral-700 active:scale-95 transition-all shadow-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              {/* Botão Pill: Opções */}
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setIsOptionsSheetOpen(true)
                }}
                className="inline-flex items-center justify-center p-2.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-neutral-700 active:scale-95 transition-all shadow-sm"
                title="Mais opções do cartão"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 5. CARD INSET GROUPED: FATURA & LIMITE */}
          {activeCard && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-gray-150 dark:border-neutral-800 shadow-sm space-y-4">
              {/* Cabeçalho da Fatura */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                    Total desta Fatura
                  </p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-0.5">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(breakdown.total)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                    Limite Livre
                  </p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {hasLimit
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableLimit)
                      : 'Sem limite'}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso do Limite */}
              {hasLimit && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-neutral-400 font-medium">Uso do Limite</span>
                    <span className={cn(
                      "font-bold px-2 py-0.5 rounded-full text-[10px]",
                      usagePercentage > 90
                        ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                        : usagePercentage > 75
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                        : "bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400"
                    )}>
                      {usagePercentage.toFixed(0)}% do limite
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        usagePercentage > 90
                          ? "bg-red-500"
                          : usagePercentage > 75
                          ? "bg-amber-500"
                          : "bg-primary-500"
                      )}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-400 dark:text-neutral-500 pt-0.5">
                    <span>Gasto: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(breakdown.total)}</span>
                    <span>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(limitValue)}</span>
                  </div>
                </div>
              )}

              {/* Decomposição: Assinaturas vs. Despesas Avulsas */}
              {breakdown.total > 0 && (
                <div className="bg-gray-50/70 dark:bg-neutral-800/40 rounded-2xl p-3 border border-gray-100 dark:border-neutral-800/60 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-neutral-300 font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span>Assinaturas Recorrentes</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(breakdown.subscriptions)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-neutral-300 font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <span>Compras Avulsas / Outros</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(breakdown.casual)}
                    </span>
                  </div>

                  {/* Barra Segmentada de Gastos */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(breakdown.subscriptions / breakdown.total) * 100}%` }}
                      className="bg-indigo-500 h-full"
                    />
                    <div
                      style={{ width: `${(breakdown.casual / breakdown.total) * 100}%` }}
                      className="bg-sky-500 h-full"
                    />
                  </div>
                </div>
              )}

              {/* Previsão da Próxima Fatura */}
              <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-primary-500/10 border border-indigo-200/50 dark:border-indigo-900/30 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-indigo-900/70 dark:text-indigo-300/70">
                      Próxima Fatura Est.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Baseado em assinaturas ativas
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nextInvoiceEstimate)}
                </span>
              </div>
            </div>
          )}

          {/* 6. LISTA DE ASSINATURAS VINCULADAS AO CARTÃO (INSET GROUPED) */}
          {activeCard && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-gray-150 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Assinaturas no Cartão
                  </h3>
                </div>

                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                  {subscriptions.length} ativas
                </span>
              </div>

              {subscriptions.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-xs text-gray-400 dark:text-neutral-500 italic">
                    Nenhuma assinatura recorrente registrada neste cartão.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-neutral-800/80 pt-1">
                  {subscriptions.slice(0, 4).map(sub => (
                    <div key={sub.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-black text-xs shrink-0">
                          {sub.description.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {sub.description}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-neutral-500">
                            Recorrente mensal
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sub.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Botão Pill para Extrato Completo */}
              {breakdown.transactions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setIsInvoiceSheetOpen(true)
                  }}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold bg-gray-50 dark:bg-neutral-800/60 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 active:scale-98 transition-all border border-gray-150 dark:border-neutral-800"
                >
                  <span>Ver todas as {breakdown.transactions.length} compras desta fatura</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 7. NATIVE BOTTOM SHEET: NOVO CARTÃO / EDITAR CARTÃO                       */}
      {/* ========================================================================= */}
      <NativeBottomSheet
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        title={editingCard ? 'Editar Cartão' : 'Novo Cartão'}
        description={editingCard ? 'Atualize as informações do seu cartão' : 'Cadastre um novo cartão de crédito'}
        footer={
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSaveCard}
              disabled={isLoading}
              className={cn(
                "w-full py-3.5 px-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/25 active:scale-98 transition-all flex items-center justify-center gap-2",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingCard ? 'Salvar Alterações' : 'Cadastrar Cartão'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                haptics.light()
                setIsFormSheetOpen(false)
              }}
              className="w-full py-2.5 rounded-full text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        }
      >
        <div className="space-y-4 pt-1">
          {formError && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2 border border-red-200/50 dark:border-red-900/40">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Nome do Cartão */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1.5">
              Nome do Cartão
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value)
                if (formError) setFormError('')
              }}
              placeholder="Ex: Nubank Roxinho, Inter Black..."
              className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* Seletor de Bandeira / Banco em formato Pill */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1.5">
              Instituição / Bandeira
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_BRANDS.map(brand => {
                const isSelected = formBrand === brand.id
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => {
                      haptics.light()
                      setFormBrand(brand.id)
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border active:scale-95",
                      isSelected
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-100"
                    )}
                  >
                    {brand.slug && (
                      <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0">
                        <BrandIcon brand={brand.id} className="w-3.5 h-3.5 object-contain" />
                      </div>
                    )}
                    <span>{brand.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Input customizado se escolheu "Outro" */}
            <AnimatePresence>
              {formBrand === 'Outro' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    value={formCustomBrand}
                    onChange={(e) => setFormCustomBrand(e.target.value)}
                    placeholder="Digite o nome da instituição..."
                    className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-primary-300 dark:border-primary-700 rounded-2xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Limite Total */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1.5">
              Limite de Crédito (Opcional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={formLimit}
                onChange={(e) => setFormLimit(e.target.value)}
                placeholder="0,00"
                className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Fechamento e Vencimento lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1.5">
                Dia Fechamento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={formClosingDay}
                onChange={(e) => setFormClosingDay(e.target.value)}
                placeholder="Ex: 1"
                className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1.5">
                Dia Vencimento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={formDueDay}
                onChange={(e) => setFormDueDay(e.target.value)}
                placeholder="Ex: 10"
                className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </NativeBottomSheet>

      {/* ========================================================================= */}
      {/* 8. NATIVE BOTTOM SHEET: OPÇÕES DO CARTÃO                                  */}
      {/* ========================================================================= */}
      {activeCard && (
        <NativeBottomSheet
          isOpen={isOptionsSheetOpen}
          onClose={() => setIsOptionsSheetOpen(false)}
          title={activeCard.name}
          description="Opções e gerenciamento do cartão"
          footer={
            <button
              type="button"
              onClick={() => {
                haptics.light()
                setIsOptionsSheetOpen(false)
              }}
              className="w-full py-2.5 rounded-full text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              Fechar
            </button>
          }
        >
          <div className="space-y-2 pt-1">
            {/* Botão Pill: Editar */}
            <button
              type="button"
              onClick={() => handleOpenEdit(activeCard)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-neutral-800/60 hover:bg-gray-100 dark:hover:bg-neutral-800 active:scale-98 transition-all border border-gray-150 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Editar Dados</p>
                  <p className="text-[10px] text-gray-400 dark:text-neutral-400">Nome, bandeira, limite e datas</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Botão Pill: Ver Fatura */}
            <button
              type="button"
              onClick={() => {
                haptics.light()
                setIsOptionsSheetOpen(false)
                setIsInvoiceSheetOpen(true)
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-neutral-800/60 hover:bg-gray-100 dark:hover:bg-neutral-800 active:scale-98 transition-all border border-gray-150 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Extrato da Fatura</p>
                  <p className="text-[10px] text-gray-400 dark:text-neutral-400">Lista completa de compras e assinaturas</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Botão Pill: Excluir */}
            <button
              type="button"
              onClick={() => {
                haptics.warning()
                setIsOptionsSheetOpen(false)
                setIsDeleteSheetOpen(true)
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100/70 dark:hover:bg-red-900/40 active:scale-98 transition-all border border-red-200/50 dark:border-red-900/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">Excluir Cartão</p>
                  <p className="text-[10px] text-red-500/80 dark:text-red-400/70">Remover este cartão do aplicativo</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </NativeBottomSheet>
      )}

      {/* ========================================================================= */}
      {/* 9. NATIVE BOTTOM SHEET: CONFIRMAR EXCLUSÃO                                */}
      {/* ========================================================================= */}
      {activeCard && (
        <NativeBottomSheet
          isOpen={isDeleteSheetOpen}
          onClose={() => setIsDeleteSheetOpen(false)}
          title="Excluir Cartão?"
          description={`Cartão "${activeCard.name}"`}
          footer={
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sim, Excluir Cartão</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteSheetOpen(false)}
                className="w-full py-2.5 rounded-full text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          }
        >
          <div className="py-2 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <p className="text-xs text-gray-600 dark:text-neutral-300 leading-relaxed max-w-xs mx-auto">
              Tem certeza que deseja remover o cartão <strong>{activeCard.name}</strong>? As transações vinculadas a ele permanecerão registradas, mas não estarão mais associadas ao cartão.
            </p>
          </div>
        </NativeBottomSheet>
      )}

      {/* ========================================================================= */}
      {/* 10. NATIVE BOTTOM SHEET: EXTRATO DA FATURA DO CARTÃO                      */}
      {/* ========================================================================= */}
      {activeCard && (
        <NativeBottomSheet
          isOpen={isInvoiceSheetOpen}
          onClose={() => setIsInvoiceSheetOpen(false)}
          title={`Fatura • ${activeCard.name}`}
          description={`Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(breakdown.total)}`}
          footer={
            <button
              type="button"
              onClick={() => setIsInvoiceSheetOpen(false)}
              className="w-full py-3 rounded-full text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 active:scale-98 transition-transform"
            >
              Concluído
            </button>
          }
        >
          <div className="space-y-4 pt-1">
            {/* Pills de Filtro do Extrato */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-neutral-800 rounded-full">
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setInvoiceFilter('all')
                }}
                className={cn(
                  "flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all text-center",
                  invoiceFilter === 'all'
                    ? "bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-neutral-400"
                )}
              >
                Todas ({breakdown.transactions.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setInvoiceFilter('recurring')
                }}
                className={cn(
                  "flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all text-center",
                  invoiceFilter === 'recurring'
                    ? "bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-neutral-400"
                )}
              >
                Assinaturas
              </button>
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setInvoiceFilter('casual')
                }}
                className={cn(
                  "flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all text-center",
                  invoiceFilter === 'casual'
                    ? "bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-neutral-400"
                )}
              >
                Avulsas
              </button>
            </div>

            {/* Lista de Transações */}
            {filteredInvoiceTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 dark:text-neutral-500">
                Nenhum gasto encontrado neste filtro.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                {filteredInvoiceTransactions.map(tx => (
                  <div key={tx.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0",
                        tx.isRecurring
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                          : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300"
                      )}>
                        {tx.isRecurring ? <Zap className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {tx.description}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-neutral-500">
                          {new Date(tx.date).toLocaleDateString('pt-BR')} • {tx.isRecurring ? 'Assinatura' : 'Compra'}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-gray-900 dark:text-white shrink-0 ml-2">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </NativeBottomSheet>
      )}

      {/* Floating Action Button (FAB) Flutuante Nativo */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleOpenCreate}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 active:scale-90 text-white rounded-full shadow-2xl shadow-primary-500/40 border border-white/20 flex items-center justify-center transition-all cursor-pointer"
        aria-label="Novo Cartão"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </motion.button>
    </div>
  )
}

export default MobileCardsView
