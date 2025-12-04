import { FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'

const Terms = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Termos de Uso
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
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Aceitação dos Termos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Ao acessar e usar o FinControl, você concorda em cumprir estes termos de uso. 
              Se você não concordar com algum destes termos, não use nossos serviços.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Uso Permitido
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-3">
              Você pode usar o FinControl para:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Gerenciar suas finanças pessoais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Criar e acompanhar orçamentos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Gerar relatórios financeiros</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Compartilhar dados com sua permissão</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Uso Proibido
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-3">
              Você NÃO pode:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Usar o serviço para atividades ilegais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Tentar acessar contas de outros usuários</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Fazer engenharia reversa do sistema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Sobrecarregar nossos servidores</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Responsabilidades
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Você é responsável por:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-1">!</span>
                <span>Manter a segurança de sua senha</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-1">!</span>
                <span>Todas as atividades em sua conta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-1">!</span>
                <span>A precisão dos dados que você insere</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-1">!</span>
                <span>Notificar-nos sobre uso não autorizado</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Propriedade Intelectual
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Todo o conteúdo, recursos e funcionalidades do FinControl são de propriedade exclusiva 
              da empresa e protegidos por leis de direitos autorais e propriedade intelectual.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Limitação de Responsabilidade
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              O FinControl é fornecido "como está". Não nos responsabilizamos por decisões financeiras 
              tomadas com base nas informações da plataforma. Sempre consulte um profissional financeiro 
              para decisões importantes.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Modificações
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Notificaremos você sobre mudanças significativas por email ou através da plataforma.
            </p>
          </section>

          {/* Contact */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Dúvidas sobre os Termos?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Entre em contato conosco em{' '}
              <a href="mailto:legal@fincontrol.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                contato@fincontrol.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Terms
