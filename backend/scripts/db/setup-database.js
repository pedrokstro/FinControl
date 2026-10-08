require('dotenv').config();
const { Client } = require('pg');

const setupDatabase = async () => {
  console.log('🔧 Configurando PostgreSQL...\n');

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';

  // Conectar ao postgres (database padrão)
  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: 'postgres', // Conecta ao database padrão primeiro
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!\n');

    // Verificar se o database já existe
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'fincontrol_db'"
    );

    if (checkDb.rows.length > 0) {
      console.log('✅ Database "fincontrol_db" já existe!');
    } else {
      console.log('📦 Criando database "fincontrol_db"...');
      await client.query('CREATE DATABASE fincontrol_db');
      console.log('✅ Database "fincontrol_db" criado com sucesso!');
    }

    await client.end();

    // Agora conectar ao novo database para configurar encoding
    const dbClient = new Client({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: 'fincontrol_db',
    });

    await dbClient.connect();
    console.log('\n✅ Conectado ao database "fincontrol_db"!');

    // Verificar encoding
    const encoding = await dbClient.query('SHOW SERVER_ENCODING');
    console.log(`📝 Encoding: ${encoding.rows[0].server_encoding}`);

    await dbClient.end();

    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('\n📋 Próximo passo:');
    console.log('   npm run dev\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
};

setupDatabase();
