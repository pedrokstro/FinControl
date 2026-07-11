# API de Autenticação (`/auth`)

Todas as requisições desta seção são públicas e não exigem cabeçalho `Authorization` prévio.

---

## 1. Cadastro de Usuário (`POST /auth/register`)
Cadastra uma nova conta na aplicação.

### Requisição
- **Método**: `POST`
- **Caminho**: `/auth/register`
- **Cabeçalhos**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "name": "Pedro Castro",
    "email": "pedro@exemplo.com",
    "password": "senhaSegura123"
  }
  ```

### Resposta (Sucesso `201 Created`)
```json
{
  "message": "Usuário registrado com sucesso"
}
```

---

## 2. Login de Usuário (`POST /auth/login`)
Efetua login e retorna as credenciais e o token de sessão do usuário.

### Requisição
- **Método**: `POST`
- **Caminho**: `/auth/login`
- **Cabeçalhos**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "email": "pedro@exemplo.com",
    "password": "senhaSegura123"
  }
  ```

### Resposta (Sucesso `200 OK`)
```json
{
  "user": {
    "id": "e8e9cdcd-e01d-44aa-ba66-7b447814a091",
    "name": "Pedro Castro",
    "email": "pedro@exemplo.com",
    "avatar": null,
    "role": "user",
    "planType": "free",
    "isPremium": false,
    "isAdmin": false,
    "theme": "light"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "d8e3b4a2-9e8c..."
}
```

---

## 3. Renovação de Token (`POST /auth/refresh`)
Gera um novo `accessToken` válido utilizando o `refreshToken` persistido.

### Requisição
- **Método**: `POST`
- **Caminho**: `/auth/refresh`
- **Cabeçalhos**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "refreshToken": "d8e3b4a2-9e8c..."
  }
  ```

### Resposta (Sucesso `200 OK`)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "new-refresh-token-uuid..."
}
```
*Nota: Ao receber um erro `401 Unauthorized` nas chamadas protegidas da API, o cliente móvel deve pausar as requisições pendentes, invocar este endpoint e repetir as chamadas falhas com o novo token.*
