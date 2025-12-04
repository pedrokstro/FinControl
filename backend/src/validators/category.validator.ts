import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Nome da categoria é obrigatório',
    'string.min': 'Nome deve ter no mínimo 2 caracteres',
    'string.max': 'Nome deve ter no máximo 255 caracteres',
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'string.empty': 'Tipo é obrigatório',
    'any.only': 'Tipo deve ser "income" ou "expense"',
  }),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required().messages({
    'string.empty': 'Cor é obrigatória',
    'string.pattern.base': 'Cor deve estar no formato hexadecimal (#RRGGBB)',
  }),
  icon: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Ícone é obrigatório',
    'string.min': 'Ícone deve ter no mínimo 2 caracteres',
    'string.max': 'Ícone deve ter no máximo 100 caracteres',
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(255).optional().messages({
    'string.min': 'Nome deve ter no mínimo 2 caracteres',
    'string.max': 'Nome deve ter no máximo 255 caracteres',
  }),
  type: Joi.string().valid('income', 'expense').optional().messages({
    'any.only': 'Tipo deve ser "income" ou "expense"',
  }),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().messages({
    'string.pattern.base': 'Cor deve estar no formato hexadecimal (#RRGGBB)',
  }),
  icon: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Ícone deve ter no mínimo 2 caracteres',
    'string.max': 'Ícone deve ter no máximo 100 caracteres',
  }),
});
