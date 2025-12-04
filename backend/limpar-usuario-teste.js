const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function deleteTestUser() {
  console.log('=== LIMPAR USUÁRIO DE TESTE ===\n');

  // Perguntar o email
  rl.question('Digite o email do usuário que deseja remover: ', async (email) => {
    if (!email) {
      console.log('❌ Email não fornecido!');
      rl.close();
      return;
    }

    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '360106',
      database: 'fincontrol_db',
    });

    try {
      await client.connect();
      console.log('\n📡 Conectado ao banco de dados...\n');

      // Verificar se o usuário existe
      const checkUser = await client.query(
        'SELECT id, name, email, "emailVerified" FROM users WHERE email = $1',
        [email]
      );

      if (checkUser.rows.length === 0) {
        console.log('❌ Usuário não encontrado!');
        rl.close();
        await client.end();
        return;
      }

      const user = checkUser.rows[0];
      console.log('👤 Usuário encontrado:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Email Verificado: ${user.emailVerified}`);
      console.log('');

      rl.question('⚠️  Deseja REALMENTE deletar este usuário? (sim/não): ', async (confirm) => {
        if (confirm.toLowerCase() !== 'sim') {
          console.log('❌ Operação cancelada!');
          rl.close();
          await client.end();
          return;
        }

        try {
          // Deletar em ordem (por causa das foreign keys)
          console.log('\n🗑️  Deletando dados relacionados...');

          // 1. Deletar refresh tokens
          await client.query('DELETE FROM refresh_tokens WHERE "userId" = $1', [user.id]);
          console.log('   ✅ Refresh tokens deletados');

          // 2. Deletar transações
          await client.query('DELETE FROM transactions WHERE "userId" = $1', [user.id]);
          console.log('   ✅ Transações deletadas');

          // 3. Deletar categorias
          await client.query('DELETE FROM categories WHERE "userId" = $1', [user.id]);
          console.log('   ✅ Categorias deletadas');

          // 4. Deletar preferências
          await client.query('DELETE FROM user_preferences WHERE "userId" = $1', [user.id]);
          console.log('   ✅ Preferências deletadas');

          // 5. Deletar códigos de verificação
          await client.query('DELETE FROM verification_codes WHERE email = $1', [email]);
          console.log('   ✅ Códigos de verificação deletados');

          // 6. Deletar usuário
          await client.query('DELETE FROM users WHERE id = $1', [user.id]);
          console.log('   ✅ Usuário deletado');

          console.log('\n✅ Usuário removido com sucesso!');
          console.log('💡 Agora você pode criar uma nova conta com este email.\n');

        } catch (error) {
          console.error('\n❌ Erro ao deletar usuário:');
          console.error(error.message);
        } finally {
          rl.close();
          await client.end();
        }
      });

    } catch (error) {
      console.error('\n❌ Erro ao conectar ao banco:');
      console.error(error.message);
      rl.close();
      await client.end();
    }
  });
}

deleteTestUser();
