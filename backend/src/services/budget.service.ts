import { AppDataSource } from '@/config/database';
import { Budget } from '@/models/Budget';
import { NotFoundError } from '@/utils/errors';

export class BudgetService {
    private budgetRepository = AppDataSource.getRepository(Budget);

    async save(userId: string, data: { categoryId: string; amount: number }) {
        console.log(`[BUDGET-SERVICE] Upserting budget for category ${data.categoryId} with amount ${data.amount}`);
        
        // Usando upsert atômico do TypeORM para evitar Race Condition (TOCTOU)
        // Se duas requisições simultâneas tentarem criar, o banco de dados lidará com o conflito usando a constraint @Unique
        await this.budgetRepository.upsert(
            {
                userId,
                categoryId: data.categoryId,
                amount: data.amount
            },
            ['userId', 'categoryId']
        );

        const budget = await this.budgetRepository.findOne({
            where: { userId, categoryId: data.categoryId }
        });

        console.log(`[BUDGET-SERVICE] Final entity saved:`, JSON.stringify(budget));
        return budget;
    }

    async findAll(userId: string) {
        return this.budgetRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async delete(userId: string, categoryId: string) {
        const budget = await this.budgetRepository.findOne({
            where: { userId, categoryId }
        });

        if (!budget) {
            throw new NotFoundError('Orçamento não encontrado');
        }

        await this.budgetRepository.remove(budget);
    }
}
