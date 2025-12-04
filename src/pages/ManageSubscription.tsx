import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Crown,
  Calendar,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Zap,
  Shield,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { subscriptionService, type SubscriptionStatus } from '@/services/subscription.service'
import { toast } from 'react-hot-toast'

const ManageSubscription = () => {
  const navigate = useNavigate()
  const { user, refreshPremiumStatus } = useAuthStore()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const isPremium = user?.isPremium || false

  useEffect(() => {
    loadSubscriptionStatus()
  }, [])

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true)
      const status = await subscriptionService.getStatus()
      setSubscriptionStatus(status)
    } catch (error) {
      console.error('Erro ao carregar status da assinatura:', error)
      toast.error('Erro ao carregar informações da assinatura')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true)
      await subscriptionService.cancel()
      await refreshPremiumStatus()
      await loadSubscriptionStatus()
      setShowCancelModal(false)
      toast.success('Assinatura cancelada com sucesso')
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error)
      toast.error(error.response?.data?.message || 'Erro ao cancelar assinatura')
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const getDaysRemaining = () => {
    if (!subscriptionStatus?.planEndDate) return null
    const endDate = new Date(subscriptionStatus.planEndDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const premiumFeatures = [
    { icon: Sparkles, text: 'Emojis avançados e exclusivos', available: true },
    { icon: Star, text: 'Categorias personalizadas ilimitadas', available: true },
    { icon: TrendingUp, text: 'Relatórios avançados e insights', available: true },
    { icon: Shield, text: 'Exportação ilimitada de dados', available: true },
    { icon: Zap, text: 'Suporte prioritário', available: true },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciar Assinatura
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Gerencie seu plano e benefícios
          </p>
        </div>
      </div>

      {/* Current Plan Card */}
      <div
        className={`rounded-2xl p-8 ${
          isPremium
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-400 dark:border-amber-600'
            : 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700'
        }`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isPremium
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                  : 'bg-gray-100 dark:bg-neutral-700'
              }`}
            >
              <Crown
                className={`w-8 h-8 ${isPremium ? 'text-white' : 'text-gray-400 dark:text-neutral-500'}`}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isPremium ? 'Plano Premium' : 'Plano Gratuito'}
              </h2>
              <p className="text-gray-600 dark:text-neutral-400">
                {isPremium ? 'Você tem acesso a todos os recursos' : 'Recursos básicos disponíveis'}
              </p>
            </div>
          </div>

          {isPremium && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Ativo
              </span>
            </div>
          )}
        </div>

        {/* Subscription Details */}
        {isPremium && subscriptionStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/50 dark:bg-neutral-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Data de Início</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDate(subscriptionStatus.planStartDate)}
              </p>
            </div>

            <div className="bg-white/50 dark:bg-neutral-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Renovação</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDate(subscriptionStatus.planEndDate)}
              </p>
            </div>

            <div className="bg-white/50 dark:bg-neutral-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Dias Restantes</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {getDaysRemaining()} dias
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!isPremium ? (
            <button
              onClick={() => navigate('/plans')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Crown className="w-5 h-5" />
              Fazer Upgrade para Premium
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/plans')}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Renovar Assinatura
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-xl transition-colors border border-red-200 dark:border-red-800"
              >
                <XCircle className="w-5 h-5" />
                Cancelar Assinatura
              </button>
            </>
          )}
        </div>
      </div>

      {/* Premium Features */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {isPremium ? 'Seus Benefícios Premium' : 'Benefícios do Plano Premium'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-neutral-900/50"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isPremium
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : 'bg-gray-200 dark:bg-neutral-700'
                }`}
              >
                <feature.icon
                  className={`w-5 h-5 ${isPremium ? 'text-white' : 'text-gray-500 dark:text-neutral-400'}`}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{feature.text}</p>
                {isPremium && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ Disponível
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isPremium && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Desbloqueie todos esses recursos
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Faça upgrade para Premium e aproveite todos os benefícios por apenas R$ 14,99/mês
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      {isPremium && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-gray-200 dark:border-neutral-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Método de Pagamento
          </h3>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-900/50 rounded-xl">
            <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center p-2">
              <img 
                src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" 
                alt="Google Pay" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                Google Pay
              </p>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Pagamento único processado
              </p>
            </div>
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
              Pago
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Renovação manual:</strong> Quando sua assinatura expirar, você precisará fazer um novo pagamento para renovar.
            </p>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Cancelar Assinatura?
              </h3>
            </div>

            <p className="text-gray-600 dark:text-neutral-400 mb-6">
              Ao cancelar sua assinatura Premium, você perderá acesso a:
            </p>

            <ul className="space-y-2 mb-6">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                  <XCircle className="w-4 h-4 text-red-500" />
                  {feature.text}
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-6">
              Você manterá o acesso até {formatDate(subscriptionStatus?.planEndDate)}.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
              >
                Manter Premium
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSubscription
