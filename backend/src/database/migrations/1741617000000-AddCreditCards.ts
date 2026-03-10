import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddCreditCards1741617000000 implements MigrationInterface {
    name = 'AddCreditCards1741617000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Criar a tabela credit_cards
        await queryRunner.createTable(new Table({
            name: "credit_cards",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "100"
                },
                {
                    name: "limit",
                    type: "decimal",
                    precision: 12,
                    scale: 2
                },
                {
                    name: "closingDay",
                    type: "integer"
                },
                {
                    name: "dueDay",
                    type: "integer"
                },
                {
                    name: "brand",
                    type: "varchar",
                    length: "20",
                    default: "'Visa'"
                },
                {
                    name: "userId",
                    type: "uuid"
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // 2. Adicionar chave estrangeira para o usuário
        await queryRunner.createForeignKey("credit_cards", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));

        // 3. Adicionar coluna creditCardId na tabela transactions
        await queryRunner.query(`ALTER TABLE "transactions" ADD COLUMN "creditCardId" uuid`);

        // 4. Adicionar chave estrangeira em transactions para credit_cards
        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["creditCardId"],
            referencedColumnNames: ["id"],
            referencedTableName: "credit_cards",
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Remover chave estrangeira em transactions
        const transactionTable = await queryRunner.getTable("transactions");
        const foreignKey = transactionTable?.foreignKeys.find(fk => fk.columnNames.indexOf("creditCardId") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("transactions", foreignKey);
        }

        // 2. Remover coluna creditCardId em transactions
        await queryRunner.dropColumn("transactions", "creditCardId");

        // 3. Remover tabela credit_cards
        await queryRunner.dropTable("credit_cards");
    }
}
