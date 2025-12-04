# 📋 Plano de Migração: localStorage → Banco de Dados

## 🎯 Objetivo
Migrar todos os dados persistentes do localStorage para o banco de dados PostgreSQL, garantindo consistência entre dispositivos e sessões.

## 📊 Análise Atual

### ✅ O que já está correto:
1. **Zustand Persist** - authStore e financialStore usam persist do Zustand (OK para cache local)
2. **API de Transações** - Já salva no backend ✅
3. **API de Categorias** - Já salva no backend ✅
4. **API de Usuário** - Já salva no backend ✅

### ❌ Problemas Identificados:

#### 1. **Duplicação de Tokens** (CRÍTICO)
- **Arquivo:** `src/services/auth.service.ts`
- **Problema:** Salva tokens diretamente no localStorage, duplicando o que o Zustand já faz
- **Solução:** Remover `localStorage.setItem/getItem` e usar apenas Zustand

#### 2. **Tema do Usuário** (IMPORTANTE)
- **Arquivo:** `src/contexts/ThemeContext.tsx`
- **Problema:** Tema salvo apenas no localStorage
- **Solução:** Criar campo `theme` na tabela `users`

#### 3. **Preferências de Visualização** (IMPORTANTE)
- **Arquivo:** `src/pages/Categories.tsx`
- **Problema:** Preferência `categories-view-mode` salva apenas no localStorage
- **Solução:** Criar tabela `user_preferences` para armazenar preferências

## 🗄️ Mudanças no Banco de Dados

### Migration 1: Adicionar campo `theme` na tabela `users`

```sql
-- Migration: add_theme_to_users.sql
ALTER TABLE users 
ADD COLUMN theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system'));

-- Índice para performance
CREATE INDEX idx_users_theme ON users(theme);
```

### Migration 2: Criar tabela `user_preferences`

```sql
-- Migration: create_user_preferences.sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Garantir que cada usuário tenha apenas uma preferência por chave
  UNIQUE("userId", key)
);

-- Índices
CREATE INDEX idx_user_preferences_user_id ON user_preferences("userId");
CREATE INDEX idx_user_preferences_key ON user_preferences(key);

-- Trigger para atualizar updatedAt
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_user_preferences_updated_at();
```

## 🔧 Mudanças no Backend

### 1. Criar Entity `UserPreference`

```typescript
// src/entities/UserPreference.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './User';

@Entity('user_preferences')
@Unique(['userId', 'key'])
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Criar Service `UserPreferenceService`

```typescript
// src/services/userPreference.service.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { UserPreference } from '@/entities/UserPreference';

export class UserPreferenceService {
  private repository: Repository<UserPreference>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserPreference);
  }

  async get(userId: string, key: string): Promise<string | null> {
    const preference = await this.repository.findOne({
      where: { userId, key },
    });
    return preference?.value || null;
  }

  async getAll(userId: string): Promise<Record<string, string>> {
    const preferences = await this.repository.find({
      where: { userId },
    });
    
    return preferences.reduce((acc, pref) => {
      acc[pref.key] = pref.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async set(userId: string, key: string, value: string): Promise<void> {
    await this.repository.upsert(
      { userId, key, value },
      ['userId', 'key']
    );
  }

  async setMany(userId: string, preferences: Record<string, string>): Promise<void> {
    const entries = Object.entries(preferences).map(([key, value]) => ({
      userId,
      key,
      value,
    }));
    
    await this.repository.upsert(entries, ['userId', 'key']);
  }

  async delete(userId: string, key: string): Promise<void> {
    await this.repository.delete({ userId, key });
  }
}
```

### 3. Criar Controller `UserPreferenceController`

```typescript
// src/controllers/userPreference.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserPreferenceService } from '@/services/userPreference.service';
import { sendSuccess } from '@/utils/response';

const service = new UserPreferenceService();

export const getPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const preferences = await service.getAll(userId);
    sendSuccess(res, preferences, 'Preferências obtidas com sucesso');
  } catch (error) {
    next(error);
  }
};

export const getPreference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { key } = req.params;
    const value = await service.get(userId, key);
    sendSuccess(res, { key, value }, 'Preferência obtida com sucesso');
  } catch (error) {
    next(error);
  }
};

export const setPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const preferences = req.body;
    await service.setMany(userId, preferences);
    sendSuccess(res, null, 'Preferências salvas com sucesso');
  } catch (error) {
    next(error);
  }
};

export const setPreference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { key } = req.params;
    const { value } = req.body;
    await service.set(userId, key, value);
    sendSuccess(res, null, 'Preferência salva com sucesso');
  } catch (error) {
    next(error);
  }
};
```

### 4. Criar Rotas

```typescript
// src/routes/userPreference.routes.ts
import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import * as controller from '@/controllers/userPreference.controller';

const router = Router();

router.use(authenticate);

router.get('/', controller.getPreferences);
router.get('/:key', controller.getPreference);
router.post('/', controller.setPreferences);
router.put('/:key', controller.setPreference);

export default router;
```

### 5. Atualizar User Entity para incluir `theme`

```typescript
// Adicionar ao src/entities/User.ts
@Column({ type: 'varchar', length: 10, default: 'light' })
theme: 'light' | 'dark' | 'system';
```

## 🎨 Mudanças no Frontend

### 1. Criar Service `UserPreferenceService`

```typescript
// src/services/userPreference.service.ts
import api from '@/config/api';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  categoriesViewMode?: 'grid' | 'list';
  [key: string]: string | undefined;
}

class UserPreferenceService {
  async getAll(): Promise<UserPreferences> {
    const response = await api.get('/user-preferences');
    return response.data.data;
  }

  async get(key: string): Promise<string | null> {
    const response = await api.get(`/user-preferences/${key}`);
    return response.data.data.value;
  }

