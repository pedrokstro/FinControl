import { Transaction, Category } from '@/types'
import { subDays, format } from 'date-fns'

export const mockCategories: Category[] = [
  // Receitas
  {
    id: 'cat-1',
    name: 'Salário',
    type: 'income',
    color: '#22c55e',
    icon: 'DollarSign',
    userId: '1',
  },
  {
    id: 'cat-2',
    name: 'Freelance',
    type: 'income',
    color: '#10b981',
    icon: 'Briefcase',
    userId: '1',
  },
  {
    id: 'cat-3',
    name: 'Investimentos',
    type: 'income',
    color: '#14b8a6',
    icon: 'TrendingUp',
    userId: '1',
  },
  // Despesas
  {
    id: 'cat-4',
    name: 'Alimentação',
    type: 'expense',
    color: '#ef4444',
    icon: 'UtensilsCrossed',
    userId: '1',
  },
  {
    id: 'cat-5',
    name: 'Transporte',
    type: 'expense',
    color: '#f97316',
    icon: 'Car',
    userId: '1',
  },
  {
    id: 'cat-6',
    name: 'Moradia',
    type: 'expense',
    color: '#dc2626',
    icon: 'Home',
    userId: '1',
  },
  {
    id: 'cat-7',
    name: 'Lazer',
    type: 'expense',
    color: '#ec4899',
    icon: 'Gamepad2',
    userId: '1',
  },
  {
    id: 'cat-8',
    name: 'Saúde',
    type: 'expense',
    color: '#8b5cf6',
    icon: 'Heart',
    userId: '1',
  },
  {
    id: 'cat-9',
    name: 'Educação',
    type: 'expense',
    color: '#6366f1',
    icon: 'GraduationCap',
    userId: '1',
  },
]

export const mockTransactions: Transaction[] = [
  // Mês atual - Receitas
  {
    id: 'trans-1',
    type: 'income',
    amount: 5000,
    category: 'Salário',
    categoryId: 'cat-1',
    description: 'Salário Janeiro',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-2',
    type: 'income',
    amount: 1500,
    category: 'Freelance',
    categoryId: 'cat-2',
    description: 'Projeto Website',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-3',
    type: 'income',
    amount: 300,
    category: 'Investimentos',
    categoryId: 'cat-3',
    description: 'Dividendos Ações',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  // Mês atual - Despesas
  {
    id: 'trans-4',
    type: 'expense',
    amount: 450,
    category: 'Alimentação',
    categoryId: 'cat-4',
    description: 'Supermercado',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-5',
    type: 'expense',
    amount: 200,
    category: 'Transporte',
    categoryId: 'cat-5',
    description: 'Gasolina',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-6',
    type: 'expense',
    amount: 1200,
    category: 'Moradia',
    categoryId: 'cat-6',
    description: 'Aluguel',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-7',
    type: 'expense',
    amount: 150,
    category: 'Lazer',
    categoryId: 'cat-7',
    description: 'Cinema',
    date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-8',
    type: 'expense',
    amount: 280,
    category: 'Saúde',
    categoryId: 'cat-8',
    description: 'Farmácia',
    date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-9',
    type: 'expense',
    amount: 350,
    category: 'Educação',
    categoryId: 'cat-9',
    description: 'Curso Online',
    date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-10',
    type: 'expense',
    amount: 85,
    category: 'Alimentação',
    categoryId: 'cat-4',
    description: 'Restaurante',
    date: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  // Mês anterior - Receitas
  {
    id: 'trans-11',
    type: 'income',
    amount: 5000,
    category: 'Salário',
    categoryId: 'cat-1',
    description: 'Salário Dezembro',
    date: format(subDays(new Date(), 35), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-12',
    type: 'income',
    amount: 800,
    category: 'Freelance',
    categoryId: 'cat-2',
    description: 'Consultoria',
    date: format(subDays(new Date(), 40), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  // Mês anterior - Despesas
  {
    id: 'trans-13',
    type: 'expense',
    amount: 520,
    category: 'Alimentação',
    categoryId: 'cat-4',
    description: 'Supermercado',
    date: format(subDays(new Date(), 32), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-14',
    type: 'expense',
    amount: 180,
    category: 'Transporte',
    categoryId: 'cat-5',
    description: 'Manutenção Carro',
    date: format(subDays(new Date(), 38), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: 'trans-15',
    type: 'expense',
    amount: 1200,
    category: 'Moradia',
    categoryId: 'cat-6',
    description: 'Aluguel',
    date: format(subDays(new Date(), 35), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    userId: '1',
  },
]

/**
 * Função para popular o store com dados de exemplo
 */
export const loadMockData = (
  addTransaction: (transaction: any) => void,
  addCategory: (category: any) => void
) => {
  // Adicionar categorias
  mockCategories.forEach((category) => {
    addCategory(category)
  })

  // Adicionar transações
  mockTransactions.forEach((transaction) => {
    addTransaction(transaction)
  })
}
