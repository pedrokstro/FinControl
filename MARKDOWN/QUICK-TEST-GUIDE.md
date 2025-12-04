# 🧪 Guia Rápido de Teste - Persistência de Dados

## ⚡ Teste Rápido (5 minutos)

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend
```bash
cd ..
npm run dev
```

### 3. Testar Persistência de Nome

#### 3.1 Criar Usuário (se necessário)
```bash
# Abra http://localhost:3000/login
# Clique em "Criar conta" (se disponível)
# Ou use credenciais demo:
Email: demo@financeiro.com
Senha: demo123
```

#### 3.2 Alterar Nome
```bash
1. Login → http://localhost:3000
2. Ir para Configurações (Settings)
3. Alterar nome:
   Antes: "Usuário Demo"
   Depois: "João Pedro Silva"
4. Clicar em "Salvar alterações"
5. Verificar toast: "Perfil atualizado com sucesso!" ✅
```

#### 3.3 Verificar Persistência
```bash
1. Fazer logout
2. Fazer login novamente
3. Ir para Configurações
4. Verificar nome: "João Pedro Silva" ✅
```

### 4. Verificar no Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres -d fincontrol

# Verificar dados
SELECT id, name, email, updated_at FROM users;

# Resultado esperado:
# name = "João Pedro Silva"
# updated_at = timestamp recente
```

---

## 🔍 Verificação de Requisições HTTP

### Abrir DevTools (F12)

#### 1. Network Tab
```
Filtrar por: XHR
Procurar por:
- POST /api/auth/login       → Status 200
- GET  /api/users/profile    → Status 200
- PUT  /api/users/profile    → Status 200
```

#### 2. Console Tab
```
Procurar por:
- "Erro ao atualizar perfil" → NÃO deve aparecer ✅
- "Perfil atualizado"        → Deve aparecer ✅
```

---

## 🎯 Checklist Rápido

- [ ] Backend rodando (http://localhost:3001)
- [ ] Frontend rodando (http://localhost:3000)
- [ ] Login funciona
- [ ] Alterar nome funciona
- [ ] Toast de sucesso aparece
- [ ] Logout funciona
- [ ] Login novamente funciona
- [ ] Nome permanece alterado ✅

---

## ❌ Problemas Comuns

### "Erro ao atualizar perfil"
```bash
# Verificar se backend está rodando
curl http://localhost:3001/api/health

# Se não responder, iniciar backend
cd backend
npm run dev
```

### "Token inválido"
```bash
# Fazer logout e login novamente
# Ou limpar localStorage:
localStorage.clear()
```

### "CORS error"
```bash
# Verificar URL da API em .env
VITE_API_URL=http://localhost:3001/api

# Reiniciar frontend
npm run dev
```

---

## ✅ Teste Passou!

Se todos os itens do checklist estão marcados, a persistência está funcionando corretamente! 🎉

**Próximos passos**: Ver documentação completa em `USER-PERSISTENCE-FIX.md`
