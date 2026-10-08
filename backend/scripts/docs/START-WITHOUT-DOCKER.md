# 🚀 Iniciar Backend SEM Docker

## ⚠️ Docker não está instalado

Como o Docker não está disponível, você tem duas opções:

---

## Opção 1: Instalar PostgreSQL Localmente

### 1. Baixar PostgreSQL
- Download: https://www.postgresql.org/download/windows/
- Ou use o instalador: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

### 2. Instalar
- Execute o instalador
- Defina senha para o usuário `postgres`
- Porta padrão: `5432`

### 3. Criar Database
Abra o pgAdmin ou psql e execute:
```sql
CREATE DATABASE fincontrol;
```

### 4. Atualizar .env
Edite o arquivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=fincontrol
```

---

## Opção 2: Usar PostgreSQL Online (Desenvolvimento)

### ElephantSQL (Gratuito)
1. Acesse: https://www.elephantsql.com/
2. Crie uma conta gratuita
3. Crie uma nova instância (Tiny Turtle - Free)
4. Copie a URL de conexão

### Atualizar .env
```env
DATABASE_URL=postgres://usuario:senha@host:5432/database
```

---

## Opção 3: Instalar Docker Desktop

### Download
- Windows: https://www.docker.com/products/docker-desktop/

### Após Instalar
```bash
# Reinicie o computador
# Depois execute:
docker compose up -d postgres
```

---

## 🚀 Iniciar o Servidor (Após configurar DB)

```bash
# No diretório backend
npm run dev
```

---

## ✅ Verificar se Funcionou

Acesse:
- Health: http://localhost:5000/health
- Swagger: http://localhost:5000/api-docs

---

## 🆘 Problemas Comuns

### "Cannot connect to database"
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão com pgAdmin

### "Port 5000 already in use"
- Altere a porta no `.env`:
  ```env
  PORT=3000
  ```

---

**Recomendação**: Instale o Docker Desktop para facilitar o desenvolvimento!
