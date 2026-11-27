import { format, parse, isValid } from 'date-fns'
import { Category, Transaction } from '@/types'

export interface ParsedImportTransaction {
  id: string
  date: string // Formato YYYY-MM-DD
  description: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  isDuplicate: boolean
  duplicateReason?: string
  selected: boolean
  rawMemo?: string
  fitid?: string
}

export interface ParseResult {
  fileName: string
  fileType: 'csv' | 'ofx'
  transactions: ParsedImportTransaction[]
  totalIncome: number
  totalExpense: number
  duplicateCount: number
}

// Mapeamento inteligente de palavras-chave para categorias comuns
export const KEYWORD_CATEGORY_MAP: Record<string, string[]> = {
  transporte: ['uber', '99app', '99', 'posto', 'gasolina', 'combustivel', 'estacionamento', 'pedagio', 'sem parar', 'veloe', 'ipva', 'auto'],
  alimentacao: ['mercado', 'supermercado', 'hipermercado', 'ifood', 'rappi', 'restaurante', 'padaria', 'lanchonete', 'burger', 'pizza', 'acougue', 'hortifruti', 'cafeteria', 'coffee'],
  saude: ['farmacia', 'drogaria', 'droga', 'hospital', 'medico', 'consulta', 'laboratorio', 'dentista', 'odonto', 'exame', 'clinica', 'remedio'],
  lazer: ['netflix', 'spotify', 'amazon prime', 'disney', 'cinema', 'ingresso', 'steam', 'playstation', 'xbox', 'show', 'teatro', 'bar', 'choperia', 'viagem'],
  moradia: ['aluguel', 'condominio', 'energia', 'enel', 'cpfl', 'light', 'agua', 'sabesp', 'sanepar', 'copasa', 'gas', 'iptu', 'reforma'],
  contas: ['claro', 'vivo', 'tim', 'oi', 'internet', 'fibra', 'fatura', 'pagamento de fatura', 'seguro', 'mensalidade', 'boleto'],
  educacao: ['faculdade', 'escola', 'colegio', 'curso', 'udemy', 'livraria', 'livro', 'idiomas'],
  salario: ['salario', 'provento', 'rendimento', 'ted recebida', 'pix recebido', 'transferencia recebida', 'valor adicionado', 'pagamento cliente', 'honorarios'],
  outros: ['pix', 'transferencia enviada', 'ted enviada', 'transferencia', 'ebanx', 'iof', 'tarifa'],
}

/**
 * Normaliza um texto para comparação simples sem acentos
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Tenta sugerir a melhor categoria com base na descrição e nas categorias do usuário
 */
export function suggestCategory(description: string, type: 'income' | 'expense', categories: Category[]): string {
  if (!categories || categories.length === 0) return ''
  const normDesc = normalizeText(description)

  // 1. Tentar bater palavra-chave com categoria do usuário
  for (const [keyGroup, keywords] of Object.entries(KEYWORD_CATEGORY_MAP)) {
    if (keywords.some((kw) => normDesc.includes(kw))) {
      const matchedCat = categories.find((cat) => {
        const normCat = normalizeText(cat.name)
        return (
          cat.type === type &&
          (normCat.includes(keyGroup) ||
            keyGroup.includes(normCat) ||
            keywords.some((kw) => normCat.includes(kw)))
        )
      })
      if (matchedCat) {
        return matchedCat.id
      }
    }
  }

  // 2. Tentar bater o nome de alguma categoria diretamente no texto
  const directMatch = categories.find(
    (cat) => cat.type === type && normDesc.includes(normalizeText(cat.name))
  )
  if (directMatch) return directMatch.id

  // 3. Fallback inteligente: buscar categoria padrão compatível (ex: "Outros" ou primeira categoria do tipo)
  const outrosCat = categories.find((c) => c.type === type && normalizeText(c.name).includes('outro'))
  if (outrosCat) return outrosCat.id

  const defaultCat = categories.find((c) => c.type === type)
  return defaultCat ? defaultCat.id : ''
}

/**
 * Parse de valores em formatos brasileiros e internacionais (ex: "1.250,50", "-50.00", "R$ 15,00 D")
 */
function parseCurrencyString(raw: string): { amount: number; isNegative: boolean } {
  let cleaned = raw.replace(/[R$\s]/g, '').trim()
  let isNegative = false

  if (cleaned.startsWith('-') || cleaned.endsWith('-') || cleaned.toUpperCase().endsWith('D')) {
    isNegative = true
  }

  cleaned = cleaned.replace(/[-+DCdc]/g, '').trim()

  // Detectar formato brasileiro (com vírgula decimal)
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // 1.250,50 -> 1250.50
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  } else if (cleaned.includes(',')) {
    // 1250,50 -> 1250.50
    cleaned = cleaned.replace(',', '.')
  }

  const amount = Math.abs(parseFloat(cleaned) || 0)
  return { amount, isNegative }
}

