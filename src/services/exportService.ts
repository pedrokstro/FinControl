import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

interface ReportData {
  transactions: Transaction[]
  period: string
  totalIncome: number
  totalExpense: number
  balance: number
  categoryBreakdown: Array<{
    category: string
    amount: number
    percentage: number
  }>
}

class ExportService {
  /**
   * Exportar relatório em PDF com design profissional
   */
  exportToPDF(data: ReportData, userName: string = 'Usuário') {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Cores do tema
    const primaryColor: [number, number, number] = [37, 99, 235] // primary-600
    const lightGray: [number, number, number] = [243, 244, 246] // gray-100
    const darkGray: [number, number, number] = [75, 85, 99] // gray-600
    
    // Header com título
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 40, 'F')
    
    // Título
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('FinControl', 15, 20)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Relatório Financeiro', 15, 28)
    
    // Data de geração
    doc.setFontSize(9)
    doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth - 15, 20, { align: 'right' })
    doc.text(`Usuário: ${userName}`, pageWidth - 15, 27, { align: 'right' })
    
    // Período do relatório
    let yPos = 50
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Período do Relatório', 15, yPos)
    
    yPos += 8
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(data.period, 15, yPos)
    
    // Cards de resumo
    yPos += 15
    const cardWidth = (pageWidth - 45) / 3
    const cardHeight = 25
    
    // Card Receitas
    doc.setFillColor(220, 252, 231) // green-100
    doc.roundedRect(15, yPos, cardWidth, cardHeight, 3, 3, 'F')
    doc.setTextColor(22, 163, 74) // green-600
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('RECEITAS', 15 + cardWidth / 2, yPos + 8, { align: 'center' })
    doc.setFontSize(14)
    doc.text(`R$ ${data.totalIncome.toFixed(2)}`, 15 + cardWidth / 2, yPos + 18, { align: 'center' })
    
    // Card Despesas
    doc.setFillColor(254, 226, 226) // red-100
    doc.roundedRect(15 + cardWidth + 5, yPos, cardWidth, cardHeight, 3, 3, 'F')
    doc.setTextColor(220, 38, 38) // red-600
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('DESPESAS', 15 + cardWidth + 5 + cardWidth / 2, yPos + 8, { align: 'center' })
    doc.setFontSize(14)
    doc.text(`R$ ${data.totalExpense.toFixed(2)}`, 15 + cardWidth + 5 + cardWidth / 2, yPos + 18, { align: 'center' })
    
    // Card Saldo
    const balanceColor: [number, number, number] = data.balance >= 0 ? [22, 163, 74] : [220, 38, 38]
    const balanceBg: [number, number, number] = data.balance >= 0 ? [220, 252, 231] : [254, 226, 226]
    doc.setFillColor(...balanceBg)
    doc.roundedRect(15 + (cardWidth + 5) * 2, yPos, cardWidth, cardHeight, 3, 3, 'F')
    doc.setTextColor(...balanceColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('SALDO', 15 + (cardWidth + 5) * 2 + cardWidth / 2, yPos + 8, { align: 'center' })
    doc.setFontSize(14)
    doc.text(`R$ ${data.balance.toFixed(2)}`, 15 + (cardWidth + 5) * 2 + cardWidth / 2, yPos + 18, { align: 'center' })
    
    // Distribuição por categoria
    yPos += 40
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Distribuição por Categoria', 15, yPos)
    
    yPos += 5
    if (data.categoryBreakdown.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Categoria', 'Valor', 'Percentual']],
        body: data.categoryBreakdown.map(cat => [
          cat.category,
          `R$ ${cat.amount.toFixed(2)}`,
          `${cat.percentage.toFixed(1)}%`
        ]),
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: darkGray
        },
        alternateRowStyles: {
          fillColor: lightGray
        },
        margin: { left: 15, right: 15 }
      })
      
      yPos = (doc as any).lastAutoTable.finalY + 15
    }
    
    // Transações detalhadas
    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Transações Detalhadas', 15, yPos)
    
    yPos += 5
    if (data.transactions.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
        body: data.transactions.map(t => [
          format(new Date(t.date), 'dd/MM/yyyy'),
          t.description,
          t.category,
          t.type === 'income' ? 'Receita' : 'Despesa',
          `R$ ${t.amount.toFixed(2)}`
        ]),
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          textColor: darkGray
        },
        alternateRowStyles: {
          fillColor: lightGray
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: 15, right: 15 }
      })
    }
    
    // Footer em todas as páginas
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFillColor(...lightGray)
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')
      doc.setTextColor(...darkGray)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('FinControl - Controle Financeiro Inteligente', pageWidth / 2, pageHeight - 8, { align: 'center' })
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - 15, pageHeight - 8, { align: 'right' })
    }
    
    // Salvar PDF
    const fileName = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`
    doc.save(fileName)
  }
  
  /**
   * Exportar relatório em Excel
   */
  exportToExcel(data: ReportData) {
    const workbook = XLSX.utils.book_new()
    
    // Sheet 1: Resumo
    const summaryData = [
      ['FinControl - Relatório Financeiro'],
      [''],
      ['Período:', data.period],
      ['Gerado em:', format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })],
      [''],
      ['RESUMO FINANCEIRO'],
      ['Receitas:', data.totalIncome],
      ['Despesas:', data.totalExpense],
      ['Saldo:', data.balance],
      [''],
      ['DISTRIBUIÇÃO POR CATEGORIA'],
      ['Categoria', 'Valor', 'Percentual'],
      ...data.categoryBreakdown.map(cat => [cat.category, cat.amount, `${cat.percentage.toFixed(1)}%`])
    ]
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    
    // Estilização básica
    summarySheet['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 15 }
    ]
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo')
    
    // Sheet 2: Transações
    const transactionsData = [
      ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'],
      ...data.transactions.map(t => [
        format(new Date(t.date), 'dd/MM/yyyy'),
        t.description,
        t.category,
        t.type === 'income' ? 'Receita' : 'Despesa',
        t.amount
      ])
    ]
    
    const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData)
    
    transactionsSheet['!cols'] = [
      { wch: 12 },
      { wch: 35 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 }
    ]
    
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transações')
    
    // Salvar Excel
    const fileName = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }
  
  /**
   * Exportar relatório em CSV
   */
  exportToCSV(data: ReportData) {
    const csvContent = [
      ['FinControl - Relatório Financeiro'],
      [''],
      ['Período', data.period],
      ['Gerado em', format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })],
      [''],
      ['RESUMO FINANCEIRO'],
      ['Receitas', data.totalIncome],
      ['Despesas', data.totalExpense],
      ['Saldo', data.balance],
      [''],
      ['TRANSAÇÕES'],
      ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'],
      ...data.transactions.map(t => [
        format(new Date(t.date), 'dd/MM/yyyy'),
        t.description,
        t.category,
        t.type === 'income' ? 'Receita' : 'Despesa',
        t.amount
      ])
    ]
    
    const csv = csvContent.map(row => row.join(';')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportService = new ExportService()
