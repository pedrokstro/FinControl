# API de Transações (`/transactions`)

Todas as requisições desta seção exigem o cabeçalho `Authorization: Bearer <accessToken>`.

---

## 1. Listagem de Transações (`GET /transactions`)
Retorna as transações associadas ao usuário logado, com filtros opcionais de período e filtros rápidos.

### Requisição
- **Método**: `GET`
- **Caminho**: `/transactions`
- **Query Params**:
  - `month` (int, opcional - ex: `7` para Julho)
  - `year` (int, opcional - ex: `2026`)
  - `type` (string, opcional: `income` ou `expense`)
  - `categoryId` (UUID, opcional)
  - `searchTerm` (string, opcional)

### Resposta (Sucesso `200 OK`)
```json
[
  {
    "id": "7a3536ea-6302-4c28-98e3-cf9d9b62c455",
    "type": "expense",
    "amount": 200.00,
    "description": "Conta de Luz",
    "date": "2026-07-09",
    "categoryId": "1f4e1f74-8b65-4f3b-ba22-1d54e195f4c5",
    "category": "Contas",
    "userId": "e8e9cdcd-e01d-44aa-ba66-7b447814a091",
    "isRecurring": true,
    "recurrenceType": "monthly",
    "recurrenceEndDate": "2027-07-09T00:00:00.000Z",
    "nextOccurrence": "2026-08-09T00:00:00.000Z",
    "parentTransactionId": null,
    "creditCardId": null,
    "totalInstallments": 12,
    "currentInstallment": 1,
    "isCancelled": false,
    "createdAt": "2026-07-09T18:00:00.000Z",
    "updatedAt": "2026-07-09T18:00:00.000Z"
  }
]
```

---

## 2. Criar Transação (`POST /transactions`)
Cria uma nova receita ou despesa.

### Requisição
- **Método**: `POST`
- **Caminho**: `/transactions`
- **Payload**:
  ```json
  {
    "type": "expense",
    "amount": 149.90,
    "description": "Mensalidade Academia",
    "date": "2026-07-09",
    "categoryId": "1f4e1f74-8b65-4f3b-ba22-1d54e195f4c5",
    "creditCardId": null,
    "isRecurring": false,
    "recurrenceType": null,
    "recurrenceEndDate": null,
    "totalInstallments": null
  }
  ```

### Resposta (Sucesso `201 Created`)
Retorna o objeto da transação recém-criada idêntico à modelagem do banco.

---

## 3. Atualizar Transação (`PUT /transactions/:id`)
Atualiza os atributos de uma transação.

### Requisição
- **Método**: `PUT`
- **Caminho**: `/transactions/7a3536ea-6302-4c28-98e3-cf9d9b62c455`
- **Payload**:
  ```json
  {
    "amount": 159.90,
    "description": "Mensalidade Academia (Ajustado)"
  }
  ```

### Resposta (Sucesso `200 OK`)
Retorna o objeto da transação atualizada.

---

## 4. Deletar Transação (`DELETE /transactions/:id`)
Exclui permanentemente um lançamento.

### Requisição
- **Método**: `DELETE`
- **Caminho**: `/transactions/7a3536ea-6302-4c28-98e3-cf9d9b62c455`

### Resposta (Sucesso `200 OK`)
```json
{
  "message": "Transação excluída com sucesso"
}
```
*Nota: Ao deletar uma transação pai (recorrente), o backend pode solicitar se deseja excluir apenas esta parcela ou todas as ocorrências futuras.*
