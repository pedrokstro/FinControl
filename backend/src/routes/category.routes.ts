import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { checkFeatureAccess } from '@/middlewares/checkPremium';
import { validate } from '@/middlewares/validation.middleware';
import { createCategorySchema, updateCategorySchema } from '@/validators/category.validator';

const router = Router();

// Todas as rotas de categoria requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Listar categorias do usuário
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *     responses:
 *       200:
 *         description: Categorias obtidas com sucesso
 */
router.get('/', categoryController.findAll);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               color:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post('/', validate(createCategorySchema), categoryController.create);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria obtida com sucesso
 */
router.get('/:id', categoryController.findById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               color:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 */
router.put('/:id', validate(updateCategorySchema), categoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Deletar categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
 */
router.delete('/:id', categoryController.remove);

/**
 * @swagger
 * /categories/premium/emojis:
 *   get:
 *     summary: Obter lista de emojis avançados (Premium)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de emojis premium
 *       403:
 *         description: Acesso negado - Requer plano Premium
 */
router.get('/premium/emojis', checkFeatureAccess('advanced_emojis'), (_req, res) => {
  res.json({
    success: true,
    data: {
      emojis: [
        '🎯', '🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🎰', '🎳', '🎸',
        '🎹', '🎺', '🎻', '🎼', '🎤', '🎧', '🎵', '🎶', '🎷', '🥁',
        '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🥎',
        '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍',
      ],
      isPremium: true,
    },
  });
});

export default router;
