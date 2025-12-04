# 🚀 Como Usar a API FinControl

## ✅ Login Realizado com Sucesso!

**Usuário Demo**:
- Email: `demo@financeiro.com`
- Senha: `demo123`

---

## 🌐 3 Formas de Acessar a API

### 1️⃣ Swagger UI (RECOMENDADO - Mais Fácil)

**Abra no navegador**: http://localhost:5000/api-docs

#### Passo a Passo:

1. **Fazer Login**:
   - Encontre `POST /api/v1/auth/login`
   - Clique em "Try it out"
   - Cole no corpo:
     ```json
     {
       "email": "demo@financeiro.com",
       "password": "demo123"
     }
     ```
   - Clique em "Execute"
   - Copie o `accessToken` da resposta

2. **Autorizar**:
   - Clique no botão "Authorize" 🔒 (no topo da página)
   - Cole: `Bearer SEU_TOKEN_AQUI`
   - Clique em "Authorize"
   - Clique em "Close"

3. **Testar Endpoints**:
   - Agora você pode testar qualquer endpoint!
   - Exemplos:
     - `GET /api/v1/dashboard` - Ver resumo financeiro
     - `GET /api/v1/categories` - Ver categorias
     - `GET /api/v1/transactions` - Ver transações
     - `POST /api/v1/transactions` - Criar transação

---

### 2️⃣ PowerShell (Script Pronto)

Execute o script de teste:
```powershell
.\test-login.ps1
```

Isso vai:
- ✅ Fazer login
- ✅ Mostrar o token
- ✅ Exibir dados do usuário

---

### 3️⃣ Postman ou Insomnia

#### Importar Collection:

Crie uma requisição:

**Login**:
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "demo@financeiro.com",
  "password": "demo123"
}
```

**Dashboard** (use o token do login):
```
GET http://localhost:5000/api/v1/dashboard
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 📊 Endpoints Disponíveis

### Autenticação (Não requer token)
- `POST /api/v1/auth/register` - Criar conta
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Logout

### Dashboard (Requer token)
- `GET /api/v1/dashboard` - Resumo financeiro do mês
- `GET /api/v1/dashboard?month=10&year=2025` - Mês específico

### Usuários (Requer token)
- `GET /api/v1/users/me` - Ver perfil
- `PUT /api/v1/users/me` - Atualizar perfil
- `PUT /api/v1/users/me/password` - Alterar senha
- `POST /api/v1/users/me/avatar` - Upload de avatar

### Categorias (Requer token)
- `GET /api/v1/categories` - Listar todas
- `GET /api/v1/categories?type=income` - Só receitas
- `GET /api/v1/categories?type=expense` - Só despesas
- `POST /api/v1/categories` - Criar categoria
- `GET /api/v1/categories/:id` - Ver uma categoria
- `PUT /api/v1/categories/:id` - Atualizar categoria
- `DELETE /api/v1/categories/:id` - Deletar categoria

### Transações (Requer token)
- `GET /api/v1/transactions` - Listar todas
- `GET /api/v1/transactions?month=11&year=2025` - Filtrar por mês
- `GET /api/v1/transactions?type=income` - Só receitas
- `GET /api/v1/transactions?categoryId=xxx` - Por categoria
- `GET /api/v1/transactions?page=1&limit=10` - Paginação
- `POST /api/v1/transactions` - Criar transação
- `GET /api/v1/transactions/:id` - Ver uma transação
- `PUT /api/v1/transactions/:id` - Atualizar transação
- `DELETE /api/v1/transactions/:id` - Deletar transação

---

## 💡 Exemplos Práticos

### Criar uma Transação de Receita
```json
POST /api/v1/transactions
Authorization: Bearer SEU_TOKEN

{
  "type": "income",
  "amount": 5000,
  "description": "Salário",
  "date": "2025-11-06T00:00:00.000Z",
  "categoryId": "ID_DA_CATEGORIA_SALARIO"
}
```

### Criar uma Transação de Despesa
```json
POST /api/v1/transactions
Authorization: Bearer SEU_TOKEN

{
  "type": "expense",
  "amount": 150,
  "description": "Supermercado",
  "date": "2025-11-06T00:00:00.000Z",
  "categoryId": "ID_DA_CATEGORIA_ALIMENTACAO"
}
```

### Criar uma Categoria
```json
POST /api/v1/categories
Authorization: Bearer SEU_TOKEN

{
  "name": "Investimentos",
  "type": "income",
  "color": "#10b981",
  "icon": "TrendingUp"
}
```

---

## 🎯 Dados Demo Já Criados

O usuário demo já possui:

### 12 Categorias:
**Receitas**:
- Salário
- Freelance
- Investimentos
- Outros

**Despesas**:
- Alimentação
- Transporte
- Moradia
- Saúde
- Educação
- Lazer
- Compras
- Contas

### 8 Transações de Exemplo:
- Salário: R$ 5.000
- Projeto freelance: R$ 1.500
- Supermercado: R$ 350
- Combustível: R$ 150
- Aluguel: R$ 1.200
- Plano de saúde: R$ 200
- Cinema: R$ 80
- Conta de luz: R$ 250

---

## 🔧 URLs Importantes

| Serviço | URL |
|---------|-----|
| **Swagger UI** | http://localhost:5000/api-docs |
| **Health Check** | http://localhost:5000/health |
| **API Base** | http://localhost:5000/api/v1 |

---

## 🆘 Problemas Comuns

### "Token expirado"
- O access token expira em 15 minutos
- Use o refresh token ou faça login novamente

### "Unauthorized"
- Verifique se colocou "Bearer " antes do token
- Exemplo: `Bearer eyJhbGc...`

### "Categoria não encontrada"
- Liste as categorias primeiro: `GET /api/v1/categories`
- Use o `id` correto da categoria

---

## 🎉 Próximos Passos

1. **Explore no Swagger**: http://localhost:5000/api-docs
2. **Teste criar transações**
3. **Veja o dashboard atualizar**
4. **Integre com o frontend React**

---

**🚀 API 100% funcional e pronta para uso!**
