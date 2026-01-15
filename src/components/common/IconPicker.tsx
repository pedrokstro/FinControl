import { useState } from 'react'
import { Search, X, Package, Smile } from 'lucide-react'
import { iconCategories, type IconName, type IconCategoryItem } from '@/utils/iconMapping'
import EmojiPickerTab from './EmojiPickerTab'
import CategoryIcon from './CategoryIcon'

interface IconPickerProps {
  selectedIcon: IconName | string
  onSelectIcon: (icon: IconName | string, isEmoji?: boolean) => void
  type?: 'income' | 'expense' | 'other'
  isPremium?: boolean
  onUpgradeClick?: () => void
}

type IconItem = { name: string; label: string }

const IconPicker = ({ selectedIcon, onSelectIcon, type, isPremium = false, onUpgradeClick }: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'icons' | 'emojis'>('icons')
  
  // Verificar se é emoji
  const isEmoji = (icon: string) => {
    return /\p{Emoji}/u.test(icon) && icon.length <= 4
  }
  
  // Get categories to show based on type
  const getCategoriesToShow = () => {
    return type === 'income'
      ? {
          'Financeiro': iconCategories.income.financial,
          'Trabalho & Negocios': iconCategories.income.workAndBusiness,
          'Investimentos': iconCategories.income.investments,
          'Renda Extra': iconCategories.income.sideIncome,
          'Renda Passiva': iconCategories.income.passiveIncome,
          'Exclusivos': iconCategories.exclusive,
        }
      : {
          'Alimentacao': iconCategories.foodAndDining,
          'Transporte': iconCategories.transportation,
          'Moradia': iconCategories.housing,
          'Lazer': iconCategories.entertainment,
          'Saude': iconCategories.health,
          'Educacao': iconCategories.education,
          'Contas': iconCategories.bills,
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
    setIsOpen(false)
    setSearchTerm('')
    setActiveTab('icons')
  }

  const handleSelectEmoji = (emoji: string) => {
    onSelectIcon(emoji, true)
    setIsOpen(false)
    setActiveTab('icons')
  }

  // Contar total de ícones
  const totalIcons = Object.values(categoriesToShow).reduce(
    (sum, icons) => sum + icons.length,
    0
  )

  return (
    <div className="relative">
      {/* Selected Icon Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-neutral-700">
          {isEmoji(selectedIcon as string) ? (
            <span className="text-2xl">{selectedIcon}</span>
          ) : (
            <CategoryIcon icon={selectedIcon} size="md" className="text-gray-700 dark:text-neutral-300" />
          )}
        </div>
        <span className="text-sm text-gray-700 dark:text-neutral-300 font-medium">
          {isEmoji(selectedIcon as string) ? 'Selecionar emoji ou icone' : 'Selecionar icone'}
        </span>
      </button>

      {/* Icon Picker Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div 
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] max-h-[90vh] bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-2xl dark:shadow-dark-lg z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Tabs */}
            <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Escolher ícone ou emoji
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    {activeTab === 'icons' ? `${totalIcons} ícones disponíveis` : 'Milhares de emojis'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('icons')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'icons'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-sm'
                      : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="text-sm">Ícones</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('emojis')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'emojis'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-sm'
                      : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Smile className="w-4 h-4" />
                  <span className="text-sm">Emojis</span>
                  {!isPremium && (
                    <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">PRO</span>
                  )}
                </button>
              </div>
              
              {/* Search Input - Only for Icons Tab */}
              {activeTab === 'icons' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar ícone..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={activeTab === 'emojis' ? 'overflow-hidden' : 'overflow-y-auto'} style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {activeTab === 'emojis' ? (
                <EmojiPickerTab
                  onSelectEmoji={handleSelectEmoji}
                  selectedEmoji={isEmoji(selectedIcon as string) ? selectedIcon as string : undefined}
                  isPremium={isPremium}
                  onUpgradeClick={onUpgradeClick}
                />
              ) : (
                <div className="p-4">
              {Object.keys(filteredCategories).length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-neutral-400 text-sm">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum icone encontrado</p>
                  <p className="text-xs mt-1">Tente buscar por outro termo</p>
                </div>
              ) : (
                Object.entries(filteredCategories).map(([categoryName, icons]) => (
                  <div key={categoryName} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wide">
                        {categoryName}
                      </h4>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-800"></div>
                      <span className="text-xs text-gray-400 dark:text-neutral-500 font-medium">
                        {icons.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
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
                              group relative w-full aspect-square flex items-center justify-center
                              rounded-lg border-2 transition-all
                              ${isLocked
                                ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10 cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
                                : 'border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-neutral-900 hover:shadow-sm'
                              }
                            `}
                            title={isLocked ? `${iconData.label} - Premium` : iconData.label}
                          >
                            <CategoryIcon
                              icon={iconData.name}
                              size="md"
                              className={`transition-transform ${isLocked ? 'opacity-40' : 'group-hover:scale-105'}`}
                              color={isSelected ? '#2563eb' : '#4b5563'}
                            />
                            {isLocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-lg">
                                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {isSelected && !isLocked && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 dark:bg-primary-400 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block pointer-events-none z-10">
                              <div className="bg-gray-900 dark:bg-neutral-800 text-white text-xs py-1.5 px-2.5 rounded shadow-lg whitespace-nowrap border border-gray-700 dark:border-neutral-700">
                                {iconData.label}
                                {isLocked && <span className="ml-1 text-amber-400">🔒 Premium</span>}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                  <div className="border-4 border-transparent border-t-gray-900 dark:border-t-neutral-800"></div>
                                </div>
                              </div>
                            </div>
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

            {/* Footer with hint */}
            {activeTab === 'icons' && (
              <div className="p-3 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                <p className="text-xs text-gray-500 dark:text-neutral-400 text-center">
                  Clique em um ícone para selecionar
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default IconPicker
