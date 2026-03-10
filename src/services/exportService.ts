import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface ExportTransaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export interface ReportData {
  transactions: ExportTransaction[]
  period: string
  periodLabel: string
  totalIncome: number
  totalExpense: number
  balance: number
  userName: string
  categoryBreakdown: Array<{
    category: string
    type: 'income' | 'expense'
    amount: number
    percentage: number
  }>
}

// Cores do tema FinControl
const COLORS = {
  primary: [37, 99, 235] as [number, number, number],
  primaryLight: [219, 234, 254] as [number, number, number],
  success: [22, 163, 74] as [number, number, number],
  successLight: [220, 252, 231] as [number, number, number],
  danger: [220, 38, 38] as [number, number, number],
  dangerLight: [254, 226, 226] as [number, number, number],
  gray100: [243, 244, 246] as [number, number, number],
  gray600: [75, 85, 99] as [number, number, number],
  gray900: [17, 24, 39] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
}

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

class ExportService {
  // ─────────────────────────────────────────────────────────────────────────────
  // PDF
  // ─────────────────────────────────────────────────────────────────────────────
  exportToPDF(data: ReportData) {
    const doc = new jsPDF({ orientation: 'portrait', format: 'a4' })
    const pw = doc.internal.pageSize.getWidth()
    const ph = doc.internal.pageSize.getHeight()
    let y = 0

    // ── COVER / HEADER BAND ────────────────────────────────────────────────────
    doc.setFillColor(...COLORS.primary)
    doc.rect(0, 0, pw, 52, 'F')

    // Accent stripe at bottom of header
    doc.setFillColor(...COLORS.primaryLight)
    doc.rect(0, 49, pw, 3, 'F')

    // Logo text (FinControl)
    doc.setTextColor(...COLORS.white)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Fin', 15, 22)
    doc.setTextColor(147, 197, 253) // blue-300
    doc.text('Control', 29, 22)

    // Subtitle
    doc.setTextColor(...COLORS.white)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Controle Financeiro Inteligente', 15, 30)

    // Right-side meta
    doc.setFontSize(8)
    doc.setTextColor(219, 234, 254)
    doc.text(`Relatório gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pw - 15, 18, { align: 'right' })
    doc.text(`Usuário: ${data.userName}`, pw - 15, 26, { align: 'right' })
    doc.text(`Período: ${data.periodLabel}`, pw - 15, 34, { align: 'right' })

    y = 62

    // ── PERIOD INFO ────────────────────────────────────────────────────────────
    doc.setTextColor(...COLORS.gray600)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Período analisado: ${data.period}`, 15, y)
    y += 4
    doc.setDrawColor(...COLORS.gray100)
    doc.setLineWidth(0.5)
    doc.line(15, y, pw - 15, y)
    y += 8

    // ── SUMMARY CARDS ─────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...COLORS.gray900)
    doc.text('Resumo Financeiro', 15, y)
    y += 6

    const cardW = (pw - 45) / 3
    const cardH = 30

    const drawCard = (x: number, yy: number, label: string, value: number) => {
      const isPos = value >= 0
      const bg = label === 'RECEITAS' ? COLORS.successLight : label === 'DESPESAS' ? COLORS.dangerLight : isPos ? COLORS.successLight : COLORS.dangerLight
      const fg = label === 'RECEITAS' ? COLORS.success : label === 'DESPESAS' ? COLORS.danger : isPos ? COLORS.success : COLORS.danger

      doc.setFillColor(...bg)
      doc.roundedRect(x, yy, cardW, cardH, 4, 4, 'F')

      doc.setTextColor(...fg)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(label, x + cardW / 2, yy + 9, { align: 'center' })

      doc.setFontSize(11)
      doc.text(fmt(value), x + cardW / 2, yy + 21, { align: 'center' })
    }

    drawCard(15, y, 'RECEITAS', data.totalIncome)
    drawCard(15 + cardW + 5, y, 'DESPESAS', data.totalExpense)
    drawCard(15 + (cardW + 5) * 2, y, 'SALDO', data.balance)
    y += cardH + 12

    // ── CATEGORY BREAKDOWN ─────────────────────────────────────────────────────
    const expenses = data.categoryBreakdown.filter(c => c.type === 'expense')
    const incomes = data.categoryBreakdown.filter(c => c.type === 'income')

    if (expenses.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...COLORS.gray900)
      doc.text('Despesas por Categoria', 15, y)
      y += 4

      autoTable(doc, {
        startY: y,
        head: [['Categoria', 'Valor (R$)', '% do Total']],
        body: expenses.map(c => [c.category, fmt(c.amount), `${c.percentage.toFixed(1)}%`]),
        theme: 'striped',
        headStyles: { fillColor: COLORS.danger, textColor: COLORS.white, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8.5, textColor: COLORS.gray600 },
        alternateRowStyles: { fillColor: COLORS.gray100 },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
        margin: { left: 15, right: 15 },
      })
      y = (doc as any).lastAutoTable.finalY + 10
    }

