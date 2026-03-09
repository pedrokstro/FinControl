import { Request, Response } from 'express';
import { BudgetService } from '@/services/budget.service';
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/response';

const budgetService = new BudgetService();

export const budgetController = {
    async getAll(req: Request, res: Response) {
        const userId = req.user!.userId;
        const budgets = await budgetService.findAll(userId);
        return sendSuccess(res, budgets);
    },

    async save(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { categoryId, amount } = req.body;

        // Converte e valida o 'amount'
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

        const budget = await budgetService.save(userId, {
            categoryId,
            amount: numericAmount
        });

        return sendCreated(res, budget, 'Orçamento salvo com sucesso');
    },

    async delete(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { categoryId } = req.params;

        await budgetService.delete(userId, categoryId);

        return sendNoContent(res);
    },
};
