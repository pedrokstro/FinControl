import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  Search,
  Mail,
  Copy,
  Check,
  ChevronDown,
  HelpCircle,
  FileQuestion,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowUpRight,
  Clock,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { haptics } from '@/utils/haptics'
import { toast } from 'react-hot-toast'

interface SupportItem {
  id: string
  category: 'Geral' | 'Lançamentos' | 'Planos & Pro' | 'Segurança' | 'Categorias'
  question: string
  answer: string
}

export const MobileSupportView: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const supportEmail = 'suportfincontrol@gmail.com'

  const categories = ['Todas', 'Lançamentos', 'Planos & Pro', 'Segurança', 'Categorias', 'Geral']

  const faqs: SupportItem[] = [
    {
      id: 'faq-1',
      category: 'Lançamentos',
      question: 'Como criar uma nova receita ou despesa?',
      answer: 'No menu inferior toque no botão central de adicionar (+) ou acesse Transações e toque em "Novo Lançamento". Preencha a descrição, valor, categoria e data.'
    },
    {
      id: 'faq-2',
      category: 'Lançamentos',
      question: 'Como marcar uma despesa como fixa/recorrente?',
      answer: 'Ao criar ou editar uma despesa, marque a opção "Recorrente" e selecione a frequência (Mensal, Semanal, Anual). Ela será acompanhada automaticamente na aba de Assinaturas.'
    },
    {
      id: 'faq-3',
      category: 'Planos & Pro',
      question: 'O que está incluso no plano FinControl Pro?',
      answer: 'O Pro libera mais de 250 emojis e ícones temáticos, categorias e subcategorias ilimitadas, exportação completa de dados em Excel/PDF/CSV, suporte prioritário e navegação sem nenhum anúncio.'
    },
    {
      id: 'faq-4',
      category: 'Planos & Pro',
      question: 'Como cancelar ou gerenciar minha assinatura?',
      answer: 'Vá em Ajustes > Planos & Assinatura. Se você já for Pro, terá o botão direto para gerenciar no portal do Stripe ou cancelar a renovação sem multas.'
    },
    {
      id: 'faq-5',
      category: 'Segurança',
      question: 'Como habilitar a autenticação por Biometria?',
      answer: 'Em Ajustes > Segurança, ative a chave "Biometria (Face ID / Digital)". Seu dispositivo solicitará a digital ou reconhecimento facial ao abrir o aplicativo.'
    },
    {
      id: 'faq-6',
      category: 'Segurança',
      question: 'Meus dados bancários e senhas estão seguros?',
      answer: 'Sim! Utilizamos criptografia ponta a ponta (AES-256 e SSL) e nunca compartilhamos dados sensíveis. Seus dados de faturamento são armazenados exclusivamente pela Stripe.'
    },
    {
      id: 'faq-7',
      category: 'Categorias',
      question: 'Como criar categorias personalizadas?',
      answer: 'Acesse o menu Categorias no painel ou no menu lateral, toque em "Nova Categoria" e escolha um ícone, cor e nome personalizado para organizar seus gastos.'
    },
    {
      id: 'faq-8',
      category: 'Geral',
      question: 'Como exportar meus relatórios financeiros?',
      answer: 'Acesse Relatórios ou Ajustes > Segurança > Exportar Dados para baixar uma cópia completa dos seus lançamentos e análises em arquivo de dados ou planilhas.'
    }
  ]

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'Todas' || faq.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)

      return matchesCategory && matchesQuery
    })
  }, [faqs, selectedCategory, searchQuery])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail)
      haptics.success()
      setCopiedEmail(true)
      toast.success('E-mail de suporte copiado!')
      setTimeout(() => setCopiedEmail(false), 2500)
    } catch {
      haptics.warning()
      toast.error('Não foi possível copiar o e-mail.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-28 pt-1 select-none animate-fadeIn">
      {/* 1. Header Nativo */}
      <div className="flex items-center justify-between py-3 mb-2 px-1">
        <button
          type="button"
          onClick={() => {
            haptics.light()
            navigate(-1)
          }}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 flex items-center justify-center text-gray-700 dark:text-neutral-200 active:scale-95 transition-transform shadow-xs"
          title="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-bold text-gray-900 dark:text-white font-display">
            Central de Ajuda
          </h1>
          <span className="text-[11px] text-gray-400 dark:text-neutral-500 font-medium">
            Suporte e Dúvidas Frequentes
          </span>
        </div>

        <div className="w-10 flex items-center justify-end">
          <div className="w-8 h-8 rounded-full bg-primary-500/10 dark:bg-primary-400/10 border border-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 2. Barra de Pesquisa Nativa */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Como podemos te ajudar hoje?"
            className="w-full h-12 pl-10 pr-9 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                haptics.light()
                setSearchQuery('')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3. Chips de Categoria (Rolagem Horizontal Suave) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  haptics.light()
                  setSelectedCategory(cat)
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 border border-gray-150 dark:border-neutral-800'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* 4. Lista de Dúvidas no Formato Inset Grouped */}
        <div>
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              Perguntas Frequentes ({filteredFaqs.length})
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-sm">
              <FileQuestion className="w-8 h-8 text-gray-300 dark:text-neutral-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Nenhum resultado encontrado
              </p>
              <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
                Tente buscar com outros termos ou entre em contato direto conosco abaixo.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
              {filteredFaqs.map((faq) => {
                const isOpen = openItem === faq.id
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => {
                        haptics.light()
                        setOpenItem(isOpen ? null : faq.id)
                      }}
                      className="w-full p-4 flex items-center justify-between text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
                    >
                      <div className="pr-3">
                        <span className="text-xs font-bold text-gray-900 dark:text-white block">
                          {faq.question}
                        </span>
                        <span className="text-[10px] font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mt-0.5 block">
                          {faq.category}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 dark:text-neutral-500 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-primary-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-neutral-400 border-t border-gray-50 dark:border-neutral-800/60 bg-gray-50/50 dark:bg-neutral-900/40 leading-relaxed animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 5. Canais Diretos de Contato */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
            Fale com a nossa equipe
          </span>

          <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Suporte Oficial via E-mail
                </span>
                <span className="text-xs text-gray-500 dark:text-neutral-400 block truncate mt-0.5">
                  {supportEmail}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={`mailto:${supportEmail}`}
                onClick={() => haptics.medium()}
                className="flex-1 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
              >
                <Mail className="w-4 h-4" />
                Enviar E-mail
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="h-10 px-3.5 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                title="Copiar e-mail"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-neutral-500 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Resposta em até 24 horas úteis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
