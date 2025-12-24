import { Lock, Eye, Database, UserCheck, AlertCircle, Sparkles } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { motion } from 'framer-motion'

const Privacy = () => {
  const floatingShapes = [
    { className: 'w-70 h-70 bg-primary-500/12 top-[-30px] right-[-15px]' },
    { className: 'w-60 h-60 bg-primary-300/12 bottom-[-40px] left-[-20px]' },
    { className: 'w-44 h-44 bg-white/10 top-1/3 left-12 hidden lg:block' },
  ]

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 overflow-hidden">
        {floatingShapes.map((shape, index) => (
          <motion.span
            key={index}
            className={`absolute rounded-full blur-3xl ${shape.className}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
            transition={{ duration: 12 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
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
                <span className="text-sm font-medium">Sua Privacidade Importa</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Política de Privacidade
              </h1>
              <p className="text-xl text-primary-100">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Compromisso com sua Privacidade
                </h2>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                No FinControl, levamos sua privacidade a sério. Esta política descreve como coletamos, 
                usamos e protegemos suas informações pessoais.
              </p>
            </motion.div>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dados que Coletamos
              </h2>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span><strong>Informações de Conta:</strong> Nome, email e senha (criptografada)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span><strong>Dados Financeiros:</strong> Transações, categorias e metas que você registra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span><strong>Dados de Uso:</strong> Como você interage com nossa plataforma</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Como Usamos seus Dados
              </h2>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Fornecer e melhorar nossos serviços</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Personalizar sua experiência</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Enviar notificações importantes sobre sua conta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Garantir a segurança da plataforma</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Seus Direitos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Você tem direito a:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Acessar seus dados pessoais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Corrigir informações incorretas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Solicitar a exclusão de sua conta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                <span>Exportar seus dados</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Segurança
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados, 
              incluindo criptografia, autenticação segura e monitoramento contínuo.
            </p>
          </section>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-2">
                Dúvidas sobre Privacidade?
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
    </PageTransition>
  )
}

export default Privacy
