import { Lock, Eye, Database, UserCheck, AlertCircle, Scale, ShieldCheck } from 'lucide-react'
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

const Privacy = () => {
  const { scrollYProgress } = useScroll()
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 selection:bg-primary-500/30 selection:text-primary-900 dark:selection:text-primary-100">

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
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Documento Oficial</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1] drop-shadow-2xl"
            >
              Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 drop-shadow-lg">Privacidade</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-lg md:text-xl text-primary-100/90 font-light max-w-2xl mx-auto drop-shadow-md"
            >
              Atualizada em {new Date().toLocaleDateString('pt-BR')}. Seus dados financeiros encriptados, soberanos e intocáveis sob os mais rígidos protocolos de sigilo.
            </motion.p>
          </motion.div>
        </div>

        {/* Content Restructured - Shadcn aesthetics */}
        <div className="relative z-10 -mt-16 container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Section 1 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  I. Compromisso Irrestrito
                </h2>
              </div>
              <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-neutral-400 leading-relaxed font-light">
                <p>
                  No núcleo do FinControl, o axioma principal é claro: seus dados bancários e fluxos financeiros nunca são nossos. Eles pertencem unicamente a você. Este documento traça transparentemente a linha divisória de responsabilidades sobre coleta, uso inteligente e proteção de suas informações institucionais.
                </p>
              </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                  <Database className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  II. Matriz de Coleta de Dados
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 text-lg leading-relaxed font-light mb-8">
                Registramos unicamente informações estritamente necessárias para o funcionamento lógico do algoritmo e renderização dos dashboards financeiros:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Identificação: Nome, E-mail Corporativo/Pessoal (nunca repassados).',
                  'Arquitetura de Acesso: Senhas (altamente hasheadas via bcrypt/similar).',
                  'Entidades Primitivas: Dados contábeis registrados por você (despesas, receitas).',
                  'Biometria de Uso: Sessões de login e requisições para mitigar fraudes.'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="min-w-6 mt-1 flex justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <span className="text-gray-700 dark:text-neutral-300 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Section 3 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
                  <Eye className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  III. Engenharia de Uso
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 text-lg leading-relaxed font-light mb-8">
                Rejeitamos categoricamente a monetização mercantil de seus dados. Os usos restritos são focados inteiramente em aprimorar a sua própria ferramenta:
              </p>

              <ul className="space-y-4">
                {[
                  'Alimentar os motores lógicos das visões analíticas gráficas do seu painel.',
                  'Executar rotinas assíncronas de notificações vitais sobre a conta (e-mails transacionais).',
                  'Detectar de modo invisível padrões de navegação hostis (prevenção DDoS ou Bruteforce).',
                  'Fornecimento de customização baseada em sessões (ex: preferência Dark Mode).'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="min-w-6 mt-1 flex justify-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    </div>
                    <span className="text-gray-700 dark:text-neutral-300 text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Section 4 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  IV. Soberania Individual (LGPD/GDPR)
                </h2>
              </div>
              <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border-l-4 border-emerald-500 p-6 rounded-r-xl my-8">
                <p className="text-emerald-900 dark:text-emerald-200/80 font-medium leading-relaxed">
                  O poder sobre a permanência dos dados baseia-se puramente em consentimento afirmativo. Exija portabilidade dos formatos, correção em massa ou anonimização imediata via painel de Controle quando desejar.
                </p>
              </div>
            </motion.div>

            {/* Section 5 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  V. Protocolos de Defesa Ativos
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 text-lg leading-relaxed font-light">
                Utilizamos as mais robustas assinaturas criptográficas da indústria, isolamento de bancos de dados via silos e escudos em nível de roteamento para barrar invasões. Seu dinheiro virtual fica trancafiado aqui sob constante vigilância cibernética.
              </p>
            </motion.div>

            {/* Contact Support Block */}
            <motion.div variants={itemVariants} className="mt-16 bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px]" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <Scale className="w-12 h-12 text-primary-300 mx-auto mb-6 opacity-80" />
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                  Transparência é Inegociável.
                </h3>
                <p className="text-primary-100/80 text-lg font-light mb-10 leading-relaxed">
                  Havendo preocupações legítimas sobre a criptografia alocada à sua conta, acione imediatamente nosso esquadrão de Devs & Segurança.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <a
                    href="mailto:suportfincontrol@gmail.com"
                    className="w-full sm:w-auto px-8 py-4 bg-white text-primary-900 rounded-xl font-bold tracking-wide hover:bg-neutral-100 transition-all hover:scale-105 shadow-xl"
                  >
                    CONTATAR DPO DE SEGURANÇA
                  </a>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Privacy
