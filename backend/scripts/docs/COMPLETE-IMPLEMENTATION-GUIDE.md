# 🎯 Guia Completo de Implementação - Backend FinControl

## ✅ Arquivos Já Criados (Fase 1 e 2)

### Configuração Base
- ✅ `package.json` - Todas as dependências
- ✅ `tsconfig.json` - TypeScript config
- ✅ `.env.example` - Variáveis de ambiente
- ✅ `.gitignore`
- ✅ `docker-compose.yml` - PostgreSQL
- ✅ `init-db.sql` - Init UTF-8

### Config
- ✅ `src/config/env.ts`
- ✅ `src/config/database.ts`

### Models
- ✅ `src/models/User.ts`
- ✅ `src/models/Category.ts`
- ✅ `src/models/Transaction.ts`
- ✅ `src/models/RefreshToken.ts`

### Utils
- ✅ `src/utils/logger.ts`
- ✅ `src/utils/jwt.ts`
- ✅ `src/utils/errors.ts`
- ✅ `src/utils/response.ts`

### Validators
- ✅ `src/validators/auth.validator.ts`
- ✅ `src/validators/user.validator.ts`
- ✅ `src/validators/category.validator.ts`
- ✅ `src/validators/transaction.validator.ts`

### Middlewares
- ✅ `src/middlewares/auth.middleware.ts`
- ✅ `src/middlewares/validation.middleware.ts`
- ✅ `src/middlewares/error.middleware.ts`
- ✅ `src/middlewares/upload.middleware.ts`

### Services (Parcial)
- ✅ `src/services/auth.service.ts`

---

## 📝 Arquivos Restantes para Criar

### 1. Services Restantes

#### `src/services/user.service.ts`
```typescript
import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { NotFoundError, ConflictError } from '@/utils/errors';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError('Usuário não encontrado');
    return user.toJSON();
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findOne({ where: { email: data.email } });
      if (existing) throw new ConflictError('Email já em uso');
    }

    Object.assign(user, data);
    await this.userRepository.save(user);
    return user.toJSON();
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    if (!(await user.comparePassword(currentPassword))) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    // Processar imagem com sharp
    const filename = `avatar-${userId}-${Date.now()}.webp`;
    const outputPath = path.join('uploads', 'avatars', filename);

    await sharp(file.path)
      .resize(200, 200, { fit: 'cover' })
      .webp({ quality: 90 })
      .toFile(outputPath);

    // Deletar arquivo original
    await fs.unlink(file.path);

    // Deletar avatar anterior se existir
    if (user.avatar) {
      try {
        await fs.unlink(user.avatar);
      } catch (error) {
        // Ignora se arquivo não existir
      }
    }

    user.avatar = outputPath;
    await this.userRepository.save(user);
    return user.toJSON();
  }
}
```

#### `src/services/category.service.ts`
```typescript
import { AppDataSource } from '@/config/database';
import { Category, CategoryType } from '@/models/Category';
import { NotFoundError } from '@/utils/errors';

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async create(userId: string, data: { name: string; type: CategoryType; color: string; icon: string }) {
    const category = this.categoryRepository.create({ ...data, userId });
    await this.categoryRepository.save(category);
    return category;
  }

  async findAll(userId: string, type?: CategoryType) {
    const where: any = { userId };
    if (type) where.type = type;
    
    return this.categoryRepository.find({ where, order: { name: 'ASC' } });
  }

  async findById(id: string, userId: string) {
    const category = await this.categoryRepository.findOne({ where: { id, userId } });
    if (!category) throw new NotFoundError('Categoria não encontrada');
    return category;
  }

  async update(id: string, userId: string, data: Partial<Category>) {
    const category = await this.findById(id, userId);
    Object.assign(category, data);
    await this.categoryRepository.save(category);
    return category;
  }

  async delete(id: string, userId: string) {
    const category = await this.findById(id, userId);
    await this.categoryRepository.remove(category);
  }
}
```

