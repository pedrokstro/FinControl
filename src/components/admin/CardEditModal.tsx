import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  Image as ImageIcon,
  Shield,
  CreditCard,
  Bell,
  TrendingUp,
  Wallet,
  Tag,
  Gift,
  AlertTriangle,
  Target,
  Percent,
  Zap,
  Award,
  CheckCircle2,
  Info,
  Lock,
  Smartphone,
  Calendar,
  DollarSign,
  PiggyBank,
  FileText,
  PieChart,
  BarChart3,
  Star,
  Flame,
  ShoppingBag,
  Megaphone,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import MobileCardLivePreview from './MobileCardLivePreview'
import { haptics } from '@/utils/haptics'

export interface CardFormData {
  title: string
  desc: string
  icon: string
  imageSrc: string
  bg: string
  textColor: string
  descColor: string
  iconColor: string
  iconBg: string
  actionPath: string
  isActive: boolean
}

interface CardEditModalProps {
  isOpen: boolean
  cardId: string | null
  formData: CardFormData
  setFormData: React.Dispatch<React.SetStateAction<CardFormData>>
  onClose: () => void
  onSave: (e: React.FormEvent) => void
  isLoading: boolean
}

interface CuratedIcon {
  name: string
  label: string
  icon: LucideIcon
}

const CURATED_ICONS: CuratedIcon[] = [
  { name: 'Shield', label: 'Segurança', icon: Shield },
  { name: 'CreditCard', label: 'Cartão', icon: CreditCard },
  { name: 'Sparkles', label: 'Destaque', icon: Sparkles },
  { name: 'Bell', label: 'Notificação', icon: Bell },
  { name: 'TrendingUp', label: 'Crescimento', icon: TrendingUp },
  { name: 'Wallet', label: 'Carteira', icon: Wallet },
  { name: 'Tag', label: 'Oferta', icon: Tag },
  { name: 'Gift', label: 'Benefício', icon: Gift },
  { name: 'AlertTriangle', label: 'Aviso', icon: AlertTriangle },
  { name: 'Target', label: 'Meta', icon: Target },
  { name: 'Percent', label: 'Desconto', icon: Percent },
  { name: 'Zap', label: 'Instantâneo', icon: Zap },
  { name: 'Award', label: 'Conquista', icon: Award },
  { name: 'CheckCircle2', label: 'Sucesso', icon: CheckCircle2 },
  { name: 'Info', label: 'Informação', icon: Info },
  { name: 'Lock', label: 'Privacidade', icon: Lock },
  { name: 'Smartphone', label: 'Aplicativo', icon: Smartphone },
  { name: 'Calendar', label: 'Vencimento', icon: Calendar },
  { name: 'DollarSign', label: 'Finanças', icon: DollarSign },
  { name: 'PiggyBank', label: 'Reserva', icon: PiggyBank },
  { name: 'FileText', label: 'Fatura', icon: FileText },
  { name: 'PieChart', label: 'Relatórios', icon: PieChart },
  { name: 'BarChart3', label: 'Métricas', icon: BarChart3 },
  { name: 'Star', label: 'Exclusivo', icon: Star },
  { name: 'Flame', label: 'Urgente', icon: Flame },
  { name: 'ShoppingBag', label: 'Compras', icon: ShoppingBag },
  { name: 'Megaphone', label: 'Comunicado', icon: Megaphone },
  { name: 'HelpCircle', label: 'Suporte', icon: HelpCircle },
]

