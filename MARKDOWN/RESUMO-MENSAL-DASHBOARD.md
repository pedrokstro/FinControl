# Resumo Mensal - Dashboard

## O Que Foi Adicionado

Adicionei um novo card "Resumo Mensal" no Dashboard com um grafico de barras comparativo que mostra receitas e despesas para todos os 12 meses do ano.

## Caracteristicas Principais

### 1. Grafico de Barras Comparativo

- **Tipo**: Grafico de barras (BarChart)
- **Cores**:
  - Verde (#22c55e) para Receitas
  - Vermelho (#ef4444) para Despesas
- **Eixo X**: Meses do ano (JAN, FEV, MAR, ABR, MAI, JUN, JUL, AGO, SET, OUT, NOV, DEZ)
- **Eixo Y**: Valores em Reais (formatado como R$ 1k, R$ 2k, etc.)

### 2. Labels dos Meses

Os meses sao exibidos em portugues abreviado:
- JAN (Janeiro)
- FEV (Fevereiro)
- MAR (Marco)
- ABR (Abril)
- MAI (Maio)
- JUN (Junho)
- JUL (Julho)
- AGO (Agosto)
- SET (Setembro)
- OUT (Outubro)
- NOV (Novembro)
- DEZ (Dezembro)

### 3. Tooltip Interativo

Ao passar o mouse sobre as barras:
- Mostra o mes
- Exibe o valor exato em formato de moeda (R$ 1.234,56)
- Diferencia receitas e despesas

### 4. Legenda

- Legenda clara identificando:
  - Barra verde = Receitas
  - Barra vermelha = Despesas

### 5. Estatisticas do Resumo

Abaixo do grafico, ha 3 metricas importantes:

#### Meses com Transacoes
- Quantidade de meses que tem pelo menos uma transacao registrada
- Ajuda a entender a cobertura de dados

#### Melhor Mes
- Mes com maior saldo positivo (receitas - despesas)
- Identificado pela sigla do mes (ex: "JAN")
- Exibido em verde

#### Mes Mais Ativo
- Mes com maior volume total de transacoes (receitas + despesas)
- Indica o mes com mais movimentacao financeira
- Exibido em azul

### 6. Design Visual

- Card com icone de grafico de barras
- Titulo "Resumo Mensal"
- Subtitulo explicativo
- Espacamento e bordas adequadas
- Altura de 350px para o grafico
- Estatisticas separadas por linha divisoria

## Como Funciona

### Coleta de Dados

O sistema:
1. Agrupa todas as transacoes por mes (0-11)
2. Inicializa todos os 12 meses com valores 0
3. Soma as receitas e despesas de cada mes
4. Calcula o saldo (receitas - despesas)

### Codigo Principal

```typescript
const yearlyMonthlyData = useMemo(() => {
  const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  
  // Agrupar transacoes por mes
  const monthlyTotals = {}
  
  // Inicializar todos os meses com 0
  for (let i = 0; i < 12; i++) {
    monthlyTotals[i] = { income: 0, expense: 0 }
  }
  
  // Calcular totais de cada mes
  transactions.forEach((t) => {
    const tMonth = getMonth(parseISO(t.date))
    
    if (t.type === 'income') {
      monthlyTotals[tMonth].income += t.amount
    } else {
      monthlyTotals[tMonth].expense += t.amount
    }
  })
  
  // Transformar em array para o grafico
  return monthNames.map((name, index) => ({
    month: name,
    receitas: monthlyTotals[index].income,
    despesas: monthlyTotals[index].expense,
    saldo: monthlyTotals[index].income - monthlyTotals[index].expense
  }))
}, [transactions])
```

## Atualizacao Automatica

O grafico se atualiza automaticamente quando:
- Novas transacoes sao adicionadas
- Transacoes sao editadas
- Transacoes sao excluidas
- O mes muda

Isso e garantido pelo uso de `useMemo` com `transactions` como dependencia.

## Posicionamento no Dashboard

O card "Resumo Mensal" esta posicionado:
1. Logo apos os 4 cards de resumo (Saldo Total, Receitas, Despesas, Balanco)
2. Antes dos graficos de Historico Mensal e Despesas por Categoria
3. Ocupando toda a largura disponivel

## Layout Responsivo

O card se adapta a diferentes tamanhos de tela:
- Desktop: Largura completa
- Tablet: Largura completa com grafico ajustavel
- Mobile: Grafico responsivo com scroll horizontal se necessario

## Exemplo Visual

```
???????????????????????????????????????????????????????????
?  ?? Resumo Mensal                                       ?
?  Comparacao de receitas e despesas por mes             ?
?                                                         ?
?  [Grafico de Barras com 12 meses]                     ?
?  Verde: Receitas | Vermelho: Despesas                  ?
?                                                         ?
?  ?????????????????????????????????????????????         ?
?  Meses com        Melhor Mes      Mes Mais Ativo      ?
?  Transacoes                                            ?
?      8               MAR              JUN              ?
???????????????????????????????????????????????????????????
```

## Beneficios

1. **Visao Anual Completa**: Veja todos os 12 meses de uma vez
2. **Comparacao Visual**: Facil identificar padroes e tendencias
3. **Identificacao de Picos**: Rapidamente veja meses com maiores gastos ou receitas
4. **Estatisticas Uteis**: Metricas calculadas automaticamente
5. **Atualizacao em Tempo Real**: Sempre reflete os dados mais recentes

## Integracao com Outros Componentes

O card trabalha em conjunto com:
- **Store de Transacoes**: Le dados do Zustand
- **Grafico de Historico**: Complementa com visao de 6 meses
- **Cards de Resumo**: Fornece contexto mais amplo

## Melhorias Futuras Possiveis

1. Adicionar filtro por ano
2. Comparar ano atual com ano anterior
3. Adicionar linha de saldo (lucro) no grafico
4. Permitir clicar em uma barra para ver detalhes
5. Exportar dados do grafico
6. Adicionar metas mensais como linha de referencia

## Conclusao

O card "Resumo Mensal" fornece uma visao completa e comparativa de todo o ano financeiro, facilitando a analise de padroes, identificacao de meses problematicos e planejamento futuro.
