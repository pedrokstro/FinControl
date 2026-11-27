import React, { useState, useMemo } from 'react'
import { Search, Crown, Mail, Calendar, Send, UserCheck, UserX, RefreshCw, Filter, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { haptics } from '@/utils/haptics'

export interface AdminUser {
  id: string
  name: string
  email: string
  isPremium: boolean
  createdAt: string
  role?: string
  isActive?: boolean
  planType?: string
}

interface AdminUsersTabProps {
  users: AdminUser[]
  isLoading: boolean
  onRefresh: () => void
  onTogglePremium: (userId: string) => Promise<void>
  onToggleStatus: (userId: string) => Promise<void>
  onOpenDirectNotification: (user: AdminUser) => void
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  isLoading,
  onRefresh,
  onTogglePremium,
  onToggleStatus,
  onOpenDirectNotification,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<'all' | 'premium' | 'free'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPlan =
        filterPlan === 'all'
          ? true
          : filterPlan === 'premium'
          ? u.isPremium
          : !u.isPremium

      const matchesStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'active'
          ? u.isActive !== false
          : u.isActive === false

      return matchesSearch && matchesPlan && matchesStatus
    })
  }, [users, searchTerm, filterPlan, filterStatus])

  const premiumCount = users.filter((u) => u.isPremium).length
  const freeCount = users.length - premiumCount

  const handleTogglePremium = async (userId: string) => {
    try {
      setActionLoadingId(userId)
      haptics.medium()
      await onTogglePremium(userId)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      setActionLoadingId(userId)
      haptics.medium()
      await onToggleStatus(userId)
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros e Ações */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
              Gestão da Base de Usuários
            </h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              Pesquise, gerencie planos, status de contas e envie avisos diretos
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              haptics.light()
              onRefresh()
            }}
            disabled={isLoading}
            className="btn-secondary h-9 px-3.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar Lista</span>
          </button>
        </div>

        {/* Barra de Busca e Filtros Rápidos */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pt-2 border-t border-gray-100 dark:border-neutral-800/60">
          {/* Input de Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="input-field pl-10 h-10 text-xs w-full"
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

          {/* Chips de Filtro */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => {
                haptics.light()
                setFilterPlan('all')
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterPlan === 'all'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200/60 dark:hover:bg-neutral-700/60'
              }`}
            >
              Todos ({users.length})
            </button>

            <button
              type="button"
              onClick={() => {
                haptics.light()
                setFilterPlan('premium')
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterPlan === 'premium'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100/60'
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>Premium ({premiumCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                haptics.light()
                setFilterPlan('free')
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterPlan === 'free'
                  ? 'bg-gray-800 dark:bg-neutral-200 text-white dark:text-neutral-900 shadow-sm'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200/60 dark:hover:bg-neutral-700/60'
              }`}
            >
              Gratuito ({freeCount})
            </button>

            <span className="w-px h-5 bg-gray-200 dark:border-neutral-800 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={() => {
                haptics.light()
                setFilterStatus((prev) => (prev === 'active' ? 'all' : 'active'))
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/60'
              }`}
            >
              Ativos
            </button>

            <button
              type="button"
              onClick={() => {
                haptics.light()
                setFilterStatus((prev) => (prev === 'suspended' ? 'all' : 'suspended'))
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'suspended'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 hover:bg-red-100/60'
              }`}
            >
              Suspensos
            </button>
          </div>
        </div>
      </div>

      {/* Lista / Tabela de Usuários */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-500 dark:text-neutral-400 font-semibold">
              Carregando dados dos usuários...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Filter className="w-10 h-10 text-gray-300 dark:text-neutral-700 mx-auto mb-2 opacity-70" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
              Nenhum usuário encontrado
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              Nenhum registro corresponde aos filtros selecionados. Tente alterar o termo de busca.
            </p>
            {(searchTerm || filterPlan !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setFilterPlan('all')
                }}
                className="btn-secondary h-8 px-3 text-xs font-semibold mt-4"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 bg-gray-50/40 dark:bg-neutral-900/40">
                  <th className="py-3.5 pl-6">Usuário</th>
                  <th className="py-3.5">Plano</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Cadastro</th>
                  <th className="py-3.5 pr-6 text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/40 text-xs">
                {filteredUsers.map((u) => {
                  const isOperating = actionLoadingId === u.id
                  const isUserActive = u.isActive !== false

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                    >
                      {/* Avatar e Identificação */}
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100/50 dark:border-primary-900/20 flex items-center justify-center flex-shrink-0 text-primary-600 dark:text-primary-400 font-extrabold text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-gray-900 dark:text-white truncate">
                                {u.name}
                              </span>
                              {u.role === 'admin' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/40">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5 truncate max-w-[220px] sm:max-w-none">
                              <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Badge do Plano */}
                      <td className="py-4">
                        {u.isPremium ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-amber-200/50 dark:border-amber-900/20">
                            <Crown className="w-3 h-3" />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded-full text-[10px] font-semibold">
                            Gratuito
                          </span>
                        )}
                      </td>

                      {/* Status da Conta */}
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            isUserActive
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/20'
                              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100/60 dark:border-red-900/20'
                          }`}
                        >
                          {isUserActive ? 'Ativo' : 'Suspenso'}
                        </span>
                      </td>

                      {/* Data de Criação */}
                      <td className="py-4 text-gray-500 dark:text-neutral-400 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>
                            {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botão Mensagem Direta */}
                          <button
                            type="button"
                            onClick={() => {
                              haptics.light()
                              onOpenDirectNotification(u)
                            }}
                            className="h-8 px-2.5 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition-colors"
                            title="Enviar notificação individual para este usuário"
                          >
                            <Send className="w-3 h-3" />
                            <span className="hidden sm:inline">Mensagem</span>
                          </button>

                          {/* Botão Alternar Premium */}
                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => handleTogglePremium(u.id)}
                            className={`h-8 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition-all ${
                              u.isPremium
                                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100/60'
                                : 'bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:text-amber-600 hover:bg-amber-50/50'
                            }`}
                            title={u.isPremium ? 'Remover assinatura Premium' : 'Conceder acesso Premium'}
                          >
                            <Crown className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {u.isPremium ? 'Desativar Premium' : 'Tornar Premium'}
                            </span>
                          </button>

                          {/* Botão Alternar Status Ativo/Suspenso */}
                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => handleToggleStatus(u.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isUserActive
                                ? 'bg-gray-50 dark:bg-neutral-800 text-gray-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20'
                                : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 hover:bg-emerald-100/60'
                            }`}
                            title={isUserActive ? 'Suspender usuário' : 'Reativar usuário'}
                          >
                            {isUserActive ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
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

export default AdminUsersTab
