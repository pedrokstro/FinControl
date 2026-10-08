import React from 'react'
import {
  ChevronLeft,
  Lock,
  Fingerprint,
  Smartphone,
  Database,
  Trash2,
  ShieldAlert
} from 'lucide-react'
import { haptics } from '@/utils/haptics'
import PasswordStrengthInput from '@/components/ui/PasswordStrengthInput'
import { UseFormReturn } from 'react-hook-form'

interface MobileSecurityViewProps {
  onBack: () => void
  passwordForm: UseFormReturn<any>
  onSubmitPassword: (data: any) => void
  watchedNewPassword: string
  isBiometricEnabled: boolean
  handleToggleBiometric: () => void
  biometricSupported: boolean
  setLocked: (val: boolean) => void
  onExportData: () => void
  onDeleteAccount: () => void
}

export const MobileSecurityView: React.FC<MobileSecurityViewProps> = ({
  onBack,
  passwordForm,
  onSubmitPassword,
  watchedNewPassword,
  isBiometricEnabled,
  handleToggleBiometric,
  biometricSupported,
  setLocked,
  onExportData,
  onDeleteAccount,
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
          Segurança
        </h1>
      </div>

      {/* 2. Grupo 1: Proteção por Biometria */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Proteção do Aplicativo
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-gray-900 dark:text-white block">
                  Acesso por Biometria
                </span>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block">
                  Digital ou Face ID ao abrir
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isBiometricEnabled}
                onChange={() => {
                  haptics.light()
                  handleToggleBiometric()
                }}
                disabled={!biometricSupported}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {!biometricSupported ? (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-xs leading-relaxed flex items-center gap-2">
              <Smartphone className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Seu navegador ou dispositivo móvel atual não possui suporte a biometria nativa.</span>
            </div>
          ) : (
            isBiometricEnabled && (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    haptics.medium()
                    setLocked(true)
                  }}
                  className="w-full h-10 bg-gray-50 dark:bg-neutral-800/80 hover:bg-gray-100 text-gray-700 dark:text-neutral-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Testar bloqueio biométrico agora</span>
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* 3. Grupo 2: Alteração de Senha */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Credenciais de Acesso
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Alterar Senha
              </h2>
              <p className="text-xs text-gray-400 dark:text-neutral-500">
                Atualize sua senha com segurança
              </p>
            </div>
          </div>

          <form
            onSubmit={passwordForm.handleSubmit((data) => {
              haptics.medium()
              onSubmitPassword(data)
            })}
            className="space-y-4"
          >
            <div>
              <PasswordStrengthInput
                id="mobileCurrentPassword"
                label="Senha Atual"
                {...passwordForm.register('currentPassword')}
                error={passwordForm.formState.errors.currentPassword?.message as string}
                showStrengthMeter={false}
                bgClass="bg-gray-50 dark:bg-neutral-800"
              />
            </div>

            <div>
              <PasswordStrengthInput
                id="mobileNewPassword"
                label="Nova Senha"
                value={watchedNewPassword}
                {...passwordForm.register('newPassword')}
                error={passwordForm.formState.errors.newPassword?.message as string}
                showStrengthMeter={true}
                bgClass="bg-gray-50 dark:bg-neutral-800"
              />
            </div>

            <div>
              <PasswordStrengthInput
                id="mobileConfirmPassword"
                label="Confirmar Nova Senha"
                {...passwordForm.register('confirmPassword')}
                error={passwordForm.formState.errors.confirmPassword?.message as string}
                showStrengthMeter={false}
                bgClass="bg-gray-50 dark:bg-neutral-800"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10 active:scale-95 transition-transform"
            >
              Salvar Nova Senha
            </button>
          </form>
        </div>
      </div>

      {/* 4. Grupo 3: Backup & Privacidade */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Gerenciamento de Dados
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onExportData()
            }}
            className="w-full flex items-center gap-3.5 p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Database className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                Exportar Meus Dados
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 block">
                Baixar backup estruturado em formato JSON
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Grupo 4: Zona de Perigo */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 px-3 mb-1.5 block">
          Zona Crítica
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-rose-100 dark:border-rose-950/50 rounded-2xl shadow-sm overflow-hidden p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-gray-900 dark:text-white block">
                Excluir Conta
              </span>
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5 leading-relaxed">
                Essa ação é irreversível e apagará todas as transações, metas e categorias salvas.
              </p>
              <button
                type="button"
                onClick={() => {
                  haptics.heavy()
                  onDeleteAccount()
                }}
                className="mt-3.5 w-full h-10 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir minha conta permanentemente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
