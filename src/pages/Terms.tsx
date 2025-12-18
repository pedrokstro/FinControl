import { FileText, CheckCircle2, XCircle, AlertTriangle, Sparkles } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { motion } from 'framer-motion'

const Terms = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6 max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Termos e Condições</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Termos de Uso
              </h1>
              <p className="text-xl text-primary-100">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid gap-6">
            {/* Section 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Aceitação dos Termos
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                Ao acessar e usar o FinControl, você concorda em cumprir estes termos de uso. 
                Se você não concordar com algum destes termos, não use nossos serviços.
              </p>
            </motion.div>

            {/* Section 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Uso Permitido
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
                Você pode usar o FinControl para:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                  <span>Gerenciar suas finanças pessoais</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                  <span>Criar e acompanhar orçamentos</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                  <span>Gerar relatórios financeiros</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                  <span>Compartilhar dados com sua permissão</span>
                </li>
              </ul>
            </motion.div>

            {/* Section 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-danger-500 to-danger-600 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Uso Proibido
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
                Você NÃO pode:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                  <span>Usar o serviço para atividades ilegais</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                  <span>Tentar acessar contas de outros usuários</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                  <span>Fazer engenharia reversa do sistema</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                  <span>Sobrecarregar nossos servidores</span>
                </li>
              </ul>
            </motion.div>

            {/* Section 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Responsabilidades
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
                Você é responsável por:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                  <span>Manter a segurança de sua senha</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                  <span>Todas as atividades em sua conta</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                  <span>A precisão dos dados que você insere</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 dark:text-neutral-400">
                  <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                  <span>Notificar-nos sobre uso não autorizado</span>
                </li>
              </ul>
            </motion.div>

            {/* Section 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Propriedade Intelectual
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                Todo o conteúdo, recursos e funcionalidades do FinControl são de propriedade exclusiva 
                da empresa e protegidos por leis de direitos autorais e propriedade intelectual.
              </p>
            </motion.div>

            {/* Section 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Limitação de Responsabilidade
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                O FinControl é fornecido "como está". Não nos responsabilizamos por decisões financeiras 
                tomadas com base nas informações da plataforma. Sempre consulte um profissional financeiro 
                para decisões importantes.
              </p>
            </motion.div>

            {/* Section 7 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Modificações
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                Notificaremos você sobre mudanças significativas por email ou através da plataforma.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-2">
                Dúvidas sobre os Termos?
              </h3>
              <p className="text-primary-100 mb-4">
                Nossa equipe está pronta para ajudar você
              </p>
              <a
                href="mailto:suportfincontrol@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                Entrar em Contato
              </a>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Terms
