import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'

const Privacy = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Política de Privacidade
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 p-8 space-y-8">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Compromisso com sua Privacidade
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              No FinControl, levamos sua privacidade a sério. Esta política descreve como coletamos, 
              usamos e protegemos suas informações pessoais.
            </p>
          </section>

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

          {/* Contact */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Dúvidas sobre Privacidade?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Entre em contato conosco em{' '}
              <a href="mailto:privacidade@fincontrol.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                privacidade@fincontrol.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Privacy
