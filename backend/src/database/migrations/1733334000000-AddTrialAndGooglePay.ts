import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrialAndGooglePay1733334000000 implements MigrationInterface {
    name = 'AddTrialAndGooglePay1733334000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar coluna isTrial
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "isTrial" boolean DEFAULT false
        `);

        // Adicionar colunas do Google Pay (se não existirem)
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "googlePayTransactionId" varchar(255)
        `);

        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "subscriptionStatus" varchar(50)
        `);

        // Adicionar colunas faltantes na tabela notifications (se necessário)
        await queryRunner.query(`
            ALTER TABLE "notifications" 
            ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        await queryRunner.query(`
            ALTER TABLE "notifications" 
            ADD COLUMN IF NOT EXISTS "category" varchar(50)
        `);

        await queryRunner.query(`
            ALTER TABLE "notifications" 
            ADD COLUMN IF NOT EXISTS "relatedId" varchar(36)
        `);

        await queryRunner.query(`
            ALTER TABLE "notifications" 
            ADD COLUMN IF NOT EXISTS "relatedType" varchar(50)
        `);

        console.log('✅ Migration AddTrialAndGooglePay executada com sucesso');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback - remover colunas adicionadas
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "isTrial"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "googlePayTransactionId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "subscriptionStatus"`);
        
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "category"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "relatedId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "relatedType"`);

        console.log('✅ Rollback AddTrialAndGooglePay executado com sucesso');
    }
}
