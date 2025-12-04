/**
 * Chaves para localStorage
 */
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  FINANCIAL: 'financial-storage',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  CATEGORIES: '/categories',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const

/**
 * Tipos de transação
 */
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const

/**
 * Status
 */
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

/**
 * Cores do tema
 */
export const THEME_COLORS = {
  PRIMARY: '#0ea5e9',
  SUCCESS: '#22c55e',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
} as const

/**
 * Ícones disponíveis
 */
export const AVAILABLE_ICONS = [
  'DollarSign',
  'Briefcase',
  'Home',
  'Car',
  'ShoppingBag',
  'Heart',
  'GraduationCap',
  'Gamepad2',
  'Coffee',
  'Plane',
  'Phone',
  'Laptop',
] as const

/**
 * Cores disponíveis para categorias
 */
export const CATEGORY_COLORS = [
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#ec4899', '#f43f5e', '#ef4444',
  '#dc2626', '#f97316', '#f59e0b', '#84cc16',
] as const

/**
 * Períodos para relatórios
 */
export const REPORT_PERIODS = {
  THREE_MONTHS: 3,
  SIX_MONTHS: 6,
  TWELVE_MONTHS: 12,
} as const

/**
 * Limites de paginação
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

/**
 * Mensagens de erro
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha deve ter no mínimo 6 caracteres',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  MIN_LENGTH: (min: number) => `Deve ter no mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Deve ter no máximo ${max} caracteres`,
  INVALID_VALUE: 'Valor inválido',
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  UNAUTHORIZED: 'Não autorizado. Faça login novamente.',
  NOT_FOUND: 'Recurso não encontrado',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
} as const

/**
 * Mensagens de sucesso
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso',
  LOGOUT: 'Logout realizado com sucesso',
  TRANSACTION_ADDED: 'Transação adicionada com sucesso',
  TRANSACTION_UPDATED: 'Transação atualizada com sucesso',
  TRANSACTION_DELETED: 'Transação excluída com sucesso',
  CATEGORY_ADDED: 'Categoria criada com sucesso',
  CATEGORY_UPDATED: 'Categoria atualizada com sucesso',
  CATEGORY_DELETED: 'Categoria excluída com sucesso',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso',
  PASSWORD_CHANGED: 'Senha alterada com sucesso',
} as const

/**
 * Configurações da aplicação
 */
export const APP_CONFIG = {
  NAME: 'FinControl',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de Controle Financeiro',
  AUTHOR: 'Seu Nome',
  LOCALE: 'pt-BR',
  CURRENCY: 'BRL',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
} as const
