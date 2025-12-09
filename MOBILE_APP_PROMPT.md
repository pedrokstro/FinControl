# 📱 Prompt para Criação do FinControl Mobile

## 🎯 Objetivo
Criar um aplicativo mobile nativo usando **React Native** e **Expo** que consuma a API REST existente do FinControl, mantendo todas as funcionalidades da versão web com uma experiência otimizada para dispositivos móveis.

---

## 📋 Informações do Projeto Existente

### 🔗 Backend API
- **URL de Produção:** `https://fincontrol-backend.onrender.com`
- **Versão da API:** v1
- **Base Path:** `/api/v1`
- **Autenticação:** JWT (Bearer Token)
- **Banco de Dados:** PostgreSQL (Supabase)

### 🛠️ Stack Tecnológica Atual

#### Backend (Node.js + Express)
- **Framework:** Express 4.18
- **ORM:** TypeORM 0.3.19
- **Autenticação:** JWT (jsonwebtoken 9.0)
- **Validação:** Joi 17.11
- **Upload de Arquivos:** Multer + Cloudinary
- **Email:** Nodemailer (Gmail SMTP)
- **Cron Jobs:** node-cron 3.0
- **Rate Limiting:** express-rate-limit
- **Segurança:** Helmet, CORS, bcryptjs

#### Frontend Web (React)
- **Framework:** React 18.2 + TypeScript 5.2
- **Build Tool:** Vite 5.0
- **Roteamento:** React Router 6.20
- **Estilização:** Tailwind CSS 3.4
- **State Management:** Zustand 4.4
- **Formulários:** React Hook Form 7.49 + Zod 3.22
- **Gráficos:** Recharts 2.10
- **Ícones:** Lucide React
- **Notificações:** React Hot Toast
- **Animações:** Framer Motion
- **Analytics:** Vercel Analytics + Speed Insights

---

## 🎨 Funcionalidades a Implementar

### 1. 🔐 Autenticação e Segurança
- [ ] Login com email/senha
- [ ] Registro de novo usuário
- [ ] Verificação de email (código 6 dígitos)
- [ ] Recuperação de senha (código 6 dígitos)
- [ ] Logout
- [ ] Persistência de sessão (AsyncStorage)
- [ ] Refresh token automático
- [ ] Biometria (Face ID / Touch ID) - opcional

### 2. 📊 Dashboard
- [ ] Resumo financeiro do mês atual
- [ ] Saldo total (receitas - despesas)
- [ ] Cards de métricas:
  - Total de receitas
  - Total de despesas
  - Saldo disponível
  - Transações do mês
- [ ] Gráfico de evolução mensal (linha)
- [ ] Gráfico de distribuição por categoria (pizza)
- [ ] Lista das últimas 5 transações
- [ ] Pull-to-refresh

### 3. 💸 Transações
- [ ] Listagem de transações com scroll infinito
- [ ] Filtros:
  - Por tipo (receita/despesa)
  - Por categoria
  - Por período (mês/ano)
  - Busca por descrição
- [ ] Adicionar nova transação:
  - Tipo (receita/despesa)
  - Valor (teclado numérico)
  - Descrição
  - Data (date picker)
  - Categoria (seletor)
  - Transação recorrente (opcional):
    - Tipo: diária, semanal, mensal, anual
    - Número de parcelas
- [ ] Editar transação
- [ ] Deletar transação (com confirmação)
- [ ] Swipe actions (editar/deletar)

### 4. 🏷️ Categorias
- [ ] Listagem de categorias (separadas por tipo)
- [ ] Adicionar categoria:
  - Nome
  - Tipo (receita/despesa)
  - Ícone (seletor de emojis)
  - Cor (color picker)
- [ ] Editar categoria
- [ ] Deletar categoria (com validação)
- [ ] Visualizar total gasto por categoria

