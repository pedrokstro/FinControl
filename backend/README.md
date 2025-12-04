# 🚀 FinControl Backend - Production Ready

Backend completo e robusto para o sistema FinControl, desenvolvido com Node.js, Express, TypeScript e PostgreSQL.

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando](#executando)
- [API Endpoints](#api-endpoints)
- [Testes](#testes)
- [Deploy](#deploy)
- [Documentação](#documentação)

---

## ✨ Características

### 🔐 Segurança
- ✅ Autenticação JWT com refresh tokens
- ✅ Senhas criptografadas com bcrypt
- ✅ Rate limiting por IP
- ✅ CORS configurável
- ✅ Helmet para headers de segurança
- ✅ Validação de inputs com Joi
- ✅ Proteção contra SQL injection
- ✅ HTTPS ready

### 📊 Funcionalidades
- ✅ CRUD completo de usuários
- ✅ CRUD completo de categorias
- ✅ CRUD completo de transações
- ✅ Dashboard com métricas do mês atual
- ✅ Relatórios mensais e anuais
- ✅ Filtros avançados por data, categoria, tipo
- ✅ Paginação e ordenação
- ✅ Upload de fotos de perfil
- ✅ Exportação CSV/Excel/PDF
- ✅ Agregações e estatísticas

### 🌐 Encoding UTF-8
- ✅ Banco de dados UTF-8 (utf8mb4)
- ✅ API responses em UTF-8
- ✅ Suporte completo a acentuação portuguesa
- ✅ Exports (CSV/Excel) em UTF-8

### 🔍 Observabilidade
- ✅ Logging estruturado (Winston)
- ✅ Request logging (Morgan)
- ✅ Error tracking
- ✅ Health check endpoint
- ✅ Métricas de performance

---

## 🛠️ Tecnologias

### Core
- **Node.js** 18+ - Runtime JavaScript
- **Express** 4.18 - Framework web
- **TypeScript** 5.3 - Tipagem estática
- **PostgreSQL** 14+ - Banco de dados

### ORM e Validação
- **TypeORM** 0.3 - ORM para TypeScript
- **Class Validator** - Validação de DTOs
- **Joi** - Validação de schemas

### Autenticação
- **JWT** - JSON Web Tokens
- **bcryptjs** - Hash de senhas
- **Refresh Tokens** - Renovação de tokens

### Upload e Processamento
- **Multer** - Upload de arquivos
- **Sharp** - Processamento de imagens

### Segurança
- **Helmet** - Security headers
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Rate limiting

### Logging e Monitoramento
- **Winston** - Logging estruturado
- **Morgan** - HTTP request logger

### Documentação
- **Swagger** - Documentação OpenAPI
- **Swagger UI** - Interface interativa

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de API

---

## 📦 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0
- **Docker** (opcional, para desenvolvimento)

---

## 🚀 Instalação

### 1. Clone o repositório (se ainda não fez)
```bash
cd backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados

#### Opção A: Docker (Recomendado)
```bash
npm run docker:up
```

#### Opção B: PostgreSQL Local
```sql
CREATE DATABASE fincontrol_db;
CREATE USER fincontrol WITH PASSWORD 'fincontrol_password';
GRANT ALL PRIVILEGES ON DATABASE fincontrol_db TO fincontrol;
```

### 4. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 5. Execute as migrations
```bash
npm run migration:run
```

### 6. (Opcional) Popule o banco com dados de exemplo
```bash
npm run seed
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente (development/production) | development |
| `PORT` | Porta do servidor | 5000 |
| `API_PREFIX` | Prefixo das rotas | /api/v1 |
| `DB_HOST` | Host do PostgreSQL | localhost |
| `DB_PORT` | Porta do PostgreSQL | 5432 |
| `DB_USERNAME` | Usuário do banco | fincontrol |
| `DB_PASSWORD` | Senha do banco | fincontrol_password |
| `DB_DATABASE` | Nome do banco | fincontrol_db |
| `JWT_SECRET` | Secret do JWT | (obrigatório em prod) |
| `JWT_REFRESH_SECRET` | Secret do refresh token | (obrigatório em prod) |
| `JWT_EXPIRES_IN` | Expiração do JWT | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Expiração do refresh | 7d |
| `CORS_ORIGIN` | Origem permitida no CORS | http://localhost:3000 |
| `UPLOAD_DIR` | Diretório de uploads | uploads |
| `MAX_FILE_SIZE` | Tamanho máximo de arquivo | 5242880 (5MB) |

---

## 🏃 Executando

### Desenvolvimento
```bash
npm run dev
```
Servidor rodando em: `http://localhost:5000`

### Produção
```bash
# Build
npm run build

# Start
npm start
```

### Docker
```bash
# Subir todos os serviços (backend + postgres)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Autenticação

#### POST /auth/register
Registrar novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### POST /auth/login
Login
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### POST /auth/refresh
Renovar token
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Logout (revoga refresh token)

### Usuários

#### GET /users/me
Obter perfil do usuário autenticado

#### PUT /users/me
Atualizar perfil
```json
{
  "name": "João Silva Santos",
  "email": "joao.novo@example.com"
}
```

#### POST /users/me/avatar
Upload de foto de perfil (multipart/form-data)

#### PUT /users/me/password
Alterar senha
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

### Categorias

#### GET /categories
Listar categorias do usuário
- Query params: `type` (income/expense), `page`, `limit`

#### POST /categories
Criar categoria
```json
{
  "name": "Alimentação",
  "type": "expense",
  "color": "#ef4444",
  "icon": "UtensilsCrossed"
}
```

#### GET /categories/:id
Obter categoria por ID

#### PUT /categories/:id
Atualizar categoria

#### DELETE /categories/:id
Deletar categoria

### Transações

#### GET /transactions
Listar transações
- Query params: `month`, `year`, `type`, `categoryId`, `page`, `limit`, `sortBy`, `sortOrder`

#### POST /transactions
Criar transação
```json
{
  "type": "expense",
  "amount": 150.50,
  "description": "Supermercado",
  "date": "2024-01-15",
  "categoryId": "uuid-da-categoria"
}
```

#### GET /transactions/:id
Obter transação por ID

#### PUT /transactions/:id
Atualizar transação

#### DELETE /transactions/:id
Deletar transação

### Dashboard

#### GET /dashboard
Dados do dashboard do mês atual
```json
{
  "currentMonth": {
    "income": 5000,
    "expense": 3500,
    "balance": 1500
  },
  "recentTransactions": [...],
  "topCategories": [...]
}
```

#### GET /dashboard/monthly/:year/:month
Dados de um mês específico

### Relatórios

#### GET /reports/monthly
Relatório mensal
- Query params: `year`, `month`

#### GET /reports/annual
Relatório anual
- Query params: `year`

#### GET /reports/category
Relatório por categoria
- Query params: `startDate`, `endDate`, `type`

#### GET /reports/export/csv
Exportar transações em CSV
- Query params: `startDate`, `endDate`

#### GET /reports/export/excel
Exportar transações em Excel

#### GET /reports/export/pdf
Exportar relatório em PDF

### Health Check

#### GET /health
Status do servidor e banco de dados

---

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Testes em modo watch
```bash
npm run test:watch
```

### Testes E2E
```bash
npm run test:e2e
```

### Coverage
```bash
npm test -- --coverage
```

---

## 📚 Documentação

### Swagger UI
Acesse a documentação interativa:
```
http://localhost:5000/api-docs
```

### OpenAPI JSON
```
http://localhost:5000/api-docs.json
```

---

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: fincontrol_db
      POSTGRES_USER: fincontrol
      POSTGRES_PASSWORD: fincontrol_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## 🚢 Deploy

### Heroku
```bash
heroku create fincontrol-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Railway
```bash
railway init
railway add postgresql
railway up
```

### AWS ECS / Kubernetes
Veja `deploy/` para configurações de infraestrutura.

---

## 🔒 Segurança

### Checklist de Produção
- [ ] Alterar `JWT_SECRET` e `JWT_REFRESH_SECRET`
- [ ] Configurar CORS para domínio específico
- [ ] Habilitar HTTPS
- [ ] Configurar rate limiting adequado
- [ ] Revisar permissões do banco de dados
- [ ] Configurar backups automáticos
- [ ] Habilitar monitoring (Sentry, etc)
- [ ] Configurar logs centralizados
- [ ] Revisar variáveis de ambiente
- [ ] Testar em ambiente de staging

---

## 📝 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/      # Controllers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── category.controller.ts
│   │   ├── transaction.controller.ts
│   │   └── dashboard.controller.ts
│   ├── middlewares/      # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── upload.middleware.ts
│   ├── models/           # Models TypeORM
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Transaction.ts
│   │   └── RefreshToken.ts
│   ├── routes/           # Rotas
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── category.routes.ts
│   │   ├── transaction.routes.ts
│   │   └── dashboard.routes.ts
│   ├── services/         # Lógica de negócio
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── category.service.ts
│   │   ├── transaction.service.ts
│   │   └── report.service.ts
│   ├── validators/       # Schemas de validação
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── category.validator.ts
│   │   └── transaction.validator.ts
│   ├── utils/            # Utilitários
│   │   ├── logger.ts
│   │   ├── jwt.ts
│   │   └── errors.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── database/         # Migrations e seeders
│   │   ├── migrations/
│   │   └── seeders/
│   ├── app.ts            # Configuração Express
│   └── server.ts         # Entry point
├── tests/                # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── uploads/              # Arquivos uploadados
├── logs/                 # Logs
├── .env.example          # Exemplo de env
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](../LICENSE) para detalhes.

---

## 👥 Autores

FinControl Team

---

## 🙏 Agradecimentos

- Express.js
- TypeORM
- PostgreSQL
- Comunidade Open Source

---

**Status:** ✅ Production Ready  
**Versão:** 1.0.0  
**Última atualização:** 2024
