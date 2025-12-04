import Joi from 'joi';

export const upsertGoalSchema = Joi.object({
  targetAmount: Joi.number().positive().required().messages({
    'number.base': 'O valor da meta deve ser um número',
    'number.positive': 'O valor da meta deve ser positivo',
    'any.required': 'O valor da meta é obrigatório',
  }),
  month: Joi.number().integer().min(1).max(12).required().messages({
    'number.base': 'O mês deve ser um número',
    'number.integer': 'O mês deve ser um número inteiro',
    'number.min': 'O mês deve ser entre 1 e 12',
    'number.max': 'O mês deve ser entre 1 e 12',
    'any.required': 'O mês é obrigatório',
  }),
  year: Joi.number().integer().min(2000).max(2100).required().messages({
    'number.base': 'O ano deve ser um número',
    'number.integer': 'O ano deve ser um número inteiro',
    'number.min': 'O ano deve ser maior ou igual a 2000',
    'number.max': 'O ano deve ser menor ou igual a 2100',
    'any.required': 'O ano é obrigatório',
  }),
  description: Joi.string().max(500).optional().allow('', null).messages({
    'string.max': 'A descrição deve ter no máximo 500 caracteres',
  }),
});
