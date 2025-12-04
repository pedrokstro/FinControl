# Debug: Categorias Não Aparecem no Modal de Transação

## Problema Reportado

Ao tentar criar uma nova transação com o usuário `pedrocastro767@gmail.com`:
- ✅ Modal abre corretamente
- ❌ Select de categorias aparece vazio
- ✅ Página de Categorias mostra 37 categorias cadastradas

## Logs de Debug Adicionados

### 1. Store (`financialStore.ts`)
```typescript
fetchCategories: async () => {
  console.log('🔄 Buscando categorias do backend...')
  const data = await categoryService.getAll()
  console.log('📦 Categorias recebidas:', data.length)
  set({ categories: data })
}
```

### 2. Página Transactions (`Transactions.tsx`)
```typescript
console.log('📋 Total de categorias no store:', categories.length)
console.log('📋 Categorias disponíveis para', transactionType, ':', availableCategories.length)
```

## Como Verificar

1. **Abra o Console do Navegador** (F12)
2. **Faça login** com `pedrocastro767@gmail.com`
3. **Vá para Transações**
4. **Clique em "+ Nova Transação"**
5. **Verifique os logs:**

### Logs Esperados:

```
🔄 Buscando categorias do backend...
📦 Categorias recebidas: 37
📋 Total de categorias no store: 37
📋 Categorias disponíveis para expense: 25
```

### Se aparecer:

#### Caso 1: Categorias não são buscadas
```
// Nenhum log de "Buscando categorias"
```
**Problema:** `syncWithBackend()` não está sendo chamado ou `fetchCategories()` não está sendo executado.

#### Caso 2: API retorna erro
```
🔄 Buscando categorias do backend...
❌ Erro ao buscar categorias: [erro]
```
**Problema:** Erro na API ou autenticação.

#### Caso 3: Categorias chegam mas não aparecem
```
🔄 Buscando categorias do backend...
📦 Categorias recebidas: 37
📋 Total de categorias no store: 0
```
**Problema:** Store não está atualizando corretamente.

#### Caso 4: Filtro está errado
```
📋 Total de categorias no store: 37
📋 Categorias disponíveis para expense: 0
```
**Problema:** Todas as categorias são de `income` ou filtro está incorreto.

## Possíveis Causas

### 1. Categorias não estão sendo sincronizadas
- `syncWithBackend()` não chama `fetchCategories()`
- `useEffect` não está executando

### 2. API de categorias com problema
- Endpoint `/categories` retornando erro
- Token de autenticação não sendo enviado
- Categorias pertencem a outro usuário

### 3. Formato de resposta incorreto
- API retorna formato diferente do esperado
- Conversão de tipos falhando

### 4. Filtro de tipo incorreto
- Todas categorias são `income` mas está filtrando por `expense`
- Campo `type` com valor diferente

## Verificação via API

### Script PowerShell para testar:

```powershell
# Login
$loginBody = @{
    email = "pedrocastro767@gmail.com"
    password = "C0po4545@#"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.accessToken

# Buscar categorias
$headers = @{ "Authorization" = "Bearer $token" }
$categories = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/categories" -Method GET -Headers $headers

Write-Host "Total de categorias: $($categories.data.Count)"
$categories.data | ForEach-Object {
    Write-Host "$($_.type) - $($_.name)"
}
```

## Verificação via SQL

```sql
-- Contar categorias do usuário
SELECT COUNT(*) 
FROM categories 
WHERE "userId" = '38ce18aa-5d85-43d8-bb49-535cfaaedd11';

-- Ver categorias por tipo
SELECT type, COUNT(*) 
FROM categories 
WHERE "userId" = '38ce18aa-5d85-43d8-bb49-535cfaaedd11'
GROUP BY type;

-- Listar categorias
SELECT id, name, type, color, icon
FROM categories 
WHERE "userId" = '38ce18aa-5d85-43d8-bb49-535cfaaedd11'
ORDER BY type, name;
```

## Solução Temporária

Se as categorias não aparecerem, você pode:

1. **Limpar localStorage:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **Forçar sincronização:**
   - Fazer logout
   - Fazer login novamente
   - Recarregar a página

3. **Verificar se categorias existem:**
   - Ir para página de Categorias
   - Verificar se as 37 categorias aparecem lá

## Próximos Passos

1. ✅ Logs adicionados
2. ⏳ Abrir console e verificar logs
3. ⏳ Identificar qual caso está acontecendo
4. ⏳ Aplicar correção específica

## Arquivos Modificados

- ✅ `src/store/financialStore.ts` - Logs em `fetchCategories`
- ✅ `src/pages/Transactions.tsx` - Logs de categorias disponíveis
