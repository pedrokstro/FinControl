import { useState, useEffect } from 'react'
import { X, Mail, Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'
import userService from '@/services/user.service'
import { useAuthStore } from '@/store/authStore'

interface VerifyEmailChangeModalProps {
  isOpen: boolean
  onClose: () => void
  newEmail: string
}

const VerifyEmailChangeModal = ({ isOpen, onClose, newEmail }: VerifyEmailChangeModalProps) => {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const updateUser = useAuthStore((state) => state.updateUser)

  console.log('VerifyEmailChangeModal - isOpen:', isOpen, 'newEmail:', newEmail)

  // Limpar código quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setCode('')
      setIsVerifying(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.length !== 6) {
      toast.error('Digite o código de 6 dígitos')
      return
    }

    setIsVerifying(true)

    try {
      const updatedUser = await userService.confirmEmailChange(newEmail, code)
      
      // Atualizar usuário no store
      updateUser({ email: updatedUser.email })
      
      toast.success('Email alterado com sucesso!')
      
      // Limpar código e fechar modal
      setCode('')
      
      // Garantir que o modal fecha após sucesso
      setTimeout(() => {
        onClose()
      }, 100)
    } catch (error: any) {
      console.error('Erro ao verificar código:', error)
      toast.error(error.response?.data?.message || 'Código inválido ou expirado')
      setIsVerifying(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verificar Novo Email
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 text-sm">
            Enviamos um código de 6 dígitos para:
          </p>
          <p className="text-primary-600 dark:text-primary-400 font-semibold mt-1">
            {newEmail}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Código de Verificação
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                maxLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:text-white text-center text-2xl font-bold tracking-widest"
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-2">
              O código expira em 15 minutos
            </p>
          </div>

          {/* Info */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Importante:</p>
                <p>Após confirmar, você precisará usar o novo email para fazer login.</p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isVerifying || code.length !== 6}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isVerifying ? 'Verificando...' : 'Confirmar'}
            </button>
          </div>
        </form>

        {/* Reenviar */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Não recebeu o código?{' '}
            <button
              type="button"
              onClick={() => {
                userService.requestEmailChange(newEmail)
                toast.success('Código reenviado!')
              }}
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Reenviar
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailChangeModal
