import { Router } from 'express';
import { budgetController } from '@/controllers/budget.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// Todas as rotas de orçamento requerem autenticação
router.use(authenticate);

router.get('/', budgetController.getAll);
router.post('/', budgetController.save);
router.delete('/:categoryId', budgetController.delete);

export default router;
