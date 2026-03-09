# 🔄 Guia de Migração - MySQL → PostgreSQL

## 📋 Checklist de Migração

### ✅ **Passo 1: Atualizar Dependências**

```bash
cd backend
npm uninstall mysql2
npm install pg@^8.11.3
```

### ✅ **Passo 2: Executar Migration no Supabase**

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo de `backend/database/postgresql/add-trial-and-googlepay.sql`
5. Clique em **Run**

### ✅ **Passo 3: Atualizar Variáveis de Ambiente**

#### **Local (.env)**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres
DB_HOST=db.hzazlkgpamawlqmvxyii.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_supabase
DB_DATABASE=postgres
```

#### **GitHub Secrets**
Atualize em: `Settings` → `Secrets and variables` → `Actions`

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres
```

#### **Render (Backend)**
Atualize em: `Dashboard` → `Environment`

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres
```

### ✅ **Passo 4: Fazer Deploy**

```bash
git add .
git commit -m "feat: Migrar para PostgreSQL e adicionar Trial + Google Pay"
git push origin main
```

O GitHub Actions vai:
1. ✅ Build do backend
2. ✅ Executar migrations
3. ✅ Deploy no Render
4. ✅ Deploy frontend na Vercel

### ✅ **Passo 5: Verificar**

1. **Backend**: Acesse `https://seu-backend.onrender.com/health`
2. **Frontend**: Acesse `https://seu-app.vercel.app`
3. **Teste**: Faça login e teste o botão "Iniciar Teste Grátis"

## 🆕 Novas Funcionalidades

### **1. Teste Grátis de 7 Dias**
- ✅ Sem necessidade de cartão
- ✅ Ativação instantânea
- ✅ Expira automaticamente após 7 dias
- ✅ Usuário só pode usar uma vez

### **2. Google Pay**
- ✅ Pagamento único (mensal ou anual)
- ✅ Sem renovação automática
- ✅ Integração via Google Pay JS API

### **3. Campos Adicionados**

#### **Tabela `users`:**
- `isTrial` (boolean) - Se está em período de teste
- `googlePayTransactionId` (varchar) - ID da transação Google Pay
- `subscriptionStatus` (varchar) - Status da assinatura

#### **Tabela `notifications`:**
- `updatedAt` (timestamp) - Data de atualização
- `category` (varchar) - Categoria da notificação
- `relatedId` (varchar) - ID relacionado
- `relatedType` (varchar) - Tipo relacionado

## 🔧 Troubleshooting

### **Erro: Cannot find module 'pg'**
```bash
cd backend
npm install pg
```

### **Erro: Database connection failed**
1. Verifique se o DATABASE_URL está correto
2. Teste a conexão: `psql $DATABASE_URL`
3. Verifique se o IP está na whitelist do Supabase

### **Erro: Migration já executada**
Normal! A migration usa `IF NOT EXISTS`, então é seguro executar múltiplas vezes.

### **Erro: SSL connection required**
Adicione `?sslmode=require` no final da DATABASE_URL:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

## 📊 Comparação

| Recurso | MySQL (Antes) | PostgreSQL (Agora) |
|---------|---------------|-------------------|
| **Provider** | XAMPP Local | Supabase Cloud |
| **Porta** | 3306 | 5432 |
| **SSL** | ❌ | ✅ |
| **Backups** | Manual | Automático |
| **Escalabilidade** | Limitada | Ilimitada |
| **Custo** | Grátis | Grátis (até 500MB) |
| **Dashboard** | phpMyAdmin | Supabase Dashboard |

## ✅ Vantagens da Migração

1. **🌐 Cloud-native**: Não depende de servidor local
2. **🔒 Segurança**: SSL/TLS automático
3. **💾 Backups**: Automáticos e gerenciados
4. **📊 Dashboard**: Interface moderna do Supabase
5. **🚀 Performance**: Otimizado para produção
6. **🔄 CI/CD**: Integração perfeita com GitHub Actions
7. **💰 Custo**: Gratuito até 500MB

## 🎉 Pronto!

Sua aplicação agora está rodando com:
- ✅ PostgreSQL (Supabase)
- ✅ Teste grátis de 7 dias
- ✅ Google Pay integrado
- ✅ Deploy automático configurado

**Próximos passos:**
1. Testar funcionalidade de trial
2. Testar pagamento Google Pay
3. Monitorar logs no Render e Vercel