### 5. 📈 Relatórios
- [ ] Gráfico de evolução mensal (6 meses)
- [ ] Gráfico de distribuição por categoria
- [ ] Comparação mês atual vs anterior
- [ ] Top 5 categorias com maior gasto
- [ ] Filtros por período
- [ ] Exportar relatório (PDF/CSV) - compartilhar

### 6. ⚙️ Configurações
- [ ] Perfil do usuário:
  - Foto de perfil (câmera/galeria)
  - Nome
  - Email (não editável)
  - Data de cadastro
- [ ] Alterar senha
- [ ] Preferências:
  - Notificações push
  - Tema (claro/escuro)
  - Idioma (PT-BR/EN)
- [ ] Plano Premium:
  - Status atual (Free/Premium)
  - Upgrade para Premium
  - Gerenciar assinatura
- [ ] Sobre o app
- [ ] Termos de uso
- [ ] Política de privacidade
- [ ] Suporte (email)
- [ ] Deletar conta (com confirmação)
- [ ] Logout

### 7. 💎 Sistema Premium
- [ ] Tela de planos (Free vs Premium)
- [ ] Checkout (integração Stripe)
- [ ] Funcionalidades Premium:
  - Transações ilimitadas
  - Categorias ilimitadas
  - Relatórios avançados
  - Exportação de dados
  - Suporte prioritário
  - Sem anúncios

### 8. 🔔 Notificações
- [ ] Listagem de notificações
- [ ] Marcar como lida
- [ ] Deletar notificação
- [ ] Push notifications (Expo Notifications)
- [ ] Notificações de:
  - Transações recorrentes processadas
  - Lembretes de pagamento
  - Atualizações do sistema

---

## 🔌 Endpoints da API

### Autenticação (`/api/v1/auth`)
```
POST   /register           - Registrar usuário
POST   /login              - Login
POST   /logout             - Logout
POST   /refresh            - Refresh token
POST   /verify-email       - Verificar email
POST   /resend-code        - Reenviar código
POST   /forgot-password    - Solicitar reset
POST   /reset-password     - Resetar senha
```

### Usuário (`/api/v1/users`)
```
GET    /profile            - Obter perfil
PUT    /profile            - Atualizar perfil
PUT    /password           - Alterar senha
POST   /avatar             - Upload avatar
DELETE /account            - Deletar conta
```

### Transações (`/api/v1/transactions`)
```
GET    /                   - Listar (com paginação e filtros)
POST   /                   - Criar
GET    /:id                - Obter por ID
PUT    /:id                - Atualizar
DELETE /:id                - Deletar
POST   /recurring          - Criar recorrente
GET    /export/csv         - Exportar CSV
GET    /export/pdf         - Exportar PDF
```

### Categorias (`/api/v1/categories`)
```
GET    /                   - Listar
POST   /                   - Criar
GET    /:id                - Obter por ID
PUT    /:id                - Atualizar
DELETE /:id                - Deletar
```

### Dashboard (`/api/v1/dashboard`)
```
GET    /summary            - Resumo financeiro
GET    /monthly-evolution  - Evolução mensal
GET    /category-distribution - Distribuição por categoria
```

### Notificações (`/api/v1/notifications`)
```
GET    /                   - Listar
PUT    /:id/read           - Marcar como lida
DELETE /:id                - Deletar
```

### Assinaturas (`/api/v1/subscriptions`)
```
GET    /plans              - Listar planos
POST   /checkout           - Criar sessão de checkout
GET    /status             - Status da assinatura
POST   /cancel             - Cancelar assinatura
```

---

## 📦 Stack Recomendada para Mobile

### Core
```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.0",
  "typescript": "^5.3.0"
}
```

### Navegação
```json
{
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "react-native-screens": "~3.31.0",
  "react-native-safe-area-context": "4.10.0"
}
```

### State Management
```json
{
  "zustand": "^4.4.0",
  "react-query": "^3.39.0"
}
```

