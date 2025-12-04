const { Client } = require('pg');

async function deleteOldDecimo() {
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

    // Deletar a transação "Decimo" com data 2025-11-10
    const result = await client.query(`
      DELETE FROM transactions 
      WHERE description = 'Decimo' AND date = '2025-11-10'
      RETURNING id, description, date
    `);
    
    if (result.rows.length > 0) {
      console.log('🗑️  Transação deletada:');
      result.rows.forEach(row => {
        console.log(`   - ID: ${row.id}`);
        console.log(`   - Descrição: ${row.description}`);
        console.log(`   - Data: ${row.date}`);
      });
      console.log('\n✅ Transação antiga removida com sucesso!');
    } else {
      console.log('⚠️  Nenhuma transação encontrada para deletar');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

deleteOldDecimo();
