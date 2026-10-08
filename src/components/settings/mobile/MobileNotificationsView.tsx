import React from 'react'
import {
  ChevronLeft,
  Mail,
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { haptics } from '@/utils/haptics'

interface NotificationPreferences {
  emailTransactions: boolean
  weeklyReport: boolean
  budgetAlerts: boolean
  newsUpdates: boolean
}

interface MobileNotificationsViewProps {
  onBack: () => void
  notifications: NotificationPreferences
  toggleNotification: (key: keyof NotificationPreferences) => void
}

export const MobileNotificationsView: React.FC<MobileNotificationsViewProps> = ({
  onBack,
  notifications,
  toggleNotification,
}) => {
  return (
    <div className="pb-28 pt-1 animate-fadeIn select-none">
      {/* 1. Header Nativo com Botão Voltar */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            haptics.light()
            onBack()
          }}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 active:scale-90 transition-all"
          aria-label="Voltar para Ajustes"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display tracking-tight">
          Notificações
        </h1>
      </div>

      {/* 2. Grupo 1: Movimentações e Alertas */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Alertas Financeiros
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          {/* Email de Transações */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-gray-900 dark:text-white block">
                  E-mail de transações
                </span>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block leading-tight mt-0.5">
                  Aviso imediato a cada movimentação
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.emailTransactions}
                onChange={() => {
                  haptics.light()
                  toggleNotification('emailTransactions')
                }}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Resumo Semanal */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-gray-900 dark:text-white block">
                  Resumo semanal
                </span>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block leading-tight mt-0.5">
                  Relatório consolidado aos finais de semana
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.weeklyReport}
                onChange={() => {
                  haptics.light()
                  toggleNotification('weeklyReport')
                }}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Alertas de Orçamento */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-gray-900 dark:text-white block">
                  Alertas de orçamento
                </span>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block leading-tight mt-0.5">
                  Aviso quando limites forem atingidos
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.budgetAlerts}
                onChange={() => {
                  haptics.light()
                  toggleNotification('budgetAlerts')
                }}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Grupo 2: Novidades */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Comunicação
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-gray-900 dark:text-white block">
                  Novidades e recursos
                </span>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block leading-tight mt-0.5">
                  Novas ferramentas e dicas de controle
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.newsUpdates}
                onChange={() => {
                  haptics.light()
                  toggleNotification('newsUpdates')
                }}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
