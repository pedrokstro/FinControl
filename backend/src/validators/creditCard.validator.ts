import Joi from 'joi';

export const createCreditCardSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  limit: Joi.number().min(0).optional().default(0),
  closingDay: Joi.number().integer().min(1).max(31).optional().default(1),
  dueDay: Joi.number().integer().min(1).max(31).optional().default(10),
  brand: Joi.string().optional().default('Visa'),
});

export const updateCreditCardSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  limit: Joi.number().min(0),
  closingDay: Joi.number().integer().min(1).max(31),
  dueDay: Joi.number().integer().min(1).max(31),
  brand: Joi.string(),
});
