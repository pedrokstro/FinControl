import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as controller from '../controllers/userPreference.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Obter todas as preferências
router.get('/', controller.getPreferences);

// Obter uma preferência específica
router.get('/:key', controller.getPreference);

// Definir múltiplas preferências
router.post('/', controller.setPreferences);

// Definir uma preferência específica
router.put('/:key', controller.setPreference);

// Excluir uma preferência específica
router.delete('/:key', controller.deletePreference);

// Excluir todas as preferências
router.delete('/', controller.deleteAllPreferences);

export default router;
