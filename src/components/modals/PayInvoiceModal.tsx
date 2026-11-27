import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, CreditCard as CardIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Category, CreditCard } from '@/types'
import { haptics } from '@/utils/haptics'
import { useIsMobile } from '@/hooks'

interface PayInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  card: CreditCard | null
  invoiceAmount: number
  categories: Category[]
  onPayInvoice: (cardId: string, amount: number, paymentDate: string, categoryId: string) => Promise<void>
}

export const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
  isOpen,
  onClose,
  card,
  invoiceAmount,
  categories,
  onPayInvoice,
}) => {
  const [amount, setAmount] = useState<string>('')
  const [paymentDate, setPaymentDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [categoryId, setCategoryId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useIsMobile()
  const dragControls = useDragControls()

  useEffect(() => {
    if (card) {
      setAmount(invoiceAmount.toFixed(2))
      setPaymentDate(format(new Date(), 'yyyy-MM-dd'))

      // Buscar categoria de cartão de crédito ou padrão
      const cardCat = categories.find(
        (c) =>
          c.type === 'expense' &&
          (c.name.toLowerCase().includes('cartão') ||
            c.name.toLowerCase().includes('cartao') ||
            c.name.toLowerCase().includes('fatura') ||
            c.name.toLowerCase().includes('contas'))
      )
      const defaultCat = cardCat || categories.find((c) => c.type === 'expense')
      setCategoryId(defaultCat ? defaultCat.id : '')
    }
  }, [card, invoiceAmount, categories])

  useEffect(() => {
    if (!isOpen) return
    haptics.light()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !card) return null

  const parsedAmount = parseFloat(amount) || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedAmount <= 0) return

    try {
      setIsLoading(true)
      haptics.medium()
      await onPayInvoice(card.id, parsedAmount, paymentDate, categoryId)
      onClose()
    } catch (error) {
      console.error('Erro ao pagar fatura:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fmtCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200]">
          {/* Backdrop global cobrindo 100% da viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 bg-black/60 dark:bg-black/75"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Posicionamento: bottom sheet no mobile e centralizado no desktop */}
          <div className="fixed inset-0 flex justify-center z-[200] pointer-events-none items-end sm:items-center p-0 sm:p-4">
            <motion.div
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.96, y: 12 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.34 }}
              drag={isMobile ? 'y' : false}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={isMobile ? { top: 0, bottom: 0 } : undefined}
              dragElastic={isMobile ? { top: 0, bottom: 0.4 } : undefined}
              onDragEnd={isMobile ? ((_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 400) {
                  onClose()
                }
              }) : undefined}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 rounded-t-[2.25rem] sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-t sm:border border-gray-100 dark:border-neutral-800 flex flex-col pointer-events-auto max-h-[90vh] sm:max-h-[92vh]"
            >
              {/* Drag Handle exclusivo para Mobile */}
              <div
                className="sm:hidden pt-3 pb-1 w-full flex justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0 select-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-neutral-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <CardIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                      Pagar Fatura do Cartão
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      {card.name} • Final {card.lastFourDigits || '••••'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 active:scale-95 transition-all flex-shrink-0"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Card Resumo da Fatura */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Fatura Atual Fechada / Aberta
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                Vence dia {card.dueDay}
              </span>
            </div>
            <p className="text-2xl font-black font-display tracking-tight text-white">
              {fmtCurrency(invoiceAmount)}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Fechamento da fatura no dia {card.closingDay} de cada mês.
            </p>
          </div>

          {/* Campo Valor do Pagamento */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 block mb-1">
              Valor do Pagamento (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="input-field pl-10 text-base font-bold text-gray-900 dark:text-white"
                required
              />
            </div>
            {parsedAmount < invoiceAmount && parsedAmount > 0 && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Pagamento parcial: o saldo remanescente irá para a próxima fatura.</span>
              </p>
            )}
          </div>

          {/* Data do Pagamento */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 block mb-1">
              Data da Liquidação
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="input-field text-xs"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 block mb-1">
              Categoria do Lançamento
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field text-xs"
              required
            >
              {categories
                .filter((c) => c.type === 'expense')
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-neutral-800/40 rounded-xl border border-gray-150 dark:border-neutral-800 text-[11px] text-gray-500 dark:text-neutral-400">
            Ao confirmar, uma despesa única de <strong>{fmtCurrency(parsedAmount)}</strong> será lançada no seu extrato e fluxo de caixa na data indicada, quitando o ciclo da fatura.
          </div>

          {/* Botões com suporte a Safe Area */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto btn-secondary h-10 px-4 text-xs font-semibold rounded-xl order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || parsedAmount <= 0}
              className="w-full sm:w-auto btn-primary bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 h-10 px-5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 active:scale-[0.98] transition-transform order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmar Pagamento ({fmtCurrency(parsedAmount)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  </div>
  )}
  </AnimatePresence>,
  document.body
  )
}

export default PayInvoiceModal
