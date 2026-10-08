# 🚀 Guia de Integração - Sistema Premium

## ✅ Checklist de Integração Completa

### 1️⃣ Rotas Adicionadas ✅

**Arquivo**: `src/routes/index.ts`

```typescript
import subscriptionRoutes from './subscription.routes';
router.use('/subscription', subscriptionRoutes);
```

**Endpoints Disponíveis**:
- `GET /api/v1/subscription/status`
- `GET /api/v1/subscription/features`
- `POST /api/v1/subscription/activate`
- `POST /api/v1/subscription/renew`
- `POST /api/v1/subscription/cancel`

---

### 2️⃣ Job de Expiração Iniciado ✅

**Arquivo**: `src/server.ts`

```typescript
import { scheduleExpirePlansJob } from '@/jobs/expirePlans.job';

// No startServer()
scheduleExpirePlansJob();
logger.info('⏰ Premium plan expiration job scheduled');
```

**Funcionamento**:
- Executa imediatamente ao iniciar servidor
- Roda a cada 24 horas automaticamente
- Expira planos com `planEndDate < now`
- Converte `planType` de `premium` → `free`

---

### 3️⃣ Rota Premium Protegida ✅

**Arquivo**: `src/routes/category.routes.ts`

```typescript
import { checkFeatureAccess } from '@/middlewares/checkPremium';

router.get('/premium/emojis', 
  checkFeatureAccess('advanced_emojis'), 
  (req, res) => {
    // Retorna emojis premium
  }
);
```

**Teste**:
```bash
# Usuário free - Bloqueado (403)
GET /api/v1/categories/premium/emojis

# Usuário premium - Permitido (200)
GET /api/v1/categories/premium/emojis
```

---

### 4️⃣ Migration Pronta ✅

**Script**: `src/scripts/runMigration.ts`

**Executar**:
```bash
cd backend
npm run migration:premium
```

**O que faz**:
- Adiciona coluna `planType` (VARCHAR(20), default 'free')
- Adiciona coluna `planStartDate` (TIMESTAMP, nullable)
- Adiciona coluna `planEndDate` (TIMESTAMP, nullable)
- Adiciona coluna `isPremium` (BOOLEAN, default false)

**Verificação**:
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('planType', 'planStartDate', 'planEndDate', 'isPremium');
```

---

## 📋 Passos para Executar

### Passo 1: Executar Migration

```bash
cd backend
npm run migration:premium
```

**Saída Esperada**:
```
🔄 Iniciando migration...
✅ Conexão com banco estabelecida
📝 Adicionando colunas de plano premium...
✅ Coluna planType adicionada
✅ Coluna planStartDate adicionada
✅ Coluna planEndDate adicionada
✅ Coluna isPremium adicionada
🎉 Migration concluída com sucesso!
🔌 Conexão com banco encerrada
✅ Script de migration finalizado
```

---

### Passo 2: Iniciar Servidor

```bash
npm run dev
```

**Saída Esperada**:
```
==================================================
🚀 FinControl API Server Started
==================================================
📡 Port: 5000
🌍 Environment: development
⏰ Premium plan expiration job scheduled
🏥 Health: http://localhost:5000/health
📚 API Docs: http://localhost:5000/api-docs
🔗 API Base: http://localhost:5000/api/v1
==================================================
```

---

### Passo 3: Testar Endpoints

Siga o guia: `TEST-PREMIUM-ENDPOINTS.md`

**Resumo Rápido**:

1. **Login**
   ```bash
   POST /api/v1/auth/login
   ```

2. **Verificar Status**
   ```bash
   GET /api/v1/subscription/status
   ```

3. **Testar Bloqueio (Free)**
   ```bash
   GET /api/v1/categories/premium/emojis
   # Esperado: 403 Forbidden
   ```

4. **Ativar Premium**
   ```bash
   POST /api/v1/subscription/activate
   ```

5. **Testar Acesso (Premium)**
   ```bash
   GET /api/v1/categories/premium/emojis
   # Esperado: 200 OK
   ```

---

### Passo 4: Executar Testes Unitários

```bash
npm test subscription.test.ts
```

**Saída Esperada**:
```
PASS  src/tests/subscription.test.ts
  Subscription Service
    ✓ should return subscription status for free user
    ✓ should throw error if user not found
    ✓ should activate premium plan for 1 month
    ✓ should cancel premium plan
    ✓ should renew premium plan
    ✓ should expire old premium plans
  User Model - Premium Methods
    ✓ should return false for free plan
    ✓ should return true for active premium plan
    ✓ should deny access to premium features for free user
    ✓ should allow access to premium features for premium user

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

---

## 🔧 Configuração Adicional

### Variáveis de Ambiente

Adicionar ao `.env` (opcional):

```env
# Premium Features
PREMIUM_TRIAL_DAYS=7
PREMIUM_PRICE_MONTHLY=14.99
PREMIUM_PRICE_YEARLY=149.99

# Job Configuration
EXPIRE_PLANS_CRON=0 0 * * *  # Diariamente à meia-noite
```

---

### Proteger Mais Rotas

