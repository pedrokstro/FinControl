# 🚀 Configuração do Google Play Billing no Render.com

Guia completo para configurar o Google Play Billing e webhook no Render.com.

---

## ✅ Vantagens do Render

- ✅ **HTTPS automático** - Certificado SSL gerenciado
- ✅ **Deploy automático** - Conectado ao GitHub
- ✅ **Domínio customizado** - Gratuito
- ✅ **Logs em tempo real** - Fácil debugging
- ✅ **Variáveis de ambiente** - Interface simples

---

## 📋 Passo a Passo Completo

### 1. Preparar Arquivo de Credenciais do Google Play

#### 1.1. Baixar Credenciais

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Selecione seu projeto
3. Vá em **IAM & Admin** > **Service Accounts**
4. Clique na conta de serviço criada
5. Vá em **Keys** > **Add Key** > **Create new key**
6. Escolha **JSON** e baixe o arquivo

#### 1.2. Converter JSON para Base64

O Render não suporta upload de arquivos, então precisamos converter o JSON para Base64 e usar como variável de ambiente.

**No Windows (PowerShell):**
```powershell
$bytes = [System.IO.File]::ReadAllBytes("caminho\para\google-play-service-account.json")
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Out-File -FilePath "credentials-base64.txt"
```

**No Mac/Linux:**
```bash
base64 -i google-play-service-account.json -o credentials-base64.txt
```

Copie o conteúdo do arquivo `credentials-base64.txt` gerado.

---

### 2. Configurar Variáveis de Ambiente no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Selecione seu serviço **fincontrol-backend**
3. Vá em **Environment** na barra lateral
4. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```env
# Google Play Billing
GOOGLE_PLAY_PACKAGE_NAME=com.fincontrol.app
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64=<cole_o_base64_aqui>

# Outras variáveis existentes
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1

# Database
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USERNAME=seu-usuario
DB_PASSWORD=sua-senha
DB_DATABASE=fincontrol_db

# JWT
JWT_SECRET=sua-chave-secreta-forte
JWT_REFRESH_SECRET=sua-chave-refresh-forte
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://fincontrol.com,https://www.fincontrol.com
```

5. Clique em **Save Changes**

---

### 3. Atualizar Código para Ler Credenciais do Base64

Crie o arquivo `backend/src/config/googlePlay.ts`:

```typescript
import { config } from './env';
import fs from 'fs';
import path from 'path';

/**
 * Obter caminho do arquivo de credenciais do Google Play
 * Em produção (Render), decodifica de Base64
 * Em desenvolvimento, usa arquivo local
 */
export function getGooglePlayCredentialsPath(): string {
  // Se estiver em produção e tiver a variável Base64
  if (process.env.NODE_ENV === 'production' && process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64) {
    const base64Credentials = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64;
    const jsonCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    
    // Criar arquivo temporário
    const tempPath = path.join('/tmp', 'google-play-service-account.json');
    fs.writeFileSync(tempPath, jsonCredentials);
    
    console.log('✅ Google Play credentials loaded from Base64');
    return tempPath;
  }
  
  // Em desenvolvimento, usar arquivo local
  return config.googlePlay.serviceAccountKeyPath;
}
```

Atualize `backend/src/services/googlePlay.service.ts`:

```typescript
import { getGooglePlayCredentialsPath } from '../config/googlePlay';

export class GooglePlayService {
  private androidPublisher: any;
  private packageName: string;

  constructor() {
    this.packageName = config.googlePlay.packageName;
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      const credentialsPath = getGooglePlayCredentialsPath();
      
      const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      });

      this.androidPublisher = google.androidpublisher({
        version: 'v3',
        auth,
      });

      console.log('✅ Google Play API client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Play API client:', error);
      throw error;
    }
  }
}
```

---

### 4. Configurar Domínio Customizado (Opcional mas Recomendado)

#### 4.1. Adicionar Domínio no Render

1. No seu serviço, vá em **Settings**
2. Role até **Custom Domain**
3. Clique em **Add Custom Domain**
4. Digite: `api.fincontrol.com`
5. Render fornecerá um endereço CNAME

