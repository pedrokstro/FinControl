import { Mail, FileQuestion, Sparkles, ChevronDown, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Support = () => {
  const faqs = [
    {
      question: 'Como criar uma nova transação?',
      answer: 'Vá para a página de Transações e clique no botão "Nova Transação". Preencha os detalhes e salve.'
    },
    {
      question: 'Como alterar minha senha?',
      answer: 'Acesse Configurações > Segurança e clique em "Alterar Senha". Você receberá um código de verificação por email.'
    },
    {
      question: 'O que inclui o plano Premium?',
      answer: 'O Premium inclui relatórios ilimitados, emojis personalizados, categorias personalizadas, suporte prioritário e muito mais.'
    },
    {
      question: 'Como exportar meus dados?',
      answer: 'Em Configurações > Preferências > Dados e Privacidade, clique em "Exportar meus dados" para baixar todas as suas informações.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Sim! Usamos criptografia de ponta a ponta, autenticação segura e seguimos as melhores práticas de segurança.'
    },
    {
      question: 'Como cancelar minha assinatura?',
      answer: 'Acesse Configurações > Assinatura e clique em "Cancelar Assinatura". Você manterá acesso até o fim do período pago.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white dark:bg-neutral-900 sm:bg-gray-50 sm:dark:bg-neutral-900 sm:py-12 px-0 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 sm:bg-transparent min-h-screen sm:min-h-0 p-6 sm:p-0">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 sm:mb-16">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Login
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">Suporte ao Cliente</span>
          </div>
        </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 text-center">
            Central de Ajuda
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 text-base sm:text-lg text-center">
            Estamos aqui para ajudar você a aproveitar ao máximo o FinControl
          </p>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center border border-gray-100 dark:border-neutral-700 shadow-sm">
              <FileQuestion className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden group transition-all"
              >
                <summary className="px-6 py-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors list-none">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 py-5 border-t border-gray-50 dark:border-neutral-700 bg-gray-50/50 dark:bg-neutral-900/50">
                  <p className="text-gray-600 dark:text-neutral-400 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 dark:bg-primary-700 rounded-3xl p-6 sm:p-12 text-center shadow-xl">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-primary-100 mb-6 sm:mb-8 opacity-90 text-sm sm:text-base">
              Nossa equipe de suporte está pronta para ajudar você
            </p>
            <a
              href="mailto:suportfincontrol@gmail.com"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-primary-600 rounded-full font-bold hover:bg-gray-50 transition-transform active:scale-95 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              Entrar em Contato
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Support
