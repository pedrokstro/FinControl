const { Client } = require('pg');

async function fixAllDates() {
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

    // Buscar todas as transações
    const result = await client.query('SELECT id, description, date::text as date FROM transactions ORDER BY date DESC');
    console.log(`📊 Total de transações: ${result.rows.length}\n`);

    // Atualizar TODAS as transações adicionando 2 dias
    const updateResult = await client.query(`
      UPDATE transactions 
      SET date = date + INTERVAL '2 days'
      RETURNING id, description, date::text as new_date
    `);

    console.log('✅ Transações atualizadas:\n');
    updateResult.rows.forEach(row => {
      console.log(`   ✅ ${row.description}: ${row.new_date}`);
    });

    console.log('\n🎉 Todas as datas foram corrigidas (+2 dias)!');
    console.log('⚠️  Recarregue a página (F5) para ver as mudanças');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

fixAllDates();
