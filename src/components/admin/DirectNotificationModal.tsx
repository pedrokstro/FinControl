import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Send, Bell } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/config/api'
import CustomSelect from '@/components/common/CustomSelect'
import { haptics } from '@/utils/haptics'

export interface TargetUser {
  id: string
  name: string
  email: string
  isPremium?: boolean
}

interface DirectNotificationModalProps {
  user: TargetUser | null
  onClose: () => void
  onSuccess?: () => void
}

export const DirectNotificationModal: React.FC<DirectNotificationModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'error'>('info')
  const [category, setCategory] = useState<'system' | 'premium' | 'transaction' | 'goal' | 'budget'>('system')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    haptics.light()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [user, onClose])

  if (!user) return null

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      toast.error('Preencha o título e a mensagem')
      return
    }

    try {
      setIsLoading(true)
      haptics.light()
      await api.post(`/admin/send-notification/${user.id}`, {
        title,
        message,
        type,
        category,
      })
      toast.success(`Notificação enviada com sucesso para ${user.name}`)
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Erro ao enviar notificação direta:', error)
      toast.error(error.response?.data?.message || 'Erro ao enviar notificação')
    } finally {
      setIsLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop global cobrindo 100% da viewport */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Container de alinhamento com ponte de eventos segura */}
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-neutral-800 animate-in zoom-in-95 duration-150 flex flex-col pointer-events-auto"
        >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white font-display">
                Enviar Notificação Direta
              </h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400 truncate max-w-[220px]">
                Para: {user.name} ({user.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div>
            <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mensagem sobre sua conta"
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva a mensagem individual para o usuário..."
              className="input-field mt-1 min-h-[90px]"
              maxLength={500}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                Tipo
              </label>
              <div className="mt-1">
                <CustomSelect
                  value={type}
                  onChange={(val) => setType(val as any)}
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
                  value={category}
                  onChange={(val) => setCategory(val as any)}
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

          {/* Mini Preview */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-800/40 rounded-xl border border-gray-100 dark:border-neutral-800 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-neutral-300 mb-1">
              <Bell className="w-3.5 h-3.5 text-primary-500" />
              <span>{title || 'Pré-visualização do título'}</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400 line-clamp-2">
              {message || 'A mensagem aparecerá na central de notificações deste usuário.'}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary h-10 px-4 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary-500/10 active:scale-[0.98] transition-transform"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Enviar Mensagem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>,
  document.body
  )
}

export default DirectNotificationModal
