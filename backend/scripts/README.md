# Scripts & Utilitários do Backend (FinControl)

Este diretório contém os scripts operacionais, de manutenção de banco de dados, administração e testes da API do FinControl.

## Estrutura de Pastas

### 📁 `db/` - Banco de Dados & Migrações
Scripts SQL e Node.js para inspeção, ajustes de datas/timezone, verificação de tabelas e execução de migrações no PostgreSQL/Supabase.
- **`setup-database.js`**: Inicialização e criação da base de dados PostgreSQL local.
- **`test-db-connection.js`**: Teste de conectividade com o banco configurado no `.env`.
- **`check-tables.js` / `check-dates.js` / `check-transactions.js`**: Inspeção de integridade dos registros.
- **`executar-migrations.ps1` / `executar-migration.js`**: Execução de scripts e migrações pendentes.
- **`fix-postgres-timezone.js` / `fix-dates.js` / `fix-all-dates-plus-2.js`**: Correções de timezone e datas.
- **`run-supabase-migration.js`**: Utilitário para rodar migrações remotas no Supabase via `DATABASE_URL`.
- **`add-installments-columns.sql` / `register-migration.sql` / `fix-recurring-next-occurrence.sql`**: Scripts SQL pontuais.

### 📁 `admin/` - Administração & Usuários
Scripts para tarefas administrativas, gestão de contas de teste e disparos de notificações.
- **`create-demo-user.js` / `verificar-e-criar-demo.ps1`**: Criação e validação do usuário demonstrativo (`demo@financeiro.com`).
- **`activate-demo-premium.ps1` / `ativar-premium.ps1`**: Ativação do plano PRO para contas de teste.
- **`tornar-usuario-admin.js` / `verificar-admin.js`**: Concessão e validação de permissões de administrador.
- **`listar-usuarios.ps1`**: Listagem das contas cadastradas.
- **`resetar-senha-usuario.ps1`**: Auxiliar para redefinição ou recriação de usuário para testes.
- **`limpar-usuario-teste.js` / `executar-limpeza-demo.ps1`**: Limpeza de dados temporários e transações.
- **`enviar-notificacao-novidades.js` / `criar-notificacao-teste.js`**: Disparo de avisos e notificações in-app.

### 📁 `tests/` - Testes de API & Endpoints
Scripts interativos e requisições HTTP para validar o funcionamento dos endpoints da API REST.
- **`test-api.ps1`**: Teste geral de rotas públicas e autenticadas.
- **`test-login.ps1` / `testar-login.ps1`**: Validação de fluxo de autenticação e geração de JWT.
- **`test-transaction.ps1` / `test-transaction.js` / `testar-transacao.ps1`**: Testes de criação e listagem de transações.
- **`testar-criar-categoria.ps1` / `testar-categorias.ps1`**: Testes de categorias.
- **`testar-preferencias.ps1`**: Teste de persistência de preferências de usuário (tema, moeda).
- **`testar-verificacao-completa.ps1`**: Teste pontual do fluxo completo de verificação de código por e-mail.
- **`test-premium.http` / `test-verification.http`**: Arquivos de teste HTTP prontos para extensões como REST Client / Thunder Client.

### 📁 `docs/` - Manuais & Guias Técnicos
Guias detalhados de configuração, resolução de problemas, histórico de migrações e notas de arquitetura.
- Manuais de inicialização: `QUICK-START.md`, `START-WITHOUT-DOCKER.md`, `SETUP-POSTGRESQL.md`, `RENDER_SETUP.md`.
- Guias de correção: `CORRECAO-TRANSACOES-VOLTANDO.md`, `SOLUCAO-CATEGORIAS-VOLTANDO.md`, `SOLUCAO-EMAIL-DUPLICADO.md`.
- Relatórios de implementação: `COMPLETE-IMPLEMENTATION-GUIDE.md`, `IMPLEMENTATION-COMPLETE.md`, `INTEGRATION-GUIDE.md`.

---

## 🔒 Boas Práticas de Segurança

1. **Variáveis de Ambiente**:
   Nenhum script possui senhas ou chaves em texto plano. Os scripts leem automaticamente as credenciais das variáveis de ambiente:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (ou arquivo `backend/.env`)
   - `DATABASE_URL` (para conexões diretas PostgreSQL/Supabase)
   - `TEST_USER_EMAIL` e `TEST_USER_PASSWORD` (para testes personalizados com contas próprias)

2. **Execução de Scripts PowerShell**:
   Para testar com uma conta customizada sem expor senhas no terminal:
   ```powershell
   $env:TEST_USER_EMAIL = "seu-email@teste.com"
   $env:TEST_USER_PASSWORD = "sua-senha-aqui"
   .\scripts\admin\verificar-usuario.ps1
   ```
