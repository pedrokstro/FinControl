# 🛠️ Scripts Utilitários - FinControl

Coleção de scripts para automação e manutenção do projeto.

## 📋 Scripts Disponíveis

### 🔐 Segurança e Secrets

#### `generate-jwt-secret.js`
Gera secrets seguros para JWT, sessão, API keys e criptografia.

```bash
node scripts/generate-jwt-secret.js
```

**Saída:**
- JWT_SECRET (64 bytes / 128 chars hex)
- SESSION_SECRET (32 bytes / 64 chars hex)
- API_KEY (24 bytes / base64)
- ENCRYPTION_KEY (32 bytes / 64 chars hex)

---

#### `setup-github-secrets.ps1` (Windows)
Configura automaticamente todos os secrets no GitHub via CLI.

```powershell
# Executar interativamente
.\scripts\setup-github-secrets.ps1

# Ou com parâmetros
.\scripts\setup-github-secrets.ps1 `
  -DatabaseUrl "postgresql://user:pass@host:5432/db" `
  -DatabasePassword "senha123"
```

**Requisitos:**
- GitHub CLI instalado: `winget install GitHub.cli`
- Autenticado: `gh auth login`

**O que faz:**
1. ✅ Gera JWT_SECRET, SESSION_SECRET, ENCRYPTION_KEY
2. ✅ Solicita DATABASE_URL e DATABASE_PASSWORD
3. ✅ Envia todos os secrets para GitHub
4. ✅ Cria arquivo `.env.local` para desenvolvimento
5. ✅ Lista secrets configurados

---

#### `setup-github-secrets.sh` (Linux/macOS)
Versão Bash do script de configuração de secrets.

```bash
# Dar permissão de execução
chmod +x scripts/setup-github-secrets.sh

# Executar
./scripts/setup-github-secrets.sh
```

**Requisitos:**
- GitHub CLI instalado: `brew install gh` (macOS) ou `sudo apt install gh` (Linux)
- OpenSSL instalado (geralmente já vem no sistema)
- Autenticado: `gh auth login`

---

### 💾 Backup e Manutenção

#### `backup-project.ps1`
Cria backup completo do projeto em arquivo ZIP.

```powershell
# Backup padrão (pasta backups/)
.\scripts\backup-project.ps1

# Backup em local específico
.\scripts\backup-project.ps1 -DestinationFolder "D:\Backups"

# Backup com exclusões personalizadas
.\scripts\backup-project.ps1 -ExcludeFolders @("node_modules", "dist", ".git", "logs")
```

**Características:**
- 📦 Compacta em ZIP com timestamp
- 🚫 Exclui node_modules, .git, dist, logs por padrão
- 📊 Mostra tamanho do backup
- ✅ Usa robocopy para cópia eficiente

---

### 🗄️ Banco de Dados

#### `run-migrations.js`
Executa migrations do banco de dados.

```bash
# Executar migrations pendentes
node scripts/run-migrations.js

# Ver status das migrations
node scripts/run-migrations.js --status

# Reverter última migration
node scripts/run-migrations.js --revert
```

---

### 🧪 Testes e Qualidade

#### `test-all.sh` (se existir)
Executa todos os testes do projeto.

```bash
chmod +x scripts/test-all.sh
./scripts/test-all.sh
```

---

## 🚀 Fluxo de Trabalho Recomendado

### Setup Inicial

1. **Gerar secrets:**
   ```bash
   node scripts/generate-jwt-secret.js
   ```

2. **Configurar GitHub:**
   ```powershell
   # Windows
   .\scripts\setup-github-secrets.ps1
   
   # Linux/macOS
   ./scripts/setup-github-secrets.sh
   ```

3. **Executar migrations:**
   ```bash
   node scripts/run-migrations.js
   ```

### Manutenção Regular

1. **Backup semanal:**
   ```powershell
   .\scripts\backup-project.ps1
   ```

2. **Atualizar dependências:**
   ```bash
   npm update
   cd backend && npm update
   ```

3. **Verificar segurança:**
   ```bash
   npm audit
   npm audit fix
   ```

---

## 📝 Criando Novos Scripts

### Template PowerShell

```powershell
# Nome do script: meu-script.ps1
# Descrição: O que o script faz

param(
    [string]$Parametro1 = "valor_padrao"
)

Write-Host "🚀 Iniciando script..." -ForegroundColor Cyan

# Seu código aqui

Write-Host "✅ Concluído!" -ForegroundColor Green
```

### Template Bash

```bash
#!/bin/bash
# Nome do script: meu-script.sh
# Descrição: O que o script faz

set -e

echo "🚀 Iniciando script..."

# Seu código aqui

echo "✅ Concluído!"
```

### Template Node.js

```javascript
#!/usr/bin/env node
/**
 * Nome do script: meu-script.js
 * Descrição: O que o script faz
 */

console.log('🚀 Iniciando script...');

// Seu código aqui

console.log('✅ Concluído!');
```

---

## 🔒 Segurança

### ⚠️ Nunca Commitar

- `.env.local` - Gerado pelos scripts de setup
- Arquivos com secrets/senhas
- Tokens de API
- Chaves privadas

### ✅ Sempre Fazer

- Usar `.env.example` como template
- Adicionar arquivos sensíveis ao `.gitignore`
- Rotacionar secrets regularmente
- Usar GitHub Secrets para CI/CD

---

## 🆘 Troubleshooting

### Erro: "gh: command not found"

**Solução:**
```bash
# Windows
winget install GitHub.cli

# macOS
brew install gh

# Linux
sudo apt install gh
```

### Erro: "Permission denied"

**Solução:**
```bash
# Linux/macOS
chmod +x scripts/*.sh

# Windows (PowerShell como Admin)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: "openssl: command not found"

**Solução:**
```bash
# Windows
choco install openssl

# macOS (já vem instalado)
brew install openssl

# Linux
sudo apt install openssl
```

---

## 📚 Recursos

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [PowerShell Documentation](https://docs.microsoft.com/powershell/)
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Desenvolvido por PEDRO KSTRO** 🚀
