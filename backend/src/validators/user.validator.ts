import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 255 caracteres',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email inválido',
  }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Senha atual é obrigatória',
  }),
  newPassword: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'Nova senha é obrigatória',
    'string.min': 'Nova senha deve ter no mínimo 6 caracteres',
    'string.max': 'Nova senha deve ter no máximo 100 caracteres',
  }),
});
