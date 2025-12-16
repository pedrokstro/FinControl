import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required().messages({
    'string.empty': 'Tipo é obrigatório',
    'any.only': 'Tipo deve ser "income" ou "expense"',
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Valor deve ser um número',
    'number.positive': 'Valor deve ser positivo',
    'any.required': 'Valor é obrigatório',
  }),
  description: Joi.string().min(3).max(500).required().messages({
    'string.empty': 'Descrição é obrigatória',
    'string.min': 'Descrição deve ter no mínimo 3 caracteres',
    'string.max': 'Descrição deve ter no máximo 500 caracteres',
  }),
  date: Joi.date().iso().required().messages({
    'date.base': 'Data inválida',
    'any.required': 'Data é obrigatória',
  }),
  categoryId: Joi.string().uuid().required().messages({
    'string.empty': 'Categoria é obrigatória',
    'string.guid': 'ID da categoria inválido',
  }),
  // Campos de recorrência
  isRecurring: Joi.boolean().optional().default(false),
  recurrenceType: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').when('isRecurring', {
    is: true,
    then: Joi.required().messages({
      'any.required': 'Tipo de recorrência é obrigatório quando a transação é recorrente',
    }),
    otherwise: Joi.optional(),
  }),
  recurrenceEndDate: Joi.date().iso().optional().messages({
    'date.base': 'Data final da recorrência inválida',
  }),
  recurrenceMonths: Joi.number()
    .integer()
    .min(1)
    .max(60)
    .when('isRecurring', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.optional(),
    }),
  // Novos campos para sistema de parcelas
  totalInstallments: Joi.number()
    .integer()
    .min(2)
    .max(360)
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Número de parcelas deve ser um número',
      'number.integer': 'Número de parcelas deve ser inteiro',
      'number.min': 'Mínimo de 2 parcelas',
      'number.max': 'Máximo de 360 parcelas',
    }),
});

export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').optional().messages({
    'any.only': 'Tipo deve ser "income" ou "expense"',
  }),
  amount: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'Valor deve ser um número',
    'number.positive': 'Valor deve ser positivo',
  }),
  description: Joi.string().min(3).max(500).optional().messages({
    'string.min': 'Descrição deve ter no mínimo 3 caracteres',
    'string.max': 'Descrição deve ter no máximo 500 caracteres',
  }),
  date: Joi.date().iso().optional().messages({
    'date.base': 'Data inválida',
  }),
  categoryId: Joi.string().uuid().optional().messages({
    'string.guid': 'ID da categoria inválido',
  }),
});

export const filterTransactionsSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).optional(),
  year: Joi.number().integer().min(2000).max(2100).optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  categoryId: Joi.string().uuid().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('date', 'amount', 'createdAt').default('date'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
