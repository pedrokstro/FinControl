import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateRecurringTransactions1734371000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar e remover coluna antiga se existir
    const table = await queryRunner.getTable('transactions');
    const hasRecurrenceEndDate = table?.findColumnByName('recurrenceEndDate');
    
    if (hasRecurrenceEndDate) {
      await queryRunner.dropColumn('transactions', 'recurrenceEndDate');
    }
    
    // Verificar e adicionar novas colunas apenas se não existirem
    const hasTotalInstallments = table?.findColumnByName('totalInstallments');
    if (!hasTotalInstallments) {
      await queryRunner.addColumn(
        'transactions',
        new TableColumn({
          name: 'totalInstallments',
          type: 'integer',
          isNullable: true,
          comment: 'Número total de parcelas (null = recorrência infinita)',
        })
      );
    }

    const hasCurrentInstallment = table?.findColumnByName('currentInstallment');
    if (!hasCurrentInstallment) {
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
    }

    const hasIsCancelled = table?.findColumnByName('isCancelled');
    if (!hasIsCancelled) {
      await queryRunner.addColumn(
        'transactions',
        new TableColumn({
          name: 'isCancelled',
          type: 'boolean',
          default: false,
          comment: 'Indica se a recorrência foi cancelada',
        })
      );
    }

    const hasCancelledAt = table?.findColumnByName('cancelledAt');
    if (!hasCancelledAt) {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter mudanças
    const table = await queryRunner.getTable('transactions');
    
    if (table?.findColumnByName('cancelledAt')) {
      await queryRunner.dropColumn('transactions', 'cancelledAt');
    }
    
    if (table?.findColumnByName('isCancelled')) {
      await queryRunner.dropColumn('transactions', 'isCancelled');
    }
    
    if (table?.findColumnByName('currentInstallment')) {
      await queryRunner.dropColumn('transactions', 'currentInstallment');
    }
    
    if (table?.findColumnByName('totalInstallments')) {
      await queryRunner.dropColumn('transactions', 'totalInstallments');
    }

    // Restaurar coluna antiga se não existir
    if (!table?.findColumnByName('recurrenceEndDate')) {
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
}
