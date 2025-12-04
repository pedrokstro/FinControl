/**
 * Formata um valor numérico para moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata uma data para o padrão brasileiro
 * Trata strings no formato YYYY-MM-DD como data local, não UTC
 */
export const formatDate = (date: string | Date): string => {
  if (typeof date === 'string') {
    // Se for string no formato YYYY-MM-DD, trata como data local
    const [year, month, day] = date.split('-').map(Number)
    const d = new Date(year, month - 1, day)
    return d.toLocaleDateString('pt-BR')
  }
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

/**
 * Formata uma data para o padrão completo
 */
export const formatDateLong = (date: string | Date): string => {
  const d = new Date(date)
  return new Intl.DateFormat('pt-BR', {
    dateStyle: 'long',
  }).format(d)
}

/**
 * Formata porcentagem
 */
export const formatPercent = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

/**
 * Converte string para número
 */
export const parseNumber = (value: string): number => {
  return parseFloat(value.replace(',', '.'))
}

/**
 * Trunca texto com ellipsis
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}

/**
 * Calcula a diferença percentual entre dois valores
 */
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Gera cor aleatória
 */
export const randomColor = (): string => {
  const colors = [
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
    '#f43f5e', '#ef4444', '#dc2626', '#f97316', '#f59e0b',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Gera ID único
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Agrupa array por chave
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = String(item[key])
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Ordena array por chave
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}
