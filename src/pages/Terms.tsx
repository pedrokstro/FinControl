import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Scale,
  CheckCircle2,
  XCircle,
  Shield,
  Landmark,
  ArrowLeft,
  FileText,
  Mail,
  ArrowRight
} from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'

const Terms = () => {
  const navigate = useNavigate()

  const sections = [
    {
      num: '01',
      title: 'Aceitação do Protocolo & Serviços',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      content:
        'Ao acessar, criar conta ou navegar no ecossistema FinControl, você expressa concordância voluntária e irrestrita com estes Termos de Serviço. Este documento constitui um acordo vinculativo entre o usuário e a plataforma FinControl, regendo o uso de nossas ferramentas de gestão patrimonial, inteligência analítica e automação financeira.'
    },
    {
      num: '02',
      title: 'Licença de Uso & Acesso à Plataforma',
      icon: <Landmark className="w-6 h-6 text-primary-500" />,
      content:
        'Concedemos uma licença pessoal, não-exclusiva, intransferível e revogável para acesso aos nossos serviços e interfaces web/mobile. Essa autorização inclui:',
      bullets: [
        'Registro e auditoria de transações, contas e cartões de crédito.',
        'Criação de orçamentos, tetos por categoria e planejamento financeiro.',
        'Definição de metas patrimoniais e simulações com calculadoras avançadas.',
        'Exportação de relatórios analíticos em PDF e planilhas estruturadas.'
      ]
    },
    {
      num: '03',
      title: 'Condutas & Usos Estritamente Proibidos',
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      content:
        'Para manter a integridade da comunidade e segurança dos servidores, é expressamente vedado ao usuário:',
      bullets: [
        'Utilizar a plataforma para encobrir transações ilegais ou lavagem de dinheiro.',
        'Praticar engenharia reversa, descompilação ou scraping não autorizado.',
        'Tentativas de exploração de vulnerabilidades, ataques DDoS ou injeção de código.',
        'Compartilhamento indevido de credenciais ou simulação de identidade de terceiros.'
      ]
    },
    {
      num: '04',
      title: 'Responsabilidades & Caráter Informativo',
      icon: <Shield className="w-6 h-6 text-amber-500" />,
      content:
        'O FinControl fornece instrumentalização lógica e organizacional para suas finanças. As projeções, gráficos e simulações de rendimentos possuem caráter estritamente educativo e analítico, não constituindo recomendação formal de investimento ou assessoria regulada por órgãos de mercado de capitais.'
    }
  ]

  return (
    <PageTransition className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white selection:bg-primary-500 selection:text-white transition-colors duration-300">
      {/* Header Fixo Minimalista no Padrão Landing */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-50/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60 transition-all">
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 transition-transform group-hover:scale-105">
              <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-2xl tracking-tight text-neutral-900 dark:text-white">
                FinControl
              </span>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">Legal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/privacy"
              className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-3 py-2"
            >
              Privacidade
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="h-10 px-5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Entrar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 pt-32 sm:pt-40 pb-24">
        {/* Top Badge & Título */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md mb-6 shadow-sm"
          >
            <Scale className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-xs font-mono tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">
              Diretrizes & Acordo Legal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-900 dark:text-white mb-4 leading-tight"
          >
            Termos de <span className="text-primary-600 dark:text-primary-400">Serviço</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed"
          >
            Vigência atualizada em {new Date().toLocaleDateString('pt-BR')}. Estabelecemos os direitos, deveres e parâmetros transparentes que garantem a segurança do seu patrimônio.
          </motion.p>
        </div>

        {/* Seções de Termos com Accordion */}
        <Accordion
          type="multiple"
          defaultValue={['01', '02']}
          variant="card"
          className="space-y-4"
        >
          {sections.map((section) => (
            <AccordionItem key={section.num} value={section.num} className="p-6 sm:p-8">
              <AccordionTrigger
                icon={
                  <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-center shrink-0">
                    {section.icon}
                  </div>
                }
                subtitle={`SEÇÃO ${section.num}`}
                className="py-1"
              >
                <span className="text-xl sm:text-2xl font-bold font-display text-neutral-900 dark:text-white">
                  {section.title}
                </span>
              </AccordionTrigger>

              <AccordionContent className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 mt-4">
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {section.content}
                </p>

                {section.bullets && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {section.bullets.map((bullet, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Card CTA Suporte Jurídico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 dark:from-neutral-900 dark:via-primary-950 dark:to-neutral-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center"
        >
          {/* Luz de fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <FileText className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-display mb-3">
              Transparência Inegociável
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8">
              Tem alguma dúvida sobre os termos ou precisa de esclarecimentos adicionais? Nossa equipe jurídica está pronta para te atender.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:suportfincontrol@gmail.com"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-neutral-900 font-bold text-sm hover:bg-neutral-100 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-primary-600" />
                <span>Contato Jurídico</span>
              </a>

              <Link
                to="/login"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Acesso</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Rodapé da Página */}
        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400 dark:text-neutral-600">
          <div>© {new Date().getFullYear()} FinControl. Todos os direitos reservados.</div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}

export default Terms
