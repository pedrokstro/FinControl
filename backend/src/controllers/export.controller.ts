import { Request, Response } from 'express';
import { AppDataSource } from '@/config/database';
import { Transaction } from '@/models/Transaction';
import { Category } from '@/models/Category';
import { User } from '@/models/User';

class ExportController {
  /**
   * POST /api/export/reports
   * Exportar relatórios (validação de premium já feita pelo middleware)
   */
  async exportReports(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { format, startDate, endDate } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Validar formato
      if (!['pdf', 'excel', 'csv'].includes(format)) {
        res.status(400).json({
          success: false,
          message: 'Formato inválido. Use: pdf, excel ou csv',
        });
        return;
      }

      const transactionRepository = AppDataSource.getRepository(Transaction);
      const categoryRepository = AppDataSource.getRepository(Category);

      // Buscar transações do período
      let query = transactionRepository
        .createQueryBuilder('transaction')
        .where('transaction.userId = :userId', { userId });

      if (startDate) {
        query = query.andWhere('transaction.date >= :startDate', { startDate });
      }

      if (endDate) {
        query = query.andWhere('transaction.date <= :endDate', { endDate });
      }

      const transactions = await query.getMany();
      const categories = await categoryRepository.find({ where: { userId } });

      // Preparar dados para exportação
      const exportData = {
        transactions: transactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          description: t.description,
          date: t.date,
          categoryId: t.categoryId,
          category: categories.find(c => c.id === t.categoryId)?.name || 'Sem categoria',
        })),
        summary: {
          totalTransactions: transactions.length,
          totalIncome: transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0),
          totalExpense: transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0),
        },
        period: {
          startDate: startDate || 'Início',
          endDate: endDate || 'Fim',
        },
        exportDate: new Date().toISOString(),
        format,
      };

      res.json({
        success: true,
        message: 'Dados preparados para exportação',
        data: exportData,
      });
    } catch (error: any) {
      console.error('Erro ao exportar relatórios:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao exportar relatórios',
      });
    }
  }

  /**
   * POST /api/export/data
   * Exportar todos os dados do usuário (validação de premium já feita pelo middleware)
   */
  async exportData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const transactionRepository = AppDataSource.getRepository(Transaction);
      const categoryRepository = AppDataSource.getRepository(Category);

      // Buscar todos os dados do usuário
      const user = await userRepository.findOne({ where: { id: userId } });
      const transactions = await transactionRepository.find({ where: { userId } });
      const categories = await categoryRepository.find({ where: { userId } });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
        return;
      }

      // Preparar dados completos para exportação
      const exportData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isPremium: user.isPremium,
          planType: user.planType,
          createdAt: user.createdAt,
        },
        transactions: transactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          description: t.description,
          date: t.date,
          categoryId: t.categoryId,
          isRecurring: t.isRecurring,
          recurrenceType: t.recurrenceType,
          createdAt: t.createdAt,
        })),
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          type: c.type,
          color: c.color,
          icon: c.icon,
          createdAt: c.createdAt,
        })),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      res.json({
        success: true,
        message: 'Dados exportados com sucesso',
        data: exportData,
      });
    } catch (error: any) {
      console.error('Erro ao exportar dados:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao exportar dados',
      });
    }
  }
}

export const exportController = new ExportController();
