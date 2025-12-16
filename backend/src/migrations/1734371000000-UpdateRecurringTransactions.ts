import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateRecurringTransactions1734371000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remover colunas antigas de recorrência
    await queryRunner.dropColumn('transactions', 'recurrenceEndDate');
    
    // Adicionar novas colunas para sistema de parcelas
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'totalInstallments',
        type: 'integer',
        isNullable: true,
        comment: 'Número total de parcelas (null = recorrência infinita)',
      })
    );

    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'currentInstallment',
        type: 'integer',
        isNullable: true,
        default: 1,
        comment: 'Parcela atual (para controle)',
      })
    );

    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'isCancelled',
        type: 'boolean',
        default: false,
        comment: 'Indica se a recorrência foi cancelada',
      })
    );

    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'cancelledAt',
        type: 'timestamp',
        isNullable: true,
        comment: 'Data de cancelamento da recorrência',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter mudanças
    await queryRunner.dropColumn('transactions', 'cancelledAt');
    await queryRunner.dropColumn('transactions', 'isCancelled');
    await queryRunner.dropColumn('transactions', 'currentInstallment');
    await queryRunner.dropColumn('transactions', 'totalInstallments');

    // Restaurar coluna antiga
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'recurrenceEndDate',
        type: 'timestamp',
        isNullable: true,
      })
    );
  }
}
