#!/bin/bash

# Script para configurar GitHub Secrets automaticamente
# Requer: GitHub CLI (gh) instalado e autenticado

set -e

echo ""
echo "🔐 Setup de GitHub Secrets - FinControl"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI não encontrado!"
    echo ""
    echo "📥 Instale com:"
    echo "  macOS:  brew install gh"
    echo "  Linux:  sudo apt install gh"
    echo "  Ou:     https://cli.github.com/"
    echo ""
    exit 1
fi

# Verificar autenticação
echo ""
echo "🔍 Verificando autenticação..."
if ! gh auth status &> /dev/null; then
    echo "❌ Não autenticado no GitHub!"
    echo ""
    echo "🔑 Execute: gh auth login"
    echo ""
    exit 1
fi
echo "✅ Autenticado com sucesso!"

# Gerar secrets
echo ""
echo "🔑 Gerando secrets seguros..."

# Gerar JWT_SECRET (64 bytes = 128 chars hex)
JWT_SECRET=$(openssl rand -hex 64)

# Gerar SESSION_SECRET (32 bytes = 64 chars hex)
SESSION_SECRET=$(openssl rand -hex 32)

# Gerar ENCRYPTION_KEY (32 bytes = 64 chars hex)
ENCRYPTION_KEY=$(openssl rand -hex 32)

echo "✅ Secrets gerados!"

# Solicitar DATABASE_URL
echo ""
echo "📊 Configure o banco de dados PostgreSQL:"
echo "Formato: postgresql://usuario:senha@host:5432/database"
echo ""
read -p "DATABASE_URL: " DATABASE_URL

# Solicitar DATABASE_PASSWORD
echo ""
echo "🔒 Digite a senha do banco de dados:"
read -s -p "DATABASE_PASSWORD: " DATABASE_PASSWORD
echo ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📤 Enviando secrets para GitHub..."
echo ""

# Função para adicionar secret
add_secret() {
    local name=$1
    local value=$2
    
    echo -n "  📝 Adicionando $name..."
    
    if echo "$value" | gh secret set "$name" 2>/dev/null; then
        echo " ✅"
        return 0
    else
        echo " ❌"
        return 1
    fi
}

# Contador de sucesso
success=0
total=0

# Adicionar secrets essenciais
((total++))
add_secret "JWT_SECRET" "$JWT_SECRET" && ((success++)) || true

((total++))
add_secret "DATABASE_URL" "$DATABASE_URL" && ((success++)) || true

((total++))
add_secret "DATABASE_PASSWORD" "$DATABASE_PASSWORD" && ((success++)) || true

# Secrets adicionais
((total++))
add_secret "SESSION_SECRET" "$SESSION_SECRET" && ((success++)) || true

((total++))
add_secret "ENCRYPTION_KEY" "$ENCRYPTION_KEY" && ((success++)) || true

# Resumo
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Resumo:"
echo "  ✅ Secrets adicionados: $success/$total"

if [ $success -eq $total ]; then
    echo ""
    echo "🎉 Todos os secrets foram configurados com sucesso!"
else
    echo ""
    echo "⚠️  Alguns secrets falharam. Verifique as mensagens acima."
fi

# Listar secrets configurados
echo ""
echo "📋 Secrets configurados no repositório:"
gh secret list

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💾 Salvando cópia local dos secrets (NÃO COMMITAR!)..."

# Criar arquivo .env.local com os secrets (para desenvolvimento)
cat > .env.local << EOF
# Secrets gerados em $(date '+%Y-%m-%d %H:%M:%S')
# ⚠️ NÃO COMMITAR ESTE ARQUIVO!

# Backend
DATABASE_URL=$DATABASE_URL
DATABASE_PASSWORD=$DATABASE_PASSWORD
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY

# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=FinControl
VITE_APP_VERSION=1.8.0
NODE_ENV=development
EOF

echo "✅ Arquivo .env.local criado (use para desenvolvimento local)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Links úteis:"
echo "  • Secrets: https://github.com/pedrokstro/FinControl/settings/secrets/actions"
echo "  • Actions: https://github.com/pedrokstro/FinControl/actions"
echo "  • Releases: https://github.com/pedrokstro/FinControl/releases"
echo ""
echo "✨ Configuração concluída!"
echo ""
