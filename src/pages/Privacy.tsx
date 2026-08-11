import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  UserCheck,
  ArrowLeft,
  Mail,
  ArrowRight,
  KeyRound
} from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'

const Privacy = () => {
  const navigate = useNavigate()

  const sections = [
    {
      num: '01',
      title: 'Compromisso & Soberania dos Dados',
      icon: <Lock className="w-6 h-6 text-emerald-500" />,
      content:
        'No ecossistema FinControl, a premissa é absoluta: seus dados financeiros pertencem exclusivamente a você. Não comercializamos, compartilhamos ou concedemos acesso a terceiros sob nenhuma circunstância. Todas as rotinas são executadas com isolamento lógico de banco de dados e autenticação criptográfica de ponta.'
    },
    {
      num: '02',
      title: 'Coleta Estritamente Essencial',
      icon: <Database className="w-6 h-6 text-primary-500" />,
      content:
        'Coletamos única e exclusivamente as informações técnicas necessárias para viabilizar as funcionalidades da plataforma e garantir a integridade da sua sessão:',
      bullets: [
        'Identificação: Nome e e-mail para autenticação e comunicação transacional.',
        'Segurança: Senhas criptografadas com algoritmos de hashing irreversíveis (Bcrypt/Argon2).',
        'Dados Financeiros: Registros de receitas, despesas, orçamentos e metas cadastrados por você.',
        'Logs de Sessão: Registros temporários de IP e user-agent para detecção de fraudes e intrusões.'
      ]
    },
    {
      num: '03',
      title: 'Uso & Finalidade das Informações',
      icon: <Eye className="w-6 h-6 text-indigo-500" />,
      content:
        'Seus dados são processados exclusivamente para alimentar os recursos da sua própria conta:',
      bullets: [
        'Construção de relatórios gráficos, balanços e dashboards em tempo real.',
        'Envio de alertas de segurança, códigos de verificação 2FA e lembretes de faturas.',
        'Cálculo de projeções patrimoniais e simulação de juros compostos sob sua demanda.',
        'Melhoria contínua de performance e estabilidade do aplicativo web e PWA.'
      ]
    },
    {
      num: '04',
      title: 'Direitos do Titular & Exclusão Total',
      icon: <UserCheck className="w-6 h-6 text-emerald-500" />,
      content:
        'Em conformidade integral com a LGPD e padrões globais de privacidade, você detém controle total: pode solicitar exportação de todos os seus dados em JSON/PDF ou a exclusão irreversível de sua conta e histórico diretamente pelas configurações da plataforma a qualquer momento.'
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
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">Privacidade</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/terms"
              className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-3 py-2"
            >
              Termos de Uso
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-mono tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">
              Criptografia & Sigilo Bancário
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-900 dark:text-white mb-4 leading-tight"
          >
            Política de <span className="text-primary-600 dark:text-primary-400">Privacidade</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed"
          >
            Atualizada em {new Date().toLocaleDateString('pt-BR')}. Seus dados financeiros encriptados, soberanos e intocáveis sob os mais rigorosos protocolos internacionais de proteção.
          </motion.p>
        </div>

        {/* Seções de Privacidade com Accordion */}
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
                subtitle={`PROTOCOLO ${section.num}`}
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
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Card CTA Segurança */}
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
              <KeyRound className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-display mb-3">
              Dúvidas sobre Proteção de Dados?
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8">
              Nosso time de segurança da informação e privacidade está disponível para esclarecer como protegemos cada byte de informação.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:suportfincontrol@gmail.com"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-neutral-900 font-bold text-sm hover:bg-neutral-100 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-primary-600" />
                <span>Oficial de Privacidade</span>
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

export default Privacy
