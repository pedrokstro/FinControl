import { describe, it, expect } from 'vitest'
import { parseCSV, parseOFX } from '@/services/importService'
import { calculateBalanceForecast } from '@/utils/balanceForecast'
import { Category, Transaction, CreditCard } from '@/types'

const mockCategories: Category[] = [
  { id: 'cat-transporte', name: 'Transporte', type: 'expense', icon: 'Car', color: '#3b82f6', userId: 'user-1' },
  { id: 'cat-alimentacao', name: 'Alimentação', type: 'expense', icon: 'Utensils', color: '#10b981', userId: 'user-1' },
  { id: 'cat-salario', name: 'Salário', type: 'income', icon: 'DollarSign', color: '#10b981', userId: 'user-1' },
  { id: 'cat-outros', name: 'Outros', type: 'expense', icon: 'Tag', color: '#6b7280', userId: 'user-1' },
]

const mockExistingTransactions: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Uber Viagem Trabalho',
    amount: 32.5,
    type: 'expense',
    date: '2026-03-10',
    category: 'Transporte',
    categoryId: 'cat-transporte',
    paymentMethod: 'cash',
    userId: 'user-1',
    createdAt: '2026-03-10T10:00:00Z',
  },
]

describe('1. Importação de Extratos (CSV & OFX)', () => {
  it('parseCSV processa extrato com delimitador ponto-e-vírgula e moeda brasileira', () => {
    const csvContent = `Data;Descricao;Valor
10/03/2026;Uber Viagem Trabalho;-32,50
11/03/2026;Supermercado Pao de Acucar;-245,80
12/03/2026;Pix Recebido Cliente;1500,00`

    const result = parseCSV(csvContent, mockCategories, mockExistingTransactions)

    expect(result.transactions.length).toBe(3)

    // Primeiro item: detectado como duplicada do mockExistingTransactions
    const uberTx = result.transactions[0]
    expect(uberTx.description).toBe('Uber Viagem Trabalho')
    expect(uberTx.amount).toBe(32.5)
    expect(uberTx.type).toBe('expense')
    expect(uberTx.categoryId).toBe('cat-transporte')
    expect(uberTx.isDuplicate).toBe(true)
    expect(uberTx.selected).toBe(false) // Desmarcado por segurança

    // Segundo item: Alimentação sugerida
    const mercadoTx = result.transactions[1]
    expect(mercadoTx.description).toBe('Supermercado Pao de Acucar')
    expect(mercadoTx.amount).toBe(245.8)
    expect(mercadoTx.type).toBe('expense')
    expect(mercadoTx.categoryId).toBe('cat-alimentacao')
    expect(mercadoTx.isDuplicate).toBe(false)
    expect(mercadoTx.selected).toBe(true)

    // Terceiro item: Receita detectada
    const pixTx = result.transactions[2]
    expect(pixTx.description).toBe('Pix Recebido Cliente')
    expect(pixTx.amount).toBe(1500)
    expect(pixTx.type).toBe('income')
    expect(pixTx.categoryId).toBe('cat-salario')
  })

  it('parseOFX processa tags padrão de extratos bancários', () => {
    const ofxContent = `OFXHEADER:100
<OFX>
<BANKTRANLIST>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260315120000[-03:EST]
<TRNAMT>-78.90
<FITID>20260315001
<MEMO>Posto Ipiranga Combustivel
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20260320120000[-03:EST]
<TRNAMT>2500.00
<FITID>20260320002
<NAME>Salario Empresa XYZ
</STMTTRN>
</BANKTRANLIST>
</OFX>`

    const result = parseOFX(ofxContent, mockCategories, mockExistingTransactions)

    expect(result.transactions.length).toBe(2)

    const debito = result.transactions[0]
    expect(debito.type).toBe('expense')
    expect(debito.amount).toBe(78.9)
    expect(debito.date).toBe('2026-03-15')
    expect(debito.categoryId).toBe('cat-transporte')

    const credito = result.transactions[1]
    expect(credito.type).toBe('income')
    expect(credito.amount).toBe(2500)
    expect(credito.date).toBe('2026-03-20')
    expect(credito.categoryId).toBe('cat-salario')
  })
})

describe('2. Previsão de Saldo até o fim do Mês (Contas e Faturas a Pagar)', () => {
  it('calculateBalanceForecast projeta saldo final subtraindo faturas e assinaturas pendentes', () => {
    const testDate = new Date(2026, 2, 15) // 15 de Março de 2026

    const transactions: Transaction[] = [
      // Saldo realizado antes do dia 15
      {
        id: '1',
        description: 'Salário Inicial',
        amount: 5000,
        type: 'income',
        date: '2026-03-05',
        category: 'Salário',
        categoryId: 'cat-salario',
        paymentMethod: 'cash',
        userId: 'user-1',
        createdAt: '2026-03-05T10:00:00Z',
      },
      {
        id: '2',
        description: 'Mercado Inicial',
        amount: 1000,
        type: 'expense',
        date: '2026-03-08',
        category: 'Alimentação',
        categoryId: 'cat-alimentacao',
        paymentMethod: 'cash',
        userId: 'user-1',
        createdAt: '2026-03-08T10:00:00Z',
      },
      // Gasto no cartão de crédito que vencerá na fatura
      {
        id: '3',
        description: 'Compra Eletrônicos Cartão',
        amount: 800,
        type: 'expense',
        date: '2026-03-02',
        category: 'Outros',
        categoryId: 'cat-outros',
        creditCardId: 'card-1',
        paymentMethod: 'credit',
        userId: 'user-1',
        createdAt: '2026-03-02T10:00:00Z',
      },
      // Assinatura recorrente que vence dia 22 (após dia 15)
      {
        id: '4',
        description: 'Netflix Premium',
        amount: 55.9,
        type: 'expense',
        date: '2026-02-22', // Template de assinatura
        category: 'Lazer',
        categoryId: 'cat-lazer',
        isRecurring: true,
        userId: 'user-1',
        createdAt: '2026-02-22T10:00:00Z',
      },
    ]

    const creditCards: CreditCard[] = [
      {
        id: 'card-1',
        name: 'Nubank Ultravioleta',
        brand: 'Nubank',
        limit: 10000,
        closingDay: 18,
        dueDay: 25, // Vence dia 25 (após dia 15)
        userId: 'user-1',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ]

    const forecast = calculateBalanceForecast(transactions, creditCards, testDate)

    // Saldo atual realizado: 5000 (receita) - 1000 (despesa em dinheiro) = 4000
    expect(forecast.currentBalance).toBe(4000)

    // Compromissos pendentes até o fim do mês:
    // 1. Fatura Nubank: 800 (vence dia 25)
    // 2. Assinatura Netflix: 55.9 (vence dia 22)
    // Total pendente: 855.90
    expect(forecast.pendingExpenses).toBeCloseTo(855.9, 1)

    // Saldo projetado no fim do mês: 4000 - 855.90 = 3144.10
    expect(forecast.projectedBalance).toBeCloseTo(3144.1, 1)
    expect(forecast.status).toBe('positive')
    expect(forecast.pendingItems.length).toBe(2)
  })
})
