const { Client } = require('pg');

async function checkAdmin() {
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

    const result = await client.query(
      'SELECT id, name, email, "isAdmin", "isPremium" FROM users WHERE email = $1',
      ['demo@financeiro.com']
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    const user = result.rows[0];
    console.log('👤 Status do usuário:');
    console.table(user);

    if (!user.isAdmin) {
      console.log('\n🔧 Tornando usuário admin...');
      await client.query(
        'UPDATE users SET "isAdmin" = TRUE WHERE id = $1',
        [user.id]
      );
      console.log('✅ Usuário agora é admin!');
    } else {
      console.log('\n✅ Usuário já é admin!');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

checkAdmin();