### Formulários e Validação
```json
{
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0"
}
```

### HTTP Client
```json
{
  "axios": "^1.6.0",
  "axios-retry": "^3.9.0"
}
```

### UI Components
```json
{
  "react-native-paper": "^5.11.0",
  "react-native-vector-icons": "^10.0.0",
  "@expo/vector-icons": "^14.0.0",
  "react-native-gesture-handler": "~2.16.0",
  "react-native-reanimated": "~3.10.0"
}
```

### Gráficos
```json
{
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "15.2.0"
}
```

### Armazenamento
```json
{
  "@react-native-async-storage/async-storage": "1.23.0"
}
```

### Imagens e Câmera
```json
{
  "expo-image-picker": "~15.0.0",
  "expo-camera": "~15.0.0",
  "expo-file-system": "~17.0.0"
}
```

### Notificações
```json
{
  "expo-notifications": "~0.28.0"
}
```

### Biometria
```json
{
  "expo-local-authentication": "~14.0.0"
}
```

### Outros
```json
{
  "date-fns": "^3.0.0",
  "react-native-keyboard-aware-scroll-view": "^0.9.5",
  "react-native-modal": "^13.0.1",
  "expo-haptics": "~13.0.0"
}
```

---

## 🏗️ Estrutura de Pastas Sugerida

```
fincontrol-mobile/
├── app.json                    # Configuração Expo
├── App.tsx                     # Entry point
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
│
├── src/
│   ├── @types/                 # TypeScript types
│   │   ├── navigation.d.ts
│   │   ├── api.d.ts
│   │   └── models.d.ts
│   │
│   ├── api/                    # API client
│   │   ├── client.ts           # Axios instance
│   │   ├── auth.ts             # Auth endpoints
│   │   ├── transactions.ts     # Transaction endpoints
│   │   ├── categories.ts       # Category endpoints
│   │   ├── dashboard.ts        # Dashboard endpoints
│   │   └── notifications.ts    # Notification endpoints
│   │
│   ├── assets/                 # Imagens, fontes, etc
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/             # Componentes reutilizáveis
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── FormDatePicker.tsx
│   │   │   └── FormColorPicker.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── BarChart.tsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionCard.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── TransactionFilter.tsx
│   │   │
│   │   └── categories/
│   │       ├── CategoryCard.tsx
│   │       ├── CategoryList.tsx
│   │       └── CategoryPicker.tsx
│   │
│   ├── config/                 # Configurações
│   │   ├── constants.ts        # Constantes
│   │   ├── theme.ts            # Tema (cores, fontes)
│   │   └── env.ts              # Variáveis de ambiente
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useCategories.ts
│   │   ├── useDashboard.ts
│   │   └── useNotifications.ts
│   │
│   ├── navigation/             # Navegação
│   │   ├── AppNavigator.tsx    # Navigator principal
│   │   ├── AuthNavigator.tsx   # Stack de autenticação
│   │   └── MainNavigator.tsx   # Bottom tabs
│   │
│   ├── screens/                # Telas
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── VerifyEmailScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   └── ResetPasswordScreen.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionsScreen.tsx
│   │   │   ├── AddTransactionScreen.tsx
│   │   │   └── EditTransactionScreen.tsx
│   │   │
│   │   ├── categories/
│   │   │   ├── CategoriesScreen.tsx
│   │   │   ├── AddCategoryScreen.tsx
│   │   │   └── EditCategoryScreen.tsx
│   │   │
│   │   ├── reports/
│   │   │   └── ReportsScreen.tsx
│   │   │
│   │   ├── notifications/
│   │   │   └── NotificationsScreen.tsx
│   │   │
│   │   └── settings/
│   │       ├── SettingsScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       ├── ChangePasswordScreen.tsx
│   │       ├── PreferencesScreen.tsx
│   │       ├── PremiumScreen.tsx
│   │       ├── AboutScreen.tsx
│   │       ├── TermsScreen.tsx
│   │       └── PrivacyScreen.tsx
│   │
│   ├── services/               # Serviços
│   │   ├── storage.ts          # AsyncStorage wrapper
│   │   ├── notifications.ts    # Push notifications
│   │   ├── biometrics.ts       # Biometria
│   │   └── analytics.ts        # Analytics
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts
│   │   ├── transactionStore.ts
│   │   ├── categoryStore.ts
│   │   └── notificationStore.ts
│   │
│   └── utils/                  # Utilitários
│       ├── formatters.ts       # Formatação (moeda, data)
│       ├── validators.ts       # Validações
│       ├── helpers.ts          # Funções auxiliares
│       └── constants.ts        # Constantes
│
└── .env.example                # Exemplo de variáveis de ambiente
```