const COLOR_PRESETS = [
  {
    id: 'default',
    name: 'Branco Neutro',
    description: 'Padrão do sistema',
    badgeColor: 'bg-white border-2 border-gray-300 dark:bg-neutral-800 dark:border-neutral-600',
    bg: 'bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800/85 shadow-sm',
    textColor: 'text-gray-900 dark:text-white',
    descColor: 'text-gray-500 dark:text-neutral-400',
    iconColor: 'text-primary-600 dark:text-primary-400',
    iconBg: 'bg-primary-50 dark:bg-primary-950/20',
  },
  {
    id: 'blue',
    name: 'Azul FinControl',
    description: 'Destaque de marca',
    badgeColor: 'bg-primary-600',
    bg: 'bg-primary-600 dark:bg-primary-700 shadow-sm shadow-primary-500/10',
    textColor: 'text-white',
    descColor: 'text-white/80',
    iconColor: 'text-white',
    iconBg: 'bg-white/20',
  },
  {
    id: 'amber',
    name: 'Âmbar Destaque',
    description: 'Promoções e novidades',
    badgeColor: 'bg-amber-500',
    bg: 'bg-amber-500 dark:bg-amber-600 shadow-sm',
    textColor: 'text-white',
    descColor: 'text-white/95',
    iconColor: 'text-white',
    iconBg: 'bg-white/20',
  },
  {
    id: 'emerald',
    name: 'Verde Esmeralda',
    description: 'Metas e economia',
    badgeColor: 'bg-emerald-600',
    bg: 'bg-emerald-600 dark:bg-emerald-700 shadow-sm',
    textColor: 'text-white',
    descColor: 'text-white/90',
    iconColor: 'text-white',
    iconBg: 'bg-white/20',
  },
  {
    id: 'red',
    name: 'Carmim Alerta',
    description: 'Avisos e pendências',
    badgeColor: 'bg-red-600',
    bg: 'bg-red-650 dark:bg-red-750 shadow-sm',
    textColor: 'text-white',
    descColor: 'text-white/95',
    iconColor: 'text-white',
    iconBg: 'bg-white/20',
  },
  {
    id: 'indigo',
    name: 'Roxo Índigo',
    description: 'Premium e benefícios',
    badgeColor: 'bg-indigo-600',
    bg: 'bg-indigo-600 dark:bg-indigo-700 shadow-sm',
    textColor: 'text-white',
    descColor: 'text-white/90',
    iconColor: 'text-white',
    iconBg: 'bg-white/20',
  },
  {
    id: 'dark',
    name: 'Dark Grafite',
    description: 'Minimalismo escuro',
    badgeColor: 'bg-neutral-900 border border-neutral-700',
    bg: 'bg-neutral-900 dark:bg-black border border-neutral-800 dark:border-neutral-800/80 shadow-sm',
    textColor: 'text-neutral-100',
    descColor: 'text-neutral-400',
    iconColor: 'text-neutral-200',
    iconBg: 'bg-neutral-800 dark:bg-neutral-900',
  },
]

