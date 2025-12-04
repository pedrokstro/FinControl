import { useState } from 'react'
import { AlertTriangle, X, Mail, Shield, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (code: string) => Promise<void>
  userEmail: string
}

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, userEmail }: DeleteAccountModalProps) => {
  const [step, setStep] = useState<'warning' | 'code' | 'final'>('warning')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)

  if (!isOpen) return null

  const handleSendCode = async () => {
    setIsSendingCode(true)
    try {
      // TODO: Implementar envio real de código
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Código enviado para ${userEmail}`)
      setStep('code')
    } catch (error) {
      toast.error('Erro ao enviar código. Tente novamente.')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleValidateCode = () => {
    if (code.length !== 6) {
      toast.error('Digite o código de 6 dígitos')
      return
    }
    setStep('final')
  }

  const handleConfirmDelete = async () => {
    setIsLoading(true)
    try {
      await onConfirm(code)
    } catch (error) {
      toast.error('Erro ao excluir conta. Tente novamente.')
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('warning')
    setCode('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
        
        {/* Step 1: Warning */}
        {step === 'warning' && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Excluir Conta</h2>
                  <p className="text-white/80 text-sm">Esta ação é irreversível</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    ⚠️ Atenção: Dados Permanentemente Perdidos
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Todas as suas transações serão excluídas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Categorias personalizadas serão perdidas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Configurações e preferências serão apagadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Assinatura Premium será cancelada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Não será possível recuperar esses dados</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                    💡 Alternativa: Exportar seus dados
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Considere exportar seus dados antes de excluir a conta. Você pode fazer isso em Configurações → Dados e Privacidade.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-neutral-800 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors border border-gray-300 dark:border-neutral-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendCode}
                disabled={isSendingCode}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSendingCode ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Continuar
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Step 2: Code Validation */}
        {step === 'code' && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Verificação de Segurança</h2>
                  <p className="text-white/80 text-sm">Digite o código enviado</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Enviamos um código de 6 dígitos para:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {userEmail}
                </p>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Código de Verificação
                  </span>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="mt-1 w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    maxLength={6}
                    autoFocus
                  />
                </label>

                <button
                  onClick={handleSendCode}
                  disabled={isSendingCode}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                >
                  {isSendingCode ? 'Enviando...' : 'Reenviar código'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-neutral-800 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors border border-gray-300 dark:border-neutral-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleValidateCode}
                disabled={code.length !== 6}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar Código
              </button>
            </div>
          </>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 'final' && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 relative">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Confirmação Final</h2>
                  <p className="text-white/80 text-sm">Última chance para cancelar</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-300 dark:border-red-700 text-center space-y-3">
                <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto" />
                <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                  ⚠️ ATENÇÃO: AÇÃO IRREVERSÍVEL
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Ao confirmar, sua conta será <strong>permanentemente excluída</strong> e todos os seus dados serão <strong>perdidos para sempre</strong>.
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 font-semibold">
                  Não será possível desfazer esta ação.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-neutral-400 text-center">
                  Tem certeza absoluta que deseja excluir sua conta?
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-neutral-800 flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors border border-gray-300 dark:border-neutral-600 disabled:opacity-50"
              >
                Não, Manter Conta
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Sim, Excluir Conta'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DeleteAccountModal
