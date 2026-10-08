import React from 'react'
import {
  ChevronLeft,
  Camera,
  Upload,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  Check
} from 'lucide-react'
import { haptics } from '@/utils/haptics'

interface MobileProfileViewProps {
  user: any
  onBack: () => void
  avatarPreview: string | null
  isUploadingAvatar: boolean
  isSavingAvatar: boolean
  onAvatarClick: () => void
  onSaveAvatar: () => void
  onCancelAvatar: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  newEmail: string
  setNewEmail: (val: string) => void
  isEditingEmail: boolean
  setIsEditingEmail: (val: boolean) => void
  isSendingCode: boolean
  onRequestEmailChange: () => void
  onCancelEmailEdit: () => void
}

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  user,
  onBack,
  avatarPreview,
  isUploadingAvatar,
  isSavingAvatar,
  onAvatarClick,
  onSaveAvatar,
  onCancelAvatar,
  fileInputRef,
  onAvatarChange,
  newEmail,
  setNewEmail,
  isEditingEmail,
  setIsEditingEmail,
  isSendingCode,
  onRequestEmailChange,
  onCancelEmailEdit,
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
          Perfil
        </h1>
      </div>

      {/* 2. Área Central de Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <img
            src={avatarPreview || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
            alt={user?.name}
            className={`w-28 h-28 rounded-3xl object-cover border-4 border-white dark:border-neutral-800 shadow-xl transition-all ${
              isUploadingAvatar || isSavingAvatar ? 'opacity-50 scale-95' : ''
            }`}
          />

          <button
            type="button"
            onClick={() => {
              haptics.light()
              onAvatarClick()
            }}
            disabled={isUploadingAvatar || isSavingAvatar}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-md active:scale-90 transition-transform cursor-pointer"
            title="Alterar foto de perfil"
          >
            {isUploadingAvatar || isSavingAvatar ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-4.5 h-4.5" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
            onChange={onAvatarChange}
            className="hidden"
            disabled={isUploadingAvatar || isSavingAvatar}
          />
        </div>

        {avatarPreview && (
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                haptics.light()
                onSaveAvatar()
              }}
              disabled={isSavingAvatar}
              className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              {isSavingAvatar ? 'Salvando...' : 'Salvar Nova Foto'}
            </button>
            <button
              type="button"
              onClick={() => {
                haptics.light()
                onCancelAvatar()
              }}
              disabled={isSavingAvatar}
              className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 text-xs font-bold py-2 px-4 rounded-xl active:scale-95 transition-transform"
            >
              Cancelar
            </button>
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-3 font-display">
          {user?.name || 'Usuário'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-neutral-400">
          {user?.email || ''}
        </p>
      </div>

      {/* 3. Grupo de Dados Pessoais Estilo Inset Grouped */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Informações da Conta
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          {/* Nome */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-gray-400 dark:text-neutral-500 block leading-tight">
                  Nome Completo
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate block mt-0.5">
                  {user?.name || 'Não informado'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md shrink-0">
              Principal
            </span>
          </div>

          {/* Email */}
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-400 dark:text-neutral-500 block leading-tight">
                    E-mail de Acesso
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate block mt-0.5">
                    {user?.email || 'Não informado'}
                  </span>
                </div>
              </div>

              {!isEditingEmail && (
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setIsEditingEmail(true)
                  }}
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 py-1 px-2.5 rounded-lg active:bg-primary-50 dark:active:bg-primary-950/30 transition-colors shrink-0"
                >
                  Alterar
                </button>
              )}
            </div>

            {/* Formulário de alteração de email inline */}
            {isEditingEmail && (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800/80 space-y-3">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Digite seu novo e-mail"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.medium()
                      onRequestEmailChange()
                    }}
                    disabled={isSendingCode}
                    className="flex-1 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {isSendingCode ? 'Enviando Código...' : 'Enviar Código'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light()
                      onCancelEmailEdit()
                    }}
                    className="flex-1 h-10 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center active:scale-95"
                  >
                    Cancelar
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-neutral-500">
                  Um código de segurança será enviado ao novo e-mail para confirmação.
                </p>
              </div>
            )}
          </div>

          {/* Plano */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block leading-tight">
                  Status da Assinatura
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white block mt-0.5">
                  {user?.isPremium ? 'Plano Premium' : 'Plano Gratuito'}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              user?.isPremium
                ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/50'
                : 'text-gray-500 bg-gray-100 dark:bg-neutral-800'
            }`}>
              {user?.isPremium ? 'Ativo' : 'Básico'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
