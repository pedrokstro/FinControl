# 🔐 Guia de Uso - Middleware Premium

## Como Proteger Rotas com Verificação Premium

### Exemplo 1: Proteger Rota Completa

```typescript
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { checkPremiumAccess } from '../middlewares/checkPremium';

const router = Router();

// Rota que requer premium
router.get('/advanced-reports', 
  authenticate,           // 1. Verificar autenticação
  checkPremiumAccess,     // 2. Verificar se é premium
  (req, res) => {
    // Usuário autenticado E premium
    res.json({ data: 'Relatório avançado' });
  }
);
```

### Exemplo 2: Proteger Feature Específica

```typescript
import { checkFeatureAccess } from '../middlewares/checkPremium';

// Rota que requer feature específica
router.post('/categories/emoji',
  authenticate,
  checkFeatureAccess('advanced_emojis'),  // Verificar feature
  (req, res) => {
    // Usuário tem acesso a emojis avançados
    res.json({ success: true });
  }
);
```

### Exemplo 3: Múltiplas Features

```typescript
// Exportar dados (premium)
router.get('/export/unlimited',
  authenticate,
  checkFeatureAccess('export_unlimited'),
  exportController.exportAll
);

// Suporte prioritário (premium)
router.post('/support/priority',
  authenticate,
  checkFeatureAccess('priority_support'),
  supportController.createPriorityTicket
);
```

---

## Features Disponíveis

### Features Premium
- `advanced_emojis` - Emojis avançados
- `custom_categories` - Categorias customizadas
- `advanced_reports` - Relatórios avançados
- `export_unlimited` - Exportação ilimitada
- `priority_support` - Suporte prioritário

### Features Free
- `basic_categories` - Categorias básicas
- `basic_transactions` - Transações básicas
- `basic_reports` - Relatórios básicos

---

## Respostas de Erro

### Usuário Não Premium

```json
{
  "success": false,
  "message": "Acesso negado. Esta funcionalidade requer um plano Premium ativo.",
  "code": "PREMIUM_REQUIRED",
  "planType": "free",
  "planEndDate": null
}
```

### Feature Específica Bloqueada

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

---

## Exemplo Completo: Rota de Categorias

```typescript
// routes/category.routes.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { checkFeatureAccess } from '../middlewares/checkPremium';
import { categoryController } from '../controllers/category.controller';

const router = Router();

// Rotas básicas (free)
router.get('/', authenticate, categoryController.getAll);
router.post('/', authenticate, categoryController.create);
router.put('/:id', authenticate, categoryController.update);
router.delete('/:id', authenticate, categoryController.delete);

// Rotas premium
router.post('/emoji',
  authenticate,
  checkFeatureAccess('advanced_emojis'),
  categoryController.createWithEmoji
);

router.post('/custom',
  authenticate,
  checkFeatureAccess('custom_categories'),
  categoryController.createCustom
);

export default router;
```

---

## Testando Localmente

### 1. Ativar Premium para Usuário

```bash
POST http://localhost:5000/api/v1/subscription/activate
Authorization: Bearer <token>
Content-Type: application/json

{
  "durationMonths": 1
}
```

### 2. Verificar Status

```bash
GET http://localhost:5000/api/v1/subscription/status
Authorization: Bearer <token>
```

### 3. Testar Rota Premium

```bash
GET http://localhost:5000/api/v1/advanced-reports
Authorization: Bearer <token>
```

---

## Boas Práticas

### ✅ Fazer

1. **Sempre usar `authenticate` antes de `checkPremiumAccess`**
   ```typescript
   router.get('/premium', authenticate, checkPremiumAccess, handler);
   ```

2. **Usar `checkFeatureAccess` para features específicas**
   ```typescript
   router.post('/emoji', authenticate, checkFeatureAccess('advanced_emojis'), handler);
   ```

3. **Documentar quais rotas são premium**
   ```typescript
   /**
    * @route   GET /api/reports/advanced
    * @desc    Relatórios avançados
    * @access  Private + Premium
    */
   ```

### ❌ Evitar

1. **Não usar `checkPremiumAccess` sem `authenticate`**
   ```typescript
   // ❌ Errado
   router.get('/premium', checkPremiumAccess, handler);
   
   // ✅ Correto
   router.get('/premium', authenticate, checkPremiumAccess, handler);
   ```

2. **Não verificar premium no controller**
   ```typescript
   // ❌ Evitar verificação manual
   async handler(req, res) {
     if (!user.isPremium) return res.status(403).json(...);
   }
   
   // ✅ Usar middleware
   router.get('/', authenticate, checkPremiumAccess, handler);
   ```

---

## Integração com Frontend

### Verificar Status Premium

```typescript
// Frontend
const checkPremiumStatus = async () => {
  const response = await api.get('/subscription/status');
  return response.data.isPremium;
};
```

### Tratar Erro Premium

```typescript
try {
  await api.post('/categories/emoji', data);
} catch (error) {
  if (error.response?.data?.code === 'PREMIUM_REQUIRED') {
    // Mostrar modal de upgrade
    showUpgradeModal();
  }
}
```

---

## Monitoramento

### Logs Automáticos

O middleware automaticamente loga tentativas de acesso:

```
[PREMIUM] Acesso negado para user@example.com - Feature: advanced_emojis
[PREMIUM] Acesso permitido para premium@example.com - Feature: advanced_reports
```

### Métricas Sugeridas

- Total de tentativas de acesso premium
- Taxa de conversão (free → premium)
- Features mais acessadas
- Usuários que mais tentam acessar premium

---

## Troubleshooting

### Problema: "PREMIUM_REQUIRED" mesmo sendo premium

**Solução**: Verificar se o plano não expirou
```typescript
const status = await subscriptionService.getSubscriptionStatus(userId);
console.log('Plan end date:', status.planEndDate);
console.log('Is active:', status.isActive);
```

### Problema: Middleware não está funcionando

**Solução**: Verificar ordem dos middlewares
```typescript
// ✅ Ordem correta
router.get('/', authenticate, checkPremiumAccess, handler);

// ❌ Ordem errada
router.get('/', checkPremiumAccess, authenticate, handler);
```

---

**Middleware premium implementado e pronto para uso!** 🚀
