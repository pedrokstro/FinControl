# 🔗 Integração Frontend com API - FinControl

## ✅ Configuração Completa!

A API do backend está configurada e pronta para uso no frontend.

---

## 📁 Arquivos Criados

### Configuração
- ✅ `.env.local` - URL da API configurada
- ✅ `src/config/api.ts` - Instância do Axios configurada

### Services (Camada de API)
- ✅ `src/services/auth.service.ts` - Autenticação
- ✅ `src/services/user.service.ts` - Usuário
- ✅ `src/services/category.service.ts` - Categorias
- ✅ `src/services/transaction.service.ts` - Transações
- ✅ `src/services/dashboard.service.ts` - Dashboard
- ✅ `src/services/index.ts` - Exportações centralizadas

---

## 🚀 Como Usar nos Componentes

### 1️⃣ Login

```typescript
import { authService } from '@/services';
import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await authService.login({ email, password });
      console.log('Login realizado:', response.user);
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Email ou senha incorretos');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

### 2️⃣ Listar Categorias

```typescript
import { categoryService } from '@/services';
import { useEffect, useState } from 'react';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  return (
    <div>
      <h1>Categorias</h1>
      {categories.map(category => (
        <div key={category.id}>
          {category.name} - {category.type}
        </div>
      ))}
    </div>
  );
}
```

### 3️⃣ Criar Transação

```typescript
import { transactionService, categoryService } from '@/services';
import { useState, useEffect } from 'react';

function NewTransactionPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: 0,
    description: '',
    date: new Date().toISOString(),
    categoryId: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await transactionService.create(formData);
      alert('Transação criada com sucesso!');
      // Redirecionar ou limpar formulário
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select 
        value={formData.type}
        onChange={(e) => setFormData({...formData, type: e.target.value})}
      >
        <option value="income">Receita</option>
        <option value="expense">Despesa</option>
      </select>

      <input 
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
        placeholder="Valor"
      />

      <input 
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Descrição"
      />

      <select 
        value={formData.categoryId}
        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
      >
        <option value="">Selecione uma categoria</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <button type="submit">Criar Transação</button>
    </form>
  );
}
```

### 4️⃣ Dashboard

```typescript
import { dashboardService } from '@/services';
import { useEffect, useState } from 'react';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await dashboardService.getData();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  if (!dashboardData) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Receitas: R$ {dashboardData.summary.income}</p>
        <p>Despesas: R$ {dashboardData.summary.expense}</p>
        <p>Saldo: R$ {dashboardData.summary.balance}</p>
      </div>

      <h2>Últimas Transações</h2>
      {dashboardData.recentTransactions.map(transaction => (
        <div key={transaction.id}>
          {transaction.description} - R$ {transaction.amount}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Autenticação Automática

O sistema já está configurado para:

1. ✅ **Adicionar token automaticamente** em todas as requisições
2. ✅ **Renovar token** automaticamente quando expirar
3. ✅ **Redirecionar para login** se o token for inválido
4. ✅ **Salvar dados do usuário** no localStorage

---

## 🎯 Credenciais Demo

Para testar, use:
- **Email**: `demo@financeiro.com`
- **Senha**: `demo123`

---

## 📊 Services Disponíveis

### authService
- `login(credentials)` - Fazer login
- `register(data)` - Registrar usuário
- `logout()` - Fazer logout
- `refreshToken()` - Renovar token
- `getCurrentUser()` - Obter usuário atual
- `isAuthenticated()` - Verificar se está autenticado

### userService
- `getProfile()` - Obter perfil
- `updateProfile(data)` - Atualizar perfil
- `changePassword(data)` - Alterar senha
- `uploadAvatar(file)` - Upload de avatar

### categoryService
- `getAll(type?)` - Listar categorias
- `getById(id)` - Obter categoria
- `create(data)` - Criar categoria
- `update(id, data)` - Atualizar categoria
- `delete(id)` - Deletar categoria

### transactionService
- `getAll(filters?)` - Listar transações
- `getById(id)` - Obter transação
- `create(data)` - Criar transação
- `update(id, data)` - Atualizar transação
- `delete(id)` - Deletar transação

### dashboardService
- `getData(month?, year?)` - Obter dados do dashboard

---

## 🚀 Próximos Passos

1. **Atualizar componentes existentes** para usar os services
2. **Remover mock data** e usar dados reais da API
3. **Testar todas as funcionalidades**
4. **Adicionar tratamento de erros** com toast notifications

---

## 🔧 Configuração do Vite

O Vite já está configurado para usar variáveis de ambiente com prefixo `VITE_`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Acesse no código:
```typescript
import.meta.env.VITE_API_URL
```

---

## ✅ Checklist de Integração

- [x] Configurar .env.local
- [x] Criar config/api.ts
- [x] Criar services
- [x] Configurar interceptors
- [x] Adicionar refresh token automático
- [ ] Atualizar componentes para usar API real
- [ ] Remover mock data
- [ ] Testar login
- [ ] Testar CRUD de categorias
- [ ] Testar CRUD de transações
- [ ] Testar dashboard

---

**🎉 Frontend configurado e pronto para se conectar ao backend!**
