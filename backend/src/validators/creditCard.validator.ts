import Joi from 'joi';

export const createCreditCardSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  limit: Joi.number().required().positive(),
  closingDay: Joi.number().required().min(1).max(31),
  dueDay: Joi.number().required().min(1).max(31),
  brand: Joi.string().optional().default('Visa'),
});

export const updateCreditCardSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  limit: Joi.number().positive(),
  closingDay: Joi.number().min(1).max(31),
  dueDay: Joi.number().min(1).max(31),
  brand: Joi.string(),
});
