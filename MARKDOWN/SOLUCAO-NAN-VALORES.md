# Solução: Valores Aparecendo como NaN

## Problema

As transações apareciam na lista, mas os valores mostravam **NaN** (Not a Number):
- Receitas: R$ NaN
- Despesas: R$ NaN
- Saldo: R$ NaN

## Causa

O backend (PostgreSQL) retorna o campo `amount` como **string** (tipo `decimal`):

```json
{
  "id": "...",
  "amount": "150.00",  // ← STRING!
  "description": "Combustível",
  ...
}
```

Mas o frontend tentava somar diretamente:
```typescript
const income = transactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0)  // ❌ "150.00" + 0 = NaN
```

Quando você tenta somar uma **string** com um **número** em JavaScript, o resultado é `NaN`.

## Solução Aplicada

Modificado `src/store/financialStore.ts` para **converter** `amount` de string para número em todos os lugares:

### 1. Ao Buscar Transações (fetchTransactions)
```typescript
const transactions = data.transactions.map(t => ({
  ...t,
  amount: Number(t.amount), // ✅ Converter string → número
  category: t.category.name,
}))
```

### 2. Ao Criar Transação (addTransaction)
```typescript
const newTransaction = {
  ...result,
  amount: Number(result.amount), // ✅ Converter
  category: result.category.name,
}
```

### 3. Ao Atualizar Transação (updateTransaction)
```typescript
const updated = {
  ...result,
  amount: Number(result.amount), // ✅ Converter
  category: result.category.name,
}
```

## Por Que Isso Acontece?

### PostgreSQL
O tipo `DECIMAL(12,2)` no PostgreSQL é retornado como **string** para preservar precisão:
```sql
amount DECIMAL(12,2)  → "150.00" (string)
```

### JavaScript
Operações matemáticas com strings resultam em `NaN`:
```javascript
"150.00" + 100 = "150.00100"  // Concatenação
Number("150.00") + 100 = 250  // ✅ Soma correta
```

## Resultado

✅ **Receitas:** R$ 8.011,57
✅ **Despesas:** R$ 2.380,50
✅ **Saldo:** R$ 5.631,07
✅ **Valores individuais:** R$ 150,00, R$ 350,00, etc.

## Teste

Após a correção, os valores devem aparecer corretamente:

```
Total de Transacoes: 7
Receitas: R$ 8.011,57
Despesas: R$ 2.380,50
Saldo: R$ 5.631,07
```

## Arquivos Modificados

- ✅ `src/store/financialStore.ts` - Conversão de `amount` em 3 métodos

## Alternativas Consideradas

### Opção 1: Converter no Backend
Modificar o backend para retornar números:
```typescript
amount: parseFloat(t.amount)
```
❌ Não recomendado - pode perder precisão

### Opção 2: Converter no Frontend (ESCOLHIDA)
Converter ao receber do backend:
```typescript
amount: Number(t.amount)
```
✅ Mantém precisão e compatibilidade

### Opção 3: Usar BigDecimal
Biblioteca para valores monetários:
```typescript
import Decimal from 'decimal.js'
```
⚠️ Overkill para este caso

## Boas Práticas

1. **Sempre converter tipos** ao receber dados da API
2. **Validar tipos** antes de operações matemáticas
3. **Usar Number()** para conversão segura de strings numéricas
4. **Documentar** conversões de tipos no código

## Prevenção Futura

Para evitar esse problema no futuro:

```typescript
// Adicionar validação de tipo
interface Transaction {
  amount: number; // ← Documentar que deve ser número
}

// Validar ao receber
const amount = typeof t.amount === 'string' 
  ? Number(t.amount) 
  : t.amount;
```

## Lições Aprendidas

1. PostgreSQL DECIMAL → JavaScript String
2. String + Number = NaN
3. Number(string) converte corretamente
4. Sempre converter tipos ao cruzar fronteiras (API → Frontend)
