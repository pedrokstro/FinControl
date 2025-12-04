import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateUserPreferences1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela user_preferences
    await queryRunner.createTable(
      new Table({
        name: 'user_preferences',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'key',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Criar constraint UNIQUE para userId + key
    await queryRunner.query(`
      ALTER TABLE user_preferences 
      ADD CONSTRAINT unique_user_preference 
      UNIQUE ("userId", key)
    `);

    // Criar foreign key para users
    await queryRunner.createForeignKey(
      'user_preferences',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Criar índices
    await queryRunner.createIndex(
      'user_preferences',
      new TableIndex({
        name: 'idx_user_preferences_user_id',
        columnNames: ['userId'],
      })
    );

    await queryRunner.createIndex(
      'user_preferences',
      new TableIndex({
        name: 'idx_user_preferences_key',
        columnNames: ['key'],
      })
    );

    // Criar trigger para atualizar updatedAt
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_user_preferences_updated_at
      BEFORE UPDATE ON user_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_user_preferences_updated_at();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover trigger
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_user_preferences_updated_at ON user_preferences`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_user_preferences_updated_at`);

    // Remover índices
    await queryRunner.dropIndex('user_preferences', 'idx_user_preferences_key');
    await queryRunner.dropIndex('user_preferences', 'idx_user_preferences_user_id');

    // Remover tabela (foreign keys são removidas automaticamente)
    await queryRunner.dropTable('user_preferences');
  }
}
