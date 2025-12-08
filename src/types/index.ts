export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  categoryId: string
  description: string
  date: string
  createdAt: string
  userId: string
  isRecurring?: boolean
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurrenceStartDate?: string
  recurrenceEndDate?: string
  nextOccurrence?: string
  parentTransactionId?: string
  recurrenceMonths?: number
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  userId: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  monthIncome: number
  monthExpense: number
  monthBalance: number
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

export interface TransactionFormData {
  type: 'income' | 'expense'
  amount: string
  categoryId: string
  description: string
  date: string
  recurrenceMonths?: string
  recurrenceStartDate?: string
  recurrenceEndDate?: string
}

export interface CategoryFormData {
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
}

export interface FilterOptions {
  startDate?: string
  endDate?: string
  categoryId?: string
  type?: 'income' | 'expense' | 'all'
  searchTerm?: string
}

export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
