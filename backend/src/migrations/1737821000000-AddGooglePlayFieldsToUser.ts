import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGooglePlayFieldsToUser1737821000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se as colunas já existem antes de adicionar
    const table = await queryRunner.getTable('users');
    
    if (!table?.findColumnByName('googlePlayPurchaseToken')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'googlePlayPurchaseToken',
          type: 'varchar',
          length: '500',
          isNullable: true,
        })
      );
    }

    if (!table?.findColumnByName('googlePlaySubscriptionId')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'googlePlaySubscriptionId',
          type: 'varchar',
          length: '100',
          isNullable: true,
        })
      );
    }

    if (!table?.findColumnByName('googlePlayOrderId')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'googlePlayOrderId',
          type: 'varchar',
          length: '255',
          isNullable: true,
        })
      );
    }

    // Atualizar coluna subscriptionStatus de forma compatível com MySQL e PostgreSQL
    const dbType = queryRunner.connection.options.type;
    
    if (dbType === 'postgres') {
      // PostgreSQL usa ALTER COLUMN
      await queryRunner.query(`
        ALTER TABLE users 
        ALTER COLUMN "subscriptionStatus" TYPE VARCHAR(50)
      `);
    } else {
      // MySQL usa MODIFY COLUMN
      await queryRunner.query(`
        ALTER TABLE users 
        MODIFY COLUMN subscriptionStatus VARCHAR(50) NULL 
        COMMENT 'Status: active, canceled, expired, revoked'
      `);
    }

    console.log('✅ Migration: Added Google Play Billing fields to users table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover campos do Google Play Billing
    await queryRunner.dropColumn('users', 'googlePlayOrderId');
    await queryRunner.dropColumn('users', 'googlePlaySubscriptionId');
    await queryRunner.dropColumn('users', 'googlePlayPurchaseToken');

    // Reverter coluna subscriptionStatus
    await queryRunner.query(`
      ALTER TABLE users 
      MODIFY COLUMN subscriptionStatus VARCHAR(50) NULL 
      COMMENT 'Status: active, cancelled, expired'
    `);

    console.log('✅ Migration: Removed Google Play Billing fields from users table');
  }
}
