import { 
  Target, 
  Eye, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Bell, 
  Crown,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'

const About = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas finanças com gráficos interativos e relatórios detalhados em tempo real.'
    },
    {
      icon: TrendingUp,
      title: 'Análise Inteligente',
      description: 'Insights automáticos sobre seus gastos e sugestões personalizadas para economizar.'
    },
    {
      icon: Bell,
      title: 'Alertas Personalizados',
      description: 'Receba notificações sobre vencimentos, metas e movimentações importantes.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta e autenticação em duas etapas.'
    },
    {
      icon: Zap,
      title: 'Rápido e Eficiente',
      description: 'Interface otimizada para carregamento instantâneo e experiência fluida.'
    },
    {
      icon: Users,
      title: 'Multiplataforma',
      description: 'Acesse de qualquer dispositivo - desktop, tablet ou smartphone.'
    }
  ]

  const premiumFeatures = [
    'Categorias ilimitadas',
    'Ícones e emojis exclusivos',
    'Personalização avançada de categorias',
    'Suporte prioritário e atualizações',
    'Experiência sem anúncios',
    'Acesso antecipado a novos recursos',
    'Relatórios avançados e exportação'
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10 dark:from-primary-900/20 dark:to-purple-900/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  Sobre o Projeto
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                FinControl
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Seu parceiro inteligente para controle financeiro pessoal. 
                Transforme a maneira como você gerencia seu dinheiro.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-neutral-800">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Nossa Visão
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                Ser a plataforma de controle financeiro mais intuitiva e completa do Brasil, 
                capacitando pessoas a alcançarem seus objetivos financeiros através de 
                tecnologia acessível e insights inteligentes.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-neutral-800">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Nossa Missão
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                Democratizar o acesso a ferramentas profissionais de gestão financeira, 
                oferecendo uma solução moderna, segura e fácil de usar que ajuda pessoas 
                a tomarem decisões financeiras mais inteligentes.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recursos Principais
            </h2>
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              Tudo que você precisa para ter controle total das suas finanças
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-neutral-800 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Section */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Crown className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">
                  Premium
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Desbloqueie Todo o Potencial
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Upgrade para Premium e tenha acesso a recursos exclusivos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/plans"
              >
                Ver Planos
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                10K+
              </div>
              <div className="text-gray-600 dark:text-neutral-400">
                Usuários Ativos
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                1M+
              </div>
              <div className="text-gray-600 dark:text-neutral-400">
                Transações
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                99.9%
              </div>
              <div className="text-gray-600 dark:text-neutral-400">
                Uptime
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                4.9★
              </div>
              <div className="text-gray-600 dark:text-neutral-400">
                Avaliação
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram sua vida financeira
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Criar Conta Grátis
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border-2 border-white/20"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default About
