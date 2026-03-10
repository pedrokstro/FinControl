import { Request, Response, NextFunction } from 'express';
import { CreditCardService } from '@/services/creditCard.service';
import { sendSuccess, sendCreated } from '@/utils/response';

const creditCardService = new CreditCardService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const card = await creditCardService.create(userId, req.body);
    sendCreated(res, card, 'Cartão de crédito criado com sucesso');
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const cards = await creditCardService.findAll(userId);
    sendSuccess(res, cards, 'Cartões de crédito obtidos com sucesso');
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const card = await creditCardService.findById(id, userId);
    sendSuccess(res, card, 'Cartão de crédito obtido com sucesso');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const card = await creditCardService.update(id, userId, req.body);
    sendSuccess(res, card, 'Cartão de crédito atualizado com sucesso');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    await creditCardService.delete(id, userId);
    sendSuccess(res, null, 'Cartão de crédito deletado com sucesso');
  } catch (error) {
    next(error);
  }
};
