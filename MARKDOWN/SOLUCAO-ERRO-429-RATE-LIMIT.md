# Solução: Erro 429 ao Excluir Transação

## Problema

Ao tentar excluir uma transação, aparece o erro:
```
Erro ao excluir transação
DELETE http://localhost:5000/api/v1/transactions/[id]
429 (Too Many Requests)
```

## Causa

O backend tem **rate limiting** (limitação de taxa de requisições) configurado para prevenir abuso da API.

### Configuração Anterior:
```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100    # 100 requisições
```

Isso significa:
- **Máximo de 100 requisições a cada 15 minutos**
- Se ultrapassar, retorna erro **429 (Too Many Requests)**

### Por que aconteceu?

Durante o desenvolvimento, é comum fazer muitas requisições rapidamente:
- Criar transações
- Atualizar transações
- Excluir transações
- Recarregar páginas
- Testar funcionalidades

Isso facilmente ultrapassa o limite de 100 requisições.

## Soluções Aplicadas

### 1. Aumentar Limite de Rate Limiting (Backend)

**Arquivo:** `backend/.env`

**Antes:**
```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100    # 100 requisições
```

**Depois:**
```env
RATE_LIMIT_WINDOW_MS=60000     # 1 minuto
RATE_LIMIT_MAX_REQUESTS=1000   # 1000 requisições
```

**Resultado:**
- ✅ **1000 requisições por minuto** (muito mais flexível para desenvolvimento)
- ✅ Janela menor (1 minuto) para resetar mais rápido

### 2. Melhorar Mensagem de Erro (Frontend)

**Arquivo:** `src/store/financialStore.ts`

**Antes:**
```typescript
catch (error) {
  toast.error('Erro ao excluir transação')
}
```

**Depois:**
```typescript
catch (error: any) {
  // Tratar erro 429 (Too Many Requests)
  if (error.response?.status === 429) {
    toast.error('Muitas requisições. Aguarde alguns segundos e tente novamente.')
  } else {
    toast.error('Erro ao excluir transação')
  }
  
  console.error('❌ Erro ao excluir transação:', error)
}
```

**Resultado:**
- ✅ Mensagem específica para erro 429
- ✅ Usuário entende o que aconteceu
- ✅ Log detalhado no console para debug

## Como Aplicar

### 1. Reiniciar Backend

O backend precisa ser reiniciado para carregar as novas configurações do `.env`:

```bash
cd backend
npm run dev
```

### 2. Testar Exclusão

Agora você pode excluir transações sem problemas!

## Configurações Recomendadas

### Desenvolvimento:
```env
RATE_LIMIT_WINDOW_MS=60000     # 1 minuto
RATE_LIMIT_MAX_REQUESTS=1000   # 1000 req/min
```

### Produção:
```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100    # 100 req/15min
```

## Entendendo Rate Limiting

### O que é?
Mecanismo para limitar o número de requisições que um cliente pode fazer à API em um período de tempo.

### Por que usar?
1. **Prevenir abuso** - Evitar ataques DDoS
2. **Proteger recursos** - Não sobrecarregar servidor/banco
3. **Garantir qualidade** - Todos os usuários têm acesso justo

### Como funciona?
```
Cliente faz requisição → Contador incrementa
Se contador < limite → Requisição aceita ✅
Se contador >= limite → Erro 429 ❌
Após janela de tempo → Contador reseta
```

## Outros Erros de Rate Limiting

### 429 em Login
Se aparecer ao fazer login repetidamente:
```
Aguarde 1 minuto e tente novamente
```

### 429 em Criação de Transações
Se aparecer ao criar muitas transações:
```
Aguarde alguns segundos entre cada criação
```

### 429 em Qualquer Endpoint
Mensagem genérica:
```
"Muitas requisições. Aguarde alguns segundos e tente novamente."
```

## Verificar Status do Rate Limit

### Via Headers HTTP
O backend pode retornar headers informativos:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1699456789
```

### Via Console
Verificar logs do backend:
```
Rate limit exceeded for IP: 127.0.0.1
```

## Desabilitar Rate Limiting (Não Recomendado)

Se quiser desabilitar completamente (apenas para testes locais):

**Arquivo:** `backend/src/middleware/rateLimiter.ts`

```typescript
// Comentar ou remover o middleware
// app.use(rateLimiter)
```

⚠️ **Atenção:** Nunca desabilitar em produção!

## Arquivos Modificados

1. ✅ `backend/.env` - Aumentado limite de rate limiting
2. ✅ `src/store/financialStore.ts` - Melhorada mensagem de erro 429

## Teste

1. **Reinicie o backend**
2. **Tente excluir uma transação**
3. **Deve funcionar normalmente** ✅

Se ainda aparecer erro 429:
- Aguarde 1 minuto
- Tente novamente
- Verifique se o backend foi reiniciado

## Lições Aprendidas

1. ✅ **Rate limiting é importante** mas deve ser ajustado para desenvolvimento
2. ✅ **Mensagens de erro específicas** ajudam o usuário
3. ✅ **Logs detalhados** facilitam debug
4. ✅ **Configurações diferentes** para dev e produção
5. ✅ **Reiniciar backend** após mudar `.env`
