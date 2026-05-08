import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
  Gift,
  Target
} from 'lucide-react';
import { subscriptionService } from '@/services/subscription.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import PageTransition from '@/components/common/PageTransition';

const Plans = () => {
  const navigate = useNavigate();
  const { user, refreshPremiumStatus } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isStartingTrial, setIsStartingTrial] = useState(false);

  // Stripe Official Links (Mantendo os links de teste validados)
  const STRIPE_LINKS = {
    monthly: 'https://buy.stripe.com/test_5kQaEQgnNd685Y2fdUcZa00',
    yearly: 'https://buy.stripe.com/3cIaEQ6Nd7LO7264zgcZa03'
  };

  const features = {
    free: [
      { name: 'Acesso a ícones padrão', included: true },
      { name: 'Rastreamento básico de despesas e receitas', included: true },
      { name: 'Dashboard com resumos mensais', included: true },
      { name: 'Categorias ilimitadas', included: true },
      { name: 'Ícones e emojis exclusivos', included: false },
      { name: 'Personalização avançada', included: false },
      { name: 'Suporte prioritário', included: false },
      { name: 'Experiência sem anúncios', included: false },
      { name: 'Acesso antecipado a novos recursos', included: false },
      { name: 'Relatórios avançados', included: false },
    ],
    premium: [
      { name: 'Acesso a ícones padrão', included: true },
      { name: 'Rastreamento básico de despesas e receitas', included: true },
      { name: 'Dashboard com resumos mensais', included: true },
      { name: 'Categorias ilimitadas', included: true },
      { name: 'Ícones e emojis exclusivos', included: true, highlight: true },
      { name: 'Personalização avançada de categorias', included: true, highlight: true },
      { name: 'Suporte prioritário e atualizações', included: true, highlight: true },
      { name: 'Experiência sem anúncios', included: true, highlight: true },
      { name: 'Acesso antecipado a novos recursos', included: true, highlight: true },
      { name: 'Relatórios avançados e exportação', included: true, highlight: true },
    ],
  };

  const monthlyPrice = 14.99;
  const yearlyPrice = 149.99;
  const yearlyMonthlyEquivalent = (yearlyPrice / 12).toFixed(2);
  const savings = (((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100).toFixed(0);

  const handleStartTrial = async () => {
    try {
      setIsStartingTrial(true);
      await subscriptionService.startTrial();
      await refreshPremiumStatus();
      toast.success('🎉 Teste grátis de 7 dias ativado com sucesso!');
      navigate('/app/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao iniciar teste grátis');
    } finally {
      setIsStartingTrial(false);
    }
  };

  const handleUpgrade = () => {
    if (!user?.id) {
      toast.error('Usuário não identificado. Por favor, faça login novamente.');
      return;
    }

    // Lógica técnica de checkout direto do Stripe Pró
    const separator = STRIPE_LINKS[billingCycle].includes('?') ? '&' : '?';
    const checkoutUrl = `${STRIPE_LINKS[billingCycle]}${separator}client_reference_id=${user.id}`;

    window.location.href = checkoutUrl;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
        <div className="container-custom py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Oferta Especial: 7 dias grátis!
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Leve Suas Finanças ao
              <span className="block mt-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Próximo Nível!
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Desbloqueie recursos premium por apenas <strong>R$ 14,99/mês</strong> e transforme a maneira como você gerencia seu dinheiro.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${billingCycle === 'monthly'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 shadow-sm border border-gray-200 dark:border-neutral-700'
                }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all relative ${billingCycle === 'yearly'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 shadow-sm border border-gray-200 dark:border-neutral-700'
                }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-[10px] rounded-full font-bold uppercase tracking-wider">
                -{savings}%
              </span>
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Free Plan */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-dark-lg border-2 border-gray-100 dark:border-neutral-800 p-8 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plano Inicial
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 0</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Perfeito para começar sua jornada
                </p>
              </div>

              <button
                disabled
                className="w-full py-4 text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl font-bold mb-8 cursor-default border border-neutral-200 dark:border-neutral-800"
              >
                Seu Plano Atual
              </button>

              <div className="space-y-4 flex-1">
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-300 dark:text-neutral-700 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included
                      ? 'text-neutral-700 dark:text-neutral-300 font-medium'
                      : 'text-neutral-400 dark:text-neutral-600 line-through'
                      }`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl dark:shadow-dark-2xl border-2 border-amber-400 dark:border-amber-500 p-8 relative overflow-hidden flex flex-col group transition-all duration-300">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-amber-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-xs flex items-center gap-2">
                <Star className="w-4 h-4 fill-white" />
                RECOMENDADO
              </div>

              <div className="text-center mb-6 mt-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-xl ring-4 ring-amber-400/20">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                  FinControl Pro
                </h3>
                <div className="mb-4">
                  {billingCycle === 'monthly' ? (
                    <>
                      <span className="text-5xl font-black text-gray-900 dark:text-white">
                        R$ {monthlyPrice.toFixed(2)}
                      </span>
                      <span className="text-gray-500">/mês</span>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-neutral-400 line-through mb-1">
                        R$ {(monthlyPrice * 12).toFixed(2)}/ano
                      </div>
                      <span className="text-5xl font-black text-amber-500">
                        R$ {yearlyPrice.toFixed(2)}
                      </span>
                      <span className="text-gray-500">/ano</span>
                      <div className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black px-2 py-1 rounded inline-block mt-2 uppercase">
                        Apenas R$ {yearlyMonthlyEquivalent}/mês
                      </div>
                    </>
                  )}
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                  Controle total, inteligência avançada <br />e estilo exclusivo
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {!user?.isPremium && !user?.isTrial && (
                  <button
                    onClick={handleStartTrial}
                    disabled={isStartingTrial}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5 fill-white" />
                    {isStartingTrial ? 'Preparando...' : 'Liberar 7 Dias Grátis'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                <button
                  onClick={handleUpgrade}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2 group"
                >
                  <Crown className="w-5 h-5 fill-white" />
                  {user?.isPremium ? 'Renovar Assinatura' : 'Assinar Pró Agora'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {features.premium.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded-full flex items-center justify-center bg-emerald-500/10`}>
                      <Check className={`w-3.5 h-3.5 text-emerald-600 stroke-[3px]`} />
                    </div>
                    <span className={`text-sm ${feature.highlight
                      ? 'text-neutral-900 dark:text-white font-black'
                      : 'text-neutral-600 dark:text-neutral-300 font-bold'
                      }`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-center gap-4">
                <div className="p-3 bg-amber-500 rounded-lg">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-tighter">Garantia Absoluta</p>
                  <p className="text-[11px] text-amber-700 dark:text-neutral-400 italic">Cancele quando quiser na interface Stripe.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-24">
            <div className="group">
              <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-transform border border-neutral-100 dark:border-neutral-800">
                <Target className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="text-lg font-black text-neutral-900 dark:text-white mb-2 uppercase tracking-tight">FOCO TOTAL</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Nossa IA filtra o que realmente importa nas suas métricas financeiras diárias.
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-transform border border-neutral-100 dark:border-neutral-800">
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
              <h4 className="text-lg font-black text-neutral-900 dark:text-white mb-2 uppercase tracking-tight">ALTA PERFORMANCE</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Relatórios que carregam instantaneamente e exportação de BI para sua estratégia.
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-transform border border-neutral-100 dark:border-neutral-800">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-lg font-black text-neutral-900 dark:text-white mb-2 uppercase tracking-tight">SEGURANÇA BLINDADA</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Processamento oficial Stripe com criptografia de ponta a ponta nos seus dados.
              </p>
            </div>
          </div>

          {/* Social Proof CTA */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 to-orange-500 text-white p-12 text-center shadow-3xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Crown className="w-20 h-20 mx-auto mb-8 animate-bounce transition-all duration-[2000ms]" />
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">PRONTO PARA A EVOLUÇÃO?</h2>
              <p className="text-lg text-white/90 font-medium mb-10 leading-relaxed">
                Junte-se a centenas de usuários que transformaram suas planilhas em um centro de comando inteligente.
              </p>
              <button
                onClick={handleUpgrade}
                className="px-10 py-5 bg-white text-orange-600 rounded-2xl font-black text-xl hover:bg-neutral-50 transition-all shadow-2xl flex items-center gap-3 mx-auto"
              >
                COMEÇAR AGORA
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="mt-4 text-xs font-bold text-white/70 uppercase tracking-widest">Até {savings}% de desconto no plano anual</p>
            </div>
          </div>

          {/* FAQ Area */}
          <div className="max-w-3xl mx-auto mt-24">
            <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-12 uppercase tracking-tighter">PERGUNTAS RECORRENTES</h2>
            <div className="space-y-4">
              {[
                { q: 'Posso cancelar a qualquer momento?', a: 'Sim. Você cancela com um clique no seu portal do Stripe e seu acesso permanece até o fim do período já pago.' },
                { q: 'Meus dados são exportáveis?', a: 'Completamente. Usuários Premium têm exportação ilimitada para formatos Excel, CSV e PDF de alta precisão.' },
                { q: 'O pagamento é seguro?', a: 'Usamos a infraestrutura global da Stripe. Seus dados de cartão nunca tocam nossos servidores.' }
              ].map((item, i) => (
                <details key={i} className="group bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/50 rounded-2xl p-6 transition-all duration-300 open:shadow-xl">
                  <summary className="font-black text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center outline-none">
                    <span className="uppercase text-sm tracking-tight">{item.q}</span>
                    <div className="bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg group-open:rotate-180 transition-transform">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </summary>
                  <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Plans;
