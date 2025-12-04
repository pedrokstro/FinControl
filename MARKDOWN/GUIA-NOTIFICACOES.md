# 🔔 Guia Completo - Sistema de Notificações

## 📋 Índice
1. [Enviar Notificações Manualmente](#1-enviar-notificações-manualmente)
2. [Enviar via API](#2-enviar-via-api)
3. [Notificações Automáticas](#3-notificações-automáticas)
4. [Exemplos Práticos](#4-exemplos-práticos)

---

## 1. Enviar Notificações Manualmente

### 🎯 **Quando usar:**
- Anunciar novos recursos
- Comunicados importantes
- Manutenções programadas
- Promoções especiais

### 📝 **Como usar:**

1. **Edite o arquivo:** `backend/enviar-notificacao-novidades.js`

2. **Configure a notificação:**
```javascript
const notification = {
  title: '✨ Novos Relatórios Disponíveis!',
  message: 'Agora você tem acesso a relatórios avançados...',
  type: 'success', // info, warning, success, error
  category: 'premium', // transaction, goal, budget, premium, system
  onlyPremium: true, // true = apenas premium, false = todos
};
```

3. **Execute o script:**
```bash
cd backend
node enviar-notificacao-novidades.js
```

### 📊 **Tipos de Notificação:**
- `info` - Informação geral (azul)
- `success` - Sucesso/Conquista (verde)
- `warning` - Alerta/Atenção (amarelo)
- `error` - Erro/Problema (vermelho)

### 🏷️ **Categorias:**
- `system` - Sistema/Geral
- `premium` - Recursos Premium
- `transaction` - Transações
- `goal` - Metas
- `budget` - Orçamento

---

## 2. Enviar via API

### 🌐 **Endpoints Disponíveis:**

#### **A) Broadcast (Envio em Massa)**
```http
POST /api/v1/admin/broadcast-notification
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "✨ Novos Recursos Premium",
  "message": "Confira os novos relatórios avançados disponíveis!",
  "type": "success",
  "category": "premium",
  "onlyPremium": true
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Notificação enviada para 15 usuário(s)",
  "data": {
    "count": 15,
    "onlyPremium": true
  }
}
```

#### **B) Envio Individual**
```http
POST /api/v1/admin/send-notification/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "🎉 Parabéns!",
  "message": "Você atingiu sua meta de economia!",
  "type": "success",
  "category": "goal"
}
```

### 🔧 **Exemplo com cURL:**
```bash
curl -X POST http://localhost:3333/api/v1/admin/broadcast-notification \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "✨ Novidade!",
    "message": "Novo recurso disponível",
    "type": "info",
    "category": "system",
    "onlyPremium": false
  }'
```

---

## 3. Notificações Automáticas

### 🤖 **Usar o NotificationHelper no código:**

```typescript
import { NotificationHelper } from '@/utils/notificationHelper';

// 1. Nova transação
await NotificationHelper.notifyNewTransaction(
  userId, 
  'income', 
  5000, 
  'Salário', 
  transactionId
);

// 2. Meta atingida
await NotificationHelper.notifyGoalAchieved(
  userId,
  'Viagem para Europa',
  100,
  goalId
);

// 3. Gastos elevados
await NotificationHelper.notifyHighExpenses(
  userId,
  8500,
  5000
);

// 4. Saldo baixo
await NotificationHelper.notifyLowBalance(
  userId,
  500,
  1000
);

// 5. Transação recorrente
await NotificationHelper.notifyRecurringTransaction(
  userId,
  'Aluguel',
  1500,
  transactionId
);

// 6. Premium expirando
await NotificationHelper.notifyPremiumExpiring(
  userId,
  7
);

// 7. Boas-vindas
await NotificationHelper.notifyWelcome(
  userId,
  'João Silva'
);

// 8. Limite de categoria
await NotificationHelper.notifyCategoryLimitReached(
  userId,
  'Alimentação',
  1800,
  2000,
  90
);
```

---

## 4. Exemplos Práticos

### 📢 **Exemplo 1: Anunciar Novo Recurso Premium**

**Script:**
```javascript
const notification = {
  title: '✨ Novos Relatórios Disponíveis!',
  message: 'Acesse relatórios avançados com gráficos interativos e análises detalhadas.',
  type: 'success',
  category: 'premium',
  onlyPremium: true,
};
```

### 🔧 **Exemplo 2: Manutenção Programada**

**Script:**
```javascript
const notification = {
  title: '⚠️ Manutenção Programada',
  message: 'O sistema ficará indisponível amanhã das 2h às 4h para melhorias.',
  type: 'warning',
  category: 'system',
  onlyPremium: false,
};
```

### 🎉 **Exemplo 3: Promoção Especial**

**Script:**
```javascript
const notification = {
  title: '🎁 Promoção Especial!',
  message: '50% de desconto no plano Premium por tempo limitado!',
  type: 'info',
  category: 'premium',
  onlyPremium: false,
};
```

### 📊 **Exemplo 4: Integrar em Transação**

**No transaction.service.ts:**
```typescript
import { NotificationHelper } from '@/utils/notificationHelper';

async create(data: CreateTransactionData): Promise<Transaction> {
  // ... código de criação da transação
  
  const transaction = await this.transactionRepository.save(newTransaction);
  
  // Enviar notificação automática
  await NotificationHelper.notifyNewTransaction(
    userId,
    transaction.type,
    transaction.amount,
    transaction.description,
    transaction.id
  );
  
  return transaction;
}
```

---

## 🎯 **Dicas e Boas Práticas:**

1. **Emojis:** Use emojis no título para chamar atenção
2. **Mensagens curtas:** Seja direto e objetivo
3. **Tipo correto:** Use o tipo apropriado (info, success, warning, error)
4. **Categoria:** Sempre defina a categoria para organização
5. **Teste primeiro:** Teste com poucos usuários antes de enviar para todos

---

## 🔍 **Verificar Notificações no Banco:**

```bash
cd backend
node verificar-notifications.js
```

---

## ❓ **Perguntas Frequentes:**

**Q: Como enviar apenas para usuários Premium?**
A: Configure `onlyPremium: true` no script ou API.

**Q: Posso agendar notificações?**
A: Sim, use um cron job ou scheduler para executar o script em horário específico.

**Q: Como deletar notificações antigas?**
A: Use o endpoint DELETE `/api/v1/notifications/read` para deletar lidas.

**Q: Quantas notificações posso enviar?**
A: Não há limite, mas recomendamos não enviar mais de 1-2 por dia para não incomodar.

---

## 📞 **Suporte:**

Para dúvidas ou problemas, consulte a documentação do sistema ou entre em contato com o time de desenvolvimento.
