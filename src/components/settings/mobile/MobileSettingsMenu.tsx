import React from 'react'
import {
  User,
  Shield,
  Bell,
  Palette,
  History,
  ChevronRight,
  Camera,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CreditCard
} from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { useNavigate } from 'react-router-dom'

interface MobileSettingsMenuProps {
  user: any
  onSelectTab: (tab: 'profile' | 'security' | 'notifications' | 'preferences' | 'changelog') => void
  onAvatarClick: () => void
  onLogout: () => void
  version: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export const MobileSettingsMenu: React.FC<MobileSettingsMenuProps> = ({
  user,
  onSelectTab,
  onAvatarClick,
  onLogout,
  version,
  theme,
  onToggleTheme,
}) => {
  const navigate = useNavigate()

  return (
    <div className="pb-24 pt-2 select-none animate-fadeIn">
      {/* 1. Título Nativo */}
      <div className="mb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight">
          Ajustes
        </h1>
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
          Gerencie sua conta e preferências do aplicativo
        </p>
      </div>

      {/* 2. Card de Perfil Estilo Apple ID / Banco Digital */}
      <div
        onClick={() => {
          haptics.light()
          onSelectTab('profile')
        }}
        className="w-full bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-3xl p-4 shadow-sm mb-5 flex items-center gap-3.5 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="relative shrink-0">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-neutral-800 shadow-md"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              haptics.light()
              onAvatarClick()
            }}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-primary-600 text-white flex items-center justify-center shadow-sm border border-white dark:border-neutral-900"
            title="Alterar foto"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-white truncate font-display">
              {user?.name || 'Usuário'}
            </h2>
            {user?.isPremium && (
              <span className="shrink-0 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/40">
                PRO
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-neutral-400 truncate mt-0.5">
            {user?.email || ''}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-1">
            Ver e editar perfil
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 3. Grupo 1: Conta & Acesso */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Conta & Segurança
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          {/* Perfil */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onSelectTab('profile')
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 flex items-center justify-center shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Perfil
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate block">
                Nome, foto e e-mail
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
          </button>

          {/* Segurança */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onSelectTab('security')
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/40 flex items-center justify-center shrink-0">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Segurança
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate block">
                Senha, biometria e privacidade
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
          </button>
        </div>
      </div>

      {/* 4. Grupo 2: Sistema & Experiência */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Preferências
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          {/* Notificações */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onSelectTab('notifications')
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100/60 dark:border-rose-900/40 flex items-center justify-center shrink-0">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Notificações
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate block">
                Alertas por e-mail e orçamento
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
          </button>

          {/* Preferências */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onSelectTab('preferences')
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100/60 dark:border-amber-900/40 flex items-center justify-center shrink-0">
              <Palette className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Preferências
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate block">
                Aparência, idioma e moeda
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
          </button>

          {/* Alternar Tema Rápido */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
                {theme === 'dark' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                  Modo Escuro
                </span>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block">
                  {theme === 'dark' ? 'Ativado' : 'Desativado'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === 'dark'}
                onChange={() => {
                  haptics.light()
                  onToggleTheme()
                }}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 5. Grupo 3: Sistema & Versão */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Sobre o Aplicativo
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          {/* Atualizações */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onSelectTab('changelog')
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100/60 dark:border-purple-900/40 flex items-center justify-center shrink-0">
              <History className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Atualizações & Changelog
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate block">
                Novidades e melhorias recentes
              </span>
            </div>
            <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded-full border border-primary-100 dark:border-primary-900/50 mr-1">
              v{version}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
          </button>

          {/* Planos */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              navigate('/app/plans')
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100/60 dark:border-amber-900/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Planos & Assinatura
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate block">
                Recursos exclusivos e limites
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
          </button>

          {/* Suporte */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              navigate('/support')
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Central de Ajuda
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate block">
                Dúvidas frequentes e suporte
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
          </button>
        </div>
      </div>

      {/* 6. Grupo 4: Sessão e Logout */}
      <div className="mb-4">
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => {
              haptics.medium()
              onLogout()
            }}
            className="w-full flex items-center justify-center gap-2 p-3.5 text-rose-600 dark:text-rose-400 active:bg-rose-50 dark:active:bg-rose-950/30 transition-colors text-sm font-bold"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      {/* 7. Rodapé de Versão */}
      <div className="text-center pt-2 pb-6">
        <p className="text-[11px] text-gray-400 dark:text-neutral-500 font-medium">
          FinControl v{version} • Feito para você
        </p>
      </div>
    </div>
  )
}
