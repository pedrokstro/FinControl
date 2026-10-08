import React, { useState } from 'react'
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Star,
  ChevronLeft,
  ChevronDown,
  Gift,
  ExternalLink,
  Calendar,
  Lock,
  ArrowRight,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { haptics } from '@/utils/haptics'
import type { SubscriptionStatus } from '@/services/subscription.service'

interface MobilePlansViewProps {
  user: any
  billingCycle: 'monthly' | 'yearly'
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void
  onStartTrial: () => Promise<void>
  onUpgrade: () => void
  isStartingTrial: boolean
  monthlyPrice: number
  yearlyPrice: number
  yearlyMonthlyEquivalent: string
  savings: string
  subscriptionStatus?: SubscriptionStatus | null
  onManageBilling?: () => void
  onCancelSubscription?: () => void
  loadingPortal?: boolean
  cancelling?: boolean
}

export const MobilePlansView: React.FC<MobilePlansViewProps> = ({
  user,
  billingCycle,
  setBillingCycle,
  onStartTrial,
  onUpgrade,
  isStartingTrial,
  monthlyPrice,
  yearlyPrice,
  yearlyMonthlyEquivalent,
  savings,
  subscriptionStatus,
  onManageBilling,
  onCancelSubscription,
  loadingPortal = false,
  cancelling = false
}) => {
  const navigate = useNavigate()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const isPremium = user?.isPremium || false

  const premiumBenefits = [
    {
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-150 dark:border-amber-800/50',
      title: 'Emojis e Ícones Exclusivos',
      desc: 'Mais de 250 ícones temáticos para personalizar categorias e marcas.'
    },
    {
      icon: Layers,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-150 dark:border-indigo-800/50',
      title: 'Categorias Ilimitadas',
      desc: 'Crie e organize quantas categorias e subcategorias desejar sem restrições.'
    },
    {
      icon: FileSpreadsheet,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-150 dark:border-emerald-800/50',
      title: 'Exportação Ilimitada em Excel & PDF',
      desc: 'Exporte relatórios financeiros completos para contabilidade e controle pessoal.'
    },
    {
      icon: Zap,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-150 dark:border-blue-800/50',
      title: 'Lançamentos e Recorrências Sem Fim',
      desc: 'Cadastre todas as suas receitas, despesas e assinaturas fixas sem travas.'
    },
    {
      icon: Shield,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-150 dark:border-purple-800/50',
      title: 'Suporte VIP e Acesso Antecipado',
      desc: 'Prioridade no atendimento e acesso imediato aos novos recursos lançados.'
    }
  ]

  const faqs = [
    {
      q: 'Posso cancelar a assinatura quando quiser?',
      a: 'Sim! Você pode cancelar com apenas um toque a qualquer momento. Seu acesso continuará ativo até o término do ciclo já contratado.'
    },
    {
      q: 'Como funciona o teste grátis de 7 dias?',
      a: 'Você terá acesso irrestrito a todos os recursos Pro. Se não desejar continuar, pode cancelar antes do término sem qualquer custo.'
    },
    {
      q: 'O pagamento é seguro?',
      a: 'Sim, todos os pagamentos são processados com segurança máxima via Stripe, a maior e mais segura plataforma de pagamentos do mundo.'
    }
  ]

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Ativo'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDaysRemaining = () => {
    if (!subscriptionStatus?.planEndDate) return null
    const end = new Date(subscriptionStatus.planEndDate).getTime()
    const now = new Date().getTime()
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-28 pt-1 select-none animate-fadeIn">
      {/* 1. Header Nativo */}
      <div className="flex items-center justify-between py-3 mb-2 px-1">
        <button
          type="button"
          onClick={() => {
            haptics.light()
            navigate(-1)
          }}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 flex items-center justify-center text-gray-700 dark:text-neutral-200 active:scale-95 transition-transform shadow-xs"
          title="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-bold text-gray-900 dark:text-white font-display">
            Planos & Assinatura
          </h1>
          <span className="text-[11px] text-gray-400 dark:text-neutral-500 font-medium">
            {isPremium ? 'Sua Assinatura Pro' : 'FinControl Premium'}
          </span>
        </div>

        <div className="w-10 flex items-center justify-end">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Crown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* CASO A: USUÁRIO JÁ POSSUI PLANO PRO */}
      {isPremium ? (
        <div className="space-y-4">
          {/* Card Ativo Estilo Cartão Black / Gold */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950 text-white p-5 shadow-xl border border-amber-500/30">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    FinControl Pro
                  </h2>
                  <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Assinatura Ativa
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950 px-2.5 py-1 rounded-full shadow-sm">
                VIP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-t border-white/10 relative z-10">
              <div>
                <span className="text-[11px] text-neutral-400 block">Renovação</span>
                <span className="text-sm font-semibold text-white">
                  {formatDate(subscriptionStatus?.planEndDate)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">Dias Restantes</span>
                <span className="text-sm font-semibold text-amber-300">
                  {getDaysRemaining() !== null ? `${getDaysRemaining()} dias` : 'Ilimitado'}
                </span>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2 relative z-10">
              {onManageBilling && (
                <button
                  type="button"
                  onClick={() => {
                    haptics.medium()
                    onManageBilling()
                  }}
                  disabled={loadingPortal}
                  className="w-full h-11 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  {loadingPortal ? 'Abrindo Portal...' : 'Gerenciar Faturamento (Stripe)'}
                </button>
              )}

              {onCancelSubscription && (
                <button
                  type="button"
                  onClick={() => {
                    haptics.warning()
                    setShowCancelConfirm(true)
                  }}
                  className="text-center text-[11px] font-semibold text-neutral-400 hover:text-rose-400 py-1 transition-colors"
                >
                  Cancelar renovação da assinatura
                </button>
              )}
            </div>
          </div>

          {/* Modal de Confirmação de Cancelamento */}
          {showCancelConfirm && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    Deseja mesmo cancelar?
                  </h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300/90 mt-0.5">
                    Você continuará aproveitando o Pro até o fim do ciclo pago, mas perderá os recursos exclusivos após a data.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    haptics.medium()
                    setShowCancelConfirm(false)
                    onCancelSubscription?.()
                  }}
                  disabled={cancelling}
                  className="flex-1 h-9 bg-rose-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform"
                >
                  {cancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setShowCancelConfirm(false)
                  }}
                  className="h-9 px-4 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 rounded-xl text-xs font-bold active:scale-95 transition-transform"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {/* Benefícios que o usuário tem ativos */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
              Recursos Ativos no Seu Plano
            </span>
            <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
              {premiumBenefits.map((b, i) => (
                <div key={i} className="p-3.5 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${b.color}`}>
                    <b.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      {b.title}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-neutral-400 block mt-0.5">
                      {b.desc}
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* CASO B: USUÁRIO PLANO GRATUITO - PAYWALL NATIVO */
        <div className="space-y-4">
          {/* Hero Banner FinControl Pro */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-5 shadow-lg">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3 h-3 text-amber-200" />
              Oferta Especial de Lançamento
            </div>

            <h2 className="text-xl font-black font-display tracking-tight text-white leading-tight">
              Desbloqueie Todo o Poder Financeiro
            </h2>
            <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed">
              Elimine limites, tenha relatórios completos com BI e personalize seu app com ícones exclusivos.
            </p>

            {/* Trial Banner */}
            {!user?.isTrial && (
              <div className="mt-3.5 p-2.5 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white block">
                    7 Dias Grátis para Testar
                  </span>
                  <span className="text-[10px] text-white/80 block">
                    Sem compromisso, cancele quando desejar.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Segmented Control Nativo (Mensal vs Anual) */}
          <div className="bg-gray-200/80 dark:bg-neutral-900 p-1 rounded-2xl flex items-center gap-1 border border-gray-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => {
                haptics.light()
                setBillingCycle('monthly')
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              <span>Mensal</span>
              <span className="text-[10px] opacity-75">R$ {monthlyPrice.toFixed(2)}/mês</span>
            </button>

            <button
              type="button"
              onClick={() => {
                haptics.light()
                setBillingCycle('yearly')
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>Anual</span>
                <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  -{savings}%
                </span>
              </div>
              <span className="text-[10px] opacity-75">R$ {yearlyMonthlyEquivalent}/mês</span>
            </button>
          </div>

          {/* Card Resumo do Preço Selecionado */}
          <div className="bg-white dark:bg-neutral-900 border-2 border-amber-400/80 dark:border-amber-500/80 rounded-3xl p-4 shadow-sm relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Plano Selecionado
              </span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/40">
                Mais Escolhido
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-3xl font-black text-gray-900 dark:text-white font-display">
                R$ {billingCycle === 'monthly' ? monthlyPrice.toFixed(2) : yearlyPrice.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400 font-medium">
                /{billingCycle === 'monthly' ? 'mês' : 'ano'}
              </span>
            </div>

            {billingCycle === 'yearly' && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mb-3">
                Equivalente a R$ {yearlyMonthlyEquivalent} por mês cobrado anualmente.
              </p>
            )}

            {/* Botões de Ação */}
            <div className="space-y-2 mt-3">
              {!user?.isTrial && (
                <button
                  type="button"
                  onClick={() => {
                    haptics.medium()
                    onStartTrial()
                  }}
                  disabled={isStartingTrial}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  {isStartingTrial ? 'Ativando...' : 'Iniciar Teste de 7 Dias Grátis'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  haptics.medium()
                  onUpgrade()
                }}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
              >
                <Crown className="w-4 h-4 fill-white" />
                Assinar FinControl Pro Agora
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vantagens Exclusivas Inset Grouped */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
              Tudo o que você desbloqueia
            </span>
            <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
              {premiumBenefits.map((b, i) => (
                <div key={i} className="p-3.5 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${b.color}`}>
                    <b.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      {b.title}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-neutral-400 block mt-0.5">
                      {b.desc}
                    </span>
                  </div>
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Garantia & Segurança */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200 block">
                Segurança & Garantia Total
              </span>
              <span className="text-[11px] text-amber-800/90 dark:text-amber-300/80 block mt-0.2">
                Processamento seguro via Stripe com criptografia SSL 256-bit. Cancele com um toque quando quiser.
              </span>
            </div>
          </div>

          {/* FAQ Rápida em Acordeom */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
              Dúvidas Frequentes
            </span>
            <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div key={index}>
                    <button
                      type="button"
                      onClick={() => {
                        haptics.light()
                        setOpenFaqIndex(isOpen ? null : index)
                      }}
                      className="w-full p-3.5 flex items-center justify-between text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
                    >
                      <span className="text-xs font-bold text-gray-900 dark:text-white pr-2">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-primary-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-0 text-[11px] text-gray-500 dark:text-neutral-400 border-t border-gray-50 dark:border-neutral-850 bg-gray-50/50 dark:bg-neutral-900/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