export const CardEditModal: React.FC<CardEditModalProps> = ({
  isOpen,
  cardId,
  formData,
  setFormData,
  onClose,
  onSave,
  isLoading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [iconMode, setIconMode] = useState<'icon' | 'image'>(formData.imageSrc ? 'image' : 'icon')
  const [iconSearch, setIconSearch] = useState('')

  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return CURATED_ICONS
    const term = iconSearch.toLowerCase()
    return CURATED_ICONS.filter(
      (item) => item.name.toLowerCase().includes(term) || item.label.toLowerCase().includes(term)
    )
  }, [iconSearch])

  useEffect(() => {
    if (!isOpen) return

    haptics.light()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelectPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    haptics.light()
    setFormData((prev) => ({
      ...prev,
      bg: preset.bg,
      textColor: preset.textColor,
      descColor: preset.descColor,
      iconColor: preset.iconColor,
      iconBg: preset.iconBg,
    }))
  }

  const handleSelectIcon = (iconName: string) => {
    haptics.light()
    setFormData((prev) => ({
      ...prev,
      icon: iconName,
      imageSrc: '',
    }))
  }

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop global cobrindo 100% da viewport */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Container de alinhamento com ponte de eventos segura */}
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden border border-gray-100 dark:border-neutral-800 animate-in zoom-in-95 duration-150 flex flex-col pointer-events-auto"
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
              {cardId ? 'Editar Card de Aviso' : 'Novo Card de Aviso'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              Configure o conteúdo, estilo visual e destino do card exibido no carrossel mobile
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 active:scale-95 transition-all"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body com 2 Colunas */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna de Configuração */}
          <form onSubmit={onSave} id="cardForm" className="lg:col-span-7 space-y-5">
            {/* Seletor de Cores e Estilos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                  <span>Paleta e Estilo Visual</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = formData.bg === preset.bg
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 active:scale-[0.98] ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 ring-2 ring-primary-500/20 shadow-sm'
                          : 'border-gray-200/60 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-800/40 hover:border-gray-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className={`w-4 h-4 rounded-full flex-shrink-0 shadow-xs ${preset.badgeColor}`} />
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-800 dark:text-neutral-200 line-clamp-1 leading-tight">
                          {preset.name}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Título e Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Fatura do Cartão"
                  className="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Link de Destino
                </label>
                <input
                  type="text"
                  value={formData.actionPath}
                  onChange={(e) => setFormData({ ...formData, actionPath: e.target.value })}
                  placeholder="Ex: /app/cards"
                  className="input-field mt-1"
                  required
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                Descrição
              </label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Descreva o conteúdo do comunicado para o usuário..."
                className="input-field mt-1 min-h-[64px]"
                required
              />
            </div>

            {/* Seletor Visual de Ícones / Imagem */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Ícone ou Imagem
                </label>

                {/* Alternador de Modo */}
                <div className="flex p-0.5 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light()
                      setIconMode('icon')
                      setFormData((prev) => ({ ...prev, imageSrc: '' }))
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 ${
                      iconMode === 'icon'
                        ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-xs'
                        : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Shield className="w-3 h-3 text-primary-500" />
                    <span>Ícones</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light()
                      setIconMode('image')
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 ${
                      iconMode === 'image'
                        ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-xs'
                        : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3 text-emerald-500" />
                    <span>Imagem URL</span>
                  </button>
                </div>
              </div>

              {iconMode === 'icon' ? (
                <div className="p-3.5 bg-gray-50/60 dark:bg-neutral-800/30 rounded-2xl border border-gray-100 dark:border-neutral-800 space-y-3">
                  {/* Busca Rápida de Ícones */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      placeholder="Buscar ícone por nome..."
                      className="input-field pl-8 text-xs h-9 bg-white dark:bg-neutral-900"
                    />
                    {iconSearch && (
                      <button
                        type="button"
                        onClick={() => setIconSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Grade de Ícones Curados */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {filteredIcons.map((item) => {
                      const IconComp = item.icon
                      const isSelected = formData.icon === item.name
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleSelectIcon(item.name)}
                          title={`${item.label} (${item.name})`}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-500/20'
                              : 'bg-white dark:bg-neutral-900 border border-gray-200/50 dark:border-neutral-700/60 text-gray-650 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-500'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          <span className="text-[9px] font-medium truncate max-w-full">
                            {item.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Exibição do Ícone Selecionado e Opção Customizada */}
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200/50 dark:border-neutral-800 text-xs">
                    <span className="text-gray-400 text-[11px]">Ícone selecionado:</span>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value, imageSrc: '' })}
                      placeholder="Nome do ícone Lucide"
                      className="input-field text-xs h-7 py-0 px-2 font-mono flex-1 bg-white dark:bg-neutral-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-gray-50/60 dark:bg-neutral-800/30 rounded-2xl border border-gray-100 dark:border-neutral-800 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 block mb-1">
                      URL da Imagem ou Ícone Externo
                    </label>
                    <input
                      type="text"
                      value={formData.imageSrc}
                      onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value, icon: '' })}
                      placeholder="Ex: https://exemplo.com/icone.png ou /assets/icon.png"
                      className="input-field text-xs h-9 bg-white dark:bg-neutral-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox de Ativação */}
            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="cardIsActiveInput"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 dark:text-primary-500 rounded border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500/20 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="cardIsActiveInput" className="text-xs font-semibold text-gray-700 dark:text-neutral-300 cursor-pointer">
                Card Ativo (visível imediatamente no carrossel do Dashboard mobile)
              </label>
            </div>

            {/* Accordion de Customização Avançada */}
            <div className="border border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-neutral-800/30 flex items-center justify-between text-xs font-bold text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Classes Tailwind Avançadas
                </span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvanced && (
                <div className="p-4 space-y-3 bg-white dark:bg-neutral-900/50 text-[10px]">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Classe de Fundo (bg)</label>
                      <input
                        type="text"
                        value={formData.bg}
                        onChange={(e) => setFormData({ ...formData, bg: e.target.value })}
                        className="input-field font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">Cor do Título (text)</label>
                      <input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="input-field font-mono text-[10px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Cor da Descrição</label>
                      <input
                        type="text"
                        value={formData.descColor}
                        onChange={(e) => setFormData({ ...formData, descColor: e.target.value })}
                        className="input-field font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">Cor do Ícone</label>
                      <input
                        type="text"
                        value={formData.iconColor}
                        onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
                        className="input-field font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Coluna de Pré-visualização ao Vivo */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center p-4 bg-gray-50/50 dark:bg-neutral-800/20 rounded-2xl border border-gray-100 dark:border-neutral-800">
            <MobileCardLivePreview
              title={formData.title}
              desc={formData.desc}
              icon={formData.icon}
              imageSrc={formData.imageSrc}
              bg={formData.bg}
              textColor={formData.textColor}
              descColor={formData.descColor}
              iconColor={formData.iconColor}
              iconBg={formData.iconBg}
              actionPath={formData.actionPath}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-3 bg-gray-50/30 dark:bg-neutral-800/10">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary h-10 px-4 text-xs font-semibold rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="cardForm"
            disabled={isLoading}
            className="btn-primary h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary-500/10 active:scale-[0.98] transition-transform"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Card</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
  )
}

export default CardEditModal
