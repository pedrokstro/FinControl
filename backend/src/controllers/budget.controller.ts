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

            console.log(`[BUDGET] Request received: User=${userId}, Category=${categoryId}, Amount=${amount} (${typeof amount})`);

            if (!categoryId || amount === undefined || amount === null) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados insuficientes: categoryId e amount são obrigatórios'
                });
            }

            // Converte e valida o 'amount'
            let numericAmount: number;
            if (typeof amount === 'string') {
                // Remove R$, pontos de milhar e troca vírgula por ponto (se houver)
                const cleanAmount = amount.replace(/[R$\s.]/g, '').replace(',', '.');
                numericAmount = parseFloat(cleanAmount);
            } else {
                numericAmount = Number(amount);
            }

            if (isNaN(numericAmount)) {
                console.error(`[BUDGET] Valor inválido recebido: ${amount}`);
                return res.status(400).json({
                    success: false,
                    message: 'O valor do limite deve ser um número válido'
                });
            }

            console.log(`[BUDGET] Saving numeric limit: ${numericAmount}`);

            const budget = await budgetService.save(userId, {
                categoryId,
                amount: numericAmount
            });

            return sendCreated(res, budget, 'Orçamento salvo com sucesso');
        } catch (error: any) {
            console.error('[BUDGET] Erro fatal no controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao salvar orçamento',
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
