import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '@/services/category.service';
import { sendSuccess, sendCreated } from '@/utils/response';

const categoryService = new CategoryService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { name, type, color, icon } = req.body;
    const category = await categoryService.create(userId, { name, type, color, icon });
    sendCreated(res, category, 'Categoria criada com sucesso');
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { type } = req.query;
    const categories = await categoryService.findAll(userId, type as any);
    sendSuccess(res, categories, 'Categorias obtidas com sucesso');
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const category = await categoryService.findById(id, userId);
    sendSuccess(res, category, 'Categoria obtida com sucesso');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body;
    const category = await categoryService.update(id, userId, data);
    sendSuccess(res, category, 'Categoria atualizada com sucesso');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    await categoryService.delete(id, userId);
    sendSuccess(res, null, 'Categoria deletada com sucesso');
  } catch (error) {
    next(error);
  }
};
