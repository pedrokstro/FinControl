# 🧪 Teste dos Endpoints Premium

## Pré-requisitos

1. **Servidor rodando**
   ```bash
   cd backend
   npm run dev
   ```

2. **Usuário autenticado**
   - Email: `demo@financeiro.com`
   - Senha: `demo123`

---

## 📝 Roteiro de Testes

### 1️⃣ Login e Obter Token

```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "demo@financeiro.com",
  "password": "demo123"
}
```

**Resposta Esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "demo@financeiro.com",
      "isPremium": true
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "..."
  }
}
```

**Copiar o `accessToken` para usar nos próximos testes!**

---

### 2️⃣ Verificar Status da Assinatura

```bash
GET http://localhost:5000/api/v1/subscription/status
Authorization: Bearer <SEU_TOKEN>
```

**Resposta Esperada (Usuário Free):**
```json
{
  "success": true,
  "data": {
    "planType": "free",
    "isPremium": false,
    "isActive": false,
    "planStartDate": null,
    "planEndDate": null,
    "daysRemaining": null,
    "features": [
      "basic_categories",
      "basic_transactions",
      "basic_reports"
    ]
  }
}
```

---

### 3️⃣ Testar Acesso Negado (Usuário Free)

```bash
GET http://localhost:5000/api/v1/categories/premium/emojis
Authorization: Bearer <SEU_TOKEN>
```

**Resposta Esperada (403 Forbidden):**
```json
{
  "success": false,
  "message": "Acesso negado. A funcionalidade \"advanced_emojis\" requer um plano Premium ativo.",
  "code": "FEATURE_PREMIUM_REQUIRED",
  "feature": "advanced_emojis",
  "planType": "free",
  "planEndDate": null
}
```

✅ **SUCESSO**: Middleware bloqueou acesso corretamente!

---

### 4️⃣ Ativar Plano Premium

```bash
POST http://localhost:5000/api/v1/subscription/activate
Authorization: Bearer <SEU_TOKEN>
Content-Type: application/json

{
  "durationMonths": 1
}
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Plano Premium ativado com sucesso!",
  "data": {
    "planType": "premium",
    "planStartDate": "2024-11-07T...",
    "planEndDate": "2024-12-07T...",
    "isPremium": true
  }
}
```

✅ **SUCESSO**: Plano premium ativado!

---

### 5️⃣ Verificar Status Novamente

```bash
GET http://localhost:5000/api/v1/subscription/status
Authorization: Bearer <SEU_TOKEN>
```

**Resposta Esperada (Usuário Premium):**
```json
{
  "success": true,
  "data": {
    "planType": "premium",
    "isPremium": true,
    "isActive": true,
    "planStartDate": "2024-11-07T...",
    "planEndDate": "2024-12-07T...",
    "daysRemaining": 30,
    "features": [
      "basic_categories",
      "basic_transactions",
      "basic_reports",
      "advanced_emojis",
      "custom_categories",
      "advanced_reports",
      "export_unlimited",
      "priority_support"
    ]
  }
}
```

✅ **SUCESSO**: Status atualizado para premium!

---

### 6️⃣ Testar Acesso Permitido (Usuário Premium)

```bash
GET http://localhost:5000/api/v1/categories/premium/emojis
Authorization: Bearer <SEU_TOKEN>
```

**Resposta Esperada (200 OK):**
```json
{
  "success": true,
  "data": {
    "emojis": [
      "🎯", "🎨", "🎭", "🎪", "🎬", "🎮", "🎲", "🎰", "🎳", "🎸",
      "🎹", "🎺", "🎻", "🎼", "🎤", "🎧", "🎵", "🎶", "🎷", "🥁",
      "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾", "🥎",
      "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍"
    ],
    "isPremium": true
  }
}
```

✅ **SUCESSO**: Acesso premium permitido!

---

### 7️⃣ Obter Features Disponíveis

```bash
GET http://localhost:5000/api/v1/subscription/features
Authorization: Bearer <SEU_TOKEN>
```

**Resposta Esperada:**
```json
{
  "success": true,
  "data": {
    "features": [
      "basic_categories",
      "basic_transactions",
      "basic_reports",
      "advanced_emojis",
      "custom_categories",
      "advanced_reports",
      "export_unlimited",
      "priority_support"
    ],
    "isPremium": true
  }
}
```

---

### 8️⃣ Renovar Plano Premium

```bash
POST http://localhost:5000/api/v1/subscription/renew
Authorization: Bearer <SEU_TOKEN>
Content-Type: application/json

