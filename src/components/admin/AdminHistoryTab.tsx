import React, { useState, useEffect } from 'react'
import { Bell, RefreshCw, CheckCircle2, AlertTriangle, Info, XCircle, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import api from '@/config/api'
import { haptics } from '@/utils/haptics'

export interface NotificationHistoryItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category?: string
  isRead?: boolean
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  } | null
}

export const AdminHistoryTab: React.FC = () => {
  const [history, setHistory] = useState<NotificationHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/admin/notifications/history')
      setHistory(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar histórico de notificações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const filteredHistory = history.filter((item) => {
    if (filterType === 'all') return true
    return item.type === filterType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-primary-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                Histórico de Notificações
              </h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                Acompanhe os últimos comunicados enviados para usuários ou em massa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              haptics.light()
              loadHistory()
            }}
            disabled={isLoading}
            className="btn-secondary h-9 px-3.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Chips de Filtro por Tipo */}
        <div className="pt-2 border-t border-gray-100 dark:border-neutral-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'Todos os tipos' },
            { id: 'info', label: 'Informação' },
            { id: 'success', label: 'Sucesso' },
            { id: 'warning', label: 'Alerta' },
            { id: 'error', label: 'Erro' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                haptics.light()
                setFilterType(chip.id)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === chip.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200/60'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista do Histórico */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-500 dark:text-neutral-400 font-semibold">
              Carregando histórico...
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Bell className="w-10 h-10 text-gray-300 dark:text-neutral-700 mx-auto mb-2 opacity-70" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
              Nenhuma notificação encontrada
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              Quando você enviar notificações em massa ou individuais, o histórico aparecerá listado aqui.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800/60">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-gray-50/50 dark:hover:bg-neutral-800/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="mt-0.5 p-2 rounded-xl bg-gray-50 dark:bg-neutral-800 flex-shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      {item.category && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 text-xs text-gray-400 dark:text-neutral-500 flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-1 text-[11px]">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.user ? item.user.name : 'Transmissão em massa'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminHistoryTab
