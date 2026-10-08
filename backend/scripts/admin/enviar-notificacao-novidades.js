require('dotenv').config();
const { Client } = require('pg');

/**
 * Script para enviar notificações de novidades/recursos
 * 
 * Uso:
 * node enviar-notificacao-novidades.js
 */

async function sendFeatureNotification() {
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
    // CONFIGURAÇÃO DA NOTIFICAÇÃO
    // ============================================
    
    const notification = {
      title: '✨ Novos Relatórios Disponíveis!',
      message: 'Agora você tem acesso a relatórios avançados de análise financeira com gráficos interativos.',
      type: 'success', // info, warning, success, error
      category: 'premium', // transaction, goal, budget, premium, system
      onlyPremium: true, // true = apenas premium, false = todos os usuários
    };

    // ============================================
    // BUSCAR USUÁRIOS
    // ============================================
    
    let query = 'SELECT id, name, email, "isPremium" FROM users';
    let params = [];

    if (notification.onlyPremium) {
      query += ' WHERE "isPremium" = $1';
      params.push(true);
      console.log('🎯 Enviando para: Apenas usuários Premium\n');
    } else {
      console.log('🎯 Enviando para: Todos os usuários\n');
    }

    const users = await client.query(query, params);

    if (users.rows.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }

    console.log(`👥 ${users.rows.length} usuário(s) encontrado(s)\n`);

    // ============================================
    // CRIAR NOTIFICAÇÕES
    // ============================================
    
    let successCount = 0;
    let errorCount = 0;

    for (const user of users.rows) {
      try {
        await client.query(`
          INSERT INTO notifications ("userId", title, message, type, category, "isRead", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, [
          user.id,
          notification.title,
          notification.message,
          notification.type,
          notification.category,
          false
        ]);

        console.log(`✅ ${user.name} (${user.email})`);
        successCount++;
      } catch (error) {
        console.log(`❌ ${user.name} - Erro: ${error.message}`);
        errorCount++;
      }
    }

    // ============================================
    // RESUMO
    // ============================================
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO DO ENVIO');
    console.log('='.repeat(50));
    console.log(`✅ Enviadas com sucesso: ${successCount}`);
    console.log(`❌ Erros: ${errorCount}`);
    console.log(`📧 Total: ${users.rows.length}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await client.end();
  }
}

sendFeatureNotification();
