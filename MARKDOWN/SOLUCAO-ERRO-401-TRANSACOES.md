# Solução: Erro 401 ao Adicionar Transação

## Problema

Ao tentar adicionar uma transação, ocorria o erro:
```
AxiosError {message: 'Request failed with status code 401', name: 'AxiosError', code: 'ERR_BAD_REQUEST'}
```

## Causa

O interceptor do Axios estava buscando o token de autenticação da chave errada no localStorage:

**Código Antigo (ERRADO):**
```typescript
const token = localStorage.getItem('accessToken');
```

**Problema:** O `authStore` (Zustand) salva os dados com a chave `'auth-storage'`, não `'accessToken'` diretamente.

## Solução

Atualizado o `src/config/api.ts` para buscar o token do Zustand storage corretamente:

### 1. Interceptor de Request

**Antes:**
```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // ❌ ERRADO
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

**Depois:**
```typescript
api.interceptors.request.use(
  (config) => {
    // Buscar token do Zustand storage
    const authStorage = localStorage.getItem('auth-storage'); // ✅ CORRETO
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const token = state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Erro ao parsear auth storage:', error);
      }
    }
    return config;
  }
);
```

### 2. Interceptor de Response (Refresh Token)

Também atualizado para buscar e atualizar o `refreshToken` no Zustand storage:

```typescript
// Buscar refreshToken do Zustand storage
const authStorage = localStorage.getItem('auth-storage');
if (authStorage) {
  const { state } = JSON.parse(authStorage);
  const refreshToken = state?.refreshToken;
  
  if (refreshToken) {
    // Renovar token...
    
    // Atualizar token no Zustand storage
    const updatedState = {
      ...state,
      accessToken: newAccessToken,
    };
    localStorage.setItem('auth-storage', JSON.stringify({ state: updatedState }));
  }
}
```

## Estrutura do Zustand Storage

O Zustand persiste os dados no formato:
```json
{
  "state": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "isAuthenticated": true,
    "isPremium": false
  },
  "version": 0
}
```

## Resultado

✅ **Token agora é enviado corretamente em todas as requisições**
✅ **Transações podem ser criadas, editadas e deletadas**
✅ **Refresh token funciona automaticamente**
✅ **Todas as chamadas à API estão autenticadas**

## Como Testar

1. Faça login
2. Tente criar uma transação
3. **Deve funcionar sem erro 401!** ✅

## Arquivo Modificado

- `src/config/api.ts` - Interceptores do Axios corrigidos
