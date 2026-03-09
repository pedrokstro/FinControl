import { Request, Response } from 'express';
import { BudgetService } from '@/services/budget.service';
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/response';

const budgetService = new BudgetService();

export const budgetController = {
    async getAll(req: Request, res: Response) {
        try {
            const userId = req.user!.userId;
            const budgets = await budgetService.findAll(userId);
            return sendSuccess(res, budgets);
        } catch (error: any) {
            console.error('[BUDGET] Erro ao buscar:', error);
            return res.status(500).json({ error: 'Erro ao buscar orçamentos' });
        }
    },

    async save(req: Request, res: Response) {
        try {
            const userId = req.user!.userId;
            const { categoryId, amount } = req.body;

            console.log(`[BUDGET] Salvando limite: User=${userId}, Category=${categoryId}, Amount=${amount}`);

            if (!categoryId || amount === undefined) {
                return res.status(400).json({ error: 'Dados insuficientes' });
            }

            // Converte e valida o 'amount'
            const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

            const budget = await budgetService.save(userId, {
                categoryId,
                amount: numericAmount
            });

            return sendCreated(res, budget, 'Orçamento salvo com sucesso');
        } catch (error: any) {
            console.error('[BUDGET] Erro ao salvar:', error);
            return res.status(500).json({
                error: 'Erro interno ao salvar orçamento',
                message: error.message
            });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const userId = req.user!.userId;
            const { categoryId } = req.params;

            await budgetService.delete(userId, categoryId);

            return sendNoContent(res);
        } catch (error: any) {
            console.error('[BUDGET] Erro ao excluir:', error);
            return res.status(500).json({ error: 'Erro ao excluir orçamento' });
        }
    },
};
