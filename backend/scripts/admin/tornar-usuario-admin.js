require('dotenv').config();
const { Client } = require('pg');

/**
 * Script para tornar um usuário administrador
 * 
 * Uso:
 * node tornar-usuario-admin.js
 */

async function makeUserAdmin() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'fincontrol_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');

    // ============================================
    // CONFIGURAÇÃO - ALTERE O EMAIL AQUI
    // ============================================
    const userEmail = 'demo@financeiro.com'; // <-- ALTERE AQUI
    // ============================================

    // Buscar usuário
    const userResult = await client.query(
      'SELECT id, name, email, "isAdmin", "isPremium" FROM users WHERE email = $1',
      [userEmail]
    );

    if (userResult.rows.length === 0) {
      console.log(`❌ Usuário com email "${userEmail}" não encontrado`);
      console.log('\n💡 Dica: Verifique se o email está correto\n');
      return;
    }

    const user = userResult.rows[0];

    console.log('👤 Usuário encontrado:');
    console.log(`   Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Admin: ${user.isAdmin ? 'Sim' : 'Não'}`);
    console.log(`   Premium: ${user.isPremium ? 'Sim' : 'Não'}`);
    console.log('');

    if (user.isAdmin) {
      console.log('ℹ️  Este usuário já é administrador!');
      return;
    }

    // Tornar administrador
    await client.query(
      'UPDATE users SET "isAdmin" = TRUE WHERE id = $1',
      [user.id]
    );

    console.log('✅ Usuário promovido a administrador com sucesso!');
    console.log('');
    console.log('🎉 Agora este usuário pode:');
    console.log('   • Acessar o painel administrativo (/admin)');
    console.log('   • Enviar notificações em massa');
    console.log('   • Gerenciar avisos do sistema');
    console.log('');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

makeUserAdmin();
