import { Router } from 'express';
import * as dashboardController from '@/controllers/dashboard.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// Todas as rotas de dashboard requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obter dados do dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dashboard obtido com sucesso
 */
router.get('/', dashboardController.getDashboard);

export default router;
