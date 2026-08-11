import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react'

export interface PasswordCriteria {
  hasMinLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  passedCount: number
  score: number
  label: string
  color: 'neutral' | 'red' | 'amber' | 'green'
}

export const checkPasswordCriteria = (pwd: string = ''): PasswordCriteria => {
  const hasMinLength = pwd.length >= 8
  const hasUpperCase = /[A-Z]/.test(pwd)
  const hasLowerCase = /[a-z]/.test(pwd)
  const hasNumber = /[0-9]/.test(pwd)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(pwd)

  const passedCount = [
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length

  let score = 0
  let label = ''
  let color: 'neutral' | 'red' | 'amber' | 'green' = 'neutral'

  if (pwd.length === 0) {
    score = 0
    label = ''
    color = 'neutral'
  } else if (passedCount <= 2) {
    score = Math.max(20, (passedCount / 5) * 100)
    label = 'Fraca'
    color = 'red'
  } else if (passedCount <= 4) {
    score = (passedCount / 5) * 100
    label = 'Média'
    color = 'amber'
  } else {
    score = 100
    label = 'Forte'
    color = 'green'
  }

  return {
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    passedCount,
    score,
    label,
    color
  }
}

export interface PasswordStrengthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  showStrengthMeter?: boolean
  bgClass?: string
  value?: string
}

export const PasswordStrengthInput = forwardRef<
  HTMLInputElement,
  PasswordStrengthInputProps
>(
  (
    {
      label = 'Senha',
      error,
      showStrengthMeter = true,
      bgClass = 'bg-white dark:bg-neutral-800',
      value: controlledValue,
      defaultValue,
      onChange,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [internalValue, setInternalValue] = useState<string>(
      (defaultValue as string) || ''
    )

    const currentValue =
      controlledValue !== undefined ? String(controlledValue) : internalValue

    const criteria = checkPasswordCriteria(currentValue)
    const { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, score, label: strengthLabel, color } = criteria

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (controlledValue === undefined) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    const criteriaItems = [
      { id: 'length', label: '8 Chars', met: hasMinLength },
      { id: 'upper', label: 'A-Z', met: hasUpperCase },
      { id: 'lower', label: 'a-z', met: hasLowerCase },
      { id: 'number', label: '123', met: hasNumber },
      { id: 'special', label: '@#$', met: hasSpecialChar }
    ]

    return (
      <div className="w-full space-y-3">
        {/* Input Container com Borda Arredondada e Label Entalhada */}
        <div
          className={`relative rounded-2xl border-2 transition-all duration-300 ${
            error
              ? 'border-red-500'
              : color === 'green'
              ? 'border-emerald-500 dark:border-emerald-500 shadow-sm shadow-emerald-500/10'
              : color === 'amber'
              ? 'border-amber-500 dark:border-amber-500 shadow-sm shadow-amber-500/10'
              : color === 'red'
              ? 'border-red-500 dark:border-red-500 shadow-sm shadow-red-500/10'
              : 'border-gray-200 dark:border-neutral-700 focus-within:border-primary-500 dark:focus-within:border-primary-400'
          }`}
        >
          {/* Label Flutuante Entalhada na Borda Superior */}
          <label
            htmlFor={id}
            className={`absolute -top-3 left-4 px-2 ${bgClass} text-xs font-bold tracking-wide transition-colors duration-200 select-none ${
              error
                ? 'text-red-500'
                : color === 'green'
                ? 'text-emerald-600 dark:text-emerald-400'
                : color === 'amber'
                ? 'text-amber-600 dark:text-amber-400'
                : color === 'red'
                ? 'text-red-500 dark:text-red-400'
                : 'text-gray-500 dark:text-neutral-400'
            }`}
          >
            {label}
          </label>

          {/* Campo de Entrada e Botão Eye */}
          <div className="relative flex items-center">
            <input
              ref={ref}
              id={id}
              type={showPassword ? 'text' : 'password'}
              value={controlledValue}
              defaultValue={defaultValue}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-transparent px-5 py-3.5 pr-12 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 outline-none ${className || ''}`}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors p-1"
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Medidor de Força e Checklist de Critérios */}
        {showStrengthMeter && currentValue.length > 0 && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-200">
            {/* Texto de Força da Senha */}
            <div className="flex items-center justify-between text-xs font-semibold px-0.5">
              <span className="text-gray-500 dark:text-neutral-400">
                Força da Senha
              </span>
              <span
                className={`transition-colors duration-200 ${
                  color === 'green'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : color === 'amber'
                    ? 'text-amber-600 dark:text-amber-400'
                    : color === 'red'
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-400 dark:text-neutral-500'
                }`}
              >
                {strengthLabel}
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="h-1.5 w-full bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  color === 'green'
                    ? 'bg-emerald-500'
                    : color === 'amber'
                    ? 'bg-amber-500'
                    : color === 'red'
                    ? 'bg-red-500'
                    : 'bg-transparent'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>

            {/* Badges de Critérios */}
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 pt-1">
              {criteriaItems.map((item) => (
                <div
                  key={item.id}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
                    item.met
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-gray-400 dark:text-neutral-500'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      item.met
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1 font-semibold pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

PasswordStrengthInput.displayName = 'PasswordStrengthInput'
export default PasswordStrengthInput
