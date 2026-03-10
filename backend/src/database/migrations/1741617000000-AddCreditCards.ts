import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddCreditCards1741617000000 implements MigrationInterface {
    name = 'AddCreditCards1741617000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Criar tabela credit_cards apenas se não existir
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "credit_cards" (
                "id"         uuid        NOT NULL DEFAULT gen_random_uuid(),
                "name"       varchar(100) NOT NULL,
                "limit"      decimal(12,2) NOT NULL,
                "closingDay" integer      NOT NULL,
                "dueDay"     integer      NOT NULL,
                "brand"      varchar(20)  NOT NULL DEFAULT 'Visa',
                "userId"     uuid         NOT NULL,
                "createdAt"  timestamp    NOT NULL DEFAULT now(),
                "updatedAt"  timestamp    NOT NULL DEFAULT now(),
                CONSTRAINT "PK_credit_cards" PRIMARY KEY ("id")
            )
        `);

        // 2. FK credit_cards.userId → users.id (apenas se não existir)
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'credit_cards_userId_fkey'
                      AND table_name = 'credit_cards'
                ) THEN
                    ALTER TABLE "credit_cards"
                        ADD CONSTRAINT "credit_cards_userId_fkey"
                        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
                END IF;
            END
            $$;
        `);

        // 3. Coluna creditCardId em transactions (apenas se não existir)
        await queryRunner.query(`
            ALTER TABLE "transactions"
                ADD COLUMN IF NOT EXISTS "creditCardId" uuid
        `);

        // 4. FK transactions.creditCardId → credit_cards.id (apenas se não existir)
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'transactions_creditCardId_fkey'
                      AND table_name = 'transactions'
                ) THEN
                    ALTER TABLE "transactions"
                        ADD CONSTRAINT "transactions_creditCardId_fkey"
                        FOREIGN KEY ("creditCardId") REFERENCES "credit_cards"("id") ON DELETE SET NULL;
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Remover FK em transactions
        const transactionTable = await queryRunner.getTable("transactions");
        const fk = transactionTable?.foreignKeys.find(
            f => f.columnNames.includes("creditCardId")
        );
        if (fk) await queryRunner.dropForeignKey("transactions", fk);

        // 2. Remover FK em credit_cards
        const creditCardTable = await queryRunner.getTable("credit_cards");
        const userFk = creditCardTable?.foreignKeys.find(
            f => f.columnNames.includes("userId")
        );
        if (userFk) await queryRunner.dropForeignKey("credit_cards", userFk);

        // 3. Remover coluna e tabela
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN IF EXISTS "creditCardId"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "credit_cards"`);
    }
}
