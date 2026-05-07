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
  Sparkles,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Login
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6 border border-blue-100 dark:border-blue-800/30">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Sobre o Projeto</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            <span className="text-primary-600">Fin</span>Control
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            Nós não queremos apenas guardar números. Nossa engenharia existe para empoderar cada movimento financeiro da sua vida.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manifesto Visual</h2>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Erguer-se como o monopólio da clareza e controle na mente das pessoas. Queremos substituir a ansiedade causada por planilhas defasadas pela excelência de um ecossistema inteligente, minimalista e resolutivo ao toque.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Operação Tática</h2>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Disponibilizar os algoritmos anteriormente retidos por instituições Private-Banking e condensá-los na palma da sua mão. Se o desafio financeiro escalar, o FinControl escala primeiro de forma preventiva na sua tela.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Módulos Nativos</h2>
            <p className="text-gray-500 dark:text-neutral-400 mt-2">Tecnologias ancoradas e prontas para seu sucesso.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white dark:bg-neutral-800 p-8 rounded-3xl border border-gray-100 dark:border-neutral-700 shadow-sm hover:border-primary-500/50 transition-colors">
                <div className="w-12 h-12 bg-gray-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Section */}
        <div className="bg-primary-600 dark:bg-primary-700 rounded-[40px] p-8 md:p-16 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-6 text-sm font-bold uppercase tracking-wider">
                <Crown className="w-4 h-4 text-emerald-400" />
                Elevando Padrões
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Assuma o Comando Financeiro <span className="text-emerald-400">Em Espectro Total.</span>
              </h2>
              <p className="text-primary-100 text-lg mb-8 opacity-90">
                Desbloqueie tetos arbitrários. Os dados detalhados podem transformar relatórios corporativos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-50 transition-transform active:scale-95 shadow-lg">
                  REGISTRAR AGORA
                </Link>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <h4 className="font-bold mb-6 flex items-center gap-2 text-xl">
                <Shield className="w-6 h-6 text-emerald-400" />
                Vantagens Core:
              </h4>
              <ul className="space-y-4">
                {premiumFeatures.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-primary-50 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
