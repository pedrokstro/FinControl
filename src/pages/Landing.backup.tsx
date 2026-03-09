import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import AnimatedTextCycle from '@/components/ui/animated-text-cycle'
import { MovingBorderButton } from '@/components/ui/moving-border'
import {
  TrendingUp,
  PieChart,
  CreditCard,
  Shield,
  Smartphone,
  BarChart3,

  Target,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  Globe
} from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/transactions', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const features = [
    {
      icon: <PieChart className="w-8 h-8" />,
      title: 'Controle Completo',
      description: 'Gerencie todas as suas finanças em um só lugar',
      glowClass: 'bg-[radial-gradient(var(--primary-400)_45%,transparent_70%)]',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Relatórios Detalhados',
      description: 'Visualize seus gastos com gráficos intuitivos',
      glowClass: 'bg-[radial-gradient(var(--info-400)_45%,transparent_70%)]',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Metas Financeiras',
      description: 'Defina e acompanhe suas metas de economia',
      glowClass: 'bg-[radial-gradient(var(--success-400)_45%,transparent_70%)]',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta',
      glowClass: 'bg-[radial-gradient(var(--primary-500)_45%,transparent_70%)]',
    },
  ]

  const plans = [
    {
      name: 'Básico',
      price: 'Grátis',
      description: 'Perfeito para começar',
      features: [
        'Até 10 transações/mês',
        'Ícones básicos',
        'Relatórios'
      ]
    },
    {
      name: 'Premium',
      price: 'R$ 14,99',
      period: '/mês',
      description: 'Para quem quer mais controle',
      features: [
        'Transações ilimitadas',
        'Exportação de relatórios',
        'Ícones exclusivos',
        'Exportação de dados',
        'Calculadoras'
      ],
      highlighted: true
    }
  ]

  const stats = [
    { value: '10K+', label: 'Usuários Ativos' },
    { value: '500K+', label: 'Transações' },
    { value: '98%', label: 'Satisfação' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl">
                <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                FinControl
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-primary-600/30"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Potencialize seu{' '}
              <AnimatedTextCycle
                words={['Futuro', 'Negócio', 'Bolso']}
                interval={3000}
                className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent"
              />{' '}
              com FinControl
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              A plataforma completa para gerenciar suas finanças pessoais com inteligência e simplicidade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl shadow-primary-600/30 flex items-center gap-2"
              >
                Começar Grátis
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-semibold text-lg transition-all duration-200 border-2 border-neutral-200 dark:border-neutral-700"
              >
                Fazer Login
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              A escolha estratégica
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Tudo que você precisa para ter controle total das suas finanças
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full"
              >
                <MovingBorderButton
                  as="div"
                  borderRadius="1.25rem"
                  duration={3200 + index * 300}
                  containerClassName="w-full h-full"
                  borderClassName={feature.glowClass}
                  className="rounded-[1.15rem] p-6 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-white/40 dark:border-white/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </MovingBorderButton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O futuro bancário que você precisa
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Interface moderna e intuitiva para gerenciar suas finanças
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <MovingBorderButton
                as="div"
                borderRadius="1.75rem"
                duration={2600}
                containerClassName="w-full h-full"
                borderClassName="bg-[radial-gradient(var(--primary-200)_40%,transparent_70%)]"
                className="rounded-[1.6rem] p-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-700/40"
              >
                <TrendingUp className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Acompanhe sua evolução</h3>
                <p className="text-primary-100 mb-6">
                  Visualize seu progresso financeiro com gráficos detalhados e insights personalizados
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Este mês</span>
                    <span className="text-success-400">+23%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-success-400 rounded-full"></div>
                  </div>
                </div>
              </MovingBorderButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <MovingBorderButton
                as="div"
                borderRadius="1.75rem"
                duration={3600}
                containerClassName="w-full h-full"
                borderClassName="bg-[radial-gradient(var(--info-400)_35%,transparent_70%)]"
                className="rounded-[1.6rem] p-8 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-100/80 dark:border-white/5 shadow-lg"
              >
                <CreditCard className="w-12 h-12 mb-4 text-primary-600" />
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                  Controle total de gastos
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Categorize suas despesas e identifique oportunidades de economia
                </p>
                <div className="space-y-3">
                  {['Alimentação', 'Transporte', 'Lazer'].map((category, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{category}</span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        R$ {(Math.random() * 500 + 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </MovingBorderButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-6 bg-white dark:bg-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Planos para cada orçamento
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Escolha o plano ideal para suas necessidades
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => {
              const isHighlighted = !!plan.highlighted
              const borderGlow = isHighlighted
                ? 'bg-[radial-gradient(var(--primary-400)_40%,transparent_70%)]'
                : 'bg-[radial-gradient(var(--neutral-300)_40%,transparent_70%)]'

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="w-full"
                >
                  <MovingBorderButton
                    as="div"
                    borderRadius="1.5rem"
                    duration={isHighlighted ? 2500 : 4000}
                    containerClassName="w-full h-full"
                    borderClassName={borderGlow}
                    className={`rounded-[1.4rem] p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 ${isHighlighted
                      ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-600/30'
                      : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
                      }`}
                  >
                    <h3 className={`text-2xl font-bold mb-2 ${isHighlighted ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                      {plan.name}
                    </h3>
                    <p className={`mb-6 ${isHighlighted ? 'text-primary-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${isHighlighted ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className={isHighlighted ? 'text-primary-100' : 'text-neutral-600 dark:text-neutral-400'}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-success-300' : 'text-primary-600'
                              }`}
                          />
                          <span className={isHighlighted ? 'text-primary-50' : 'text-neutral-700 dark:text-neutral-300'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate('/register')}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${isHighlighted
                        ? 'bg-white text-primary-600 hover:bg-primary-50'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                    >
                      Começar Agora
                    </button>
                  </MovingBorderButton>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Compre em qualquer lugar, a qualquer hora
            </h2>
            <p className="text-xl text-primary-100">
              Acesse suas finanças de onde estiver, com segurança total
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Smartphone />, title: 'Acesso Mobile', desc: 'App disponível para iOS e Android' },
              { icon: <Lock />, title: 'Segurança', desc: 'Criptografia de ponta a ponta' },
              { icon: <Globe />, title: 'Multi-plataforma', desc: 'Sincronização em tempo real' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-primary-100">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-12 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center"
          >
            <Zap className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simplifique o gerenciamento de pagamentos
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já transformaram sua vida financeira
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-primary-600 hover:bg-primary-50 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl"
            >
              Começar Gratuitamente
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-neutral-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white p-0.5">
                  <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold">FinControl</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Sua plataforma completa de gestão financeira pessoal
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="/about" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Suporte</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 text-center text-sm text-neutral-400">
            <p>© 2025 FinControl. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
