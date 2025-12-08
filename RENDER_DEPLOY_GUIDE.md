# Guia de Deploy no Render - Backend FinControl

## Passo a Passo

### 1. Configuracoes Basicas

Ja preenchido:
- **Name:** FinControl
- **Language:** Node
- **Branch:** main
- **Region:** Virginia (US East)

### 2. Configuracoes de Diretorio e Build

**Root Directory:**
```
backend
```

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start
```

### 3. Variaveis de Ambiente

Clique em **"Advanced"** e adicione cada variavel abaixo:

#### Aplicacao
```
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1
```

#### Banco de Dados (Supabase)
```
DATABASE_URL=postgresql://postgres:360106@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres
DB_HOST=db.hzazlkgpamawlqmvxyii.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=360106
DB_DATABASE=postgres
```

#### JWT (Autenticacao)
```
JWT_SECRET=634e4780fd90103adeec703ff62487f041dd672f7732a386c2c6680026f351a3b18010da3b7bd8c3ca2489a3dfbfb268454180a99e952963c6ef7aa2b2a3e119
JWT_REFRESH_SECRET=595e75114be62ff93b7e266098f7cbab5bdeb14bf6c19ecc04c9f17328d1081f
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### CORS e Rate Limiting
```
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Logs
```
LOG_LEVEL=info
LOG_DIR=logs
```

#### Email (Resend)
```
RESEND_API_KEY=re_SuaChaveAqui
EMAIL_FROM=FinControl <noreply@seudominio.com>
```

**Como obter RESEND_API_KEY:**
1. Acesse: https://resend.com/
2. Crie conta gratuita (100 emails/dia)
3. Va em "API Keys" > "Create API Key"
4. Copie a chave (comeca com "re_")

### 4. Plano

Selecione: **Free** (0 USD/mes)

Limitacoes do plano Free:
- 750 horas/mes
- 512 MB RAM
- Sleep apos 15 min de inatividade

### 5. Criar Web Service

Clique em **"Create Web Service"**

### 6. Aguardar Deploy

O Render vai:
1. Clonar o repositorio
2. Instalar dependencias (npm install)
3. Compilar TypeScript (npm run build)
4. Executar migrations automaticamente
5. Iniciar o servidor

### 7. Verificar Deploy

Apos o deploy, voce vera:
- URL do backend: `https://fincontrol-xxxx.onrender.com`
- Status: **Live**
- Logs em tempo real

### 8. Testar API

Acesse no navegador:
```
https://fincontrol-xxxx.onrender.com/api/v1/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-12-08T13:44:00.000Z"
}
```

### 9. Atualizar CORS (Importante!)

Apos fazer deploy do frontend, volte ao Render e atualize:

**Environment Variables > CORS_ORIGIN:**
```
https://seu-frontend.vercel.app,https://fincontrol-xxxx.onrender.com
```

### 10. Configurar Frontend

No projeto frontend, atualize `.env`:
```
VITE_API_URL=https://fincontrol-xxxx.onrender.com/api/v1
```

## Troubleshooting

### Deploy Falhou?

**Erro: "Module not found"**
- Verifique se `Root Directory` esta como `backend`
- Verifique se `Build Command` esta correto

**Erro: "Database connection failed"**
- Verifique se DATABASE_URL esta correto
- Teste conexao com Supabase

**Erro: "Port already in use"**
- Nao precisa fazer nada, Render gerencia isso automaticamente

### Logs

Para ver logs em tempo real:
1. Acesse o dashboard do Render
2. Clique no seu servico
3. Va em **"Logs"**

### Reiniciar Servico

Se precisar reiniciar:
1. Dashboard > Seu servico
2. Clique em **"Manual Deploy"** > **"Clear build cache & deploy"**

## Proximos Passos

1. [ ] Deploy do backend concluido
2. [ ] Testar endpoints da API
3. [ ] Deploy do frontend (Vercel/Netlify)
4. [ ] Atualizar CORS_ORIGIN
5. [ ] Configurar dominio personalizado (opcional)
6. [ ] Configurar monitoramento (opcional)

## Links Uteis

- Dashboard Render: https://dashboard.render.com/
- Documentacao Render: https://render.com/docs
- Supabase Dashboard: https://supabase.com/dashboard
- GitHub Repo: https://github.com/pedrokstro/FinControl

---

**Desenvolvido por PEDRO KSTRO**
