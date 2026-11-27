import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Check,
  RefreshCw,
} from 'lucide-react'
import { Category, Transaction } from '@/types'
import {
  ParsedImportTransaction,
  ParseResult,
  parseStatementFile,
  suggestCategory,
} from '@/services/importService'
import { haptics } from '@/utils/haptics'
import { useIsMobile } from '@/hooks'

interface ImportTransactionsModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  existingTransactions: Transaction[]
  onImportBatch: (transactions: any[]) => Promise<number>
}

export const ImportTransactionsModal: React.FC<ImportTransactionsModalProps> = ({
  isOpen,
  onClose,
  categories,
  existingTransactions,
  onImportBatch,
}) => {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [items, setItems] = useState<ParsedImportTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [targetAccount, setTargetAccount] = useState<'account' | 'credit'>('account')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const dragControls = useDragControls()

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

  // Preencher categorias sugeridas caso as categorias do usuário terminem de carregar após o arquivo
  useEffect(() => {
    if (categories.length > 0 && items.length > 0) {
      const hasEmptyCategory = items.some((i) => !i.categoryId)
      if (hasEmptyCategory) {
        setItems((prev) =>
          prev.map((item) => {
            if (item.categoryId) return item
            const suggested = suggestCategory(item.description, item.type, categories)
            return { ...item, categoryId: suggested }
          })
        )
      }
    }
  }, [categories, items])

  if (!isOpen) return null

  const handleFileChange = async (selectedFile: File) => {
    try {
      haptics.light()
      const result = await parseStatementFile(selectedFile, categories, existingTransactions)
      setParseResult(result)
      setItems(result.transactions)
    } catch (error) {
      console.error('Erro ao processar extrato:', error)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleToggleItem = (id: string) => {
    haptics.light()
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    )
  }

  const handleToggleAll = (select: boolean) => {
    haptics.light()
    setItems((prev) => prev.map((item) => ({ ...item, selected: select })))
  }

  const handleCategoryChange = (id: string, newCategoryId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, categoryId: newCategoryId } : item))
    )
  }

  const selectedCount = items.filter((i) => i.selected).length
  const selectedIncome = items
    .filter((i) => i.selected && i.type === 'income')
    .reduce((sum, i) => sum + i.amount, 0)
  const selectedExpense = items
    .filter((i) => i.selected && i.type === 'expense')
    .reduce((sum, i) => sum + i.amount, 0)

  const handleConfirmImport = async () => {
    const toImport = items.filter((i) => i.selected)
    if (toImport.length === 0) return

    try {
      setIsLoading(true)
      haptics.medium()

      const payload = toImport.map((i) => ({
        description: i.description,
        amount: i.amount,
        type: i.type,
        date: i.date,
        categoryId: i.categoryId || categories[0]?.id,
        paymentMethod: targetAccount === 'credit' ? 'credit' : 'cash',
      }))

      await onImportBatch(payload)
      onClose()
      // Resetar estado
      setParseResult(null)
      setItems([])
    } catch (error) {
      console.error('Erro na importação em lote:', error)
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
              className="bg-white dark:bg-neutral-900 rounded-t-[2.25rem] sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[92vh] overflow-hidden border-t sm:border border-gray-100 dark:border-neutral-800 flex flex-col pointer-events-auto"
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
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-display">
                      Importar Extrato Bancário
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      Upload de arquivos CSV ou OFX do banco ou cartão
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
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {!parseResult ? (
            /* Área de Drag & Drop de Arquivo */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-neutral-750 hover:border-primary-500 dark:hover:border-primary-500 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50/50 dark:bg-neutral-800/20 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.ofx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0])
                  }
                }}
              />

              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-md border border-gray-150 dark:border-neutral-700 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Clique ou arraste seu extrato para cá
              </h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-md">
                Suporta extratos e faturas em formatos <strong>.CSV</strong> ou <strong>.OFX</strong> de qualquer banco (Nubank, Itaú, Inter, Bradesco, Santander, etc.)
              </p>

              <div className="flex items-center gap-2 mt-4 text-[11px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 px-3 py-1.5 rounded-full border border-primary-200/50 dark:border-primary-900/30">
                <span>Detecção automática de duplicadas e categorias</span>
              </div>
            </div>
          ) : (
            /* Área de Prévia e Seleção */
            <div className="space-y-4">
              {/* Barra de Resumo do Arquivo */}
              <div className="p-4 bg-gray-50/80 dark:bg-neutral-800/40 rounded-2xl border border-gray-150 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                      {parseResult.fileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      {items.length} lançamentos encontrados ({parseResult.fileType.toUpperCase()})
                    </p>
                  </div>
                </div>

                {/* Métricas Rápidas */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Receitas</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{fmtCurrency(selectedIncome)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Despesas</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      -{fmtCurrency(selectedExpense)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setParseResult(null)
                      setItems([])
                    }}
                    className="btn-secondary h-8 px-3 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Trocar</span>
                  </button>
                </div>
              </div>

              {/* Alerta de Duplicadas se existirem */}
              {parseResult.duplicateCount > 0 && (
                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    Identificamos <strong>{parseResult.duplicateCount}</strong> transações com data e valor semelhantes no seu histórico. Por segurança, elas vêm desmarcadas.
                  </span>
                </div>
              )}

              {/* Controles de Seleção e Conta de Destino */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAll(true)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Marcar todas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAll(false)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Desmarcar todas
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[11px] font-semibold">Conta de Destino:</span>
                  <div className="flex p-0.5 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setTargetAccount('account')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        targetAccount === 'account'
                          ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-xs'
                          : 'text-gray-500'
                      }`}
                    >
                      Conta Corrente / Saldo
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetAccount('credit')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        targetAccount === 'credit'
                          ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-xs'
                          : 'text-gray-500'
                      }`}
                    >
                      Cartão de Crédito
                    </button>
                  </div>
                </div>
              </div>

              {/* Visualização Desktop: Tabela Completa */}
              <div className="hidden sm:block border border-gray-150 dark:border-neutral-800 rounded-2xl overflow-hidden max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-neutral-800/60 sticky top-0 border-b border-gray-100 dark:border-neutral-800 text-[10px] uppercase font-bold text-gray-400">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <Check className="w-3.5 h-3.5 mx-auto" />
                      </th>
                      <th className="p-3 w-24">Data</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3 w-40">Categoria Sugerida</th>
                      <th className="p-3 w-28 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          item.selected
                            ? 'bg-white dark:bg-neutral-900'
                            : 'bg-gray-50/40 dark:bg-neutral-900/40 opacity-60'
                        }`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleItem(item.id)}
                            className="w-4 h-4 text-primary-600 rounded border-gray-300 dark:border-neutral-700 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-mono text-[11px] text-gray-600 dark:text-neutral-400">
                          {item.date.split('-').reverse().join('/')}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {item.description}
                            </span>
                            {item.isDuplicate && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex-shrink-0"
                                title={item.duplicateReason}
                              >
                                Duplicada
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <select
                            value={item.categoryId}
                            onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                            className="w-full text-xs py-1 px-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-neutral-200"
                          >
                            <option value="">Selecione...</option>
                            {categories
                              .filter((c) => c.type === item.type)
                              .map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="p-3 text-right font-bold">
                          <span
                            className={
                              item.type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-900 dark:text-white'
                            }
                          >
                            {item.type === 'income' ? '+' : '-'} {fmtCurrency(item.amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visualização Mobile: Cards Nativos Estilo Extrato */}
              <div className="sm:hidden space-y-2.5 max-h-[350px] overflow-y-auto pr-0.5 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      item.selected
                        ? 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 shadow-xs'
                        : 'bg-gray-50/50 dark:bg-neutral-900/40 border-gray-150 dark:border-neutral-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-5 h-5 mt-0.5 rounded text-primary-600 border-gray-300 dark:border-neutral-700 cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono text-gray-400 dark:text-neutral-500">
                                {item.date.split('-').reverse().join('/')}
                              </span>
                              {item.isDuplicate && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                                  Duplicada
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-xs font-extrabold flex-shrink-0 font-display ${
                              item.type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {item.type === 'income' ? '+' : '-'} {fmtCurrency(item.amount)}
                          </span>
                        </div>

                        {/* Seletor de Categoria Mobile */}
                        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-neutral-700/60 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0">
                            Categoria:
                          </span>
                          <select
                            value={item.categoryId}
                            onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                            className="flex-1 text-[11px] font-medium py-1 px-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 text-gray-800 dark:text-neutral-200 truncate"
                          >
                            <option value="">Selecione...</option>
                            {categories
                              .filter((c) => c.type === item.type)
                              .map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer com suporte a Safe Area no Mobile */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-neutral-800/20 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4 flex-shrink-0">
          <span className="text-xs text-gray-500 dark:text-neutral-400 text-center sm:text-left w-full sm:w-auto">
            {parseResult ? (
              <>
                <strong className="text-gray-900 dark:text-white">{selectedCount}</strong> de {items.length} selecionadas para importação
              </>
            ) : (
              'Selecione um arquivo para continuar'
            )}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none btn-secondary h-10 px-4 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>

            {parseResult && (
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isLoading || selectedCount === 0}
                className="flex-1 sm:flex-none btn-primary h-10 px-5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/10 active:scale-[0.98] transition-transform"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Importando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Importar {selectedCount} Lançamentos</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
  )}
  </AnimatePresence>,
  document.body
  )
}

export default ImportTransactionsModal
