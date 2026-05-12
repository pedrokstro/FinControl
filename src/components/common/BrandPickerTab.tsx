import { useState, useMemo, useEffect } from 'react';
import { Globe, Crown, Sparkles, Check, Hash } from 'lucide-react';
import BrandIcon from './BrandIcon';
import { haptics } from '@/utils/haptics';
import { searchGenericIcons } from '@/utils/brandUtils';
import { Icon } from '@iconify/react';

interface BrandPickerTabProps {
  onSelectBrand: (iconString: string) => void;
  selectedIcon?: string;
  isPremium: boolean;
  onUpgradeClick?: () => void;
  externalSearchTerm?: string;
}

const COMMON_BRANDS = [
  'Netflix', 'Spotify', 'Amazon', 'Apple', 'Google', 'Disney', 'Uber', 'iFood',
  '99App', 'Mercado Livre', 'Airbnb', 'HBO Max', 'GloboPlay', 'YouTube', 'PlayStation', 'Xbox',
  'Steam', 'Adobe', 'Canva', 'Office 365', 'Claro', 'Vivo', 'TIM', 'Oi',
  'Enel', 'Sabesp', 'Comgas', 'Sem Parar', 'Veloe', 'Shell', 'Ipiranga', 'Petrobras',
  'Carrefour', 'Extra', 'Pão de Açúcar', 'Assaí', 'Atacadão', 'GPA', 'SmartFit', 'BlueFit',
  'Nike', 'Adidas', 'Zara', 'H&M', 'Shein', 'Shopee', 'AliExpress', 'Amazon Prime'
];

const BrandPickerTab = ({
  onSelectBrand,
  selectedIcon,
  isPremium,
  onUpgradeClick,
  externalSearchTerm = ''
}: BrandPickerTabProps) => {
  const [genericIcons, setGenericIcons] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const filteredBrands = useMemo(() => {
    if (!externalSearchTerm) return COMMON_BRANDS;
    const filtered = COMMON_BRANDS.filter(b => b.toLowerCase().includes(externalSearchTerm.toLowerCase()));
    
    // Se não houver correspondência exata, adiciona o termo de busca como uma opção "custom"
    if (externalSearchTerm.length > 2 && !filtered.some(b => b.toLowerCase() === externalSearchTerm.toLowerCase())) {
      return [...filtered, externalSearchTerm];
    }
    
    return filtered;
  }, [externalSearchTerm]);

  // Busca ícones genéricos quando o termo muda
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (externalSearchTerm.length > 1) {
        setIsSearching(true);
        const icons = await searchGenericIcons(externalSearchTerm);
        setGenericIcons(icons);
        setIsSearching(false);
      } else {
        setGenericIcons([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [externalSearchTerm]);

  const handleSelectIcon = (icon: string, isBrand = true) => {
    if (!isPremium) {
      if (onUpgradeClick) onUpgradeClick();
      return;
    }
    haptics.light();
    onSelectBrand(isBrand ? `brand:${icon.toLowerCase()}` : icon);
  };

  const isSelected = (id: string, isBrand = true) => {
    return selectedIcon === (isBrand ? `brand:${id.toLowerCase()}` : id);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950">
      {/* Loading Overlay for Search Results */}
      {isSearching && (
        <div className="absolute inset-0 top-[110px] bg-white/50 dark:bg-neutral-950/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest">
              Buscando ícones...
            </span>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="p-4 border-b border-gray-100 dark:border-neutral-900 bg-gray-50/50 dark:bg-neutral-900/50 flex-shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Busca Universal
              {!isPremium && <Crown className="w-3.5 h-3.5 text-amber-500" />}
            </h4>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              Busque por marcas ou palavras-chave no campo acima
            </p>
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {!isPremium && (
          <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-amber-900 dark:text-amber-200">Recurso Premium</span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-400 mb-3">
              Personalize suas categorias com logotipos reais e milhares de ícones extras.
            </p>
            <button
              onClick={onUpgradeClick}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Fazer Upgrade Agora
            </button>
          </div>
        )}

        {/* Section: Brands */}
        <div className={!isPremium ? 'opacity-40 grayscale pointer-events-none' : ''}>
          {filteredBrands.length > 0 && (
            <div className="mb-6">
              <h5 className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">
                Logos de Marcas
              </h5>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {filteredBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleSelectIcon(brand)}
                    className={`
                      group relative aspect-square flex flex-col items-center justify-center gap-1.5
                      rounded-2xl border-2 transition-all duration-200 p-2
                      ${isSelected(brand)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                        : 'border-gray-100 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-gray-50 dark:hover:bg-neutral-900 shadow-sm'
                      }
                    `}
                  >
                    <div className="w-10 h-10 flex items-center justify-center p-1 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-100 dark:border-neutral-700">
                      <BrandIcon brand={brand} className="w-full h-full" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 dark:text-neutral-400 text-center truncate w-full">
                      {brand}
                    </span>

                    {isSelected(brand) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-neutral-900">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Generic Icons */}
          {genericIcons.length > 0 && (
            <div className="mb-6">
              <h5 className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                <Hash className="w-3 h-3" />
                Ícones Relacionados
              </h5>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {genericIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => handleSelectIcon(icon, false)}
                    className={`
                      group relative aspect-square flex flex-col items-center justify-center gap-1.5
                      rounded-2xl border-2 transition-all duration-200 p-2
                      ${isSelected(icon, false)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                        : 'border-gray-100 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-gray-50 dark:hover:bg-neutral-900 shadow-sm'
                      }
                    `}
                  >
                    <div className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-neutral-300">
                      <Icon icon={icon} className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 dark:text-neutral-500 text-center truncate w-full">
                      {icon.split(':')[1] || icon}
                    </span>

                    {isSelected(icon, false) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-neutral-900">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredBrands.length === 0 && genericIcons.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 mx-auto mb-3 opacity-20 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Nenhuma marca ou ícone encontrado
            </p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 dark:border-neutral-900 bg-gray-50/50 dark:bg-neutral-900/50">
        <p className="text-[10px] text-gray-500 dark:text-neutral-500 text-center uppercase tracking-widest font-bold">
          Busca avançada ativa para logos e ícones
        </p>
      </div>
    </div>
  );
};

export default BrandPickerTab;
