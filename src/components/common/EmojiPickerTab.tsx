import { useState } from 'react';
import EmojiPicker, { Theme, EmojiClickData, Categories } from 'emoji-picker-react';
import { Smile, Crown } from 'lucide-react';

interface EmojiPickerTabProps {
  onSelectEmoji: (emoji: string) => void;
  selectedEmoji?: string;
  isPremium: boolean;
  onUpgradeClick?: () => void;
}

const EmojiPickerTab = ({ 
  onSelectEmoji, 
  selectedEmoji,
  isPremium,
  onUpgradeClick 
}: EmojiPickerTabProps) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    onSelectEmoji(emojiData.emoji);
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    if (onUpgradeClick) {
      onUpgradeClick();
    }
  };

  return (
    <div className="relative">
      {/* Premium Badge */}
      {!isPremium && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-semibold">Recurso Premium</span>
            </div>
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="text-xs bg-white text-orange-600 px-3 py-1 rounded-full font-semibold hover:bg-orange-50 transition-colors"
            >
              Fazer Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker Container */}
      <div className={`${!isPremium ? 'mt-12 opacity-50 pointer-events-none' : ''} overflow-y-auto`} style={{ maxHeight: 'calc(90vh - 200px)' }}>
        <div className="p-4">
          {/* Selected Emoji Preview */}
          {selectedEmoji && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
              <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase mb-2">
                Emoji Selecionado
              </p>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{selectedEmoji}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Emoji atual
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Clique em outro para alterar
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Smile className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                  Escolha um emoji para sua categoria
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Emojis tornam suas categorias mais expressivas e fáceis de identificar
                </p>
              </div>
            </div>
          </div>

          {/* Emoji Picker */}
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.LIGHT}
              width="100%"
              height={500}
              searchPlaceholder="Buscar emoji..."
              categories={[
                {
                  category: Categories.SUGGESTED,
                  name: 'Recentes'
                },
                {
                  category: Categories.SMILEYS_PEOPLE,
                  name: 'Rostos & Pessoas'
                },
                {
                  category: Categories.ANIMALS_NATURE,
                  name: 'Animais & Natureza'
                },
                {
                  category: Categories.FOOD_DRINK,
                  name: 'Comida & Bebida'
                },
                {
                  category: Categories.TRAVEL_PLACES,
                  name: 'Viagem & Lugares'
                },
                {
                  category: Categories.ACTIVITIES,
                  name: 'Atividades'
                },
                {
                  category: Categories.OBJECTS,
                  name: 'Objetos'
                },
                {
                  category: Categories.SYMBOLS,
                  name: 'Símbolos'
                },
                {
                  category: Categories.FLAGS,
                  name: 'Bandeiras'
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Recurso Premium
                  </h3>
                  <p className="text-sm text-white text-opacity-90">
                    Desbloqueie emojis para suas categorias
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 dark:text-neutral-300 mb-4">
                  Os <strong>Emojis para Ícones</strong> são um recurso exclusivo do plano Premium.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Centenas de emojis
                      </p>
                      <p className="text-xs text-gray-600 dark:text-neutral-400">
                        Escolha entre milhares de emojis expressivos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Categorias mais expressivas
                      </p>
                      <p className="text-xs text-gray-600 dark:text-neutral-400">
                        Torne suas categorias únicas e divertidas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Identificação visual rápida
                      </p>
                      <p className="text-xs text-gray-600 dark:text-neutral-400">
                        Encontre suas categorias mais facilmente
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
                <p className="text-sm text-amber-900 dark:text-amber-300 text-center">
                  💎 <strong>Oferta Especial:</strong> Upgrade agora e ganhe 7 dias grátis!
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all"
                >
                  Agora Não
                </button>
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for Emoji Picker */}
      <style>{`
        .emoji-picker-container .epr-main {
          border: 1px solid rgb(229 231 235);
          border-radius: 0.5rem;
        }
        
        .dark .emoji-picker-container .epr-main {
          border-color: rgb(38 38 38);
          background-color: rgb(10 10 10);
        }
        
        .emoji-picker-container .epr-search-container input {
          background-color: rgb(249 250 251);
          border-color: rgb(229 231 235);
        }
        
        .dark .emoji-picker-container .epr-search-container input {
          background-color: rgb(23 23 23);
          border-color: rgb(38 38 38);
          color: rgb(255 255 255);
        }
        
        .emoji-picker-container .epr-emoji-category-label {
          background-color: rgb(249 250 251);
        }
        
        .dark .emoji-picker-container .epr-emoji-category-label {
          background-color: rgb(23 23 23);
          color: rgb(163 163 163);
        }
      `}</style>
    </div>
  );
};

export default EmojiPickerTab;
