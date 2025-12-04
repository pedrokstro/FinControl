import { useState } from 'react';
import { Check, Palette } from 'lucide-react';

interface ColorOption {
  value: string;
  label: string;
  group: string;
  contrast: {
    light: string;
    dark: string;
  };
}

// Paleta expandida com cores visualmente distintas e acessíveis
export const COLOR_PALETTE: ColorOption[] = [
  // Verdes
  { value: '#10b981', label: 'Verde Esmeralda', group: 'green', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#22c55e', label: 'Verde', group: 'green', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#84cc16', label: 'Lima', group: 'green', contrast: { light: '#000000', dark: '#000000' } },
  
  // Azuis/Cianos
  { value: '#14b8a6', label: 'Turquesa', group: 'cyan', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#06b6d4', label: 'Ciano', group: 'cyan', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#0ea5e9', label: 'Azul Céu', group: 'blue', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#3b82f6', label: 'Azul', group: 'blue', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#2563eb', label: 'Azul Royal', group: 'blue', contrast: { light: '#ffffff', dark: '#ffffff' } },
  
  // Roxos/Índigos
  { value: '#6366f1', label: 'Índigo', group: 'purple', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#8b5cf6', label: 'Roxo', group: 'purple', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#a855f7', label: 'Púrpura', group: 'purple', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#c026d3', label: 'Fúcsia', group: 'purple', contrast: { light: '#ffffff', dark: '#ffffff' } },
  
  // Rosas/Vermelhos
  { value: '#ec4899', label: 'Rosa', group: 'pink', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#f43f5e', label: 'Rosa Intenso', group: 'pink', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#ef4444', label: 'Vermelho', group: 'red', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#dc2626', label: 'Vermelho Escuro', group: 'red', contrast: { light: '#ffffff', dark: '#ffffff' } },
  
  // Laranjas/Amarelos
  { value: '#f97316', label: 'Laranja', group: 'orange', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#fb923c', label: 'Laranja Claro', group: 'orange', contrast: { light: '#000000', dark: '#000000' } },
  { value: '#f59e0b', label: 'Âmbar', group: 'yellow', contrast: { light: '#000000', dark: '#000000' } },
  { value: '#eab308', label: 'Amarelo', group: 'yellow', contrast: { light: '#000000', dark: '#000000' } },
  
  // Neutros
  { value: '#64748b', label: 'Cinza Azulado', group: 'gray', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#6b7280', label: 'Cinza', group: 'gray', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#78716c', label: 'Cinza Pedra', group: 'gray', contrast: { light: '#ffffff', dark: '#ffffff' } },
  { value: '#475569', label: 'Cinza Escuro', group: 'gray', contrast: { light: '#ffffff', dark: '#ffffff' } },
];

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  usedColors?: string[];
  showCustomPicker?: boolean;
}

const ColorPicker = ({ 
  selectedColor, 
  onSelectColor, 
  usedColors = [],
  showCustomPicker = true 
}: ColorPickerProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor);

  // Separar cores em usadas e não usadas
  const unusedColors = COLOR_PALETTE.filter(c => !usedColors.includes(c.value));
  const usedColorOptions = COLOR_PALETTE.filter(c => usedColors.includes(c.value));

  // Sugerir cores não usadas primeiro
  const suggestedColors = [...unusedColors, ...usedColorOptions];

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onSelectColor(color);
  };

  const isColorUsed = (color: string) => {
    return usedColors.includes(color) && color !== selectedColor;
  };

  return (
    <div className="space-y-4">
      {/* Paleta de Cores */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700 dark:text-neutral-300">
            Cores Sugeridas
          </p>
          {unusedColors.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-neutral-400">
              {unusedColors.length} cores disponíveis
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-8 gap-2">
          {suggestedColors.map((option) => {
            const isSelected = selectedColor === option.value;
            const isUsed = isColorUsed(option.value);
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelectColor(option.value)}
                disabled={isUsed}
                className={`
                  relative w-full aspect-square rounded-lg transition-all
                  ${isSelected 
                    ? 'ring-2 ring-offset-2 dark:ring-offset-neutral-950 ring-gray-900 dark:ring-white scale-110 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md'
                  }
                  ${isUsed 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:ring-2 hover:ring-offset-2 dark:hover:ring-offset-neutral-950 hover:ring-gray-400 dark:hover:ring-neutral-500'
                  }
                `}
                style={{ backgroundColor: option.value }}
                title={`${option.label}${isUsed ? ' (em uso)' : ''}`}
              >
                {/* Checkmark para cor selecionada */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white" strokeWidth={3} />
                    </div>
                  </div>
                )}
                
                {/* Indicador de cor em uso */}
                {isUsed && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white dark:bg-black rounded-full shadow-md" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">
          {usedColors.length > 0 && (
            <>Cores com ponto pequeno já estão em uso. </>
          )}
          Escolha uma cor que represente esta categoria
        </p>
      </div>

      {/* Seletor de Cor Customizada */}
      {showCustomPicker && (
        <div>
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <Palette className="w-4 h-4" />
            {showCustomInput ? 'Ocultar' : 'Usar'} cor personalizada
          </button>

          {showCustomInput && (
            <div className="mt-3 p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Escolha uma cor personalizada
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-16 h-10 rounded-lg border-2 border-gray-300 dark:border-neutral-700 cursor-pointer"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomColor(value);
                      // Validar formato hex
                      if (/^#[0-9A-F]{6}$/i.test(value)) {
                        onSelectColor(value);
                      }
                    }}
                    placeholder="#000000"
                    className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    maxLength={7}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">
                Use o seletor ou digite um código hexadecimal (ex: #FF5733)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview da Cor Selecionada */}
      <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
        <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase mb-2">
          Cor Selecionada
        </p>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg shadow-md border-2 border-white dark:border-neutral-800"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
              {selectedColor.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              {COLOR_PALETTE.find(c => c.value === selectedColor)?.label || 'Cor Personalizada'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
