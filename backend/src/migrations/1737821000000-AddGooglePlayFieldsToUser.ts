import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGooglePlayFieldsToUser1737821000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar campos do Google Play Billing
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'googlePlayPurchaseToken',
        type: 'varchar',
        length: '500',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'googlePlaySubscriptionId',
        type: 'varchar',
        length: '100',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'googlePlayOrderId',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );

    // Atualizar coluna subscriptionStatus para incluir novos status
    await queryRunner.query(`
      ALTER TABLE users 
      MODIFY COLUMN subscriptionStatus VARCHAR(50) NULL 
      COMMENT 'Status: active, canceled, expired, revoked'
    `);

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
