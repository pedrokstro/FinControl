import { FileText, CheckCircle2, XCircle, Scale, Shield, Landmark, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Terms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white dark:bg-neutral-900 sm:bg-gray-50 sm:dark:bg-neutral-900 sm:py-12 px-0 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 sm:bg-transparent min-h-screen sm:min-h-0 p-6 sm:p-0">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Login
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800/30">
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Documento Oficial</span>
          </div>
        </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 text-center">
            Termos de <span className="text-primary-600">Serviço</span>
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base text-center">
            Vigência a partir de {new Date().toLocaleDateString('pt-BR')}. Estabelecemos as diretrizes legais para proteger o seu patrimônio com absoluta transparência.
          </p>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">I. Aceitação do Protocolo</h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
              Ao acessar e autenticar no ecossistema FinControl, o usuário manifesta concordância irrestrita aos termos e condições aqui dispostos. Este documento possui natureza de contrato vinculativo e essencial para o fornecimento dos serviços de arquitetura e inteligência financeira.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Landmark className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">II. Licença de Uso</h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 mb-6">
              Garantimos a você uma licença pessoal, não-exclusiva e intransferível para utilizar os recursos de nossa interface. O ambiente autoriza exclusivamente:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Auditoria de movimentações financeiras.',
                'Estruturação analítica de ativos e passivos.',
                'Projeções e calculadoras financeiras.',
                'Compartilhamento seguro com assessores.'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">III. Usos Vedados</h2>
            </div>
            <ul className="space-y-4">
              {[
                'Uso para atividades financeiras ilícitas.',
                'Exploração ou pentesting não autorizado.',
                'Engenharia reversa do núcleo algorítmico.',
                'Ações que causem denegação de serviço (DDoS).'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-gray-600 dark:text-neutral-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">IV. Responsabilidade</h2>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-xl">
              <p className="text-amber-800 dark:text-amber-300 font-medium">
                O FinControl fornece instrumentalização lógica. Todas as projeções possuem caráter estritamente educativo e analítico.
              </p>
            </div>
          </div>

          {/* Footer Card */}
          <div className="bg-primary-600 dark:bg-primary-700 rounded-3xl p-8 sm:p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <FileText className="w-10 h-10 mx-auto mb-6 opacity-80" />
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Transparência Inegociável</h3>
            <p className="text-primary-100 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              Se tiver dúvidas sobre estes termos ou precisar de ajustes corporativos, entre em contato.
            </p>
            <a
              href="mailto:suportfincontrol@gmail.com"
              className="inline-block px-8 py-3.5 bg-white text-primary-600 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Suporte Jurídico
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Terms