---

## 🎨 Design Guidelines

### Cores (manter consistência com web)
```typescript
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Principal
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}
```

### Tipografia
```typescript
const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  }
}
```

### Espaçamento
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
}
```

---

## 🔐 Autenticação e Segurança

### Fluxo de Autenticação
1. Usuário faz login
2. Backend retorna `accessToken` e `refreshToken`
3. Salvar tokens no AsyncStorage
4. Adicionar `accessToken` no header de todas as requisições
5. Se `accessToken` expirar (401), usar `refreshToken` para renovar
6. Se `refreshToken` expirar, fazer logout

### Implementação do Axios Interceptor
```typescript
// src/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://fincontrol-backend.onrender.com/api/v1',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const { data } = await axios.post(
          'https://fincontrol-backend.onrender.com/api/v1/auth/refresh',
          { refreshToken }
        );
        
        await AsyncStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Logout
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // Navegar para login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📱 Funcionalidades Mobile Específicas

### 1. Biometria
```typescript
import * as LocalAuthentication from 'expo-local-authentication';

const authenticateWithBiometrics = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para acessar o FinControl',
      fallbackLabel: 'Usar senha',
    });
    return result.success;
  }
  return false;
};
```

### 2. Push Notifications
```typescript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync();
    // Enviar token para o backend
    return token.data;
  }
};
```

### 3. Câmera e Galeria
```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  
  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  
  if (!result.canceled) {
    return result.assets[0].uri;
  }
};
```

### 4. Haptic Feedback
```typescript
import * as Haptics from 'expo-haptics';

// Feedback leve
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Feedback médio
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Feedback pesado
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Sucesso
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Erro
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## 🧪 Testes

### Unit Tests (Jest)
```bash
npm test
```

### E2E Tests (Detox - opcional)
```bash
npm run test:e2e
```

---

## 🚀 Build e Deploy

### Development Build
```bash
# iOS
expo run:ios

# Android
expo run:android
```

### Production Build
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### Publicar na App Store / Play Store
```bash
eas submit --platform ios
eas submit --platform android
```

---

## 📝 Variáveis de Ambiente

Criar arquivo `.env`:
```env
# API
API_URL=https://fincontrol-backend.onrender.com/api/v1

# Expo
EXPO_PUBLIC_API_URL=https://fincontrol-backend.onrender.com/api/v1

# Analytics (opcional)
EXPO_PUBLIC_ANALYTICS_ID=your-analytics-id

