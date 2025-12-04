# 🗄️ Database - FinControl

Este diretório contém os arquivos relacionados ao banco de dados MySQL.

## 📁 Arquivos

- **`schema.sql`** - Schema completo do banco de dados (estrutura de todas as tabelas)
- **`seed.sql`** - Dados iniciais (categorias padrão, usuário admin, etc.)

## 🚀 Como usar

### 1. Criar o banco de dados

```bash
# Via MySQL CLI
mysql -u root -p < schema.sql

# Ou via MySQL Workbench
# File > Run SQL Script > Selecione schema.sql
```

### 2. Popular com dados iniciais (opcional)

```bash
mysql -u root -p fincontrol_db < seed.sql
```

## 🔧 Configuração

Certifique-se de que o arquivo `.env` está configurado corretamente:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=fincontrol_db
```

## 📊 Estrutura do Banco

### Tabelas principais:

1. **users** - Usuários do sistema
2. **categories** - Categorias de receitas/despesas
3. **transactions** - Transações financeiras
4. **savings_goals** - Metas de economia
5. **refresh_tokens** - Tokens de autenticação
6. **verification_codes** - Códigos de verificação (email, senha)
7. **notifications** - Notificações do sistema

## 🔄 Migrações

Para atualizar o schema do banco:

1. Faça backup do banco atual
2. Execute o novo schema
3. Migre os dados se necessário

## 📝 Backup

Para fazer backup do banco:

```bash
mysqldump -u root fincontrol_db > backup_$(date +%Y%m%d).sql
```

Para restaurar:

```bash
mysql -u root fincontrol_db < backup_20241204.sql
```

## ⚠️ Importante

- Sempre faça backup antes de executar scripts SQL
- Em produção, use usuário com permissões limitadas
- Nunca commite senhas ou dados sensíveis
