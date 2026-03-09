import { Link } from 'react-router-dom'
import { Github, Mail, Shield, FileText, HelpCircle, Wallet } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 pb-24 md:pb-12">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          {/* Brand */}
          <div className="space-y-4 md:w-1/3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                FinControl
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-neutral-400 max-w-[280px]">
              Controle financeiro inteligente para uma vida mais organizada e próspera.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400 font-medium bg-gray-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full w-fit mt-2">
              <span>Feito por</span>
              <span className="font-bold text-gray-900 dark:text-white">FinControl</span>
            </div>
          </div>

          {/* Links Area */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 gap-y-10 md:w-2/3">

            {/* Links - Produto */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
                Produto
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/app/plans"
                    className="text-sm text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Planos e Preços
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/pedrokstro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Links - Suporte */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
                Suporte
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/support"
                    className="text-sm text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:suportfincontrol@gmail.com"
                    className="text-sm text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                  >
                    <Mail className="w-4 h-4" />
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            {/* Links - Legal */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" />
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="text-sm text-gray-600 dark:text-neutral-400 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
              <p className="font-medium">© {currentYear} FinControl — Todos os direitos reservados</p>
              <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                Versão 1.8.0
              </p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-neutral-800/50 p-2 px-4 rounded-full order-1 md:order-2">
              <a
                href="https://github.com/pedrokstro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <div className="w-px h-4 bg-gray-300 dark:bg-neutral-700" />
              <a
                href="mailto:suportfincontrol@gmail.com"
                className="text-gray-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
