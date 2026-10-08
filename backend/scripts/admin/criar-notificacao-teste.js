require('dotenv').config();
const { Client } = require('pg');

async function createTestNotification() {
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

    // Buscar um usuário para criar a notificação
    const userResult = await client.query('SELECT id, name FROM users LIMIT 1');
    
    if (userResult.rows.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco');
      return;
    }

    const user = userResult.rows[0];
    console.log(`👤 Criando notificação para: ${user.name}\n`);

    // Criar notificação de boas-vindas
    await client.query(`
      INSERT INTO notifications ("userId", title, message, type, category, "isRead", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [
      user.id,
      '🎉 Bem-vindo ao Sistema de Notificações!',
      'Agora você receberá alertas importantes sobre suas finanças, metas e transações.',
      'success',
      'system',
      false
    ]);

    // Criar notificação de teste de transação
    await client.query(`
      INSERT INTO notifications ("userId", title, message, type, category, "isRead", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [
      user.id,
      '💰 Nova Receita Registrada',
      'Salário - R$ 5.000,00 foi adicionado à sua conta.',
      'info',
      'transaction',
      false
    ]);

    // Criar notificação de alerta
    await client.query(`
      INSERT INTO notifications ("userId", title, message, type, category, "isRead", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [
      user.id,
      '⚠️ Atenção aos Gastos',
      'Você já gastou 75% do seu orçamento mensal em Alimentação.',
      'warning',
      'budget',
      false
    ]);

    console.log('✅ 3 notificações de teste criadas com sucesso!\n');

    // Listar notificações criadas
    const notifications = await client.query(`
      SELECT title, message, type, category, "isRead", "createdAt"
      FROM notifications
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
    `, [user.id]);

    console.log('🔔 Notificações criadas:');
    console.table(notifications.rows);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

createTestNotification();
