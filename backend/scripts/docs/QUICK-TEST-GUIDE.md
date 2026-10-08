# 🚀 Guia Rápido de Teste - Sistema Premium

## ✅ Pré-requisitos Completos

- [x] Migration executada (`npm run migration:premium`)
- [x] Servidor rodando (`npm run dev`)
- [x] Job de expiração iniciado (ver log: "⏰ Premium plan expiration job scheduled")

---

## 🎯 Teste em 5 Minutos

### Opção 1: Usar o Arquivo HTTP (Recomendado)

**Arquivo**: `test-premium.http`

1. **Abrir o arquivo** `test-premium.http`
2. **Executar requisição 1** (Login)
3. **Copiar o token** da resposta
4. **Colar na variável** `@token` no topo do arquivo
5. **Executar as outras requisições** em ordem

**Extensão VSCode**: REST Client
- Instalar: `Ctrl+P` → `ext install humao.rest-client`
- Clicar em "Send Request" acima de cada requisição

---

### Opção 2: Usar cURL (Terminal)

#### 1️⃣ Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@financeiro.com",
    "password": "demo123"
  }'
```

**Copie o `accessToken` da resposta!**

---

#### 2️⃣ Verificar Status (Free)
```bash
TOKEN="SEU_TOKEN_AQUI"

curl http://localhost:5000/api/v1/subscription/status \
  -H "Authorization: Bearer $TOKEN"
```

**Esperado**: `"planType": "free"`, `"isPremium": false`

---

#### 3️⃣ Testar Bloqueio (403)
```bash
curl http://localhost:5000/api/v1/categories/premium/emojis \
  -H "Authorization: Bearer $TOKEN"
```

**Esperado**: Status 403, código `FEATURE_PREMIUM_REQUIRED`

---

#### 4️⃣ Ativar Premium
```bash
curl -X POST http://localhost:5000/api/v1/subscription/activate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"durationMonths": 1}'
```

**Esperado**: `"message": "Plano Premium ativado com sucesso!"`

---

#### 5️⃣ Verificar Status (Premium)
```bash
curl http://localhost:5000/api/v1/subscription/status \
  -H "Authorization: Bearer $TOKEN"
```

**Esperado**: `"planType": "premium"`, `"isPremium": true`

---

#### 6️⃣ Testar Acesso Permitido (200)
```bash
curl http://localhost:5000/api/v1/categories/premium/emojis \
  -H "Authorization: Bearer $TOKEN"
```

**Esperado**: Status 200, lista de emojis premium

---

### Opção 3: Usar Postman/Insomnia

#### Importar Collection

**Criar nova requisição para cada endpoint**:

1. **Login**
   - `POST` `http://localhost:5000/api/v1/auth/login`
   - Body: `{"email": "demo@financeiro.com", "password": "demo123"}`

2. **Status**
   - `GET` `http://localhost:5000/api/v1/subscription/status`
   - Header: `Authorization: Bearer <TOKEN>`

3. **Ativar Premium**
   - `POST` `http://localhost:5000/api/v1/subscription/activate`
   - Header: `Authorization: Bearer <TOKEN>`
   - Body: `{"durationMonths": 1}`

4. **Emojis Premium**
   - `GET` `http://localhost:5000/api/v1/categories/premium/emojis`
   - Header: `Authorization: Bearer <TOKEN>`

---

## 📊 Resultados Esperados

