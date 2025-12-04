const { Client } = require('pg');

async function checkNotifications() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'fincontrol_db',
    user: 'postgres',
    password: '360106'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');

    // Verificar estrutura da tabela
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position;
    `);

    console.log('📋 Estrutura da tabela notifications:');
    console.table(tableInfo.rows);

    // Contar notificações
    const count = await client.query('SELECT COUNT(*) FROM notifications');
    console.log(`\n📊 Total de notificações: ${count.rows[0].count}`);

    // Listar notificações existentes
    const notifications = await client.query(`
      SELECT id, title, message, type, category, "isRead", "createdAt"
      FROM notifications
      ORDER BY "createdAt" DESC
      LIMIT 5
    `);

    if (notifications.rows.length > 0) {
      console.log('\n🔔 Últimas notificações:');
      console.table(notifications.rows);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

checkNotifications();
