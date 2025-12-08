#!/usr/bin/env node

/**
 * Script para gerar JWT Secret seguro
 * Uso: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Gerador de JWT Secret\n');
console.log('━'.repeat(60));

// Gerar secret de 64 bytes (512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ JWT Secret gerado com sucesso!\n');
console.log('📋 Copie o valor abaixo:\n');
console.log(`   ${jwtSecret}\n`);
console.log('━'.repeat(60));
console.log('\n📝 Como usar:\n');
console.log('1. Acesse: https://github.com/pedrokstro/FinControl/settings/secrets/actions');
console.log('2. Clique em "New repository secret"');
console.log('3. Name: JWT_SECRET');
console.log('4. Secret: Cole o valor acima');
console.log('5. Clique em "Add secret"\n');

console.log('💡 Dica: Salve este secret em um gerenciador de senhas!\n');

// Também gerar outros secrets úteis
console.log('━'.repeat(60));
console.log('\n🔑 Outros secrets úteis:\n');

const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log(`SESSION_SECRET (32 bytes):\n   ${sessionSecret}\n`);

const apiKey = crypto.randomBytes(24).toString('base64');
console.log(`API_KEY (24 bytes, base64):\n   ${apiKey}\n`);

const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log(`ENCRYPTION_KEY (32 bytes):\n   ${encryptionKey}\n`);

console.log('━'.repeat(60));
console.log('\n⚠️  IMPORTANTE: Nunca compartilhe estes valores!\n');