  async set(key: string, value: string): Promise<void> {
    await api.put(`/user-preferences/${key}`, { value });
  }

  async setMany(preferences: Record<string, string>): Promise<void> {
    await api.post('/user-preferences', preferences);
  }
}

export default new UserPreferenceService();
```

### 2. Atualizar `ThemeContext` para usar API

```typescript
// src/contexts/ThemeContext.tsx
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isLoading, setIsLoading] = useState(true)

  // Carregar tema do backend
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const preferences = await userPreferenceService.getAll()
        if (preferences.theme) {
          setThemeState(preferences.theme as Theme)
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTheme()
  }, [])

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    
    try {
      await userPreferenceService.set('theme', newTheme)
    } catch (error) {
      console.error('Erro ao salvar tema:', error)
    }
  }

  // ... resto do código
}
```

### 3. Atualizar `Categories.tsx` para usar API

```typescript
// src/pages/Categories.tsx
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

useEffect(() => {
  const loadViewMode = async () => {
    try {
      const mode = await userPreferenceService.get('categoriesViewMode')
      if (mode) {
        setViewMode(mode as 'grid' | 'list')
      }
    } catch (error) {
      console.error('Erro ao carregar modo de visualização:', error)
    }
  }
  
  loadViewMode()
}, [])

const handleViewModeChange = async (mode: 'grid' | 'list') => {
  setViewMode(mode)
  
  try {
    await userPreferenceService.set('categoriesViewMode', mode)
  } catch (error) {
    console.error('Erro ao salvar modo de visualização:', error)
  }
}
```

### 4. Limpar `auth.service.ts`

```typescript
// Remover todas as linhas que usam localStorage diretamente
// O Zustand já faz isso via persist

async login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post('/auth/login', credentials);
  // REMOVER: localStorage.setItem('accessToken', ...)
  // REMOVER: localStorage.setItem('refreshToken', ...)
  // REMOVER: localStorage.setItem('user', ...)
  return response.data.data;
}
```

### 5. Atualizar `user.service.ts`

```typescript
// Remover linhas que atualizam localStorage
async updateProfile(data: UpdateProfileData): Promise<User> {
  const response = await api.put('/users/me', data);
  // REMOVER: localStorage.setItem('user', ...)
  return response.data.data;
}
```

## 📝 Checklist de Implementação

### Backend
- [x] ✅ Criar migration `add_theme_to_users.sql` - **CONCLUÍDO**
- [x] ✅ Criar migration `create_user_preferences.sql` - **CONCLUÍDO**
- [x] ✅ Executar migrations - **CONCLUÍDO** (via executar-migrations.ps1)
- [x] ✅ Criar entity `UserPreference` - **CONCLUÍDO** (backend/src/entities/UserPreference.ts)
- [x] ✅ Criar service `UserPreferenceService` - **CONCLUÍDO** (backend/src/services/userPreference.service.ts)
- [x] ✅ Criar controller `UserPreferenceController` - **CONCLUÍDO** (backend/src/controllers/userPreference.controller.ts)
- [x] ✅ Criar rotas `/api/v1/user-preferences` - **CONCLUÍDO** (backend/src/routes/userPreference.routes.ts)
- [x] ✅ Atualizar `User` entity com campo `theme` - **CONCLUÍDO** (backend/src/models/User.ts)
- [ ] ⏳ Testar endpoints via Postman/Thunder Client - **PENDENTE**

### Frontend
- [x] ✅ Criar `userPreference.service.ts` - **CONCLUÍDO** (src/services/userPreference.service.ts)
- [x] ✅ Atualizar `ThemeContext.tsx` - **CONCLUÍDO** (migrado para API)
- [x] ✅ Atualizar `Categories.tsx` - **CONCLUÍDO** (view mode migrado para API)
- [x] ✅ Limpar `auth.service.ts` - **CONCLUÍDO** (removidas duplicações de localStorage)
- [x] ✅ Limpar `user.service.ts` - **CONCLUÍDO** (removido localStorage.setItem)
- [x] ✅ Remover hook `useLocalStorage` - **NÃO NECESSÁRIO** (não está sendo usado)
- [ ] ⏳ Testar login/logout - **PRONTO PARA TESTE**
- [ ] ⏳ Testar mudança de tema - **PRONTO PARA TESTE**
- [ ] ⏳ Testar mudança de view mode - **PRONTO PARA TESTE**

### Testes
- [ ] ⏳ Criar conta nova - verificar tema padrão - **PENDENTE**
- [ ] ⏳ Mudar tema - fazer logout/login - verificar persistência - **PENDENTE**
- [ ] ⏳ Mudar view mode - fazer logout/login - verificar persistência - **PENDENTE**
- [ ] ⏳ Testar em dispositivo diferente - verificar sincronização - **PENDENTE**
- [ ] ⏳ Testar upgrade/downgrade de plano premium - **PENDENTE**

## 🎯 Resultado Esperado

Após a migração:
- ✅ Nenhum dado do usuário depende de localStorage
- ✅ Tema sincronizado entre dispositivos
- ✅ Preferências sincronizadas entre dispositivos
- ✅ Tokens gerenciados apenas pelo Zustand (cache local)
- ✅ Dados persistentes apenas no banco de dados
- ✅ Logout limpa apenas cache local, não dados do banco

## ⚠️ Notas Importantes

1. **Zustand Persist é OK** - Usado apenas como cache local para performance
2. **Tokens no Zustand** - OK para sessão atual, mas não persistir dados críticos
3. **Migração Gradual** - Implementar feature por feature
4. **Backward Compatibility** - Manter suporte a localStorage durante transição
5. **Performance** - Cachear preferências no Zustand após carregar do backend