#### 4.2. Configurar DNS

No seu provedor de domínio (Registro.br, GoDaddy, Cloudflare, etc):

1. Adicione um registro **CNAME**:
   - **Nome:** `api`
   - **Valor:** `fincontrol-backend.onrender.com` (ou o fornecido pelo Render)
   - **TTL:** 3600

2. Aguarde propagação (5-30 minutos)

#### 4.3. Verificar

```bash
# Testar DNS
nslookup api.fincontrol.com

# Testar HTTPS
curl https://api.fincontrol.com/api/v1/health
```

**HTTPS é automático!** O Render gera e renova certificados SSL automaticamente.

---

### 5. Configurar Google Cloud Pub/Sub

#### 5.1. Criar Tópico e Subscription

```bash
# Login no Google Cloud
gcloud auth login

# Criar tópico
gcloud pubsub topics create google-play-subscriptions

# Criar subscription push
gcloud pubsub subscriptions create fincontrol-webhook \
  --topic=google-play-subscriptions \
  --push-endpoint=https://api.fincontrol.com/api/v1/google-play/webhook \
  --ack-deadline=60
```

**Se não tiver domínio customizado**, use a URL do Render:
```bash
--push-endpoint=https://fincontrol-backend.onrender.com/api/v1/google-play/webhook
```

#### 5.2. Configurar no Google Play Console

1. Acesse [Google Play Console](https://play.google.com/console)
2. Selecione seu app
3. Vá em **Monetização** > **Configurações de monetização**
4. Em **Notificações em tempo real**:
   - **Tópico:** `projects/SEU_PROJECT_ID/topics/google-play-subscriptions`
5. Clique em **Salvar**

---

### 6. Executar Migration

#### 6.1. Via Render Shell

1. No Render Dashboard, vá em **Shell** (ícone de terminal)
2. Execute:

```bash
cd backend
npm run typeorm migration:run
```

#### 6.2. Via Deploy Hook (Automático)

Adicione ao `package.json` do backend:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "postbuild": "npm run typeorm migration:run",
    "typeorm": "typeorm-ts-node-commonjs"
  }
}
```

Isso executará as migrations automaticamente após cada deploy.

---

### 7. Testar Integração

#### 7.1. Testar Health Check

```bash
curl https://api.fincontrol.com/api/v1/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T15:45:00.000Z",
  "uptime": 123.45
}
```

#### 7.2. Testar Webhook

```bash
curl -X POST https://api.fincontrol.com/api/v1/google-play/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

#### 7.3. Simular Notificação do Google Play

```bash
gcloud pubsub topics publish google-play-subscriptions \
  --message='{"subscriptionNotification":{"version":"1.0","notificationType":4,"purchaseToken":"test-token","subscriptionId":"premium_monthly"}}'
```

---

### 8. Monitorar Logs no Render

#### 8.1. Logs em Tempo Real

1. No Render Dashboard, vá em **Logs**
2. Você verá todos os logs do backend em tempo real
3. Procure por:
   - `✅ Google Play API client initialized`
   - `📬 Received Google Play notification`
   - `✅ Google Play subscription activated`

#### 8.2. Filtrar Logs

Use a busca no topo da página de logs:
- `google play` - Ver todas as atividades do Google Play
- `webhook` - Ver requisições do webhook
- `error` - Ver erros

---

### 9. Configurar Alertas (Opcional)

#### 9.1. Notificações do Render

1. Vá em **Settings** > **Notifications**
2. Adicione seu email
3. Ative:
   - ✅ Deploy failures
   - ✅ Service crashes
   - ✅ Health check failures

#### 9.2. Alertas do Google Cloud

```bash
# Criar alerta para falhas no webhook
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Webhook Failures" \
  --condition-display-name="High error rate"
```

---

## 🔒 Segurança no Render

### Variáveis de Ambiente Seguras

- ✅ Todas as variáveis são criptografadas
- ✅ Não aparecem nos logs
- ✅ Acessíveis apenas pelo seu serviço

### HTTPS Automático

