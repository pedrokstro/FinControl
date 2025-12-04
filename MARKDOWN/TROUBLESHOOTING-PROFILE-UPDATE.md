# 🔧 Troubleshooting - Erro ao Atualizar Perfil

## 🚨 Erro: "Erro ao atualizar perfil. Tente novamente."

### 📋 Diagnóstico Rápido

#### 1. Abrir Console do Navegador (F12)

Procure por mensagens de erro no console. Você verá uma das seguintes:

#### Cenário A: Backend Offline
```
❌ Erro ao atualizar perfil: Error: Network Error
Detalhes do erro: {
  message: "Network Error",
  code: "ERR_NETWORK"
}
```

**Causa**: Backend não está rodando  
**Solução**: Iniciar o backend

```bash
# Terminal 1 - Iniciar Backend
cd backend
npm run dev

# Aguardar mensagem:
# ✅ Server running on http://localhost:3001
```

#### Cenário B: Token Expirado
```
❌ Erro ao atualizar perfil: Error: Request failed with status code 401
Detalhes do erro: {
  status: 401,
  message: "Token inválido ou expirado"
}
```

**Causa**: Sessão expirada  
**Solução**: Fazer logout e login novamente

```bash
1. Clicar em "Sair"
2. Fazer login novamente
3. Tentar atualizar perfil
```

#### Cenário C: Email Duplicado
```
❌ Erro ao atualizar perfil: Error: Request failed with status code 409
Detalhes do erro: {
  status: 409,
  message: "Email já em uso"
}
```

**Causa**: Email já cadastrado por outro usuário  
**Solução**: Usar outro email

#### Cenário D: Dados Inválidos
```
❌ Erro ao atualizar perfil: Error: Request failed with status code 400
Detalhes do erro: {
  status: 400,
  message: "Validation error"
}
```

**Causa**: Nome muito curto (< 3 caracteres) ou email inválido  
**Solução**: Verificar campos

---

## 🔍 Verificação Passo a Passo

### Passo 1: Verificar se Backend está Rodando

```bash
# Testar endpoint de health
curl http://localhost:3001/api/health

# Resposta esperada:
# {"status":"ok"}

# Se der erro "Connection refused":
# → Backend não está rodando
# → Iniciar backend: cd backend && npm run dev
```

### Passo 2: Verificar Variável de Ambiente

```bash
# Verificar arquivo .env na raiz do projeto
cat .env

# Deve conter:
VITE_API_URL=http://localhost:3001/api

# Se não existir, criar:
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Reiniciar frontend:
npm run dev
```

### Passo 3: Verificar Token no localStorage

```javascript
// Abrir Console do Navegador (F12)
// Executar:

const authStorage = localStorage.getItem('auth-storage')
console.log('Auth Storage:', JSON.parse(authStorage))

// Verificar:
// - accessToken: deve existir
// - refreshToken: deve existir
// - user: deve ter id, name, email

// Se accessToken = "demo-token":
// → Você está em modo demo (offline)
// → Alterações ficam apenas locais
// → Para usar API real, fazer login com backend rodando
```

### Passo 4: Testar Endpoint Manualmente

```bash
# Obter token do localStorage (F12 → Console)
const token = JSON.parse(localStorage.getItem('auth-storage')).state.accessToken
console.log(token)

# Testar atualização via curl
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"name":"Novo Nome","email":"demo@financeiro.com"}'

# Resposta esperada:
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "name": "Novo Nome",
#     "email": "demo@financeiro.com"
#   }
# }
```

---

## 🛠️ Soluções por Cenário

### Solução 1: Backend Offline

```bash
# Terminal 1 - Backend
cd backend
npm install  # Se primeira vez
npm run dev

# Aguardar:
# ✅ Server running on http://localhost:3001
# ✅ Database connected

# Terminal 2 - Frontend
npm run dev

# Testar novamente
```

### Solução 2: Modo Demo (Sem Backend)

Se você está usando o modo demo (backend offline), as alterações ficam apenas no localStorage.

**Para usar persistência real**:
1. Iniciar backend
2. Fazer logout
3. Fazer login novamente (agora com backend)
4. Atualizar perfil

**Identificar modo demo**:
```javascript
// Console do navegador (F12)
const token = JSON.parse(localStorage.getItem('auth-storage')).state.accessToken
console.log('Token:', token)

// Se token = "demo-token" → Modo demo
// Se token = "eyJhbGc..." → Modo real (com backend)
```

