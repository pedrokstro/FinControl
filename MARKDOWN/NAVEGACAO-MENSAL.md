# Navegacao Mensal - Pagina de Transacoes

## O Que Foi Adicionado

Adicionei navegacao mensal na pagina de Transacoes com os seguintes recursos:

### 1. Botoes de Navegacao

- **Botao "Anterior"** (com icone de seta esquerda)
  - Navega para o mes anterior
  - Exibe transacoes do mes selecionado

- **Botao "Proximo"** (com icone de seta direita)
  - Navega para o proximo mes
  - Exibe transacoes do mes seguinte

### 2. Display do Mes Atual

- Mostra o mes e ano selecionado no formato "janeiro 2024"
- Centralizado entre os botoes de navegacao
- Icone de calendario para melhor visualizacao

### 3. Botao "Voltar para Mes Atual"

- Aparece quando voce navega para um mes diferente do atual
- Permite retornar rapidamente ao mes corrente
- Visivel em dois locais:
  - Abaixo do titulo do mes
  - Na mensagem de "Nenhuma transacao encontrada"

### 4. Resumo Mensal

Adicionado um card com estatisticas do mes selecionado:

- **Total de Transacoes**: Quantidade de transacoes no mes
- **Receitas**: Soma total das receitas
- **Despesas**: Soma total das despesas
- **Saldo**: Diferenca entre receitas e despesas
  - Verde se positivo
  - Vermelho se negativo

### 5. Filtragem Automatica

- As transacoes sao automaticamente filtradas pelo mes selecionado
- Os filtros existentes (tipo, categoria, busca) continuam funcionando
- Combinacao de filtros: mes + tipo + categoria + busca

## Como Usar

### Navegacao Basica

1. Abra a pagina "Transacoes"
2. Por padrao, exibe o mes atual
3. Clique em "Anterior" para ver transacoes de meses passados
4. Clique em "Proximo" para ver transacoes de meses futuros

### Retornar ao Mes Atual

- Clique no link "Voltar para mes atual" (aparece quando nao esta no mes corrente)

### Adicionar Nova Transacao

- Ao clicar em "Nova Transacao" enquanto navegando em um mes especifico
- A data padrao sera do mes selecionado
- Voce ainda pode alterar a data manualmente

## Recursos Tecnicos

### Estado Gerenciado

```typescript
const [selectedMonth, setSelectedMonth] = useState(new Date())
```

### Funcoes de Navegacao

```typescript
const handlePreviousMonth = () => {
  setSelectedMonth(prev => subMonths(prev, 1))
}

const handleNextMonth = () => {
  setSelectedMonth(prev => addMonths(prev, 1))
}

const handleCurrentMonth = () => {
  setSelectedMonth(new Date())
}
```

### Filtragem por Mes

```typescript
const monthStart = startOfMonth(selectedMonth)
const monthEnd = endOfMonth(selectedMonth)

const isInSelectedMonth = 
  transactionDate >= monthStart && transactionDate <= monthEnd
```

## Beneficios

1. **Organizacao**: Visualize transacoes mes a mes
2. **Performance**: Menos dados exibidos de uma vez
3. **Clareza**: Foco em um periodo especifico
4. **Estatisticas**: Resumo automatico do mes
5. **Facilidade**: Navegacao intuitiva

## Layout Visual

```
???????????????????????????????????????????????????????
?  [? Anterior]   Janeiro 2024   [Proximo ?]         ?
?  Total: 15 | Receitas: R$ 5.000 | Despesas: R$ 3.000 | Saldo: R$ 2.000
???????????????????????????????????????????????????????
```

## Compatibilidade

- Funciona com todos os filtros existentes
- Mantém a busca por texto
- Respeita os filtros de tipo (receita/despesa)
- Respeita os filtros de categoria
- Integrado com o sistema de edicao e exclusao

## Proximos Passos Possiveis

Para expandir esta funcionalidade no futuro, voce pode:

1. Adicionar um seletor de calendario (date picker)
2. Implementar navegacao por trimestre ou ano
3. Adicionar graficos mensais
4. Exportar transacoes do mes selecionado
5. Comparar mes atual com mes anterior

## Conclusao

A navegacao mensal torna muito mais facil gerenciar e visualizar suas transacoes financeiras, permitindo focar em periodos especificos e obter insights claros sobre seus gastos e receitas de cada mes.
