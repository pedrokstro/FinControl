const { Client } = require('pg');

async function fixPostgresTimezone() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'fincontrol_db',
    user: 'postgres',
    password: '360106'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // 1. Verificar timezone atual
    const currentTz = await client.query(`SHOW TIMEZONE`);
    console.log('📍 Timezone atual:', currentTz.rows[0].TimeZone);

    // 2. Alterar timezone para UTC na sessão
    await client.query(`SET TIME ZONE 'UTC'`);
    console.log('✅ Timezone da sessão alterado para UTC');

    // 3. Alterar timezone padrão do banco de dados
    await client.query(`ALTER DATABASE fincontrol_db SET timezone TO 'UTC'`);
    console.log('✅ Timezone padrão do banco alterado para UTC');

    // 4. Verificar nova timezone
    const newTz = await client.query(`SHOW TIMEZONE`);
    console.log('📍 Nova timezone:', newTz.rows[0].TimeZone);

    console.log('\n🎉 Timezone do PostgreSQL configurado para UTC!');
    console.log('⚠️  IMPORTANTE: Reinicie o backend para aplicar as mudanças');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

fixPostgresTimezone();
