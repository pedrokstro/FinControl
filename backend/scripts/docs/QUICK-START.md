# ⚡ Quick Start - Backend FinControl

## 🚀 Início Rápido (5 minutos)

### 1️⃣ Instalar Dependências
```bash
cd backend
npm install
```
⏱️ **Isso resolverá TODOS os erros de lint atuais**

### 2️⃣ Configurar Ambiente
```bash
cp .env.example .env
```

### 3️⃣ Subir PostgreSQL (Docker)
```bash
docker-compose up -d postgres
```

Ou instale PostgreSQL localmente e crie o banco:
```sql
CREATE DATABASE fincontrol_db;
```

### 4️⃣ Executar Migrations
```bash
npm run migration:run
```

### 5️⃣ Popular Banco (Opcional)
```bash
npm run seed
```

### 6️⃣ Iniciar Servidor
```bash
npm run dev
```

✅ **Backend rodando em: http://localhost:5000**

---

## 📡 Testar API

### Health Check
```bash
curl http://localhost:5000/health
```

### Registrar Usuário
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

---

## 📚 Documentação

Acesse: **http://localhost:5000/api-docs**

---

## ⚠️ Problemas Comuns

### Erro: "Cannot find module"
**Solução:** Execute `npm install`

### Erro: "Database connection failed"
**Solução:** Verifique se PostgreSQL está rodando e `.env` está configurado

### Erro: "Port 5000 already in use"
**Solução:** Altere `PORT` no `.env` ou mate o processo:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 🎯 Próximos Passos

1. ✅ Instalar dependências
2. ✅ Configurar ambiente
3. ✅ Subir banco de dados
4. ✅ Executar migrations
5. ✅ Testar API
6. 📖 Ler documentação completa no `README.md`
7. 🧪 Executar testes: `npm test`
8. 🚀 Deploy (ver `README.md`)

---

**Tempo Total:** ~5 minutos  
**Dificuldade:** Fácil  
**Status:** ✅ Pronto para desenvolvimento
