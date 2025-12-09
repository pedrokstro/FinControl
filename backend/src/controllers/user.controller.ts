import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';
import { sendSuccess } from '@/utils/response';
import verificationService from '@/services/verification.service';
import { NotificationService } from '@/services/notification.service';

const userService = new UserService();
const notificationService = new NotificationService();

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const user = await userService.getProfile(userId);
    sendSuccess(res, user, 'Perfil obtido com sucesso');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { name, email } = req.body;
    const user = await userService.updateProfile(userId, { name, email });
    sendSuccess(res, user, 'Perfil atualizado com sucesso');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(userId, currentPassword, newPassword);
    sendSuccess(res, null, 'Senha alterada com sucesso');
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    if (!req.file) {
      sendSuccess(res, null, 'Nenhum arquivo enviado', 400);
      return;
    }
    
    const user = await userService.uploadAvatar(userId, req.file);
    sendSuccess(res, user, 'Avatar atualizado com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Solicitar alteração de email (envia código)
 */
export const requestEmailChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { newEmail } = req.body;
    
    // Buscar usuário
    const user = await userService.getProfile(userId);
    
    // Enviar código para o NOVO email
    await verificationService.createAndSendCode(
      newEmail,
      'email_change',
      user.name || 'Usuário'
    );
    
    sendSuccess(res, null, 'Código de verificação enviado para o novo email');
  } catch (error) {
    next(error);
  }
};

/**
 * Confirmar alteração de email (valida código)
 */
export const confirmEmailChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { newEmail, code } = req.body;
    
    // Verificar código
    const isValid = await verificationService.verifyCode(newEmail, code, 'email_change');
    
    if (!isValid) {
      sendSuccess(res, null, 'Código inválido ou expirado', 400);
      return;
    }
    
    // Atualizar email
    const user = await userService.updateProfile(userId, { email: newEmail });
    
    sendSuccess(res, user, 'Email alterado com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Solicitar alteração de senha (envia código)
 */
export const requestPasswordChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    // Buscar usuário
    const user = await userService.getProfile(userId);
    
    // Enviar código para o email do usuário
    await verificationService.createAndSendCode(
      user.email || '',
      'password_change',
      user.name || 'Usuário'
    );
    
    sendSuccess(res, null, 'Código de verificação enviado para seu email');
  } catch (error) {
    next(error);
  }
};

/**
 * Confirmar alteração de senha (valida código)
 */
export const confirmPasswordChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword, code } = req.body;
    
    // Buscar usuário
    const user = await userService.getProfile(userId);
    
    // Verificar código
    const isValid = await verificationService.verifyCode(user.email || '', code, 'password_change');
    
    if (!isValid) {
      sendSuccess(res, null, 'Código inválido ou expirado', 400);
      return;
    }
    
    // Alterar senha
    await userService.changePassword(userId, currentPassword, newPassword);
    
    // Criar notificação de sucesso
    await notificationService.create(
      userId,
      '🔒 Senha Alterada',
      'Sua senha foi alterada com sucesso. Se você não fez essa alteração, entre em contato com o suporte imediatamente.',
      'success',
      'system'
    );
    
    sendSuccess(res, null, 'Senha alterada com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Excluir conta do usuário
 */
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { password } = req.body;
    
    await userService.deleteAccount(userId, password);
    
    sendSuccess(res, null, 'Conta excluída com sucesso');
  } catch (error) {
    next(error);
  }
};
