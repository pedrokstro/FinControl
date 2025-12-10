import { Router } from 'express';
import analyticsController from '@/controllers/analytics.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * @route   GET /api/v1/analytics
 * @desc    Obter todos os dados de analytics
 * @access  Private
 */
router.get('/', analyticsController.getAll);

/**
 * @route   GET /api/v1/analytics/cash-flow
 * @desc    Obter fluxo de caixa diário
 * @access  Private
 */
router.get('/cash-flow', analyticsController.getDailyCashFlow);

/**
 * @route   GET /api/v1/analytics/top-expenses
 * @desc    Obter top despesas
 * @access  Private
 */
router.get('/top-expenses', analyticsController.getTopExpenses);

/**
 * @route   GET /api/v1/analytics/savings-rate
 * @desc    Obter taxa de poupança
 * @access  Private
 */
router.get('/savings-rate', analyticsController.getSavingsRate);

/**
 * @route   GET /api/v1/analytics/expenses-by-weekday
 * @desc    Obter despesas por dia da semana
 * @access  Private
 */
router.get('/expenses-by-weekday', analyticsController.getExpensesByWeekday);

/**
 * @route   GET /api/v1/analytics/budget-vs-actual
 * @desc    Obter orçamento vs real
 * @access  Private
 */
router.get('/budget-vs-actual', analyticsController.getBudgetVsActual);

export default router;
