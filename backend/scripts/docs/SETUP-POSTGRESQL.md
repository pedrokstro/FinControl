# 🐘 Configurar PostgreSQL - FinControl

## ✅ PostgreSQL está rodando na porta 5432!

Agora você precisa configurar o usuário e database.

---

## 📝 Passo a Passo

### 1️⃣ Abrir pgAdmin ou psql

**Opção A: pgAdmin (Interface Gráfica)**
- Abra o pgAdmin 4
- Conecte ao servidor local
- Use a senha que você definiu na instalação

**Opção B: psql (Linha de Comando)**
```bash
# Abra o PowerShell como Administrador
psql -U postgres
# Digite a senha do usuário postgres
```

---

### 2️⃣ Criar o Database

No pgAdmin ou psql, execute:

```sql
-- Criar o database
CREATE DATABASE fincontrol_db;
```

---

### 3️⃣ Criar o Usuário (Opcional)

Você pode usar o usuário `postgres` ou criar um novo usuário:

**Opção A: Usar usuário postgres (Mais Simples)**

Edite o arquivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=SUA_SENHA_DO_POSTGRES
DB_DATABASE=fincontrol_db
```

**Opção B: Criar novo usuário (Mais Seguro)**

No pgAdmin ou psql, execute:
```sql
-- Criar usuário
CREATE USER fincontrol WITH PASSWORD 'fincontrol_password';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE fincontrol_db TO fincontrol;

-- Conectar ao database
\c fincontrol_db

-- Dar permissões no schema
GRANT ALL ON SCHEMA public TO fincontrol;
```

Depois, mantenha o `.env` como está:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=fincontrol
DB_PASSWORD=fincontrol_password
DB_DATABASE=fincontrol_db
```

---

### 4️⃣ Testar a Conexão

Execute o script de teste:
```bash
node test-db-connection.js
```

Se aparecer ✅, está tudo certo!

---

### 5️⃣ Iniciar o Servidor

```bash
npm run dev
```

---

## 🔧 Comandos Úteis

### Verificar se PostgreSQL está rodando
```powershell
netstat -an | findstr :5432
```

### Conectar ao psql
```bash
psql -U postgres
```

### Listar databases
```sql
\l
```

### Conectar a um database
```sql
\c fincontrol_db
```

### Listar tabelas
```sql
\dt
```

### Sair do psql
```sql
\q
```

---

## ⚠️ Problemas Comuns

### "Senha incorreta"
- Verifique a senha no `.env`
- Confirme a senha do usuário postgres
- Tente resetar a senha:
  ```sql
  ALTER USER postgres PASSWORD 'nova_senha';
  ```

### "Database não existe"
- Execute: `CREATE DATABASE fincontrol_db;`

### "Usuário não existe"
- Use o usuário `postgres` no `.env`
- Ou crie o usuário `fincontrol`

---

## 📋 Checklist

- [ ] PostgreSQL instalado e rodando
- [ ] Database `fincontrol_db` criado
- [ ] Usuário configurado (postgres ou fincontrol)
- [ ] Arquivo `.env` atualizado com credenciais corretas
- [ ] Teste de conexão executado com sucesso
- [ ] Servidor iniciado com `npm run dev`

---

## 🎯 Próximo Passo

Após configurar tudo acima, execute:

```bash
npm run dev
```

O servidor irá:
1. ✅ Conectar ao PostgreSQL
2. ✅ Criar as tabelas automaticamente (TypeORM)
3. ✅ Executar os seeders (dados demo)
4. ✅ Iniciar na porta 5000

Depois acesse:
- **Health**: http://localhost:5000/health
- **Swagger**: http://localhost:5000/api-docs
- **API**: http://localhost:5000/api/v1

---

**Dica**: Use o usuário `postgres` para começar mais rápido! 🚀
