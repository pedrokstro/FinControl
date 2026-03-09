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
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

const FallingMoney = () => {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    const symbols = ['R$', '$', '€', '£', '¥', '₿', '¢']
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 100, // vw
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 25,
      size: 14 + Math.random() * 28, // px
      opacity: 0.15 + Math.random() * 0.45,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 360 + 360,
    }))
    setParticles(generated)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-primary-900">
      {/* Dynamic gradient overlay to make things look deep */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-800/80 via-primary-900/90 to-primary-900 z-10" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-emerald-400 font-serif font-black select-none z-20 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          style={{ left: `${p.x}vw`, fontSize: p.size, opacity: p.opacity }}
          initial={{ y: '-10vh', x: 0, rotate: p.rotateStart }}
          animate={{
            y: '110vh',
            x: [0, Math.random() * 50 - 25, 0], // sway left/right
            rotate: p.rotateEnd
          }}
          transition={{
            y: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: p.duration * 0.5, delay: p.delay, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
            rotate: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
}

const About = () => {
  const { scrollYProgress } = useScroll()
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Intuitivo',
      description: 'Observe o fluxo de suas finanças com gráficos arquitetônicos em tempo real.'
    },
    {
      icon: TrendingUp,
      title: 'Engenharia Analítica',
      description: 'Insights algorítmicos instantâneos para mapear o futuro do seu patrimônio.'
    },
    {
      icon: Bell,
      title: 'Radar Financeiro',
      description: 'Seja alertado antes do acontecimento. Vencimentos e metas monitorados sempre.'
    },
    {
      icon: Shield,
      title: 'Sistema Fortaleza',
      description: 'Isolamento criptográfico militar e 2FA nativo para seus dados não vazarem.'
    },
    {
      icon: Zap,
      title: 'Celeridade Absoluta',
      description: 'Desenvolvido para carregar na magnitude de milissegundos sem congelar.'
    },
    {
      icon: Users,
      title: 'Onipresença Digital',
      description: 'Seu acesso permanece espelhado em altíssima fidelidade seja no Mobile ou PC.'
    }
  ]

  const premiumFeatures = [
    'Transações ilimitadas irrestritas',
    'Customização visual de categorias',
    'Auditoria e exportação de relatórios em QVD/Excel',
    'Contato direto prioritário com time FinControl',
    'Experiência sem publicidade de parceiros',
    'Early Access à novos motores e I.A.',
    'Assinaturas conjuntas para Holding/Família'
  ]

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 selection:bg-primary-500/30 selection:text-primary-900 dark:selection:text-primary-100 pb-20">

        {/* Deep Landing Hero */}
        <div className="relative h-[45vh] lg:h-[55vh] flex items-center justify-center overflow-hidden bg-primary-900">
          <FallingMoney />

          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            className="relative z-20 text-center px-6 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 backdrop-blur-md rounded-full mb-8 shadow-2xl"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Sobre o Projeto</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1] drop-shadow-2xl"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 drop-shadow-lg">Fin</span>Control
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-lg md:text-xl text-primary-100/90 font-light max-w-2xl mx-auto drop-shadow-md"
            >
              Nós não queremos apenas guardar números. Nossa engenharia existe para empoderar cada movimento financeiro da sua vida.
            </motion.p>
          </motion.div>
        </div>

        {/* Vision & Mission Restructured */}
        <div className="relative z-10 -mt-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {/* Vision */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 mb-8 border border-blue-100 dark:border-blue-500/20">
                <Eye className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Manifesto Visual
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 text-lg leading-relaxed font-light">
                Erguer-se como o monopólio da clareza e controle na mente das pessoas. Queremos substituir a ansiedade causada por planilhas defasadas pela excelência de um ecossistema inteligente, minimalista e resolutivo ao toque.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 mb-8 border border-emerald-100 dark:border-emerald-500/20">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Operação Tática
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 text-lg leading-relaxed font-light">
                Disponibilizar os algoritmos anteriormente retidos por instituições Private-Banking e condensá-los na palma da sua mão. Se o desafio financeiro escalar, o FinControl escala primeiro de forma preventiva na sua tela.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Módulos Nativos
            </h2>
            <p className="text-lg text-gray-600 dark:text-neutral-400 font-light">
              Tecnologias que já estão ancoradas e prontas para uso por você.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800 group hover:border-primary-500/50 transition-colors"
              >
                <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors text-primary-600 dark:text-primary-400">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Strip */}
        <div className="bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
            >
              {[
                { label: 'Indivíduos Ativos', value: '10K+' },
                { label: 'Liquidez Mapeada', value: '2M+' },
                { label: 'Disponibilidade Escalar', value: '99.9%' },
                { label: 'Nota em Lojas', value: '4.9★' },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-neutral-400 font-medium tracking-wide text-sm uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-gradient-to-br from-primary-900 to-slate-900 dark:from-neutral-900 dark:to-black rounded-[40px] p-8 sm:p-14 relative overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800"
          >
            {/* Decals inside the Premium Banner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-6 text-white text-sm font-semibold tracking-wide uppercase">
                  <Crown className="w-4 h-4 text-emerald-400" />
                  Elevando Padrões
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1] mb-6">
                  Assuma o Comando Financeiro
                  <span className="block text-emerald-400">Em Espectro Total.</span>
                </h2>
                <p className="text-neutral-300 text-lg leading-relaxed font-light mb-8 max-w-lg mx-auto lg:mx-0">
                  Desbloqueie tetos arbitrários. Os dados detalhados podem transformar relatórios corporativos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold tracking-wide transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-center"
                  >
                    REGISTRAR
                  </Link>
                  <Link
                    to="/app/plans"
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-xl font-bold tracking-wide transition-colors text-center"
                  >
                    LOGIN
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-400" />
                    Vantagens Core:
                  </h4>
                  <ul className="space-y-4">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-neutral-300 font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  )
}

export default About
