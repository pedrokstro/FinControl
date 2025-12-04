#!/usr/bin/env node

/**
 * Script para gerar secrets seguros para JWT
 * Uso: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Gerando Secrets para JWT...\n');
console.log('=' .repeat(60));

// Gerar JWT_SECRET
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('\n📝 JWT_SECRET:');
console.log(jwtSecret);

// Gerar JWT_REFRESH_SECRET
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
console.log('\n📝 JWT_REFRESH_SECRET:');
console.log(jwtRefreshSecret);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Secrets gerados com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. Copie os valores acima');
console.log('2. Adicione no GitHub: Settings → Secrets and variables → Actions');
console.log('3. Crie dois secrets:');
console.log('   - JWT_SECRET');
console.log('   - JWT_REFRESH_SECRET');
console.log('\n⚠️  IMPORTANTE: Nunca compartilhe esses valores!\n');
