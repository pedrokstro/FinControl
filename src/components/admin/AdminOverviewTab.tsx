import React, { useState } from 'react'
import { Users, Crown, Bell, Send, Sparkles, TrendingUp, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react'
import CustomSelect from '@/components/common/CustomSelect'
import { haptics } from '@/utils/haptics'

export interface Stats {
  totalUsers: number
  premiumUsers: number
  totalNotifications: number
}

interface AdminOverviewTabProps {
  stats: Stats
  onSelectTab: (tab: 'overview' | 'users' | 'cards' | 'history') => void
  onSendBroadcast: (formData: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    category: 'system' | 'premium' | 'transaction' | 'goal' | 'budget'
    onlyPremium: boolean
  }) => Promise<void>
  onSendQuick: (notification: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    category: 'system' | 'premium' | 'transaction' | 'goal' | 'budget'
    onlyPremium: boolean
  }) => Promise<void>
  isLoading: boolean
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  stats,
  onSelectTab,
  onSendBroadcast,
  onSendQuick,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    category: 'system' as 'system' | 'premium' | 'transaction' | 'goal' | 'budget',
    onlyPremium: false,
  })

  const conversionRate = stats.totalUsers > 0
    ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)
    : '0'

  const quickNotifications = [
    {
      title: 'Novos Recursos Premium',
      message: 'Confira os novos relatórios avançados disponíveis na plataforma!',
      type: 'success' as const,
      category: 'premium' as const,
      onlyPremium: true,
    },
    {
      title: 'Manutenção Programada',
      message: 'O sistema passará por uma rápida atualização técnica na madrugada.',
      type: 'warning' as const,
      category: 'system' as const,
      onlyPremium: false,
    },
    {
      title: 'Condições Especiais de Assinatura',
      message: 'Desconto imperdível no plano Premium por tempo limitado.',
      type: 'info' as const,
      category: 'premium' as const,
      onlyPremium: false,
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    haptics.medium()
    await onSendBroadcast(formData)
    setFormData({
      title: '',
      message: '',
      type: 'info',
      category: 'system',
      onlyPremium: false,
    })
  }

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
      {/* Grade de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Usuários */}
        <button
          type="button"
          onClick={() => {
            haptics.light()
            onSelectTab('users')
          }}
          className="group relative p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-150 text-left cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 dark:text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                Total de Usuários
              </p>
              <h3 className="text-3xl font-extrabold mt-1 text-gray-900 dark:text-white font-display">
                {stats.totalUsers}
              </h3>
              <p className="text-[11px] text-primary-600 dark:text-primary-400 mt-1 font-semibold flex items-center gap-1">
                Ver todos os usuários →
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </button>

        {/* Usuários Premium */}
        <button
          type="button"
          onClick={() => {
            haptics.light()
            onSelectTab('users')
          }}
          className="group relative p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-150 text-left cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 dark:text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                Assinantes Premium
              </p>
              <h3 className="text-3xl font-extrabold mt-1 text-amber-500 font-display">
                {stats.premiumUsers}
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                {conversionRate}% de conversão
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 group-hover:scale-105 group-hover:rotate-6 transition-transform">
              <Crown className="w-6 h-6" />
            </div>
          </div>
        </button>

        {/* Notificações Disparadas */}
        <button
          type="button"
          onClick={() => {
            haptics.light()
            onSelectTab('history')
          }}
          className="group relative p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-150 text-left cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 dark:text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                Notificações Enviadas
              </p>
              <h3 className="text-3xl font-extrabold mt-1 text-gray-900 dark:text-white font-display">
                {stats.totalNotifications}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                Ver histórico de envios →
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
          </div>
        </button>

        {/* Status do Sistema */}
        <div className="relative p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-violet-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 dark:text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                Saúde do Sistema
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-bold text-gray-900 dark:text-white font-display">
                  Operacional
                </span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
                API e Banco sincronizados
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Envio e Modelos Rápidos */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Formulário com Live Preview */}
        <div className="xl:col-span-7 p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                Transmissão de Notificação em Massa
              </h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Dispare comunicados instantâneos para a base de usuários
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                Título do Comunicado
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Atualização importante no sistema"
                className="input-field mt-1"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                Mensagem
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Escreva detalhadamente o comunicado que todos os usuários receberão..."
                className="input-field mt-1 min-h-[90px]"
                maxLength={500}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Tipo
                </label>
                <div className="mt-1">
                  <CustomSelect
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val as any })}
                    options={[
                      { value: 'info', label: 'Informação' },
                      { value: 'success', label: 'Sucesso' },
                      { value: 'warning', label: 'Alerta' },
                      { value: 'error', label: 'Erro' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Categoria
                </label>
                <div className="mt-1">
                  <CustomSelect
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val as any })}
                    options={[
                      { value: 'system', label: 'Sistema' },
                      { value: 'premium', label: 'Premium' },
                      { value: 'transaction', label: 'Transação' },
                      { value: 'goal', label: 'Meta' },
                      { value: 'budget', label: 'Orçamento' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="onlyPremiumBroadcast"
                checked={formData.onlyPremium}
                onChange={(e) => setFormData({ ...formData, onlyPremium: e.target.checked })}
                className="w-4 h-4 text-primary-600 dark:text-primary-500 rounded border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500/20 focus:ring-offset-0"
              />
              <label htmlFor="onlyPremiumBroadcast" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 cursor-pointer">
                Enviar apenas para usuários Premium
              </label>
            </div>

            {/* Live Preview da Notificação */}
            <div className="p-4 bg-gray-50/70 dark:bg-neutral-800/30 rounded-2xl border border-gray-100 dark:border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 block mb-2">
                Como os usuários visualizarão:
              </span>
              <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200/60 dark:border-neutral-800 shadow-sm flex items-start gap-3">
                <div className="mt-0.5">{getTypeIcon(formData.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                    {formData.title || 'Título da notificação'}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                    {formData.message || 'O conteúdo do comunicado será exibido aqui no painel do usuário.'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded">
                      {formData.category}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      Público: {formData.onlyPremium ? 'Apenas Premium' : 'Toda a base'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-md shadow-primary-500/10 active:scale-[0.99] transition-transform"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Disparando Notificação...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Disparar para a Base
                </>
              )}
            </button>
          </form>
        </div>

        {/* Modelos Rápidos de Notificação */}
        <div className="xl:col-span-5 p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                  Modelos Prontos
                </h2>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Disparos rápidos em 1 clique para cenários comuns
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {quickNotifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50/50 dark:bg-neutral-800/20 hover:bg-gray-100/50 dark:hover:bg-neutral-800/40 rounded-xl border border-gray-100 dark:border-neutral-800/60 transition-colors"
                >
                  <h3 className="font-bold text-gray-800 dark:text-white text-xs mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-neutral-400 leading-normal mb-3">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gray-150 dark:bg-neutral-800 text-gray-650 dark:text-neutral-300">
                        {notification.onlyPremium ? 'Premium' : 'Todos'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        haptics.light()
                        onSendQuick(notification)
                      }}
                      disabled={isLoading}
                      className="btn-secondary h-8 px-3 text-xs font-bold active:scale-[0.98] transition-transform"
                    >
                      Disparar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-primary-50/60 dark:bg-primary-950/20 border border-primary-100/60 dark:border-primary-900/20 text-xs text-primary-800 dark:text-primary-300">
            <p className="font-semibold">Dica de gestão:</p>
            <p className="text-[11px] mt-0.5 opacity-90">
              Notificações com categoria adequada aparecem agrupadas no centro de notificações e geram maior engajamento dos assinantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverviewTab
