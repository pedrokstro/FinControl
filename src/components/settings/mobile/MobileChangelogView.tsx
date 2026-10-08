import React from 'react'
import {
  ChevronLeft,
  History,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Smartphone
} from 'lucide-react'
import { haptics } from '@/utils/haptics'

interface MobileChangelogViewProps {
  onBack: () => void
  version: string
}

export const MobileChangelogView: React.FC<MobileChangelogViewProps> = ({
  onBack,
  version,
}) => {
  const releases = [
    {
      version: 'v2.12.33',
      date: 'Outubro de 2026',
      isLatest: true,
      tag: 'Versão Atual',
      tagColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/60',
      highlights: [
        {
          title: 'Interface Mobile Nativa Completa',
          desc: 'Telas de Configurações, Perfil, Segurança e Notificações redesenhadas com componentes nativos móveis.',
          icon: Smartphone,
          type: 'NOVO',
          typeColor: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40',
        },
        {
          title: 'Native Bottom Sheets e Haptics',
          desc: 'Substituição de modais web por folhas nativas deslizáveis com toque tátil refinado.',
          icon: Zap,
          type: 'MELHORIA',
          typeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
        },
        {
          title: 'Ações Rápidas no Dashboard',
          desc: 'Botões pill ergonômicos para Receita e Despesa com botão rápido de alternância de tema.',
          icon: Sparkles,
          type: 'MELHORIA',
          typeColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
        },
      ],
    },
    {
      version: 'v2.12.0',
      date: 'Setembro de 2026',
      isLatest: false,
      tag: 'Estável',
      tagColor: 'text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 border-gray-200/60',
      highlights: [
        {
          title: 'Login por Biometria WebAuthn',
          desc: 'Desbloqueio seguro por digital ou reconhecimento facial.',
          icon: ShieldCheck,
          type: 'SEGURANÇA',
          typeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
        },
        {
          title: 'Busca Universal de Ícones',
          desc: 'Integração de milhares de ícones para personalização de categorias e cartões.',
          icon: Sparkles,
          type: 'NOVO',
          typeColor: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40',
        },
      ],
    },
  ]

  return (
    <div className="pb-28 pt-1 animate-fadeIn select-none">
      {/* 1. Header Nativo com Botão Voltar */}
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => {
            haptics.light()
            onBack()
          }}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 active:scale-90 transition-all"
          aria-label="Voltar para Ajustes"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display tracking-tight">
          Atualizações
        </h1>
      </div>

      {/* 2. Banner de Status da Versão */}
      <div className="w-full bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-5 text-white shadow-lg shadow-primary-950/20 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <History className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white/80">FinControl App</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-primary-700">
            v{version}
          </span>
        </div>
        <h2 className="text-lg font-black tracking-tight font-display mt-2">
          Sistema Atualizado
        </h2>
        <p className="text-xs text-white/80 mt-1 leading-relaxed">
          Você está utilizando a versão mais recente com todas as proteções, otimizações e recursos ativos.
        </p>
      </div>

      {/* 3. Linha do Tempo de Novidades */}
      <div className="space-y-4">
        {releases.map((rel) => (
          <div
            key={rel.version}
            className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm p-4"
          >
            {/* Header da Versão */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-neutral-800">
              <div>
                <span className="text-sm font-black text-gray-900 dark:text-white font-display">
                  {rel.version}
                </span>
                <span className="text-xs text-gray-400 dark:text-neutral-500 block">
                  {rel.date}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rel.tagColor}`}>
                {rel.tag}
              </span>
            </div>

            {/* Itens */}
            <div className="space-y-3">
              {rel.highlights.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${item.typeColor}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