{
  "durationMonths": 3
}
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Plano Premium renovado com sucesso!",
  "data": {
    "planType": "premium",
    "planStartDate": "2024-11-07T...",
    "planEndDate": "2025-02-07T...",
    "isPremium": true
  }
}
```

---

### 9️⃣ Cancelar Plano Premium

```bash
POST http://localhost:5000/api/v1/subscription/cancel
Authorization: Bearer <SEU_TOKEN>
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Plano Premium cancelado com sucesso",
  "data": {
    "planType": "free",
    "isPremium": false
  }
}
```

---

### 🔟 Verificar Bloqueio Após Cancelamento

```bash
GET http://localhost:5000/api/v1/categories/premium/emojis
Authorization: Bearer <SEU_TOKEN>
```

**Resposta Esperada (403 Forbidden):**
```json
{
  "success": false,
  "message": "Acesso negado. A funcionalidade \"advanced_emojis\" requer um plano Premium ativo.",
  "code": "FEATURE_PREMIUM_REQUIRED",
  "feature": "advanced_emojis",
  "planType": "free",
  "planEndDate": "..."
}
```

✅ **SUCESSO**: Acesso bloqueado após cancelamento!

---

## 📊 Checklist de Validação

### Endpoints de Assinatura
- [ ] `GET /subscription/status` retorna status correto
- [ ] `POST /subscription/activate` ativa plano premium
- [ ] `POST /subscription/renew` renova plano existente
- [ ] `POST /subscription/cancel` cancela plano premium
- [ ] `GET /subscription/features` lista features disponíveis

### Middleware Premium
- [ ] Bloqueia acesso de usuários free a rotas premium
- [ ] Permite acesso de usuários premium a rotas premium
- [ ] Retorna erro 403 com código `PREMIUM_REQUIRED`
- [ ] Retorna erro 403 com código `FEATURE_PREMIUM_REQUIRED`

### Validação de Plano
- [ ] `isPlanActive()` retorna false para planos expirados
- [ ] `hasFeatureAccess()` valida features corretamente
- [ ] Plano expira automaticamente após data de fim
- [ ] Job de expiração roda diariamente

### Integração
- [ ] Rotas de assinatura registradas em `/api/v1/subscription`
- [ ] Job de expiração iniciado ao subir servidor
- [ ] Migration executada com sucesso
- [ ] Testes unitários passando

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/middlewares/checkPremium'"
**Solução**: Verificar se o arquivo foi criado corretamente
```bash
ls backend/src/middlewares/checkPremium.ts
```

### Erro: "Column 'planType' does not exist"
**Solução**: Executar migration
```bash
cd backend
npm run migration
```

### Erro: "User is not premium" mas deveria ser
**Solução**: Verificar data de expiração
```sql
SELECT id, email, "planType", "planEndDate", "isPremium" 
FROM users 
WHERE email = 'demo@financeiro.com';
```

---

## 🎯 Resultado Esperado

Ao final dos testes, você deve ter:

✅ **Endpoints funcionando**
- Status de assinatura
- Ativação de premium
- Renovação de plano
- Cancelamento de plano
- Lista de features

✅ **Middleware protegendo rotas**
- Bloqueio de usuários free
- Acesso de usuários premium
- Mensagens de erro claras

✅ **Validação de plano**
- Verificação de expiração
- Controle de features
- Expiração automática

✅ **Integração completa**
- Rotas registradas
- Job rodando
- Migration aplicada
- Testes passando

---

**Sistema premium totalmente funcional e testado!** 🚀
