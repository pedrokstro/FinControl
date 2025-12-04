import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Send, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Goodbye = () => {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState('')
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const reasons = [
    { id: 'expensive', label: 'Muito caro', emoji: '💰' },
    { id: 'features', label: 'Faltam recursos', emoji: '⚙️' },
    { id: 'difficult', label: 'Difícil de usar', emoji: '😕' },
    { id: 'alternative', label: 'Encontrei alternativa', emoji: '🔄' },
    { id: 'privacy', label: 'Preocupações com privacidade', emoji: '🔒' },
    { id: 'temporary', label: 'Uso temporário', emoji: '⏱️' },
    { id: 'other', label: 'Outro motivo', emoji: '💭' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedReason && !feedback.trim()) {
      toast.error('Por favor, selecione um motivo ou deixe um comentário')
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Enviar feedback para o backend
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
      toast.success('Feedback enviado com sucesso!')
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      toast.error('Erro ao enviar feedback')
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    navigate('/login')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Obrigado pelo Feedback!
            </h1>
            <p className="text-gray-600 dark:text-neutral-400">
              Suas sugestões nos ajudam a melhorar
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Redirecionando para a página de login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Sentimos Muito Que Você Está Saindo
            </h1>
            <p className="text-white/80">
              Sua opinião é muito importante para nós
            </p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Reasons */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Por que você está cancelando sua conta?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reasons.map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReason(reason.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedReason === reason.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reason.emoji}</span>
                      <span className={`text-sm font-medium ${
                        selectedReason === reason.id
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-neutral-300'
                      }`}>
                        {reason.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Gostaria de nos contar mais? (Opcional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Compartilhe suas sugestões, críticas ou experiências..."
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-neutral-500">
                Seu feedback nos ajuda a melhorar o FinControl para futuros usuários
              </p>
            </div>

            {/* Message */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
                💙 Você sempre será bem-vindo de volta! Esperamos vê-lo novamente em breve.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors border border-gray-300 dark:border-neutral-700 disabled:opacity-50"
              >
                Pular
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Sua conta foi excluída permanentemente
          </p>
        </div>
      </div>
    </div>
  )
}

export default Goodbye