#### `src/services/transaction.service.ts`
```typescript
import { AppDataSource } from '@/config/database';
import { Transaction, TransactionType } from '@/models/Transaction';
import { NotFoundError } from '@/utils/errors';
import { Between } from 'typeorm';

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);

  async create(userId: string, data: any) {
    const transaction = this.transactionRepository.create({ ...data, userId });
    await this.transactionRepository.save(transaction);
    return this.transactionRepository.findOne({
      where: { id: transaction.id },
      relations: ['category'],
    });
  }

  async findAll(userId: string, filters: any) {
    const { month, year, type, categoryId, page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = filters;
    
    const where: any = { userId };
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;

    // Filtro por mês/ano
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      where.date = Between(startDate, endDate);
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      where.date = Between(startDate, endDate);
    }

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where,
      relations: ['category'],
      order: { [sortBy]: sortOrder.toUpperCase() },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { transactions, total, page, limit };
  }

  async findById(id: string, userId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
    if (!transaction) throw new NotFoundError('Transação não encontrada');
    return transaction;
  }

  async update(id: string, userId: string, data: Partial<Transaction>) {
    const transaction = await this.findById(id, userId);
    Object.assign(transaction, data);
    await this.transactionRepository.save(transaction);
    return this.transactionRepository.findOne({
      where: { id: transaction.id },
      relations: ['category'],
    });
  }

  async delete(id: string, userId: string) {
    const transaction = await this.findById(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  async getDashboardData(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startOfMonth, endOfMonth),
      },
      relations: ['category'],
      order: { date: 'DESC' },
      take: 10,
    });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      currentMonth: {
        income,
        expense,
        balance: income - expense,
      },
      recentTransactions: transactions,
    };
  }
}
```

### 2. Controllers

Crie os controllers em `src/controllers/`:

- `auth.controller.ts` - Chama AuthService
- `user.controller.ts` - Chama UserService  
- `category.controller.ts` - Chama CategoryService
- `transaction.controller.ts` - Chama TransactionService
- `dashboard.controller.ts` - Chama TransactionService.getDashboardData

**Exemplo de Controller:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { sendSuccess, sendCreated } from '@/utils/response';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    sendCreated(res, result, 'Usuário registrado com sucesso');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, result, 'Login realizado com sucesso');
  } catch (error) {
    next(error);
  }
};

// ... outros métodos
```

### 3. Routes

Crie as rotas em `src/routes/`:

**`src/routes/auth.routes.ts`:**
```typescript
import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validation.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '@/validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.post('/logout', authController.logout);

export default router;
```

**`src/routes/index.ts`:**
```typescript
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
```

### 4. App.ts

**`src/app.ts`:**
```typescript
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/config/env';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middlewares/error.middleware';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Muitas requisições, tente novamente mais tarde',
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinControl API',
      version: '1.0.0',
      description: 'API de controle financeiro pessoal',
    },
    servers: [{ url: `http://localhost:${config.port}${config.apiPrefix}` }],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use(config.apiPrefix, routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```

### 5. Server.ts

**`src/server.ts`:**
```typescript
import app from './app';
import { config } from '@/config/env';
import { initializeDatabase } from '@/config/database';
import { logger } from '@/utils/logger';

const startServer = async () => {
  try {
    // Inicializar banco de dados
    await initializeDatabase();

    // Iniciar servidor
    app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📚 API Docs: http://localhost:${config.port}/api-docs`);
      logger.info(`🏥 Health check: http://localhost:${config.port}/health`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
```

---

## 🚀 Próximos Passos

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Criar Diretórios Necessários
```bash
mkdir -p uploads/avatars logs
```

### 3. Configurar Ambiente
```bash
cp .env.example .env
# Edite .env conforme necessário
```

### 4. Subir PostgreSQL
```bash
docker-compose up -d postgres
```

### 5. Criar Arquivos Restantes
Crie os arquivos listados acima seguindo os exemplos.

### 6. Executar Servidor
```bash
npm run dev
```

---

## ✅ Checklist de Implementação

- [x] Utils (logger, jwt, errors, response)
- [x] Validators (auth, user, category, transaction)
- [x] Middlewares (auth, validation, error, upload)
- [x] Services (auth - completo)
- [ ] Services (user, category, transaction)
- [ ] Controllers (auth, user, category, transaction, dashboard)
- [ ] Routes (auth, user, category, transaction, dashboard, index)
- [ ] app.ts
- [ ] server.ts
- [ ] Migrations
- [ ] Seeders
- [ ] Testes

---

## 📚 Recursos Adicionais

- Documentação TypeORM: https://typeorm.io
- Documentação Express: https://expressjs.com
- Documentação Joi: https://joi.dev

---

**Status**: 70% completo  
**Tempo estimado para conclusão**: 2-3 horas  
**Próximo**: Criar services, controllers e routes restantes
