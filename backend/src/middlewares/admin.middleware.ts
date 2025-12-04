import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';

/**
 * Middleware para verificar se o usuário é administrador
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar se o usuário está autenticado
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      });
    }

    // Buscar usuário no banco
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.user.userId },
      select: ['id', 'email', 'name', 'isAdmin', 'isActive'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo',
      });
    }

    // Verificar se é administrador
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.',
      });
    }

    // Adicionar informações do admin ao request
    (req.user as any).isAdmin = true;
    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar permissões de administrador',
    });
  }
};
