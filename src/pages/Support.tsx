import { HelpCircle, Mail, FileQuestion } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'

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
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Central de Ajuda
          </h1>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            Estamos aqui para ajudar você a aproveitar ao máximo o FinControl
          </p>
        </div>

        {/* FAQs */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <FileQuestion className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <span className="text-primary-600 dark:text-primary-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </div>
                </summary>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                  <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-blue-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-white/90 mb-6">
            Nossa equipe de suporte está pronta para ajudar você
          </p>
          <a
            href="mailto:suportfincontrol@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Mail className="w-5 h-5" />
            Entrar em Contato
          </a>
        </div>
      </div>
    </PageTransition>
  )
}

export default Support
