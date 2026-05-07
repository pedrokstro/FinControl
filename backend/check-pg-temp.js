const { Client } = require('pg');

async function checkLocalPostgres() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'root_password', // Guessing from docker-compose mysql root pass or standard
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao Postgres Local');
    const res = await client.query('SELECT id, email, "isPremium" FROM public.users WHERE email = $1', ['demo@financeiro.com']);

    if (res.rows.length > 0) {
      console.log('👤 Usuário encontrado:', res.rows[0]);
      await client.query('UPDATE public.users SET "isPremium" = false, "planType" = $1 WHERE email = $2', ['free', 'demo@financeiro.com']);
      console.log('✅ Atualizado para isPremium = false!');
    } else {
      console.log('⚠️ Usuário demo@financeiro.com NÃO encontrado no Postgres local.');
    }
  } catch (err) {
    console.error('❌ Erro no Postgres Local:', err.message);
  } finally {
    await client.end();
  }
}

checkLocalPostgres();