### ✅ Teste 1: Login
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "demo@financeiro.com",
      "isPremium": false
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "..."
  }
}
```

---

### ✅ Teste 2: Status Free
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

### ✅ Teste 3: Bloqueio (403)
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

**Status HTTP**: 403 Forbidden ✅

---

### ✅ Teste 4: Ativação Premium
```json
{
  "success": true,
  "message": "Plano Premium ativado com sucesso!",
  "data": {
    "planType": "premium",
    "planStartDate": "2024-11-07T16:30:00.000Z",
    "planEndDate": "2024-12-07T16:30:00.000Z",
    "isPremium": true
  }
}
```

---

### ✅ Teste 5: Status Premium
```json
{
  "success": true,
  "data": {
    "planType": "premium",
    "isPremium": true,
    "isActive": true,
    "planStartDate": "2024-11-07T16:30:00.000Z",
    "planEndDate": "2024-12-07T16:30:00.000Z",
    "daysRemaining": 30,
    "features": [
      "basic_categories",
      "basic_transactions",
      "basic_reports",
      "advanced_emojis",      ← NOVO!
      "custom_categories",     ← NOVO!
      "advanced_reports",      ← NOVO!
      "export_unlimited",      ← NOVO!
      "priority_support"       ← NOVO!
    ]
  }
}
```

---

### ✅ Teste 6: Acesso Permitido (200)
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

**Status HTTP**: 200 OK ✅

---

## 🎯 Checklist de Validação

### Funcionalidades Básicas
- [ ] Login retorna token válido
- [ ] Status retorna dados corretos
- [ ] Middleware de autenticação funciona

### Sistema Premium
- [ ] Status inicial é "free"
- [ ] Usuário free é bloqueado (403)
- [ ] Ativação muda status para "premium"
- [ ] Features premium são listadas
- [ ] Usuário premium tem acesso (200)
- [ ] Cancelamento volta para "free"
- [ ] Bloqueio funciona após cancelamento

### Job de Expiração
- [ ] Job iniciou ao subir servidor
- [ ] Log aparece no console
- [ ] Planos expirados são convertidos

---

## 🐛 Problemas Comuns

### Erro: "Cannot POST /api/v1/subscription/activate"

**Causa**: Rotas não registradas

**Solução**: Verificar `src/routes/index.ts`
```typescript
import subscriptionRoutes from './subscription.routes';
router.use('/subscription', subscriptionRoutes);
```

---

### Erro: "Column 'planType' does not exist"

**Causa**: Migration não executada

**Solução**: Executar migration
```bash
npm run migration:premium
```

---

### Erro: "User is not premium" mesmo após ativar

**Causa**: Data de expiração no passado

**Solução**: Verificar no banco
```sql
SELECT email, "planType", "planEndDate", "isPremium"
FROM users 
WHERE email = 'demo@financeiro.com';
```

---

### Erro: 401 Unauthorized

**Causa**: Token inválido ou expirado

**Solução**: Fazer login novamente e obter novo token

---

## 📊 Verificar no Banco de Dados

### Ver Status do Usuário
```sql
SELECT 
  email,
  "planType",
  "planStartDate",
  "planEndDate",
  "isPremium",
  NOW() < "planEndDate" as is_active
FROM users 
WHERE email = 'demo@financeiro.com';
```

### Ver Todos os Usuários Premium
```sql
SELECT 
  email,
  "planType",
  "planEndDate",
  "isPremium"
FROM users 
WHERE "planType" = 'premium'
ORDER BY "planEndDate" DESC;
```

---

## 🎉 Sucesso!

Se todos os testes passaram, você tem:

✅ **Sistema Premium Funcionando**
- Endpoints de assinatura
- Middleware de proteção
- Validação de plano
- Job de expiração

✅ **Rotas Protegidas**
- Bloqueio de usuários free
- Acesso de usuários premium
- Mensagens de erro claras

✅ **Integração Completa**
- Rotas registradas
- Job rodando
- Migration aplicada
- Tudo testado

---

## 🚀 Próximos Passos

### 1. Proteger Mais Rotas
```typescript
// Exemplo: Relatórios avançados
router.get('/reports/advanced',
  authenticate,
  checkFeatureAccess('advanced_reports'),
  reportController.getAdvanced
);
```

### 2. Adicionar Novas Features
```typescript
// Em User.ts
const premiumFeatures = [
  'advanced_emojis',
  'custom_categories',
  'advanced_reports',
  'export_unlimited',
  'priority_support',
  'nova_feature',  // ← Adicionar aqui
];
```

### 3. Integrar com Frontend
```typescript
// Verificar status premium
const { data } = await api.get('/subscription/status');
if (data.isPremium) {
  // Mostrar features premium
}
```

---

**Sistema testado e funcionando!** 🎊

Use o arquivo `test-premium.http` para testes rápidos!