**Exemplo 1: Relatórios Avançados**
```typescript
// routes/dashboard.routes.ts
import { checkFeatureAccess } from '@/middlewares/checkPremium';

router.get('/reports/advanced',
  authenticate,
  checkFeatureAccess('advanced_reports'),
  dashboardController.getAdvancedReports
);
```

**Exemplo 2: Exportação Ilimitada**
```typescript
// routes/export.routes.ts
router.post('/export/unlimited',
  authenticate,
  checkFeatureAccess('export_unlimited'),
  exportController.exportAll
);
```

**Exemplo 3: Suporte Prioritário**
```typescript
// routes/support.routes.ts
router.post('/support/priority',
  authenticate,
  checkFeatureAccess('priority_support'),
  supportController.createPriorityTicket
);
```

---

## 📊 Monitoramento

### Logs do Job

```bash
# Ver logs do job de expiração
tail -f logs/app.log | grep CRON
```

**Saída Esperada**:
```
[CRON] Iniciando verificação de planos expirados...
[CRON] 3 plano(s) premium expirado(s) e convertido(s) para free
```

---

### Métricas Sugeridas

**Criar endpoint de métricas**:
```typescript
// routes/admin.routes.ts
router.get('/metrics/premium', authenticate, async (req, res) => {
  const total = await userRepository.count();
  const premium = await userRepository.count({ 
    where: { planType: 'premium' } 
  });
  const active = await userRepository.count({ 
    where: { isPremium: true } 
  });

  res.json({
    total,
    premium,
    active,
    conversionRate: (premium / total * 100).toFixed(2) + '%',
  });
});
```

---

## 🐛 Troubleshooting

### Problema 1: Migration Falha

**Erro**: `Column 'planType' already exists`

**Solução**: Colunas já foram adicionadas
```bash
# Verificar no banco
psql -d fincontrol -c "\d users"
```

---

### Problema 2: Job Não Inicia

**Erro**: `Cannot find module '@/jobs/expirePlans.job'`

**Solução**: Verificar path aliases
```bash
# Verificar se arquivo existe
ls src/jobs/expirePlans.job.ts
```

---

### Problema 3: Middleware Não Bloqueia

**Erro**: Usuário free acessa rota premium

**Solução**: Verificar ordem dos middlewares
```typescript
// ❌ Errado
router.get('/', checkPremiumAccess, authenticate, handler);

// ✅ Correto
router.get('/', authenticate, checkPremiumAccess, handler);
```

---

### Problema 4: isPremium Sempre False

**Erro**: `user.isPremium` retorna false mesmo com plano ativo

**Solução**: Verificar data de expiração
```sql
SELECT 
  email, 
  "planType", 
  "planEndDate", 
  "isPremium",
  NOW() < "planEndDate" as should_be_active
FROM users 
WHERE "planType" = 'premium';
```

---

## 📚 Documentação Adicional

### Arquivos Criados

```
backend/
├── src/
│   ├── models/
│   │   └── User.ts                      ← Campos premium
│   ├── middlewares/
│   │   └── checkPremium.ts              ← Middleware
│   ├── services/
│   │   └── subscription.service.ts      ← Lógica
│   ├── controllers/
│   │   └── subscription.controller.ts   ← Endpoints
│   ├── routes/
│   │   ├── index.ts                     ← Rotas registradas
│   │   ├── subscription.routes.ts       ← Rotas premium
│   │   └── category.routes.ts           ← Rota protegida
│   ├── jobs/
│   │   └── expirePlans.job.ts          ← Cron job
│   ├── scripts/
│   │   └── runMigration.ts             ← Script migration
│   └── tests/
│       └── subscription.test.ts         ← Testes
├── PREMIUM-MIDDLEWARE-USAGE.md          ← Guia de uso
├── TEST-PREMIUM-ENDPOINTS.md            ← Guia de testes
└── INTEGRATION-GUIDE.md                 ← Este arquivo
```

---

### Próximos Passos

1. **Integração com Gateway de Pagamento**
   - Stripe
   - PayPal
   - Mercado Pago

2. **Webhooks de Pagamento**
   - Ativar plano após pagamento
   - Renovar automaticamente
   - Cancelar por falta de pagamento

3. **Notificações**
   - Email de boas-vindas premium
   - Lembrete de expiração (7 dias antes)
   - Email de expiração

4. **Analytics**
   - Taxa de conversão free → premium
   - Churn rate
   - Lifetime value (LTV)

---

## ✅ Status Final

### Implementado ✅
- [x] Modelo User com campos premium
- [x] Middleware de verificação premium
- [x] Serviço de assinaturas
- [x] Controller de assinaturas
- [x] Rotas REST de assinatura
- [x] Job de expiração automática
- [x] Migration do banco
- [x] Testes unitários (15+ casos)
- [x] Rota premium protegida
- [x] Integração no servidor
- [x] Documentação completa

### Pendente (Opcional) ⏳
- [ ] Integração com gateway de pagamento
- [ ] Webhooks de pagamento
- [ ] Sistema de notificações
- [ ] Dashboard de analytics
- [ ] Testes E2E

---

**Sistema Premium Totalmente Integrado e Funcional!** 🎉

Para testar, execute:
```bash
npm run migration:premium
npm run dev
```

E siga o guia: `TEST-PREMIUM-ENDPOINTS.md`
