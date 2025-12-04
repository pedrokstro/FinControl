#!/usr/bin/env node

/**
 * Script de Diagnóstico - Persistência de Dados
 * 
 * Verifica se o sistema está configurado corretamente
 * para salvar dados do usuário no banco de dados.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 Diagnóstico de Persistência de Dados\n');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function success(msg) {
  console.log(`${colors.green}✅ ${msg}${colors.reset}`);
}

function error(msg) {
  console.log(`${colors.red}❌ ${msg}${colors.reset}`);
}

function warning(msg) {
  console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
}

function info(msg) {
  console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`);
}

// 1. Verificar arquivos essenciais
console.log('📁 Verificando arquivos...\n');

const files = [
  { path: 'src/services/api.ts', name: 'Serviço de API' },
  { path: 'src/store/authStore.ts', name: 'Auth Store' },
  { path: 'src/pages/Settings.tsx', name: 'Página de Settings' },
  { path: 'src/pages/Login.tsx', name: 'Página de Login' },
  { path: '.env.example', name: 'Exemplo de .env' },
];

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    success(`${file.name} existe`);
  } else {
    error(`${file.name} não encontrado em ${file.path}`);
  }
});

// 2. Verificar arquivo .env
console.log('\n⚙️  Verificando configuração...\n');

if (fs.existsSync('.env')) {
  success('Arquivo .env existe');
  
  const envContent = fs.readFileSync('.env', 'utf-8');
  
  if (envContent.includes('VITE_API_URL')) {
    const match = envContent.match(/VITE_API_URL=(.+)/);
    if (match) {
      success(`VITE_API_URL configurado: ${match[1]}`);
    }
  } else {
    warning('VITE_API_URL não encontrado no .env');
    info('Adicione: VITE_API_URL=http://localhost:3001/api');
  }
} else {
  warning('Arquivo .env não encontrado');
  info('Copie .env.example para .env e configure');
}

// 3. Verificar backend
console.log('\n🔌 Verificando backend...\n');

const backendUrl = 'http://localhost:3001/api/health';

const req = http.get(backendUrl, (res) => {
  if (res.statusCode === 200) {
    success('Backend está rodando em http://localhost:3001');
    success('API está acessível');
  } else {
    error(`Backend respondeu com status ${res.statusCode}`);
  }
}).on('error', (err) => {
  error('Backend não está rodando');
  warning('Inicie o backend com: cd backend && npm run dev');
  info('Ou use modo demo (offline) com credenciais: demo@financeiro.com / demo123');
});

// 4. Verificar dependências
console.log('\n📦 Verificando dependências...\n');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

const requiredDeps = [
  'axios',
  'zustand',
  'react-hook-form',
  '@hookform/resolvers',
  'zod',
  'react-hot-toast',
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    success(`${dep} instalado`);
  } else {
    error(`${dep} não encontrado`);
    info(`Instale com: npm install ${dep}`);
  }
});

// 5. Verificar backend package.json
console.log('\n🔧 Verificando backend...\n');

if (fs.existsSync('backend/package.json')) {
  success('Backend package.json existe');
  
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf-8'));
  
  const backendDeps = [
    'express',
    'typeorm',
    'pg',
    'jsonwebtoken',
    'bcryptjs',
  ];
  
  backendDeps.forEach(dep => {
    if (backendPackage.dependencies[dep] || backendPackage.devDependencies[dep]) {
      success(`Backend: ${dep} instalado`);
    } else {
      error(`Backend: ${dep} não encontrado`);
    }
  });
} else {
  error('Backend não encontrado');
  warning('Certifique-se de que o backend está na pasta ./backend');
}

// 6. Resumo
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Resumo do Diagnóstico\n');
  
  console.log('Para corrigir o erro "Erro ao atualizar perfil":\n');
  
  console.log('1️⃣  Iniciar Backend:');
  console.log('   cd backend');
  console.log('   npm run dev\n');
  
  console.log('2️⃣  Iniciar Frontend (novo terminal):');
  console.log('   npm run dev\n');
  
  console.log('3️⃣  Fazer Login:');
  console.log('   http://localhost:3000/login');
  console.log('   Email: demo@financeiro.com');
  console.log('   Senha: demo123\n');
  
  console.log('4️⃣  Verificar Console (F12):');
  console.log('   Deve mostrar: "🔄 Atualizando perfil via API..."\n');
  
  console.log('5️⃣  Se backend estiver offline:');
  console.log('   Sistema usará modo demo (alterações locais apenas)\n');
  
  console.log('📚 Documentação:');
  console.log('   - TROUBLESHOOTING-PROFILE-UPDATE.md');
  console.log('   - USER-PERSISTENCE-FIX.md');
  console.log('   - QUICK-TEST-GUIDE.md\n');
  
  console.log('='.repeat(60) + '\n');
}, 1000);
