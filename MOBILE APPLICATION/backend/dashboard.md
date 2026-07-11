# API do Dashboard (`/dashboard`)

Todas as requisições desta seção exigem o cabeçalho `Authorization: Bearer <accessToken>`.

---

## 1. Dados Consolidados do Dashboard (`GET /dashboard`)
Obtém o balanço do mês corrente e o saldo do mês anterior para comparação de variação de tendência.

### Requisição
- **Método**: `GET`
- **Caminho**: `/dashboard`
- **Query Params**:
  - `month` (int, ex: `7`)
  - `year` (int, ex: `2026`)

### Resposta (Sucesso `200 OK`)
```json
{
  "financialSummary": {
    "monthBalance": 170.18,
    "income": 3164.14,
    "expense": 2993.96
  },
  "lastMonthSummary": {
    "balance": 496.78
  }
}
```

---

## 2. Cards Informativos e Avisos (`GET /dashboard/cards`)
Obtém a lista de avisos ativos para popular o carrossel horizontal de notificações táteis (estilo Nubank).

### Requisição
- **Método**: `GET`
- **Caminho**: `/dashboard/cards`

### Resposta (Sucesso `200 OK`)
```json
[
  {
    "id": "2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7g",
    "title": "Segurança Ativa",
    "desc": "O FinControl nunca solicita sua senha por ligações telefônicas. Fique alerta!",
    "bg": "bg-amber-50 dark:bg-amber-950/20 border-amber-100",
    "icon": "Shield",
    "iconColor": "text-amber-600 dark:text-amber-400",
    "actionPath": "/app/settings",
    "imageSrc": null,
    "isActive": true
  },
  {
    "id": "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g",
    "title": "Fatura do Cartão",
    "desc": "A fatura do seu cartão Visa Platinum fecha em 3 dias. Toque para programar.",
    "bg": "bg-primary-600 text-white",
    "icon": "CreditCard",
    "iconColor": "text-white/80",
    "actionPath": "/app/cards",
    "imageSrc": null,
    "isActive": true
  }
]
```
*Nota: A propriedade `imageSrc` pode conter uma URL externa ou um caminho para recurso local. Se for fornecida, exiba a imagem recortada e arredondada; caso contrário, use a string `icon` para inflar o ícone nativo correspondente.*
