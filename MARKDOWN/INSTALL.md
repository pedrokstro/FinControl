# ?? Guia de Instalação - FinControl

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior ([Download aqui](https://nodejs.org/))
- **npm** versão 9 ou superior (vem com o Node.js)
- **Git** ([Download aqui](https://git-scm.com/))

### Verificar versões instaladas

```bash
node --version  # Deve mostrar v18.x.x ou superior
npm --version   # Deve mostrar 9.x.x ou superior
```

## Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd controle-financeiro
```

### 2. Instale as Dependências

```bash
npm install
```

Este comando irá instalar todas as dependências listadas no `package.json`, incluindo:
- React e React DOM
- TypeScript
- Vite
- Tailwind CSS
- Zustand (gerenciamento de estado)
- React Hook Form e Zod (formulários e validação)
- Recharts (gráficos)
- E muito mais...

**Tempo estimado:** 2-5 minutos (dependendo da sua conexão)

### 3. Configure as Variáveis de Ambiente (Opcional)

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário.

### 4. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:3000**

## ?? Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (porta 3000)

# Build de Produção
npm run build           # Compila o projeto para produção
npm run preview         # Preview do build de produção

# Qualidade de Código
npm run lint            # Executa ESLint
npm run type-check      # Verifica tipos TypeScript

# Testes
npm run test            # Executa testes
npm run test:ui         # Interface visual dos testes
npm run test:coverage   # Relatório de cobertura de testes
```

## ?? Credenciais de Acesso

Para acessar o sistema após iniciar, use:

- **Email:** demo@financeiro.com
- **Senha:** demo123

## ?? Troubleshooting

### Erro: "Cannot find module"

**Solução:** Reinstale as dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Porta em Uso

**Solução:** Altere a porta no `vite.config.ts` ou mate o processo:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro de Permissão (Linux/Mac)

**Solução:** Use sudo ou ajuste as permissões
```bash
sudo npm install
# ou
sudo chown -R $USER ~/.npm
```

### Cache do Navegador

Se as alterações não aparecerem:
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Use modo anônimo/privado
3. Force reload (Ctrl+F5 ou Cmd+Shift+R)

### TypeScript Errors

**Solução:** Limpe o cache do TypeScript
```bash
rm -rf node_modules/.vite
npm run dev
```

## ?? Estrutura do Projeto Após Instalação

```
controle-financeiro/
??? node_modules/          # Dependências (gerado após npm install)
??? public/                # Arquivos estáticos
??? src/
?   ??? components/        # Componentes React
?   ??? pages/            # Páginas da aplicação
?   ??? store/            # Gerenciamento de estado
?   ??? types/            # Definições TypeScript
?   ??? utils/            # Funções utilitárias
?   ??? hooks/            # Custom hooks
?   ??? data/             # Dados mockados
?   ??? test/             # Testes
?   ??? App.tsx           # Componente principal
?   ??? main.tsx          # Entry point
?   ??? index.css         # Estilos globais
??? .env.example          # Exemplo de variáveis de ambiente
??? .gitignore            # Arquivos ignorados pelo Git
??? index.html            # HTML base
??? package.json          # Dependências e scripts
??? tsconfig.json         # Configuração TypeScript
??? tailwind.config.js    # Configuração Tailwind
??? vite.config.ts        # Configuração Vite
??? vitest.config.ts      # Configuração Vitest
??? README.md             # Documentação

```

## ?? Primeiros Passos

Após a instalação:

1. **Explore o Dashboard** - Veja os gráficos e métricas
2. **Adicione Transações** - Menu "Transações" > Botão "Nova Transação"
3. **Crie Categorias** - Menu "Categorias" > Botão "Nova Categoria"
4. **Veja Relatórios** - Menu "Relatórios" para análises detalhadas
5. **Configure** - Menu "Configurações" para personalizar

## ?? Próximos Passos

- Leia a [Documentação Completa](./README.md)
- Veja a [Documentação da API](./API.md)
- Aprenda a [Contribuir](./CONTRIBUTING.md)
- Explore os [Testes](./src/test/)

## ?? Dicas

### Hot Reload
O Vite possui hot reload automático. Qualquer alteração no código será refletida imediatamente no navegador.

### DevTools
Instale as extensões do navegador:
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) (funciona com Zustand)

### VS Code
Extensões recomendadas:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## ?? Precisa de Ajuda?

- Abra uma [Issue](../../issues) no GitHub
- Consulte a [Documentação](./README.md)
- Leia o [Guia de Contribuição](./CONTRIBUTING.md)

## ? Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em `http://localhost:3000`
- [ ] Login realizado com credenciais demo
- [ ] Sistema funcionando corretamente

---

**Pronto!** Você está pronto para usar o FinControl! ??

Para mais informações, consulte o [README.md](./README.md)
