import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import {
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  CreditCard,
  Repeat,
} from 'lucide-react'
import { BalanceForecast, PendingCommitment } from '@/utils/balanceForecast'
import { useIsMobile } from '@/hooks'

interface ForecastDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  forecast: BalanceForecast
}

export const ForecastDetailsModal: React.FC<ForecastDetailsModalProps> = ({
  isOpen,
  onClose,
  forecast,
}) => {
  const isMobile = useIsMobile()
  const dragControls = useDragControls()
  useEffect(() => {
    if (!isOpen) return

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

  if (!isOpen) return null

  const fmtCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const getOriginBadge = (origin: PendingCommitment['origin']) => {
    switch (origin) {
      case 'card_invoice':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            <span>Fatura Cartão</span>
          </span>
        )
      case 'subscription':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            <span>Assinatura</span>
          </span>
        )
      case 'recurring':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Recorrente</span>
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
            Agendado
          </span>
        )
    }
  }

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
              className="bg-white dark:bg-neutral-900 rounded-t-[2.25rem] sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] sm:max-h-[92vh] overflow-hidden border-t sm:border border-gray-100 dark:border-neutral-800 flex flex-col pointer-events-auto"
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
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                      Previsão de Saldo do Mês
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Projeção com base nas contas, faturas e assinaturas pendentes
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

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Box de Comparação de Saldo */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Saldo Projetado no Fim do Mês
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  forecast.status === 'positive'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                    : forecast.status === 'warning'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                    : 'bg-red-950/80 text-red-400 border border-red-800/40'
                }`}
              >
                {forecast.status === 'positive'
                  ? 'Superávit Estimado'
                  : forecast.status === 'warning'
                  ? 'Atenção aos Gastos'
                  : 'Déficit Previsto'}
              </span>
            </div>

            <p className="text-3xl font-black font-display tracking-tight text-white">
              {fmtCurrency(forecast.projectedBalance)}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800 text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-neutral-400 block">Saldo Atual</span>
                <span className="font-semibold text-neutral-200">{fmtCurrency(forecast.currentBalance)}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-emerald-400 block">+ A Receber</span>
                <span className="font-semibold text-emerald-300">+{fmtCurrency(forecast.pendingIncome)}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-rose-400 block">- A Pagar</span>
                <span className="font-semibold text-rose-300">-{fmtCurrency(forecast.pendingExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Lista de Contas e Compromissos Pendentes */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                Compromissos Pendentes ({forecast.pendingItems.length})
              </h3>
              <span className="text-[11px] font-semibold text-gray-400">Vencimento</span>
            </div>

            {forecast.pendingItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-neutral-800/30 text-center border border-gray-100 dark:border-neutral-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-800 dark:text-neutral-200">
                  Nenhuma conta ou fatura pendente
                </p>
                <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5">
                  Todas as despesas previstas para o mês já foram liquidadas.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-neutral-800 border border-gray-150 dark:border-neutral-800 rounded-2xl overflow-hidden">
                {forecast.pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white dark:bg-neutral-900 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200/60 dark:border-neutral-700/60 flex items-center justify-center text-gray-600 dark:text-neutral-400 shrink-0">
                        {item.type === 'income' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {getOriginBadge(item.origin)}
                          <span className="text-[10px] text-gray-400">
                            Vence dia {item.dueDate.split('-')[2]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-bold ${
                          item.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {item.type === 'income' ? '+' : '-'} {fmtCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer com suporte a Safe Area */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 dark:border-neutral-800 flex justify-end bg-gray-50/50 dark:bg-neutral-800/20 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto btn-primary h-10 px-6 text-xs font-bold rounded-xl"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  </div>
  )}
  </AnimatePresence>,
  document.body
  )
}

export default ForecastDetailsModal
