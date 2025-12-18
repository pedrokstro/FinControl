import { HelpCircle, Mail, FileQuestion, Sparkles, ChevronDown } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
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
                <span className="text-sm font-medium">Suporte ao Cliente</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Central de Ajuda
              </h1>
              <p className="text-xl text-primary-100">
                Estamos aqui para ajudar você a aproveitar ao máximo o FinControl
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* FAQs */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                  <FileQuestion className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="font-semibold text-primary-600 dark:text-primary-400">FAQ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Perguntas Frequentes
                </h2>
              </motion.div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.details
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden group"
                  >
                    <summary className="px-6 py-5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors list-none">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <ChevronDown className="w-5 h-5 text-primary-600 dark:text-primary-400 group-open:rotate-180 transition-transform" />
                      </div>
                    </summary>
                    <div className="px-6 py-5 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                      <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.details>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-12 text-center shadow-2xl"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Não encontrou o que procura?
                </h2>
                <p className="text-xl text-primary-100 mb-8">
                  Nossa equipe de suporte está pronta para ajudar você
                </p>
                <a
                  href="mailto:suportfincontrol@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 hover:scale-105 shadow-xl"
                >
                  <Mail className="w-5 h-5" />
                  Entrar em Contato
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Support
