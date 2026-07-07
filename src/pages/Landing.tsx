import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import PageTransition from '@/components/common/PageTransition'
import { useAuthStore } from '@/store/authStore'
import AnimatedTextCycle from '@/components/ui/animated-text-cycle'
import { MovingBorderButton } from '@/components/ui/moving-border'
import { motion, useScroll, useTransform } from 'framer-motion'
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

const BrandCreditCard = () => {
  return (
    <div className="w-[280px] sm:w-[320px] h-[170px] sm:h-[190px] bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-700 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-white border border-white/10 select-none backdrop-blur-xs">
      {/* Reflexo brilhante diagonal */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
      
      {/* Logo e Chip */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center overflow-hidden p-1">
            <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <span className="text-sm font-bold tracking-wide font-display">FinControl</span>
        </div>
        
        {/* Chip Metálico Estilizado */}
        <div className="w-10 h-8 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-md opacity-90 border border-amber-600/30 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-0.5 w-6 h-5 opacity-40">
            <div className="border border-white/50 rounded-xs"></div>
            <div className="border border-white/50 rounded-xs"></div>
            <div className="border border-white/50 rounded-xs"></div>
            <div className="border border-white/50 rounded-xs"></div>
            <div className="border border-white/50 rounded-xs"></div>
            <div className="border border-white/50 rounded-xs"></div>
          </div>
        </div>
      </div>
      
      {/* Número do Cartão */}
      <div className="mt-8 font-mono text-sm tracking-widest text-white/90 relative z-10">
        ••••  ••••  ••••  4890
      </div>

      {/* Titular e Validade */}
      <div className="flex justify-between items-end mt-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-[8px] text-white/60 uppercase tracking-wider">Titular</span>
          <span className="text-xs font-semibold uppercase tracking-wide font-display">Premium User</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-white/60 uppercase tracking-wider">Validade</span>
          <span className="text-xs font-semibold">12/32</span>
        </div>
      </div>
    </div>
  )
}

const Landing = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const { scrollYProgress } = useScroll()
  const cardY = useTransform(scrollYProgress, [0, 0.25], [0, 520])
  const cardRotate = useTransform(scrollYProgress, [0, 0.25], [12, -15])
  const cardScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.85])

  const [shouldAnimate, setShouldAnimate] = useState(true)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldAnimate(!mediaQuery.matches)
    const listener = (e: MediaQueryListEvent) => setShouldAnimate(!e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  const fadeInUp = useMemo(() => shouldAnimate ? {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  } : {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  }, [shouldAnimate])

  const staggerContainer = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  }), [])

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
    <PageTransition className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
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
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all duration-200 shadow-lg shadow-primary-600/30"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight px-4 font-display">
              Potencialize seu{' '}
              <AnimatedTextCycle
                words={['Futuro', 'Negócio', 'Bolso']}
                interval={3000}
                className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent"
              />{' '}
              com FinControl
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto px-4">
              A plataforma completa para gerenciar suas finanças pessoais com inteligência e simplicidade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg transition-all duration-200 shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2"
              >
                Começar Grátis
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Cartão de Crédito 3D com Scroll Link */}
            <div className="mt-12 flex justify-center items-center relative h-[180px] sm:h-[220px] pointer-events-none">
              <motion.div
                style={shouldAnimate ? {
                  y: cardY,
                  rotate: cardRotate,
                  scale: cardScale,
                } : {
                  rotate: 12
                }}
                className="absolute z-10"
              >
                <BrandCreditCard />
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mt-16 max-w-3xl mx-auto px-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-neutral-900 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              A escolha estratégica
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Tudo que você precisa para ter controle total das suas finanças
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
          >
            {/* Coluna Esquerda: Features 1 e 2 */}
            <div className="flex flex-col gap-6">
              {[features[0], features[1]].map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="w-full"
                >
                  <MovingBorderButton
                    as="div"
                    borderRadius="1.25rem"
                    duration={3200 + index * 300}
                    containerClassName="w-full h-full"
                    borderClassName={feature.glowClass}
                    className="rounded-[1.15rem] p-6 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white font-display">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </MovingBorderButton>
                </motion.div>
              ))}
            </div>

            {/* Coluna Central: Espaço de aterrissagem do cartão (visível em desktop para respiro) */}
            <div className="hidden lg:block h-[380px] w-full" />

            {/* Coluna Direita: Features 3 e 4 */}
            <div className="flex flex-col gap-6">
              {[features[2], features[3]].map((feature, index) => (
                <motion.div 
                  key={index + 2}
                  variants={fadeInUp}
                  className="w-full"
                >
                  <MovingBorderButton
                    as="div"
                    borderRadius="1.25rem"
                    duration={3200 + (index + 2) * 300}
                    containerClassName="w-full h-full"
                    borderClassName={feature.glowClass}
                    className="rounded-[1.15rem] p-6 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white font-display">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </MovingBorderButton>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display text-balance">
              O futuro bancário que você precisa
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Interface moderna e intuitiva para gerenciar suas finanças
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <MovingBorderButton
                as="div"
                borderRadius="1.75rem"
                duration={2600}
                containerClassName="w-full h-full"
                borderClassName="bg-[radial-gradient(var(--primary-200)_40%,transparent_70%)]"
                className="rounded-[1.6rem] p-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-700/40"
              >
                <TrendingUp className="w-12 h-12 mb-4 animate-arrow-up" />
                <h3 className="text-2xl font-bold mb-4 font-display">Acompanhe sua evolução</h3>
                <p className="text-primary-100 mb-6">
                  Visualize seu progresso financeiro com gráficos detalhados e insights personalizados
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Este mês</span>
                    <span className="text-success-400 font-semibold">+23%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-success-400 rounded-full"></div>
                  </div>
                </div>
              </MovingBorderButton>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <MovingBorderButton
                as="div"
                borderRadius="1.75rem"
                duration={3600}
                containerClassName="w-full h-full"
                borderClassName="bg-[radial-gradient(var(--info-400)_35%,transparent_70%)]"
                className="rounded-[1.6rem] p-8 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-lg"
              >
                <CreditCard className="w-12 h-12 mb-4 text-primary-600" />
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white font-display">
                  Controle total de gastos
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Categorize suas despesas e identifique oportunidades de economia
                </p>
                <div className="space-y-3">
                  {['Alimentação', 'Transporte', 'Lazer'].map((category, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800 rounded-lg">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{category}</span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold text-numeric">
                        R$ {(120 + i * 85).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </MovingBorderButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-6 bg-white dark:bg-neutral-900 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Planos para cada orçamento
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Escolha o plano ideal para suas necessidades
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {plans.map((plan, index) => {
              const isHighlighted = !!plan.highlighted
              const borderGlow = isHighlighted
                ? 'bg-[radial-gradient(var(--primary-400)_40%,transparent_70%)]'
                : 'bg-[radial-gradient(var(--neutral-300)_40%,transparent_70%)]'

              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="w-full"
                >
                  <MovingBorderButton
                    as="div"
                    borderRadius="1.4rem"
                    duration={isHighlighted ? 2500 : 4000}
                    containerClassName="w-full h-full"
                    borderClassName={borderGlow}
                    className={`rounded-[1.4rem] p-8 flex flex-col h-full transition-all duration-300 ${isHighlighted
                      ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-600/30'
                      : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
                      }`}
                  >
                    <h3 className={`text-2xl font-bold mb-2 font-display ${isHighlighted ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                      {plan.name}
                    </h3>
                    <p className={`mb-6 ${isHighlighted ? 'text-primary-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className={`text-5xl font-bold font-display ${isHighlighted ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
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
                      className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${isHighlighted
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
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Compre em qualquer lugar, a qualquer hora
            </h2>
            <p className="text-xl text-primary-100">
              Acesse suas finanças de onde estiver, com segurança total
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Smartphone />, title: 'Acesso Mobile', desc: 'App disponível para iOS e Android' },
              { icon: <Lock />, title: 'Segurança', desc: 'Criptografia de ponta a ponta' },
              { icon: <Globe />, title: 'Multi-plataforma', desc: 'Sincronização em tempo real' }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-display">{item.title}</h3>
                <p className="text-primary-100 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="p-12 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center shadow-xl shadow-primary-600/10"
          >
            <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-300 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Simplifique o gerenciamento de pagamentos
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já transformaram sua vida financeira
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-primary-600 hover:bg-primary-50 rounded-full font-semibold text-lg transition-all duration-200 shadow-xl"
            >
              Começar Gratuitamente
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100 dark:border-neutral-800 text-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-primary-600 p-1.5 shadow-lg shadow-primary-500/20">
                  <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">FinControl</span>
              </div>
              <p className="text-gray-500 dark:text-neutral-400 text-sm">
                Sua plataforma completa de gestão financeira pessoal
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-neutral-400">
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-neutral-400">
                <li><a href="/about" className="hover:text-primary-600 dark:hover:text-white transition-colors">Sobre</a></li>
                <li><a href="/support" className="hover:text-primary-600 dark:hover:text-white transition-colors">Suporte</a></li>
                <li><a href="/terms" className="hover:text-primary-600 dark:hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-neutral-400">
                <li><a href="/privacy" className="hover:text-primary-600 dark:hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="/terms" className="hover:text-primary-600 dark:hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 dark:border-neutral-800 text-center text-sm text-gray-400 dark:text-neutral-500">
            <p>© 2025 FinControl. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </PageTransition>
  )
}

export default Landing
