const { Client } = require('pg');

async function testDate() {
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

    // Testar conversão de data
    const testDate = '2025-11-11';
    
    console.log('\n📅 Testando conversão de data:', testDate);
    
    // Teste 1: Cast simples
    const test1 = await client.query(`SELECT $1::date as result`, [testDate]);
    console.log('1. $1::date =>', test1.rows[0].result);
    
    // Teste 2: TO_DATE
    const test2 = await client.query(`SELECT TO_DATE($1, 'YYYY-MM-DD') as result`, [testDate]);
    console.log('2. TO_DATE =>', test2.rows[0].result);
    
    // Teste 3: TO_DATE com ::text
    const test3 = await client.query(`SELECT TO_DATE($1, 'YYYY-MM-DD')::text as result`, [testDate]);
    console.log('3. TO_DATE::text =>', test3.rows[0].result);
    
    // Teste 4: Inserir e buscar
    await client.query(`CREATE TEMP TABLE test_dates (id SERIAL, test_date DATE)`);
    await client.query(`INSERT INTO test_dates (test_date) VALUES (TO_DATE($1, 'YYYY-MM-DD'))`, [testDate]);
    const test4 = await client.query(`SELECT test_date FROM test_dates`);
    console.log('4. Inserir e buscar =>', test4.rows[0].test_date);
    
    // Teste 5: Verificar timezone
    const test5 = await client.query(`SELECT current_setting('TIMEZONE') as tz`);
    console.log('5. Timezone atual =>', test5.rows[0].tz);
    
    // Teste 6: Verificar se o tipo da coluna está correto
    const test6 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'transactions' AND column_name = 'date'
    `);
    console.log('6. Tipo da coluna date =>', test6.rows[0]);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

testDate();
