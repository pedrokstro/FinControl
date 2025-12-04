import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPremiumFieldsToUser1699999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna planType
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'planType',
        type: 'varchar',
        length: '20',
        default: "'free'",
      })
    );

    // Adicionar coluna planStartDate
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'planStartDate',
        type: 'timestamp',
        isNullable: true,
      })
    );

    // Adicionar coluna planEndDate
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'planEndDate',
        type: 'timestamp',
        isNullable: true,
      })
    );

    // Adicionar coluna isPremium
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'isPremium',
        type: 'boolean',
        default: false,
      })
    );

    console.log('✅ Campos de plano premium adicionados à tabela users');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover colunas na ordem inversa
    await queryRunner.dropColumn('users', 'isPremium');
    await queryRunner.dropColumn('users', 'planEndDate');
    await queryRunner.dropColumn('users', 'planStartDate');
    await queryRunner.dropColumn('users', 'planType');

    console.log('✅ Campos de plano premium removidos da tabela users');
  }
}
