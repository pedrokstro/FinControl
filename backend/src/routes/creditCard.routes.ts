import { Router } from 'express';
import * as creditCardController from '@/controllers/creditCard.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';
import { createCreditCardSchema, updateCreditCardSchema } from '@/validators/creditCard.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(createCreditCardSchema), creditCardController.create);
router.get('/', creditCardController.findAll);
router.get('/:id', creditCardController.findById);
router.put('/:id', validate(updateCreditCardSchema), creditCardController.update);
router.delete('/:id', creditCardController.remove);

export default router;