    if (incomes.length > 0) {
      if (y > ph - 80) { doc.addPage(); y = 20 }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...COLORS.gray900)
      doc.text('Receitas por Categoria', 15, y)
      y += 4

      autoTable(doc, {
        startY: y,
        head: [['Categoria', 'Valor (R$)', '% do Total']],
        body: incomes.map(c => [c.category, fmt(c.amount), `${c.percentage.toFixed(1)}%`]),
        theme: 'striped',
        headStyles: { fillColor: COLORS.success, textColor: COLORS.white, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8.5, textColor: COLORS.gray600 },
        alternateRowStyles: { fillColor: COLORS.gray100 },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
        margin: { left: 15, right: 15 },
      })
      y = (doc as any).lastAutoTable.finalY + 10
    }

    // ── TRANSACTIONS TABLE ─────────────────────────────────────────────────────
    if (y > ph - 80) { doc.addPage(); y = 20 }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...COLORS.gray900)
    doc.text(`Transações Detalhadas (${data.transactions.length})`, 15, y)
    y += 4

    if (data.transactions.length > 0) {
      const sorted = [...data.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      autoTable(doc, {
        startY: y,
        head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor (R$)']],
        body: sorted.map(t => [
          format(new Date(t.date + 'T12:00:00'), 'dd/MM/yyyy'),
          t.description,
          t.category,
          t.type === 'income' ? '▲ Receita' : '▼ Despesa',
          fmt(t.amount),
        ]),
        theme: 'striped',
        headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: COLORS.gray600 },
        alternateRowStyles: { fillColor: COLORS.gray100 },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 32 },
          3: { cellWidth: 22 },
          4: { cellWidth: 30, halign: 'right' },
        },
        didParseCell: (hookData) => {
          if (hookData.column.index === 3 && hookData.section === 'body') {
            const val = hookData.cell.raw as string
            hookData.cell.styles.textColor = val.includes('Receita') ? COLORS.success : COLORS.danger
            hookData.cell.styles.fontStyle = 'bold'
          }
        },
        margin: { left: 15, right: 15 },
      })
    } else {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...COLORS.gray600)
      doc.text('Nenhuma transação no período selecionado.', 15, y + 10)
    }

    // ── FOOTER ─────────────────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFillColor(...COLORS.gray100)
      doc.rect(0, ph - 14, pw, 14, 'F')
      doc.setDrawColor(...COLORS.primaryLight)
      doc.setLineWidth(1)
      doc.line(0, ph - 14, pw, ph - 14)
      doc.setTextColor(...COLORS.gray600)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.text('FinControl · Controle Financeiro Inteligente · Documento confidencial', pw / 2, ph - 7, { align: 'center' })
      doc.text(`Página ${i} de ${totalPages}`, pw - 15, ph - 7, { align: 'right' })
      doc.text(format(new Date(), 'dd/MM/yyyy'), 15, ph - 7)
    }

    doc.save(`FinControl_Relatorio_${format(new Date(), 'yyyy-MM-dd_HHmm')}.pdf`)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EXCEL
  // ─────────────────────────────────────────────────────────────────────────────
  exportToExcel(data: ReportData) {
    const wb = XLSX.utils.book_new()
    const now = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

    // ── Sheet 1: Resumo ────────────────────────────────────────────────────────
    const summaryRows = [
      ['FINCONTROL – RELATÓRIO FINANCEIRO'],
      [`Gerado em: ${now}`],
      [`Usuário: ${data.userName}`],
      [`Período: ${data.period}`],
      [],
      ['RESUMO GERAL'],
      ['Indicador', 'Valor (R$)'],
      ['Total de Receitas', data.totalIncome],
      ['Total de Despesas', data.totalExpense],
      ['Saldo do Período', data.balance],
      ['Total de Transações', data.transactions.length],
    ]

    const wsResumo = XLSX.utils.aoa_to_sheet(summaryRows)
    wsResumo['!cols'] = [{ wch: 30 }, { wch: 20 }]
    wsResumo['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }]
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')

    // ── Sheet 2: Categorias ────────────────────────────────────────────────────
    const catRows = [
      ['FINCONTROL – DISTRIBUIÇÃO POR CATEGORIA'],
      [`Período: ${data.period}`],
      [],
      ['Categoria', 'Tipo', 'Valor (R$)', '% do Total'],
      ...data.categoryBreakdown
        .sort((a, b) => b.amount - a.amount)
        .map(c => [c.category, c.type === 'income' ? 'Receita' : 'Despesa', c.amount, `${c.percentage.toFixed(1)}%`]),
    ]

    const wsCat = XLSX.utils.aoa_to_sheet(catRows)
    wsCat['!cols'] = [{ wch: 28 }, { wch: 12 }, { wch: 18 }, { wch: 14 }]
    XLSX.utils.book_append_sheet(wb, wsCat, 'Categorias')

    // ── Sheet 3: Transações ────────────────────────────────────────────────────
    const txRows = [
      ['FINCONTROL – TRANSAÇÕES DETALHADAS'],
      [`Período: ${data.period}`],
      [],
      ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor (R$)'],
      ...[...data.transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(t => [
          format(new Date(t.date + 'T12:00:00'), 'dd/MM/yyyy'),
          t.description,
          t.category,
          t.type === 'income' ? 'Receita' : 'Despesa',
          t.amount,
        ]),
    ]

    const wsTx = XLSX.utils.aoa_to_sheet(txRows)
    wsTx['!cols'] = [{ wch: 13 }, { wch: 38 }, { wch: 22 }, { wch: 12 }, { wch: 16 }]
    XLSX.utils.book_append_sheet(wb, wsTx, 'Transações')

    XLSX.writeFile(wb, `FinControl_Relatorio_${format(new Date(), 'yyyy-MM-dd_HHmm')}.xlsx`)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CSV
  // ─────────────────────────────────────────────────────────────────────────────
  exportToCSV(data: ReportData) {
    const now = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

    const rows: (string | number)[][] = [
      ['FINCONTROL – RELATÓRIO FINANCEIRO'],
      [`Gerado em:`, now],
      [`Usuário:`, data.userName],
      [`Período:`, data.period],
      [],
      ['RESUMO GERAL'],
      ['Receitas', data.totalIncome],
      ['Despesas', data.totalExpense],
      ['Saldo', data.balance],
      [],
      ['CATEGORIAS'],
      ['Categoria', 'Tipo', 'Valor', '% do Total'],
      ...data.categoryBreakdown
        .sort((a, b) => b.amount - a.amount)
        .map(c => [c.category, c.type === 'income' ? 'Receita' : 'Despesa', c.amount, `${c.percentage.toFixed(1)}%`]),
      [],
      ['TRANSAÇÕES DETALHADAS'],
      ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'],
      ...[...data.transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(t => [
          format(new Date(t.date + 'T12:00:00'), 'dd/MM/yyyy'),
          t.description,
          t.category,
          t.type === 'income' ? 'Receita' : 'Despesa',
          t.amount,
        ]),
    ]

    const csv = rows
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\r\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `FinControl_Relatorio_${format(new Date(), 'yyyy-MM-dd_HHmm')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportService = new ExportService()
