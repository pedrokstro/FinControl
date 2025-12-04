import { Router } from 'express';
import * as userController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';
import { updateProfileSchema, changePasswordSchema } from '@/validators/user.validator';
import { uploadAvatar } from '@/middlewares/upload.middleware';

const router = Router();

// Todas as rotas de usuário requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obter perfil do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 */
router.get('/me', userController.getProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
router.put('/me', validate(updateProfileSchema), userController.updateProfile);

/**
 * @swagger
 * /users/me/password:
 *   put:
 *     summary: Alterar senha do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 */
router.put('/me/password', validate(changePasswordSchema), userController.changePassword);

/**
 * @swagger
 * /users/me/avatar:
 *   post:
 *     summary: Upload de avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar atualizado com sucesso
 */
router.post('/me/avatar', uploadAvatar, userController.uploadAvatar);

/**
 * @swagger
 * /users/me/email/request-change:
 *   post:
 *     summary: Solicitar alteração de email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Código enviado para o novo email
 */
router.post('/me/email/request-change', userController.requestEmailChange);

/**
 * @swagger
 * /users/me/email/confirm-change:
 *   post:
 *     summary: Confirmar alteração de email com código
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email alterado com sucesso
 */
router.post('/me/email/confirm-change', userController.confirmEmailChange);

/**
 * @swagger
 * /users/me/password/request-change:
 *   post:
 *     summary: Solicitar alteração de senha (envia código)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Código enviado para o email
 */
router.post('/me/password/request-change', userController.requestPasswordChange);

/**
 * @swagger
 * /users/me/password/confirm-change:
 *   post:
 *     summary: Confirmar alteração de senha com código
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 */
router.post('/me/password/confirm-change', userController.confirmPasswordChange);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Excluir conta do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Senha atual para confirmar exclusão
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso
 *       400:
 *         description: Senha incorreta
 */
router.delete('/me', userController.deleteAccount);

export default router;
