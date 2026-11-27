import React, { useState, useMemo } from 'react'
import { Plus, Edit3, Trash2, Sparkles, Search, Layers, Info, X } from 'lucide-react'
import { getDynamicIcon } from '@/utils/iconMapping'
import { haptics } from '@/utils/haptics'

export interface DashboardCardItem {
  id: string
  title: string
  desc: string
  icon?: string
  imageSrc?: string
  bg: string
  textColor: string
  descColor: string
  iconColor?: string
  iconBg?: string
  actionPath: string
  isActive: boolean
}

interface AdminCardsTabProps {
  cards: DashboardCardItem[]
  isLoading: boolean
  onOpenCardModal: (card?: DashboardCardItem) => void
  onDeleteCard: (id: string) => Promise<void>
  onToggleActive: (card: DashboardCardItem) => Promise<void>
}

export const AdminCardsTab: React.FC<AdminCardsTabProps> = ({
  cards,
  isLoading,
  onOpenCardModal,
  onDeleteCard,
  onToggleActive,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      const match =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.actionPath.toLowerCase().includes(searchTerm.toLowerCase())
      return match
    })
  }, [cards, searchTerm])

  const handleToggle = async (card: DashboardCardItem) => {
    try {
      setTogglingId(card.id)
      haptics.light()
      await onToggleActive(card)
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    haptics.medium()
    await onDeleteCard(id)
  }

  return (
    <div className="space-y-6">
      {/* Header com Ações e Busca */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                Cards de Aviso do Dashboard Mobile
              </h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                Gerencie comunicados, atalhos e dicas exclusivas para o carrossel mobile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              haptics.light()
              onOpenCardModal()
            }}
            className="btn-primary h-10 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary-500/10 active:scale-[0.98] transition-transform self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Card</span>
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="pt-2 border-t border-gray-100 dark:border-neutral-800/60 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por título, descrição ou destino..."
              className="input-field pl-10 h-9.5 text-xs w-full"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs font-semibold text-gray-400 dark:text-neutral-500">
            {cards.length} {cards.length === 1 ? 'card configurado' : 'cards configurados'}
          </span>
        </div>
      </div>

      {/* Tabela dos Cards com Toggle Rápido e Pré-visualização */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-500 dark:text-neutral-400 font-semibold">
              Carregando cards do dashboard...
            </p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Layers className="w-10 h-10 text-gray-300 dark:text-neutral-700 mx-auto mb-2 opacity-70" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
              Nenhum card encontrado
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              Nenhum card corresponde ao filtro ou nenhum aviso foi cadastrado ainda.
            </p>
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="btn-secondary h-8 px-3 text-xs font-semibold mt-4"
              >
                Limpar busca
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenCardModal()}
                className="btn-primary h-8 px-4 text-xs font-bold mt-4"
              >
                Criar o primeiro card
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 bg-gray-50/40 dark:bg-neutral-900/40">
                  <th className="py-3.5 pl-6">Card / Prévia</th>
                  <th className="py-3.5">Destino</th>
                  <th className="py-3.5 text-center">Visibilidade</th>
                  <th className="py-3.5 pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/40 text-xs">
                {filteredCards.map((c) => {
                  const IconComponent = getDynamicIcon(c.icon)
                  const isToggling = togglingId === c.id

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                    >
                      {/* Mini Prévia do Card */}
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${
                              c.bg.includes('bg-primary-600')
                                ? 'bg-primary-600 text-white'
                                : c.bg.includes('bg-amber-500')
                                ? 'bg-amber-500 text-white'
                                : c.bg.includes('bg-red')
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300'
                            } flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200/20 shadow-sm`}
                          >
                            {c.imageSrc ? (
                              <img src={c.imageSrc} alt="" className="w-full h-full object-cover" />
                            ) : IconComponent ? (
                              <IconComponent className="w-4 h-4" />
                            ) : (
                              <Info className="w-4 h-4 opacity-70" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                              {c.title}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-1 max-w-[320px]">
                              {c.desc}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Link de Destino */}
                      <td className="py-4 font-mono text-[11px] text-gray-600 dark:text-neutral-400">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded truncate max-w-[180px] inline-block">
                          {c.actionPath}
                        </span>
                      </td>

                      {/* Toggle Rápido Ativo/Inativo */}
                      <td className="py-4 text-center">
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() => handleToggle(c)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            c.isActive
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 hover:bg-emerald-100/60'
                              : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 hover:bg-gray-200/60'
                          }`}
                          title="Clique para alternar a visibilidade no mobile"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              c.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                          <span>{c.isActive ? 'Ativo no Mobile' : 'Oculto'}</span>
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              haptics.light()
                              onOpenCardModal(c)
                            }}
                            className="w-8 h-8 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg flex items-center justify-center transition-colors"
                            title="Editar card"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
                            className="w-8 h-8 bg-red-50 dark:bg-red-950/20 text-red-600 hover:text-red-700 rounded-lg flex items-center justify-center transition-colors"
                            title="Excluir card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCardsTab
