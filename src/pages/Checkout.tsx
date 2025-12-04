import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { subscriptionService } from '@/services/subscription.service';
import { 
  Lock, 
  Check, 
  ArrowLeft, 
  Crown,
  Shield,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: _user } = useAuthStore();
  
  // Obter plano da URL (monthly ou yearly)
  const plan = searchParams.get('plan') || 'monthly';
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Preços
  const prices = {
    monthly: { value: 14.99, label: 'Mensal', period: 'mês' },
    yearly: { value: 149.99, label: 'Anual', period: 'ano', monthlyEquivalent: 12.49 }
  };
  
  const selectedPrice = prices[plan as keyof typeof prices] || prices.monthly;
  const savings = plan === 'yearly' ? ((14.99 * 12 - 149.99) / (14.99 * 12) * 100).toFixed(0) : 0;

  // Inicializar Google Pay
  useEffect(() => {
    // Carregar script do Google Pay
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGooglePay = async () => {
    setIsProcessing(true);

    try {
      // Configuração do Google Pay
      const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
        environment: 'TEST' // Mudar para 'PRODUCTION' em produção
      });

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA']
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId'
              }
            }
          }
        ],
        merchantInfo: {
          merchantId: '12345678901234567890',
          merchantName: 'FinControl'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: selectedPrice.value.toFixed(2),
          currencyCode: 'BRL',
          countryCode: 'BR'
        }
      };

      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      
      // Processar pagamento no backend
      const transactionId = `GP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await subscriptionService.processGooglePay({
        transactionId,
        paymentData,
        plan,
        amount: selectedPrice.value
      });

      toast.success('Pagamento processado com sucesso!');
      toast.success('Bem-vindo ao Premium! 🎉');
      
      // Redirecionar para dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao processar Google Pay:', error);
      if (error.statusCode === 'CANCELED') {
        toast.error('Pagamento cancelado');
      } else {
        toast.error('Erro ao processar pagamento. Tente novamente.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleGooglePay();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/plans')}
            className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para planos
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Finalizar Assinatura
              </h1>
              <p className="text-gray-600 dark:text-neutral-400">
                Você está a um passo do Premium!
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Informações de Pagamento
              </h2>

              {/* Método de Pagamento */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
                  Método de Pagamento
                </label>
                <div className="max-w-sm mx-auto">
                  <div className="p-6 border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="flex items-center justify-center mb-4">
                      <img 
                        src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" 
                        alt="Google Pay" 
                        className="h-12"
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
                      Google Pay
                    </p>
                    <p className="text-center text-xs text-gray-600 dark:text-neutral-400 mt-1">
                      Pagamento rápido e seguro
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
                  <div className="flex items-center justify-center mx-auto mb-6">
                    <img 
                      src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" 
                      alt="Google Pay" 
                      className="h-16"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Pagamento via Google Pay
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                    Pague de forma rápida e segura com o Google Pay. Seus dados de pagamento são protegidos e criptografados.
                  </p>
                  <div className="flex items-center justify-center gap-3 text-sm text-blue-600 dark:text-blue-400 mb-4">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Pagamento 100% seguro</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm text-green-600 dark:text-green-400">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Aprovação instantânea</span>
                  </div>
                </div>

                {/* Botão de Pagamento */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Confirmar Pagamento - R$ {selectedPrice.value.toFixed(2)}
                    </span>
                  )}
                </button>

                {/* Segurança */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                  <Shield className="w-4 h-4" />
                  <span>Pagamento 100% seguro e criptografado</span>
                </div>
              </form>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Resumo do Pedido
              </h3>

              {/* Plano Selecionado */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Plano Premium
                    </p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {selectedPrice.label}
                    </p>
                  </div>
                </div>
                
                {plan === 'yearly' && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded px-2 py-1">
                    <Check className="w-4 h-4" />
                    <span>Economize {savings}% no plano anual</span>
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    R$ {selectedPrice.value.toFixed(2)}
                  </span>
                </div>
                
                {plan === 'yearly' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-neutral-400">
                      Equivalente mensal
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      R$ {'monthlyEquivalent' in selectedPrice ? selectedPrice.monthlyEquivalent : selectedPrice.value}/mês
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Período de teste</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    7 dias grátis
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-neutral-700 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    R$ {selectedPrice.value.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Você terá acesso a:
                </p>
                <div className="space-y-2">
                  {[
                    'Ícones e emojis exclusivos',
                    'Personalização avançada',
                    'Relatórios detalhados',
                    'Suporte prioritário',
                    'Sem anúncios',
                    'Novos recursos primeiro'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aviso */}
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Período de teste grátis</p>
                    <p>
                      Você não será cobrado nos primeiros 7 dias. Cancele a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