# Sentry (opcional)
SENTRY_DSN=your-sentry-dsn
```

---

## ✅ Checklist de Implementação

### Fase 1 - Setup e Autenticação (Semana 1)
- [ ] Criar projeto Expo
- [ ] Configurar TypeScript
- [ ] Configurar navegação
- [ ] Implementar API client com Axios
- [ ] Criar stores Zustand
- [ ] Implementar telas de autenticação
- [ ] Implementar fluxo de login/registro
- [ ] Implementar verificação de email
- [ ] Implementar recuperação de senha
- [ ] Implementar persistência de sessão

### Fase 2 - Dashboard e Transações (Semana 2)
- [ ] Criar tela de Dashboard
- [ ] Implementar gráficos
- [ ] Criar listagem de transações
- [ ] Implementar filtros
- [ ] Criar formulário de adicionar transação
- [ ] Implementar edição de transação
- [ ] Implementar exclusão de transação
- [ ] Implementar transações recorrentes

### Fase 3 - Categorias e Relatórios (Semana 3)
- [ ] Criar listagem de categorias
- [ ] Implementar CRUD de categorias
- [ ] Criar seletor de ícones/cores
- [ ] Criar tela de relatórios
- [ ] Implementar gráficos de relatórios
- [ ] Implementar exportação de dados

### Fase 4 - Configurações e Premium (Semana 4)
- [ ] Criar tela de configurações
- [ ] Implementar edição de perfil
- [ ] Implementar upload de avatar
- [ ] Implementar alteração de senha
- [ ] Criar tela de planos Premium
- [ ] Integrar checkout (Stripe)
- [ ] Implementar gerenciamento de assinatura

### Fase 5 - Notificações e Polimento (Semana 5)
- [ ] Implementar push notifications
- [ ] Criar tela de notificações
- [ ] Implementar biometria
- [ ] Adicionar haptic feedback
- [ ] Implementar tema escuro
- [ ] Adicionar animações
- [ ] Otimizar performance
- [ ] Testes finais

### Fase 6 - Deploy (Semana 6)
- [ ] Configurar EAS Build
- [ ] Gerar builds de produção
- [ ] Testar em dispositivos reais
- [ ] Preparar assets da loja
- [ ] Submeter para App Store
- [ ] Submeter para Play Store
- [ ] Documentação final

---

## 🎯 Diferenciais Mobile

1. **Offline First** - Implementar cache local e sincronização
2. **Widgets** - Widget de resumo financeiro na home screen
3. **Siri Shortcuts** - Adicionar transação por voz (iOS)
4. **App Clips** - Versão lite do app (iOS)
5. **Instant Apps** - Versão lite do app (Android)
6. **Deep Links** - Abrir transações específicas via link
7. **Share Extension** - Compartilhar recibos/notas fiscais
8. **Face ID / Touch ID** - Autenticação biométrica
9. **Haptic Feedback** - Feedback tátil em ações
10. **Dark Mode** - Tema escuro automático

---

## 📚 Recursos Úteis

### Documentação
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)

### Design
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Elements](https://reactnativeelements.com/)
- [NativeBase](https://nativebase.io/)

### Ferramentas
- [Expo Snack](https://snack.expo.dev/) - Playground online
- [Reactotron](https://github.com/infinitered/reactotron) - Debug tool
- [Flipper](https://fbflipper.com/) - Debug tool

---

## 🎬 Começando

### Comando para criar o projeto:
```bash
npx create-expo-app fincontrol-mobile --template expo-template-blank-typescript
cd fincontrol-mobile
npm install
```

### Instalar dependências principais:
```bash
# Navegação
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

# State e Forms
npm install zustand react-hook-form zod @hookform/resolvers

# API
npm install axios axios-retry

# UI
npm install react-native-paper react-native-vector-icons date-fns

# Storage
npm install @react-native-async-storage/async-storage

# Outros
npm install expo-image-picker expo-notifications expo-local-authentication expo-haptics
```

---

## 🎉 Resultado Esperado

Um aplicativo mobile nativo, rápido e intuitivo que:
- ✅ Consome a API REST existente
- ✅ Mantém todas as funcionalidades da versão web
- ✅ Oferece experiência otimizada para mobile
- ✅ Funciona offline (com sincronização)
- ✅ Suporta biometria e notificações push
- ✅ Tem design moderno e responsivo
- ✅ Está pronto para publicação nas lojas

---

**Boa sorte com o desenvolvimento! 🚀📱**
