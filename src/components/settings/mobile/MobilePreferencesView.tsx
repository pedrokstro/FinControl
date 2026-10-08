import React from 'react'
import {
  ChevronLeft,
  Sun,
  Moon,
  Globe,
  Coins,
  Check
} from 'lucide-react'
import { haptics } from '@/utils/haptics'

interface UserPreferences {
  language: string
  currency: string
}

interface MobilePreferencesViewProps {
  onBack: () => void
  theme: 'light' | 'dark'
  onThemeChange: (val: string) => void
  preferences: UserPreferences
  onLanguageChange: (val: string) => void
  onCurrencyChange: (val: string) => void
}

export const MobilePreferencesView: React.FC<MobilePreferencesViewProps> = ({
  onBack,
  theme,
  onThemeChange,
  preferences,
  onLanguageChange,
  onCurrencyChange,
}) => {
  const languages = [
    { value: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
    { value: 'en', label: 'English (US)', flag: '🇺🇸' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
  ]

  const currencies = [
    { value: 'BRL', label: 'Real Brasileiro', symbol: 'R$' },
    { value: 'USD', label: 'Dólar Americano', symbol: 'US$' },
    { value: 'EUR', label: 'Euro', symbol: '€' },
  ]

  return (
    <div className="pb-28 pt-1 animate-fadeIn select-none">
      {/* 1. Header Nativo com Botão Voltar */}
      <div className="flex items-center gap-2 mb-6">
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
          Preferências
        </h1>
      </div>

      {/* 2. Grupo 1: Seleção Visual de Tema */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-2 block">
          Aparência do Aplicativo
        </span>
        <div className="grid grid-cols-2 gap-3">
          {/* Card Modo Claro */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onThemeChange('light')
            }}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.98] ${
              theme === 'light'
                ? 'bg-white border-primary-500 ring-2 ring-primary-500/20 shadow-md'
                : 'bg-white dark:bg-neutral-900 border-gray-150 dark:border-neutral-800 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-150">
                <Sun className="w-5 h-5" />
              </div>
              {theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white block">
                Modo Claro
              </span>
              <span className="text-[11px] text-gray-400 dark:text-neutral-500 block mt-0.5">
                Visual iluminado e limpo
              </span>
            </div>
          </button>

          {/* Card Modo Escuro */}
          <button
            type="button"
            onClick={() => {
              haptics.light()
              onThemeChange('dark')
            }}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.98] ${
              theme === 'dark'
                ? 'bg-neutral-900 border-primary-500 ring-2 ring-primary-500/20 shadow-md'
                : 'bg-white dark:bg-neutral-900 border-gray-150 dark:border-neutral-800 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-950/50 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
                <Moon className="w-5 h-5" />
              </div>
              {theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white block">
                Modo Escuro
              </span>
              <span className="text-[11px] text-gray-400 dark:text-neutral-500 block mt-0.5">
                Confortável para os olhos
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Grupo 2: Idioma */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Idioma
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          {languages.map((item) => {
            const isSelected = preferences.language === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  haptics.light()
                  onLanguageChange(item.value)
                }}
                className="w-full flex items-center justify-between p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg leading-none">{item.flag}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.label}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 stroke-[3]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Grupo 3: Moeda */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 mb-1.5 block">
          Moeda Padrão
        </span>
        <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-neutral-800/80 overflow-hidden">
          {currencies.map((item) => {
            const isSelected = preferences.currency === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  haptics.light()
                  onCurrencyChange(item.value)
                }}
                className="w-full flex items-center justify-between p-3.5 text-left active:bg-gray-50 dark:active:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {item.symbol}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.label} ({item.value})
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 stroke-[3]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
