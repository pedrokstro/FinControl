import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSavingsGoalsTable1733847600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'savings_goals',
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
            name: 'targetAmount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currentAmount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'month',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
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

    // Criar índice único para userId + month + year (uma meta por mês)
    await queryRunner.createIndex(
      'savings_goals',
      new TableIndex({
        name: 'IDX_SAVINGS_GOALS_USER_MONTH_YEAR',
        columnNames: ['userId', 'month', 'year'],
        isUnique: true,
      })
    );

    // Criar índice para userId
    await queryRunner.createIndex(
      'savings_goals',
      new TableIndex({
        name: 'IDX_SAVINGS_GOALS_USER_ID',
        columnNames: ['userId'],
      })
    );

    // Adicionar foreign key para users
    await queryRunner.query(`
      ALTER TABLE savings_goals
      ADD CONSTRAINT FK_SAVINGS_GOALS_USER
      FOREIGN KEY ("userId") REFERENCES users(id)
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('savings_goals');
  }
}
