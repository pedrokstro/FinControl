# API de Cartões de Crédito (`/credit-cards`)

Todas as requisições desta seção exigem o cabeçalho `Authorization: Bearer <accessToken>`.

---

## 1. Listar Cartões (`GET /credit-cards`)
Obtém todos os cartões de crédito cadastrados pela conta.

### Requisição
- **Método**: `GET`
- **Caminho**: `/credit-cards`

### Resposta (Sucesso `200 OK`)
```json
[
  {
    "id": "cd01d14e-e44b-48bb-a99f-e3d8816c2091",
    "name": "Cartão Principal",
    "limit": 5000.00,
    "closingDay": 28,
    "dueDay": 5,
    "brand": "Visa",
    "userId": "e8e9cdcd-e01d-44aa-ba66-7b447814a091",
    "createdAt": "2026-07-09T18:00:00.000Z",
    "updatedAt": "2026-07-09T18:00:00.000Z"
  }
]
```

---

## 2. Cadastrar Cartão (`POST /credit-cards`)
Adiciona um novo cartão de crédito à conta.

### Requisição
- **Método**: `POST`
- **Caminho**: `/credit-cards`
- **Payload**:
  ```json
  {
    "name": "Cartão Universitário",
    "limit": 1500.00,
    "closingDay": 10,
    "dueDay": 17,
    "brand": "Mastercard"
  }
  ```

### Resposta (Sucesso `201 Created`)
Retorna o objeto do cartão criado contendo o ID UUID gerado pelo banco.
