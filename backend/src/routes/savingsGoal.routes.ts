import { Router } from 'express';
import savingsGoalController from '../controllers/savingsGoal.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { upsertGoalSchema } from '../validators/savingsGoal.validator';

const router = Router();

// Todas as rotas de metas requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /savings-goals/current:
 *   get:
 *     summary: Buscar meta do mês atual
 *     tags: [Savings Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Meta encontrada
 *       404:
 *         description: Nenhuma meta definida para o mês atual
 */
router.get('/current', savingsGoalController.getCurrentGoal);

/**
 * @swagger
 * /savings-goals:
 *   get:
 *     summary: Listar todas as metas do usuário
 *     tags: [Savings Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de metas
 */
router.get('/', savingsGoalController.getAllGoals);

/**
 * @swagger
 * /savings-goals/{month}/{year}:
 *   get:
 *     summary: Buscar meta por mês/ano
 *     tags: [Savings Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meta encontrada
 *       404:
 *         description: Meta não encontrada
 */
router.get('/:month/:year', savingsGoalController.getGoalByMonthYear);

/**
 * @swagger
 * /savings-goals:
 *   post:
 *     summary: Criar ou atualizar meta de economia
 *     tags: [Savings Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetAmount
 *               - month
 *               - year
 *             properties:
 *               targetAmount:
 *                 type: number
 *                 example: 1000
 *               month:
 *                 type: integer
 *                 example: 11
 *               year:
 *                 type: integer
 *                 example: 2025
 *               description:
 *                 type: string
 *                 example: "Meta de economia para viagem"
 *     responses:
 *       200:
 *         description: Meta criada/atualizada com sucesso
 */
router.post('/', validate(upsertGoalSchema), savingsGoalController.upsertGoal);

/**
 * @swagger
 * /savings-goals/{goalId}:
 *   delete:
 *     summary: Deletar meta
 *     tags: [Savings Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meta deletada com sucesso
 *       404:
 *         description: Meta não encontrada
 */
router.delete('/:goalId', savingsGoalController.deleteGoal);

export default router;
