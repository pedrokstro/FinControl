# Usuários Cadastrados no Sistema

## Resumo

Baseado na verificação realizada, os seguintes usuários estão cadastrados no banco de dados:

## Usuários Confirmados

### 1. Usuário Demo (PREMIUM)
- **Email:** `demo@financeiro.com`
- **Senha:** `demo123`
- **ID:** `9ffaecc4-da0b-4ce4-849b-6c14ace34fff`
- **Status:** Premium ✅
- **Plano:** Premium
- **Acesso:** ✅ Funcionando

### 2. Pedro Castro
- **Email:** `pedrocastro767@gmail.com`
- **Senha:** `senha123` (provável)
- **Status:** Existe no banco ✅
- **Acesso:** ⚠️ Senha precisa ser verificada/resetada

## Scripts Disponíveis

### Listar Usuários via API
```powershell
cd backend
.\listar-usuarios.ps1
```

### Listar Usuários via SQL
```powershell
psql -U postgres -d controle_gastos -f listar-usuarios.sql
```

### Resetar Senha de Usuário
```powershell
cd backend
.\resetar-senha-usuario.ps1 -email "pedrocastro767@gmail.com" -novaSenha "senha123"
```

## Resetar Senha Manualmente (SQL)

Se precisar resetar a senha de um usuário diretamente no banco:

```sql
-- 1. Habilitar extensão pgcrypto (se ainda não estiver)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Resetar senha
UPDATE users
SET password = crypt('senha123', gen_salt('bf'))
WHERE email = 'pedrocastro767@gmail.com';

-- 3. Verificar
SELECT id, name, email, "isPremium" 
FROM users 
WHERE email = 'pedrocastro767@gmail.com';
```

## Criar Novo Usuário via API

```powershell
$body = @{
    name = "Nome do Usuario"
    email = "email@exemplo.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method POST -Body $body -ContentType "application/json"
```

## Verificar Todos os Usuários (SQL)

```sql
-- Lista completa
SELECT 
    id,
    name,
    email,
    "isPremium",
    "planType",
    "createdAt"
FROM users
ORDER BY "createdAt" DESC;

-- Contagem por tipo
SELECT 
    "isPremium",
    COUNT(*) as quantidade
FROM users
GROUP BY "isPremium";
```

## Notas de Segurança

⚠️ **Importante:** Por questões de segurança, a API **NÃO possui endpoint público** para listar todos os usuários cadastrados. Isso é uma boa prática de segurança.

Para acessar a lista completa de usuários, é necessário:
1. Acesso direto ao banco de dados PostgreSQL
2. Permissões de administrador
3. Executar queries SQL diretamente

## Conectar ao Banco de Dados

```bash
# PostgreSQL
psql -U postgres -d controle_gastos

# Ou com host/porta específicos
psql -h localhost -p 5432 -U postgres -d controle_gastos
```

## Comandos Úteis

### Verificar se usuário existe
```sql
SELECT EXISTS(SELECT 1 FROM users WHERE email = 'email@exemplo.com');
```

### Contar total de usuários
```sql
SELECT COUNT(*) FROM users;
```

### Usuários premium
```sql
SELECT name, email FROM users WHERE "isPremium" = true;
```

### Usuários com transações
```sql
SELECT 
    u.name,
    u.email,
    COUNT(t.id) as total_transacoes
FROM users u
LEFT JOIN transactions t ON u.id = t."userId"
GROUP BY u.id, u.name, u.email
HAVING COUNT(t.id) > 0
ORDER BY total_transacoes DESC;
```
