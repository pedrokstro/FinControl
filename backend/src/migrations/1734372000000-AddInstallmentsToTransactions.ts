import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInstallmentsToTransactions1734372000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se as colunas já existem antes de adicionar
    const table = await queryRunner.getTable('transactions');
    
    // Adicionar totalInstallments (null = recorrência infinita)
    if (!table?.findColumnByName('totalInstallments')) {
      await queryRunner.addColumn(
        'transactions',
        new TableColumn({
          name: 'totalInstallments',
          type: 'integer',
          isNullable: true,
          comment: 'Número total de parcelas (null = recorrência infinita ou usa recurrenceEndDate)',
        })
      );
    }

    // Adicionar currentInstallment (controle de qual parcela está)
    if (!table?.findColumnByName('currentInstallment')) {
      await queryRunner.addColumn(
        'transactions',
        new TableColumn({
          name: 'currentInstallment',
          type: 'integer',
          isNullable: true,
          default: 1,
          comment: 'Parcela atual (para controle de progresso)',
        })
      );
    }

    // Adicionar isCancelled (para recorrências infinitas)
    if (!table?.findColumnByName('isCancelled')) {
      await queryRunner.addColumn(
        'transactions',
        new TableColumn({
          name: 'isCancelled',
          type: 'boolean',
          default: false,
          comment: 'Indica se a recorrência foi cancelada pelo usuário',
        })
      );
    }

    // Adicionar cancelledAt (data do cancelamento)
    if (!table?.findColumnByName('cancelledAt')) {
      await queryRunner.addColumn(
        'transactions',
        new TableColumn({
          name: 'cancelledAt',
          type: 'timestamp',
          isNullable: true,
          comment: 'Data em que a recorrência foi cancelada',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter mudanças removendo as colunas adicionadas
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
  }
}
