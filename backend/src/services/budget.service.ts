import { AppDataSource } from '@/config/database';
import { Budget } from '@/models/Budget';
import { NotFoundError } from '@/utils/errors';

export class BudgetService {
    private budgetRepository = AppDataSource.getRepository(Budget);

    async save(userId: string, data: { categoryId: string; amount: number }) {
        // Tenta encontrar um orçamento existente para este usuário e categoria
        let budget = await this.budgetRepository.findOne({
            where: { userId, categoryId: data.categoryId }
        });

        if (budget) {
            // Atualiza o existente
            budget.amount = data.amount;
        } else {
            // Cria um novo
            budget = this.budgetRepository.create({
                ...data,
                userId,
            });
        }

        await this.budgetRepository.save(budget);
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
