import { Link } from 'react-router-dom'
import { Github, Mail, Shield, FileText, HelpCircle, Wallet } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                FinControl
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Controle financeiro inteligente para uma vida mais organizada e próspera.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
              <span>Feito por </span>
              <span>FinControl</span>
            </div>
          </div>

          {/* Links - Produto */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
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
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
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
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-neutral-400 text-center md:text-left">
              <p>© {currentYear} FinControl — Todos os direitos reservados</p>
              <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                Versão 1.8.0
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/pedrokstro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:suportfincontrol@gmail.com"
                className="text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
