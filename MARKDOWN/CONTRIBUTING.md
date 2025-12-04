# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **FinControl**! 

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Pull Requests](#pull-requests)
- [Padrões de Código](#padrões-de-código)
- [Configuração do Ambiente](#configuração-do-ambiente)

## 📜 Código de Conduta

Este projeto segue o [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, você concorda em manter um ambiente respeitoso e acolhedor.

## 🎯 Como Posso Contribuir?

### Reportando Bugs

Encontrou um bug? Ajude-nos a melhorar!

1. **Verifique** se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/fincontrol/issues)
2. **Abra uma nova issue** usando o template de bug report
3. **Inclua**:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (navegador, OS, versão)

**Exemplo:**
```markdown
## Descrição
O gráfico de barras não anima corretamente ao carregar

## Passos para Reproduzir
1. Fazer login
2. Navegar para Dashboard
3. Observar o gráfico de resumo anual

## Comportamento Esperado
Barras devem crescer de baixo para cima

## Comportamento Atual
Barras aparecem da direita para esquerda

## Ambiente
- Navegador: Chrome 120
- OS: Windows 11
- Versão: 1.0.0
```

### Sugerindo Melhorias

Tem uma ideia para melhorar o projeto?

1. **Verifique** se já existe uma issue similar
2. **Abra uma issue** com a tag `enhancement`
3. **Descreva**:
   - O problema que resolve
   - A solução proposta
   - Alternativas consideradas
   - Impacto esperado

### Contribuindo com Código

1. **Fork** o repositório
2. **Clone** seu fork
   ```bash
   git clone https://github.com/seu-usuario/fincontrol.git
   cd fincontrol
   ```
3. **Crie uma branch** para sua feature
   ```bash
   git checkout -b feature/minha-feature
   ```
4. **Faça suas alterações**
5. **Commit** seguindo os padrões
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```
6. **Push** para seu fork
   ```bash
   git push origin feature/minha-feature
   ```
7. **Abra um Pull Request**

## 🔧 Pull Requests

### Checklist

Antes de abrir um PR, certifique-se de que:

- [ ] O código segue os padrões do projeto
- [ ] Todos os testes passam (`npm run test`)
- [ ] Não há erros de lint (`npm run lint`)
- [ ] Adicionou testes para novas funcionalidades
- [ ] Atualizou a documentação (se necessário)
- [ ] O commit segue o padrão Conventional Commits
- [ ] A branch está atualizada com `main`

### Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

**Exemplos:**
```bash
feat(dashboard): adiciona gráfico de evolução mensal
fix(auth): corrige validação de email
docs(readme): atualiza instruções de instalação
style(components): formata código com prettier
refactor(store): simplifica lógica de estado
test(transactions): adiciona testes unitários
chore(deps): atualiza dependências
```

### Revisão de Código

Todos os PRs passam por revisão. Esperamos:

- **Código limpo** e legível
- **Testes** adequados
- **Documentação** clara
- **Performance** considerada
- **Acessibilidade** mantida

## 💻 Padrões de Código

### TypeScript

```typescript
// ✅ BOM
interface User {
  id: string
  name: string
  email: string
}

const getUser = async (id: string): Promise<User> => {
  // implementação
}

// ❌ RUIM
const getUser = async (id: any) => {
  // sem tipos
}
```

### React Components

```typescript
// ✅ BOM - Componente funcional com tipos
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  )
}

// ❌ RUIM - Sem tipos
const Button = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>
}
```

### Hooks

```typescript
// ✅ BOM - Hook customizado com tipos
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // lógica
  }, [])
  
  return { user, loading }
}
```

### Testes

```typescript
// ✅ BOM - Teste descritivo
describe('Dashboard', () => {
  it('should display financial summary', () => {
    render(<Dashboard />)
    expect(screen.getByText('Resumo Financeiro')).toBeInTheDocument()
  })
  
  it('should load transactions on mount', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Transação 1')).toBeInTheDocument()
    })
  })
})
```

### Estilização

```typescript
// ✅ BOM - Tailwind classes organizadas
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  {/* conteúdo */}
</div>

// ✅ BOM - Classes condicionais
<button 
  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
>
  {label}
</button>
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/fincontrol.git
cd fincontrol

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Execute os testes
npm run test
```

### Estrutura do Projeto

```
fincontrol/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── store/          # Gerenciamento de estado
│   ├── types/          # Definições TypeScript
│   ├── utils/          # Funções utilitárias
│   └── services/       # Serviços e APIs
├── tests/              # Testes
└── docs/               # Documentação
```

## 📚 Recursos Úteis

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Recharts](https://recharts.org/)

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/seu-usuario/fincontrol/discussions)
- Entre em contato: [email@exemplo.com]

## 🎉 Agradecimentos

Obrigado por contribuir! Toda ajuda é bem-vinda, seja:

- 🐛 Reportando bugs
- 💡 Sugerindo features
- 📝 Melhorando documentação
- 💻 Contribuindo com código
- ⭐ Dando uma estrela no projeto

---

**Feito com ❤️ pela comunidade**
