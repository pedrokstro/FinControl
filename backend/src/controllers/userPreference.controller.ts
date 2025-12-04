import { Request, Response, NextFunction } from 'express';
import { UserPreferenceService } from '../services/userPreference.service';
import { sendSuccess } from '../utils/response';

const service = new UserPreferenceService();

/**
 * Obter todas as preferências do usuário
 */
export const getPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const preferences = await service.getAll(userId);
    sendSuccess(res, preferences, 'Preferências obtidas com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Obter uma preferência específica
 */
export const getPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { key } = req.params;
    const value = await service.get(userId, key);
    sendSuccess(res, { key, value }, 'Preferência obtida com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Definir múltiplas preferências
 */
export const setPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const preferences = req.body;

    // Validar que é um objeto
    if (typeof preferences !== 'object' || Array.isArray(preferences)) {
      return res.status(400).json({
        success: false,
        message: 'Preferências devem ser um objeto',
      });
    }

    await service.setMany(userId, preferences);
    sendSuccess(res, null, 'Preferências salvas com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Definir uma preferência específica
 */
export const setPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        message: 'Valor da preferência é obrigatório',
      });
    }

    const preference = await service.set(userId, key, value);
    sendSuccess(res, preference, 'Preferência salva com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Excluir uma preferência específica
 */
export const deletePreference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { key } = req.params;
    await service.delete(userId, key);
    sendSuccess(res, null, 'Preferência excluída com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Excluir todas as preferências
 */
export const deleteAllPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    await service.deleteAll(userId);
    sendSuccess(res, null, 'Todas as preferências foram excluídas');
  } catch (error) {
    next(error);
  }
};
