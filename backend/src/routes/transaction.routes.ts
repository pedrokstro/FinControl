import { Router } from 'express';
import * as transactionController from '@/controllers/transaction.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate, validateQuery } from '@/middlewares/validation.middleware';
import { createTransactionSchema, updateTransactionSchema, filterTransactionsSchema } from '@/validators/transaction.validator';

const router = Router();

// Todas as rotas de transação requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Listar transações do usuário
 *     tags: [Transactions]
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Transações obtidas com sucesso
 */
router.get('/', validateQuery(filterTransactionsSchema), transactionController.findAll);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Criar nova transação
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 */
router.post('/', validate(createTransactionSchema), transactionController.create);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Obter transação por ID
 *     tags: [Transactions]
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
 *         description: Transação obtida com sucesso
 */
router.get('/:id', transactionController.findById);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Atualizar transação
 *     tags: [Transactions]
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
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 */
router.put('/:id', validate(updateTransactionSchema), transactionController.update);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Deletar transação
 *     tags: [Transactions]
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
 *         description: Transação deletada com sucesso
 */
router.delete('/:id', transactionController.remove);

/**
 * @swagger
 * /transactions/{id}/cancel-recurrence:
 *   patch:
 *     summary: Cancelar recorrência de uma transação
 *     tags: [Transactions]
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
 *         description: Recorrência cancelada com sucesso
 */
router.patch('/:id/cancel-recurrence', transactionController.cancelRecurrence);

/**
 * @swagger
 * /transactions/{id}/generated:
 *   get:
 *     summary: Obter transações geradas por uma transação recorrente
 *     tags: [Transactions]
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
 *         description: Transações geradas obtidas com sucesso
 */
router.get('/:id/generated', transactionController.getGeneratedTransactions);

export default router;
