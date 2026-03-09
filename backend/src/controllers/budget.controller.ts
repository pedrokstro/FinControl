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

            console.log('[BUDGET-DEBUG] Payload recebido:', JSON.stringify(req.body));
            console.log('[BUDGET-DEBUG] Headers:', JSON.stringify(req.headers));

            if (!categoryId) {
                console.error('[BUDGET-DEBUG] Falha: categoryId ausente');
                return res.status(400).json({
                    success: false,
                    message: 'Faltando categoryId no corpo da requisição'
                });
            }

            if (amount === undefined || amount === null) {
                console.error('[BUDGET-DEBUG] Falha: amount ausente');
                return res.status(400).json({
                    success: false,
                    message: 'Faltando amount no corpo da requisição'
                });
            }

            // Converte e valida o 'amount'
            let numericAmount: number;
            if (typeof amount === 'string') {
                const cleanAmount = amount.replace(/[R$\s.]/g, '').replace(',', '.');
                numericAmount = parseFloat(cleanAmount);
            } else {
                numericAmount = Number(amount);
            }

            if (isNaN(numericAmount)) {
                console.error(`[BUDGET-DEBUG] Falha: amount inválido (${amount})`);
                return res.status(400).json({
                    success: false,
                    message: `O valor do limite '${amount}' não é um número válido`
                });
            }

            console.log(`[BUDGET-DEBUG] Persistindo: User=${userId}, Cat=${categoryId}, Val=${numericAmount}`);

            const budget = await budgetService.save(userId, {
                categoryId,
                amount: numericAmount
            });

            return sendCreated(res, budget, 'Orçamento salvo com sucesso');
        } catch (error: any) {
            console.error('[BUDGET-FATAL] Erro:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor ao processar orçamento',
                error: error.message
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