### Solução 3: Limpar Cache e Recomeçar

```javascript
// Console do navegador (F12)
localStorage.clear()
location.reload()

// Fazer login novamente
```

### Solução 4: Verificar Logs do Backend

```bash
# Terminal do backend deve mostrar:
PUT /api/users/profile 200 - 45ms

# Se mostrar erro:
PUT /api/users/profile 401 - Token inválido
PUT /api/users/profile 500 - Internal server error

# Verificar logs detalhados no terminal
```

---

## 📊 Checklist de Diagnóstico

- [ ] Backend está rodando? (`curl http://localhost:3001/api/health`)
- [ ] Frontend está rodando? (`http://localhost:3000`)
- [ ] Arquivo `.env` existe com `VITE_API_URL`?
- [ ] Token existe no localStorage?
- [ ] Token não é "demo-token"?
- [ ] Nome tem pelo menos 3 caracteres?
- [ ] Email é válido?
- [ ] Console mostra logs de "🔄 Atualizando perfil via API..."?

---

## 🎯 Teste Completo

### Teste com Backend Rodando

```bash
# 1. Iniciar Backend
cd backend
npm run dev
# Aguardar: ✅ Server running on http://localhost:3001

# 2. Iniciar Frontend (novo terminal)
cd ..
npm run dev
# Aguardar: ✅ Local: http://localhost:3000

# 3. Fazer Login
# Ir para: http://localhost:3000/login
# Email: demo@financeiro.com
# Senha: demo123

# 4. Verificar Console (F12)
# Deve mostrar: ✅ Login realizado via API

# 5. Ir para Configurações
# http://localhost:3000/settings

# 6. Alterar Nome
# Antes: "Usuário Demo"
# Depois: "Pedro Kstro"

# 7. Clicar em "Salvar alterações"

# 8. Verificar Console (F12)
# Deve mostrar:
# 🔄 Atualizando perfil via API... {name: "Pedro Kstro", email: "demo@financeiro.com"}
# ✅ Perfil atualizado com sucesso: {...}

# 9. Verificar Toast
# ✅ "Perfil atualizado com sucesso!"

# 10. Fazer Logout e Login
# Nome deve permanecer "Pedro Kstro" ✅
```

---

## 🔧 Correções Aplicadas

### 1. Logs Detalhados
Agora o console mostra:
- 🔄 Quando inicia atualização
- ✅ Quando sucesso
- ❌ Quando erro (com detalhes)

### 2. Mensagens de Erro Específicas
- **401**: "Sessão expirada. Faça login novamente."
- **409**: "Email já está em uso por outro usuário."
- **400**: "Dados inválidos. Verifique os campos."
- **Network Error**: "Servidor offline. Usando modo demo."

### 3. Fallback Automático
Se backend estiver offline, sistema:
1. Detecta erro de rede
2. Mostra toast: "Servidor offline. Usando modo demo."
3. Atualiza dados localmente
4. Mostra toast: "Perfil atualizado localmente (modo demo)"

---

## 📞 Próximos Passos

### Se Erro Persistir

1. **Copiar logs do console** (F12 → Console → Clicar com botão direito → Save as...)

2. **Verificar versão do Node.js**
   ```bash
   node --version  # Deve ser >= 16
   npm --version   # Deve ser >= 8
   ```

3. **Reinstalar dependências**
   ```bash
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Verificar banco de dados**
   ```bash
   # Conectar ao PostgreSQL
   psql -U postgres -d fincontrol
   
   # Verificar tabela users
   \d users
   
   # Verificar dados
   SELECT * FROM users;
   ```

---

## ✅ Sucesso!

Se você ver:
- ✅ Toast: "Perfil atualizado com sucesso!"
- ✅ Console: "✅ Perfil atualizado com sucesso"
- ✅ Nome alterado no header
- ✅ Após logout/login, nome permanece alterado

**Parabéns! A persistência está funcionando corretamente!** 🎉

---

## 📚 Documentação Relacionada

- **Documentação completa**: `USER-PERSISTENCE-FIX.md`
- **Guia rápido de teste**: `QUICK-TEST-GUIDE.md`
- **Código da API**: `src/services/api.ts`
- **AuthStore**: `src/store/authStore.ts`