- ✅ Certificado SSL gerenciado pelo Render
- ✅ Renovação automática
- ✅ TLS 1.2 e 1.3 suportados

### Proteção DDoS

- ✅ Render tem proteção DDoS integrada
- ✅ Rate limiting pode ser adicionado no código

---

## 📊 Estrutura de Arquivos no Render

```
/opt/render/project/src/
├── backend/
│   ├── dist/              # Código compilado
│   ├── src/               # Código fonte
│   ├── node_modules/      # Dependências
│   └── package.json
└── /tmp/
    └── google-play-service-account.json  # Gerado em runtime
```

---

## 🆘 Troubleshooting

### Problema: Credenciais do Google Play não carregam

**Solução:**
1. Verificar se `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64` está configurada
2. Verificar se o Base64 está correto (sem quebras de linha)
3. Ver logs: procure por "Failed to initialize Google Play API client"

```bash
# Recriar Base64 (sem quebras de linha)
base64 -w 0 google-play-service-account.json
```

### Problema: Webhook não recebe notificações

**Solução:**
1. Verificar se a URL está correta no Pub/Sub
2. Testar manualmente com curl
3. Verificar logs do Render
4. Verificar logs do Pub/Sub:

```bash
gcloud logging read "resource.type=pubsub_subscription" --limit 50
```

### Problema: Migration não executa

**Solução:**
1. Executar manualmente via Shell do Render
2. Verificar conexão com banco de dados
3. Verificar se `typeorm` está instalado

### Problema: Erro de conexão com banco de dados

**Solução:**
1. Verificar variáveis `DB_*` no Render
2. Verificar se o IP do Render está na whitelist do banco
3. Usar banco de dados gerenciado do Render (recomendado)

---

## ✅ Checklist de Configuração

- [ ] Credenciais do Google Play convertidas para Base64
- [ ] Variáveis de ambiente configuradas no Render
- [ ] Código atualizado para ler credenciais do Base64
- [ ] Deploy realizado com sucesso
- [ ] Migration executada
- [ ] Domínio customizado configurado (opcional)
- [ ] DNS propagado
- [ ] Tópico Pub/Sub criado
- [ ] Subscription push configurada
- [ ] Webhook configurado no Google Play Console
- [ ] Testes de conectividade realizados
- [ ] Logs monitorados
- [ ] Alertas configurados

---

## 🚀 Deploy Automático

O Render faz deploy automático quando você faz push para o GitHub:

```bash
git add .
git commit -m "feat: configurar Google Play Billing"
git push origin main
```

O Render irá:
1. ✅ Detectar mudanças no GitHub
2. ✅ Instalar dependências
3. ✅ Compilar TypeScript
4. ✅ Executar migrations (se configurado)
5. ✅ Reiniciar serviço
6. ✅ Verificar health check

---

## 📈 Monitoramento de Performance

### Métricas do Render

No Dashboard do Render, você pode ver:
- **CPU Usage** - Uso de CPU
- **Memory Usage** - Uso de memória
- **Request Count** - Número de requisições
- **Response Time** - Tempo de resposta

### Otimizações Recomendadas

1. **Usar plano pago** - Evita cold starts
2. **Configurar health check** - Mantém serviço ativo
3. **Adicionar cache** - Redis para sessões
4. **Otimizar queries** - Índices no banco de dados

---

## 💰 Custos no Render

### Plano Free
- ✅ HTTPS incluído
- ✅ 750 horas/mês
- ⚠️ Cold starts após 15min de inatividade
- ⚠️ 512MB RAM

### Plano Starter ($7/mês)
- ✅ Sem cold starts
- ✅ 512MB RAM
- ✅ Deploy automático
- ✅ Suporte prioritário

### Recomendação
- **Desenvolvimento:** Free
- **Produção:** Starter ou superior

---

## 📞 Suporte

### Render
- [Documentação](https://render.com/docs)
- [Status](https://status.render.com)
- [Community](https://community.render.com)

### Google Play
- [Documentação](https://developer.android.com/google/play/billing)
- [Suporte](https://support.google.com/googleplay/android-developer)

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0.0
