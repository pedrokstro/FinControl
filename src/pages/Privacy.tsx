import { Lock, Eye, Database, UserCheck, Scale, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Login
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/30">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Documento Oficial</span>
          </div>
        </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 text-center">
            Política de <span className="text-primary-600">Privacidade</span>
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base text-center">
            Atualizada em {new Date().toLocaleDateString('pt-BR')}. Seus dados financeiros encriptados, soberanos e intocáveis sob os mais rígidos protocolos de sigilo.
          </p>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">I. Compromisso Irrestrito</h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              No núcleo do FinControl, o axioma principal é claro: seus dados bancários e fluxos financeiros nunca são nossos. Eles pertencem unicamente a você. Este documento traça transparentemente a linha divisória de responsabilidades sobre coleta, uso inteligente e proteção de suas informações institucionais.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">II. Coleta de Dados</h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 mb-6">
              Registramos unicamente informações estritamente necessárias para o funcionamento lógico do algoritmo e renderização dos dashboards financeiros:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Identificação: Nome, E-mail Corporativo/Pessoal.',
                'Acesso: Senhas criptografadas (hashing de alta segurança).',
                'Dados Financeiros: Registros inseridos por você.',
                'Segurança: Logs de acesso para prevenção de fraudes.'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-700">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">III. Uso das Informações</h2>
            </div>
            <ul className="space-y-4">
              {[
                'Alimentar as visões analíticas gráficas do seu painel.',
                'Enviar e-mails transacionais e notificações vitais.',
                'Prevenção de ataques cibernéticos (DDoS, Bruteforce).',
                'Preferências de personalização da interface.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-gray-600 dark:text-neutral-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">IV. Direitos do Usuário</h2>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 rounded-r-xl">
              <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                O poder sobre os dados é seu. Você pode solicitar exclusão, correção ou portabilidade a qualquer momento via painel de controle.
              </p>
            </div>
          </div>

          {/* Footer Card */}
          <div className="bg-primary-600 dark:bg-primary-700 rounded-3xl p-8 sm:p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <Scale className="w-10 h-10 mx-auto mb-6 opacity-80" />
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Dúvidas sobre Segurança?</h3>
            <p className="text-primary-100 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              Nossa equipe de segurança está pronta para esclarecer qualquer ponto sobre a proteção dos seus dados.
            </p>
            <a
              href="mailto:suportfincontrol@gmail.com"
              className="inline-block px-8 py-3.5 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Falar com Segurança
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