/**
 * Converte diferentes formatos de data para YYYY-MM-DD
 */
function parseDateStringToISO(raw: string): string {
  const cleaned = raw.trim().split(' ')[0] // remove hora se houver

  const formatsToTry = [
    'dd/MM/yyyy',
    'dd/MM/yy',
    'yyyy-MM-dd',
    'dd-MM-yyyy',
    'yyyyMMdd',
  ]

  for (const fmt of formatsToTry) {
    try {
      const parsed = parse(cleaned, fmt, new Date())
      if (isValid(parsed) && parsed.getFullYear() > 2000) {
        return format(parsed, 'yyyy-MM-dd')
      }
    } catch {
      // continua tentando
    }
  }

  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Detecta duplicatas comparando com transações já existentes no banco
 */
function checkDuplicate(
  candidate: { date: string; amount: number; description: string },
  existingTransactions: Transaction[]
): { isDuplicate: boolean; duplicateReason?: string } {
  const normCandidateDesc = normalizeText(candidate.description)

  const match = existingTransactions.find((tx) => {
    if (tx.isCancelled) return false
    const dateMatch = tx.date.split('T')[0] === candidate.date
    const amountMatch = Math.abs(Number(tx.amount) - candidate.amount) < 0.01

    if (dateMatch && amountMatch) {
      const normTxDesc = normalizeText(tx.description)
      // Se tiver descrição idêntica ou contida
      if (
        normTxDesc === normCandidateDesc ||
        normCandidateDesc.includes(normTxDesc) ||
        normTxDesc.includes(normCandidateDesc)
      ) {
        return true
      }
    }
    return false
  })

  if (match) {
    return {
      isDuplicate: true,
      duplicateReason: `Transação idêntica já cadastrada em ${candidate.date}`,
    }
  }

  return { isDuplicate: false }
}

/**
 * Parser de arquivos OFX (Open Financial Exchange)
 */
export function parseOFX(
  content: string,
  categories: Category[],
  existingTransactions: Transaction[] = []
): ParseResult {
  const transactions: ParsedImportTransaction[] = []

  // Extrair blocos STMTTRN
  const stmttrnRegex = /<STMTTRN>([\s\S]*?)(?:<\/STMTTRN>|(?=<STMTTRN>)|$)/gi
  let match: RegExpExecArray | null

  while ((match = stmttrnRegex.exec(content)) !== null) {
    const block = match[1]

    const typeMatch = /<TRNTYPE>([A-Z]+)/i.exec(block)
    const dateMatch = /<DTPOSTED>(\d{8})/i.exec(block)
    const amtMatch = /<TRNAMT>([-\d.,]+)/i.exec(block)
    const memoMatch = /<MEMO>([^<\r\n]+)/i.exec(block)
    const nameMatch = /<NAME>([^<\r\n]+)/i.exec(block)
    const fitidMatch = /<FITID>([^<\r\n]+)/i.exec(block)

    if (!amtMatch || !dateMatch) continue

    const { amount, isNegative } = parseCurrencyString(amtMatch[1])
    const trnType = typeMatch ? typeMatch[1].toUpperCase() : ''
    const isExpense = isNegative || trnType === 'DEBIT' || trnType === 'PAYMENT'

    const description = (memoMatch ? memoMatch[1] : nameMatch ? nameMatch[1] : 'Transação sem descrição').trim()
    const date = parseDateStringToISO(dateMatch[1])
    const finalType: 'income' | 'expense' = isExpense ? 'expense' : 'income'
    const categoryId = suggestCategory(description, finalType, categories)
    const { isDuplicate, duplicateReason } = checkDuplicate({ date, amount, description }, existingTransactions)

    transactions.push({
      id: `ofx-${Date.now()}-${transactions.length}`,
      date,
      description,
      amount,
      type: finalType,
      categoryId,
      isDuplicate,
      duplicateReason,
      selected: !isDuplicate, // duplicadas vêm desmarcadas por segurança
      rawMemo: description,
      fitid: fitidMatch ? fitidMatch[1].trim() : undefined,
    })
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const duplicateCount = transactions.filter((t) => t.isDuplicate).length

  return {
    fileName: 'Extrato.ofx',
    fileType: 'ofx',
    transactions,
    totalIncome,
    totalExpense,
    duplicateCount,
  }
}

/**
 * Parser de arquivos CSV com auto-detecção de delimitador e colunas
 */
export function parseCSV(
  content: string,
  categories: Category[],
  existingTransactions: Transaction[] = []
): ParseResult {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return {
      fileName: 'Extrato.csv',
      fileType: 'csv',
      transactions: [],
      totalIncome: 0,
      totalExpense: 0,
      duplicateCount: 0,
    }
  }

  // Detectar delimitador mais comum na primeira linha
  const firstLine = lines[0]
  const semicolonCount = (firstLine.match(/;/g) || []).length
  const commaCount = (firstLine.match(/,/g) || []).length
  const tabCount = (firstLine.match(/\t/g) || []).length

  let delimiter = ','
  if (semicolonCount >= commaCount && semicolonCount >= tabCount) delimiter = ';'
  else if (tabCount >= commaCount) delimiter = '\t'

  // Quebrar cabeçalho
  const headers = firstLine.split(delimiter).map((h) => normalizeText(h.replace(/["']/g, '')))

  let dateIdx = headers.findIndex((h) => h.includes('data') || h.includes('date') || h === 'dt')
  let descIdx = headers.findIndex((h) =>
    h.includes('desc') || h.includes('hist') || h.includes('memo') || h.includes('estab') || h.includes('titulo')
  )
  let amountIdx = headers.findIndex((h) => h.includes('valor') || h.includes('amount') || h.includes('total'))
  let typeIdx = headers.findIndex((h) => h.includes('tipo') || h.includes('type'))

  // Se não encontrar por nome, assumir posições padrão (Data, Descrição, Valor)
  if (dateIdx === -1) dateIdx = 0
  if (descIdx === -1) descIdx = 1
  if (amountIdx === -1) amountIdx = 2

  const transactions: ParsedImportTransaction[] = []
  const hasNegativeValuesInFile = lines.some((l) => /-\s*\d/.test(l) || /;\s*-\d/.test(l) || /,\s*-\d/.test(l))

  // Processar linhas de dados
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(delimiter).map((col) => col.trim().replace(/^["']|["']$/g, ''))
    if (row.length <= Math.max(dateIdx, descIdx, amountIdx)) continue

    const rawDate = row[dateIdx]
    const rawDesc = row[descIdx] || 'Transação'
    const rawAmount = row[amountIdx]
    const rawType = typeIdx !== -1 ? row[typeIdx] : ''

    if (!rawDate || !rawAmount) continue

    const { amount, isNegative } = parseCurrencyString(rawAmount)
    if (amount <= 0) continue

    const date = parseDateStringToISO(rawDate)
    const normType = normalizeText(rawType)
    const normDesc = normalizeText(rawDesc)
    const hasIncomeKeywords = KEYWORD_CATEGORY_MAP.salario.some((kw) => normDesc.includes(kw)) || normDesc.includes('recebid') || normDesc.includes('deposito')

    let finalType: 'income' | 'expense' = 'expense'
    if (normType.includes('cred') || normType.includes('receit') || normType.includes('incom') || (!isNegative && rawAmount.startsWith('+'))) {
      finalType = 'income'
    } else if (normType.includes('deb') || normType.includes('desp')) {
      finalType = 'expense'
    } else if (isNegative) {
      finalType = 'expense'
    } else if (hasIncomeKeywords) {
      finalType = 'income'
    } else if (hasNegativeValuesInFile && !isNegative) {
      // Quando o extrato usa sinal de menos para débitos, valores positivos representam créditos/receitas
      finalType = 'income'
    } else {
      finalType = 'expense'
    }

    const categoryId = suggestCategory(rawDesc, finalType, categories)
    const { isDuplicate, duplicateReason } = checkDuplicate({ date, amount, description: rawDesc }, existingTransactions)

    transactions.push({
      id: `csv-${Date.now()}-${transactions.length}`,
      date,
      description: rawDesc,
      amount,
      type: finalType,
      categoryId,
      isDuplicate,
      duplicateReason,
      selected: !isDuplicate,
      rawMemo: rawDesc,
    })
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const duplicateCount = transactions.filter((t) => t.isDuplicate).length

  return {
    fileName: 'Extrato.csv',
    fileType: 'csv',
    transactions,
    totalIncome,
    totalExpense,
    duplicateCount,
  }
}

/**
 * Lê e analisa qualquer arquivo de extrato suportado (.csv, .ofx)
 */
export async function parseStatementFile(
  file: File,
  categories: Category[],
  existingTransactions: Transaction[] = []
): Promise<ParseResult> {
  const content = await file.text()
  const lowerName = file.name.toLowerCase()

  let result: ParseResult
  if (lowerName.endsWith('.ofx')) {
    result = parseOFX(content, categories, existingTransactions)
  } else {
    result = parseCSV(content, categories, existingTransactions)
  }

  result.fileName = file.name
  return result
}
