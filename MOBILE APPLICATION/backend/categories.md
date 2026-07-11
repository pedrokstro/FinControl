# API de Categorias (`/categories`)

Todas as requisições desta seção exigem o cabeçalho `Authorization: Bearer <accessToken>`.

---

## 1. Listar Categorias (`GET /categories`)
Obtém a lista completa de categorias do usuário logado (incluindo as padrões do sistema e as criadas por ele).

### Requisição
- **Método**: `GET`
- **Caminho**: `/categories`

### Resposta (Sucesso `200 OK`)
```json
[
  {
    "id": "1f4e1f74-8b65-4f3b-ba22-1d54e195f4c5",
    "name": "Alimentação",
    "icon": "ShoppingBag",
    "color": "#ef4444",
    "type": "expense",
    "userId": "e8e9cdcd-e01d-44aa-ba66-7b447814a091"
  },
  {
    "id": "2f5e2f85-9c76-5f4c-cb33-2e65f206f5d6",
    "name": "Salário",
    "icon": "DollarSign",
    "color": "#10b981",
    "type": "income",
    "userId": "e8e9cdcd-e01d-44aa-ba66-7b447814a091"
  }
]
```

---

## 2. Criar Categoria (`POST /categories`)
Cria uma nova categoria personalizada.

### Requisição
- **Método**: `POST`
- **Caminho**: `/categories`
- **Payload**:
  ```json
  {
    "name": "Investimentos",
    "icon": "TrendingUp",
    "color": "#4f46e5",
    "type": "expense"
  }
  ```

### Resposta (Sucesso `201 Created`)
Retorna o objeto da categoria recém-criada contendo seu respectivo UUID gerado.
