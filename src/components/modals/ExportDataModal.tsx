import { AlertTriangle, Shield, Lock, Cloud, X } from 'lucide-react'

interface ExportDataModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const ExportDataModal = ({ isOpen, onClose, onConfirm }: ExportDataModalProps) => {
  console.log('🔍 [ExportDataModal] isOpen:', isOpen)
  
  if (!isOpen) return null

  const handleConfirm = () => {
    console.log('✅ [ExportDataModal] Confirmando exportação')
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Avisos de Segurança</h2>
              <p className="text-white/80 text-sm">Leia com atenção antes de continuar</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                  Dados Sensíveis
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  O arquivo contém TODOS os seus dados financeiros
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                  Armazenamento Seguro
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Guarde em local seguro e não compartilhe publicamente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Criptografia Recomendada
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Use criptografia se armazenar em nuvem
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
            <p className="text-sm text-gray-600 dark:text-neutral-400 text-center">
              Ao continuar, você confirma que leu e entendeu os avisos acima
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-neutral-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors border border-gray-300 dark:border-neutral-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl"
          >
            Continuar Exportação
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportDataModal
