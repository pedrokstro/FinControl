import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddThemeToUsers1699999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'theme',
        type: 'varchar',
        length: '10',
        default: "'light'",
        isNullable: false,
      })
    );

    // Adicionar constraint de check
    await queryRunner.query(`
      ALTER TABLE users 
      ADD CONSTRAINT check_theme_values 
      CHECK (theme IN ('light', 'dark', 'system'))
    `);

    // Criar índice para performance
    await queryRunner.query(`
      CREATE INDEX idx_users_theme ON users(theme)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_theme`);
    await queryRunner.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS check_theme_values`);
    await queryRunner.dropColumn('users', 'theme');
  }
}
