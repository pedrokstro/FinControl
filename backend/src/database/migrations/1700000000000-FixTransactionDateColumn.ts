import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTransactionDateColumn1700000000000 implements MigrationInterface {
    name = 'FixTransactionDateColumn1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Preencher valores NULL com a data atual
        await queryRunner.query(`
            UPDATE "transactions" 
            SET "date" = CURRENT_DATE 
            WHERE "date" IS NULL
        `);

        // 2. Criar uma nova coluna temporária do tipo VARCHAR
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD COLUMN "date_temp" character varying(10)
        `);

        // 3. Copiar os dados convertidos para a coluna temporária
        await queryRunner.query(`
            UPDATE "transactions" 
            SET "date_temp" = TO_CHAR("date", 'YYYY-MM-DD')
        `);

        // 4. Remover a coluna antiga
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            DROP COLUMN "date"
        `);

        // 5. Renomear a coluna temporária para "date"
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            RENAME COLUMN "date_temp" TO "date"
        `);

        // 6. Tornar a coluna NOT NULL
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ALTER COLUMN "date" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter: converter VARCHAR de volta para DATE
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD COLUMN "date_temp" date
        `);

        await queryRunner.query(`
            UPDATE "transactions" 
            SET "date_temp" = "date"::date
        `);

        await queryRunner.query(`
            ALTER TABLE "transactions" 
            DROP COLUMN "date"
        `);

        await queryRunner.query(`
            ALTER TABLE "transactions" 
            RENAME COLUMN "date_temp" TO "date"
        `);
    }
}
