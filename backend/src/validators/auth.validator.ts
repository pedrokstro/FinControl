import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 255 caracteres',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'string.max': 'Senha deve ter no máximo 100 caracteres',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Senha é obrigatória',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token é obrigatório',
  }),
});

export const oauthLoginSchema = Joi.object({
  accessToken: Joi.string().required().messages({
    'string.empty': 'Token do Supabase é obrigatório',
  }),
});
