# API Documentation

## Overview

Esta é a documentação da API REST para o sistema FinControl. A API permite gerenciar autenticação, transações, categorias e relatórios financeiros.

**Base URL:** `http://localhost:3001/api`

## Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer {token}
```

### POST /auth/login

Realiza login do usuário.

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "1",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "avatar": "url-avatar"
  },
  "token": "jwt-token"
}
```

### POST /auth/register

Registra novo usuário.

**Request:**
```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "1",
    "name": "Nome Completo",
    "email": "usuario@email.com"
  },
  "token": "jwt-token"
}
```

### POST /auth/logout

Realiza logout do usuário.

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

## Transações

### GET /transactions

Lista todas as transações do usuário.

**Query Parameters:**
- `page` (number): Página atual (default: 1)
- `limit` (number): Items por página (default: 10)
- `type` (string): Filtrar por tipo (income/expense)
- `categoryId` (string): Filtrar por categoria
- `startDate` (string): Data inicial (YYYY-MM-DD)
- `endDate` (string): Data final (YYYY-MM-DD)
- `search` (string): Buscar por descrição

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "1",
      "type": "expense",
      "amount": 100.50,
      "category": "Alimentação",
      "categoryId": "1",
      "description": "Almoço",
      "date": "2024-01-15",
      "createdAt": "2024-01-15T10:00:00Z",
      "userId": "1"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET /transactions/:id

Busca uma transação específica.

**Response (200):**
```json
{
  "id": "1",
  "type": "expense",
  "amount": 100.50,
  "category": "Alimentação",
  "categoryId": "1",
  "description": "Almoço",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T10:00:00Z",
  "userId": "1"
}
```

### POST /transactions

Cria nova transação.

**Request:**
```json
{
  "type": "expense",
  "amount": 100.50,
  "categoryId": "1",
  "description": "Almoço",
  "date": "2024-01-15"
}
```

**Response (201):**
```json
{
  "id": "1",
  "type": "expense",
  "amount": 100.50,
  "category": "Alimentação",
  "categoryId": "1",
  "description": "Almoço",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T10:00:00Z",
  "userId": "1"
}
```

### PUT /transactions/:id

Atualiza uma transação.

**Request:**
```json
{
  "amount": 150.00,
  "description": "Almoço e jantar"
}
```

**Response (200):**
```json
{
  "id": "1",
  "type": "expense",
  "amount": 150.00,
  "category": "Alimentação",
  "categoryId": "1",
  "description": "Almoço e jantar",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T10:00:00Z",
  "userId": "1"
}
```

### DELETE /transactions/:id

Deleta uma transação.

**Response (200):**
```json
{
  "message": "Transação deletada com sucesso"
}
```

## Categorias

### GET /categories

Lista todas as categorias do usuário.

**Response (200):**
```json
{
  "categories": [
    {
      "id": "1",
      "name": "Alimentação",
      "type": "expense",
      "color": "#ef4444",
      "icon": "UtensilsCrossed",
      "userId": "1"
    }
  ]
}
```

### POST /categories

Cria nova categoria.

**Request:**
```json
{
  "name": "Alimentação",
  "type": "expense",
  "color": "#ef4444",
  "icon": "UtensilsCrossed"
}
```

**Response (201):**
```json
{
  "id": "1",
  "name": "Alimentação",
  "type": "expense",
  "color": "#ef4444",
  "icon": "UtensilsCrossed",
  "userId": "1"
}
```

### PUT /categories/:id

Atualiza uma categoria.

**Request:**
```json
{
  "name": "Comida",
  "color": "#dc2626"
}
```

**Response (200):**
```json
{
  "id": "1",
  "name": "Comida",
  "type": "expense",
  "color": "#dc2626",
  "icon": "UtensilsCrossed",
  "userId": "1"
}
```

### DELETE /categories/:id

Deleta uma categoria (apenas se não houver transações).

**Response (200):**
```json
{
  "message": "Categoria deletada com sucesso"
}
```

## Relatórios

### GET /reports/summary

Retorna resumo financeiro.

**Query Parameters:**
- `startDate` (string): Data inicial (YYYY-MM-DD)
- `endDate` (string): Data final (YYYY-MM-DD)

**Response (200):**
```json
{
  "totalIncome": 5000.00,
  "totalExpense": 3000.00,
  "balance": 2000.00,
  "monthIncome": 5000.00,
  "monthExpense": 3000.00,
  "monthBalance": 2000.00
}
```

### GET /reports/by-category

Retorna relatório por categoria.

**Query Parameters:**
- `type` (string): Tipo (income/expense)
- `startDate` (string): Data inicial (YYYY-MM-DD)
- `endDate` (string): Data final (YYYY-MM-DD)

**Response (200):**
```json
{
  "categories": [
    {
      "categoryId": "1",
      "categoryName": "Alimentação",
      "total": 1500.00,
      "percentage": 50,
      "transactionCount": 15
    }
  ]
}
```

### GET /reports/monthly

Retorna relatório mensal.

**Query Parameters:**
- `months` (number): Número de meses (default: 6)

**Response (200):**
```json
{
  "months": [
    {
      "month": "2024-01",
      "income": 5000.00,
      "expense": 3000.00,
      "balance": 2000.00
    }
  ]
}
```

## Códigos de Status

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Erros

Formato de resposta de erro:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descrição do erro",
    "details": {
      "field": "Campo específico com erro"
    }
  }
}
```

## Rate Limiting

- 100 requisições por minuto por IP
- Headers de resposta:
  - `X-RateLimit-Limit`: Limite de requisições
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset
