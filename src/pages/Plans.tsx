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
  Gift
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
  const savings = ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100).toFixed(0);

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
    // Redirecionar para checkout com o plano selecionado
    navigate(`/app/checkout?plan=${billingCycle}`);
  };

  return (
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
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            Anual
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-bold">
              -{savings}%
            </span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-dark-lg border-2 border-gray-200 dark:border-neutral-800 p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full mb-4">
                <Shield className="w-8 h-8 text-gray-600 dark:text-neutral-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Plano Gratuito
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 0</span>
                <span className="text-gray-600 dark:text-neutral-400">/mês</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Perfeito para começar
              </p>
            </div>

            <button
              disabled
              className="w-full py-3 px-6 bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-500 rounded-lg font-semibold mb-6 cursor-not-allowed"
            >
              Plano Atual
            </button>

            <div className="space-y-3">
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 dark:text-neutral-700 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${
                    feature.included 
                      ? 'text-gray-700 dark:text-neutral-300' 
                      : 'text-gray-400 dark:text-neutral-600 line-through'
                  }`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl shadow-2xl dark:shadow-dark-2xl border-2 border-amber-400 dark:border-amber-600 p-8 relative overflow-hidden hover:shadow-3xl transition-shadow">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              MAIS POPULAR
            </div>

            <div className="text-center mb-6 mt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Plano Premium
              </h3>
              <div className="mb-4">
                {billingCycle === 'monthly' ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      R$ {monthlyPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-600 dark:text-neutral-400">/mês</span>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-600 dark:text-neutral-400 line-through mb-1">
                      R$ {(monthlyPrice * 12).toFixed(2)}/ano
                    </div>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      R$ {yearlyPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-600 dark:text-neutral-400">/ano</span>
                    <div className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
                      Apenas R$ {yearlyMonthlyEquivalent}/mês
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Controle total e estilo
              </p>
            </div>

            {/* Botão de Teste Grátis - Só aparece se não for premium e não tiver usado trial */}
            {!user?.isPremium && !user?.isTrial && (
              <button
                onClick={handleStartTrial}
                disabled={isStartingTrial}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold mb-3 hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                {isStartingTrial ? 'Ativando...' : 'Iniciar Teste Grátis de 7 Dias'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={handleUpgrade}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold mb-6 hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <Crown className="w-5 h-5" />
              {user?.isPremium ? 'Renovar Agora' : 'Fazer Upgrade Agora'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="space-y-3">
              {features.premium.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${
                    feature.highlight 
                      ? 'w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center'
                      : ''
                  }`}>
                    <Check className={`w-5 h-5 ${
                      feature.highlight 
                        ? 'text-white w-3 h-3' 
                        : 'text-green-500'
                    }`} />
                  </div>
                  <span className={`text-sm ${
                    feature.highlight
                      ? 'text-gray-900 dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-neutral-300'
                  }`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Guarantee Badge */}
            <div className="mt-6 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    7 Dias Grátis
                  </p>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">
                    Teste sem compromisso. Cancele quando quiser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Por Que Escolher o Premium?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Personalização Total
              </h3>
              <p className="text-gray-600 dark:text-neutral-400">
                Emojis exclusivos, cores ilimitadas e ícones personalizados para suas categorias.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Recursos Avançados
              </h3>
              <p className="text-gray-600 dark:text-neutral-400">
                Relatórios detalhados, exportação de dados e acesso antecipado a novidades.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Suporte Prioritário
              </h3>
              <p className="text-gray-600 dark:text-neutral-400">
                Atendimento rápido, atualizações prioritárias e experiência sem anúncios.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-12 shadow-2xl">
          <Crown className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Junte-se ao Plano Premium Hoje!
          </h2>
          <p className="text-lg text-white text-opacity-90 mb-8">
            Experimente a liberdade de controle completo, estilo e produtividade. Comece sua jornada premium agora!
          </p>
          <button
            onClick={handleUpgrade}
            className="px-8 py-4 bg-white text-amber-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3 group"
          >
            <Crown className="w-6 h-6" />
            Começar Agora - 7 Dias Grátis
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-white text-opacity-75 mt-4">
            Sem cartão de crédito necessário para o teste. Cancele quando quiser.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-neutral-800">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Posso cancelar a qualquer momento?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-neutral-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento. Você continuará tendo acesso aos recursos premium até o final do período pago.
              </p>
            </details>

            <details className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-neutral-800">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Como funciona o teste de 7 dias?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-neutral-400">
                Você tem 7 dias completos para experimentar todos os recursos premium gratuitamente. Não é necessário cartão de crédito para começar. Após o período de teste, você pode escolher continuar com o plano premium ou voltar ao plano gratuito.
              </p>
            </details>

            <details className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-neutral-800">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Qual a diferença entre o plano mensal e anual?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-neutral-400">
                O plano anual oferece uma economia de {savings}% em comparação ao plano mensal. Você paga R$ {yearlyPrice.toFixed(2)} por ano (equivalente a R$ {yearlyMonthlyEquivalent}/mês) ao invés de R$ {(monthlyPrice * 12).toFixed(2)} por ano no plano mensal.
              </p>
            </details>

            <details className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-neutral-800">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Meus dados estarão seguros?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-neutral-400">
                Absolutamente! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger seus dados financeiros. Seus dados são armazenados de forma segura e nunca são compartilhados com terceiros.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
