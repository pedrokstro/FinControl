import { useState } from 'react'
import { Search, Package, Smile, Globe } from 'lucide-react'
import { iconCategories, type IconName, type IconCategoryItem } from '@/utils/iconMapping'
import EmojiPickerTab from './EmojiPickerTab'
import BrandPickerTab from './BrandPickerTab'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { createPortal } from 'react-dom'
import CategoryIcon from './CategoryIcon'

interface IconPickerProps {
  selectedIcon: IconName | string
  onSelectIcon: (icon: IconName | string, isEmoji?: boolean) => void
  type?: 'income' | 'expense' | 'other'
  isPremium?: boolean
  onUpgradeClick?: () => void
  inline?: boolean
  className?: string
}

type IconItem = { name: string; label: string }

const IconPicker = ({
  selectedIcon,
  onSelectIcon,
  type,
  isPremium = false,
  onUpgradeClick,
  inline = false,
  className = ''
}: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'icons' | 'emojis' | 'brands'>('icons')
  const dragControls = useDragControls()

  // Verificar se é emoji
  const isEmoji = (icon: string) => {
    return /\p{Emoji}/u.test(icon) && icon.length <= 4
  }

  // Verificar se é marca
  const isBrand = (icon: string) => {
    return typeof icon === 'string' && icon.startsWith('brand:')
  }

  // Get categories to show based on type
  const getCategoriesToShow = () => {
    return type === 'income'
      ? {
        'Financeiro': iconCategories.income.financial,
        'Trabalho & Negócios': iconCategories.income.workAndBusiness,
        'Investimentos': iconCategories.income.investments,
        'Renda Extra': iconCategories.income.sideIncome,
        'Renda Passiva': iconCategories.income.passiveIncome,
        'Exclusivos': iconCategories.exclusive,
      }
      : {
        'Alimentação': iconCategories.foodAndDining,
        'Transporte': iconCategories.transportation,
        'Moradia': iconCategories.housing,
        'Lazer': iconCategories.entertainment,
        'Saúde': iconCategories.health,
        'Educação': iconCategories.education,
        'Contas': iconCategories.bills,
        'Assinaturas': iconCategories.subscriptions,
        'Pessoal': iconCategories.personal,
        'Pets': iconCategories.pets,
        'Outros': iconCategories.other,
        'Exclusivos': iconCategories.exclusive,
      }
  }

  const categoriesToShow = getCategoriesToShow()

  // Filter icons based on search
  const getFilteredIcons = () => {
    if (!searchTerm) return categoriesToShow

    const filtered: Record<string, readonly IconItem[]> = {}

    Object.entries(categoriesToShow).forEach(([categoryName, icons]) => {
      const matchingIcons = icons.filter((icon: IconItem) =>
        icon.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (matchingIcons.length > 0) {
        filtered[categoryName] = matchingIcons
      }
    })

    return filtered
  }

  const filteredCategories = getFilteredIcons()

  const handleSelectIcon = (iconName: IconName | string) => {
    onSelectIcon(iconName, false)
    if (!inline) {
      setIsOpen(false)
      setSearchTerm('')
      setActiveTab('icons')
    }
  }

  const handleSelectEmoji = (emoji: string) => {
    onSelectIcon(emoji, true)
    if (!inline) {
      setIsOpen(false)
      setActiveTab('icons')
    }
  }

  // Contar total de ícones
  const totalIcons = Object.values(categoriesToShow).reduce(
    (sum, icons) => sum + icons.length,
    0
  )

  // Conteúdo do Picker (Abas, Busca, Grade de Ícones)
  const renderPickerBody = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with Tabs */}
      <div className="p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/80 dark:bg-neutral-900/80 backdrop-blur-sm flex-shrink-0 z-20">
        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('icons')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'icons'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Ícones</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('emojis')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'emojis'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Emojis</span>
            {!isPremium && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] rounded-full font-bold">PRO</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brands')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'brands'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Marcas</span>
            {!isPremium && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] rounded-full font-bold">PRO</span>
            )}
          </button>
        </div>

        {/* Search Input - Shared for Icons and Brands */}
        {activeTab !== 'emojis' && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'icons' ? "Buscar ícone..." : "Buscar marca..."}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col ${activeTab === 'icons' ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>
        {activeTab === 'emojis' ? (
          <EmojiPickerTab
            onSelectEmoji={handleSelectEmoji}
            selectedEmoji={isEmoji(selectedIcon as string) ? selectedIcon as string : undefined}
            isPremium={isPremium}
            onUpgradeClick={onUpgradeClick}
          />
        ) : activeTab === 'brands' ? (
          <BrandPickerTab
            onSelectBrand={(icon) => {
              onSelectIcon(icon, false)
              if (!inline) setIsOpen(false)
            }}
            selectedIcon={selectedIcon}
            isPremium={isPremium}
            onUpgradeClick={onUpgradeClick}
            externalSearchTerm={searchTerm}
          />
        ) : (
          <div className="p-4 space-y-5">
            {Object.keys(filteredCategories).length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-neutral-400 text-xs">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Nenhum ícone encontrado</p>
                <p className="text-[10px] mt-0.5 text-neutral-400">Tente buscar por outro termo</p>
              </div>
            ) : (
              Object.entries(filteredCategories).map(([categoryName, icons]) => (
                <div key={categoryName} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[11px] font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                      {categoryName}
                    </h4>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-neutral-800" />
                    <span className="text-[10px] text-gray-400 dark:text-neutral-500 font-mono">
                      {icons.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2">
                    {icons.map((iconData: IconCategoryItem) => {
                      const isSelected = selectedIcon === iconData.name
                      const isExclusiveIcon = categoryName === 'Exclusivos'
                      const isLocked = isExclusiveIcon && !isPremium

                      return (
                        <button
                          key={iconData.name}
                          type="button"
                          onClick={() => {
                            if (isLocked && onUpgradeClick) {
                              onUpgradeClick()
                            } else {
                              handleSelectIcon(iconData.name as IconName)
                            }
                          }}
                          className={`
                            group relative aspect-square flex items-center justify-center
                            rounded-xl border-2 transition-all duration-200 cursor-pointer
                            ${
                              isLocked
                                ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10 cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 shadow-sm scale-105 ring-2 ring-primary-500/20'
                                : 'border-gray-100 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-white dark:hover:bg-neutral-800'
                            }
                          `}
                          title={isLocked ? `${iconData.label} - Premium` : iconData.label}
                        >
                          <CategoryIcon
                            icon={iconData.name}
                            size="md"
                            className={`transition-transform ${isLocked ? 'opacity-40' : 'group-hover:scale-110'}`}
                            color={isSelected ? '#0284c7' : '#6b7280'}
                          />
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-lg">
                              <span className="text-[10px]">🔒</span>
                            </div>
                          )}
                          {isSelected && !isLocked && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Rodapé informativo */}
      {activeTab === 'icons' && (
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-[11px] text-gray-500 dark:text-neutral-400">
          <span>{totalIcons} ícones categorizados</span>
          <span className="font-mono text-[10px] text-primary-600 dark:text-primary-400">Clique para aplicar</span>
        </div>
      )}
    </div>
  )

  // Se inline = true, renderiza diretamente no layout do modal sem popups extras
  if (inline) {
    return (
      <div className={`w-full h-full flex flex-col rounded-2xl bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden ${className}`}>
        {renderPickerBody()}
      </div>
    )
  }

  // Se inline = false (mobile), renderiza o botão de acionamento + modal/drawer
  return (
    <div className="relative">
      {/* Selected Icon Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-neutral-700">
          {isEmoji(selectedIcon as string) ? (
            <span className="text-2xl">{selectedIcon}</span>
          ) : (
            <CategoryIcon icon={selectedIcon} size="md" className="text-gray-700 dark:text-neutral-300" />
          )}
        </div>
        <span className="text-sm text-gray-700 dark:text-neutral-300 font-medium">
          {isEmoji(selectedIcon as string) ? 'Selecionar emoji ou ícone' : isBrand(selectedIcon as string) ? 'Marca selecionada' : 'Selecionar ícone'}
        </span>
      </button>

      {/* Icon Picker Modal no Mobile */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[300] sm:p-4"
                onClick={() => setIsOpen(false)}
              />

              {/* Modal Container */}
              <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none z-[300] sm:p-4">
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  drag="y"
                  dragControls={dragControls}
                  dragListener={false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.4 }}
                  onDragEnd={(_, { offset, velocity }) => {
                    if (offset.y > 60 || velocity.y > 200) {
                      setIsOpen(false)
                    }
                  }}
                  className="w-full sm:max-w-[500px] h-[85vh] sm:h-auto sm:max-h-[85vh] bg-white dark:bg-neutral-950 border-t sm:border border-gray-200 dark:border-neutral-800 rounded-t-3xl sm:rounded-2xl shadow-2xl dark:shadow-dark-lg flex flex-col overflow-hidden pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drag Indicator Header (Mobile) */}
                  <div
                    className="w-full flex flex-col items-center justify-center pt-3 pb-2.5 px-4 cursor-grab active:cursor-grabbing touch-none select-none bg-gray-50/90 dark:bg-neutral-900/90 border-b border-gray-200 dark:border-neutral-800"
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      dragControls.start(e)
                    }}
                  >
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full mb-2" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center">
                      Escolher ícone ou emoji
                    </h3>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {renderPickerBody()}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default IconPicker
