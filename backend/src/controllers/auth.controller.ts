import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { sendSuccess, sendCreated } from '@/utils/response';
import verificationService from '@/services/verification.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    
    // Enviar código de verificação de email (não aguardar para não travar)
    verificationService.createAndSendCode(email, 'email_verification', name)
      .catch(err => console.error('Erro ao enviar código:', err));
    
    sendCreated(res, result, 'Usuário registrado com sucesso. Verifique seu email para ativar sua conta.');
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body;
    const isValid = await verificationService.verifyCode(email, code, 'email_verification');
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido ou expirado',
      });
    }
    
    // Marcar email como verificado
    await authService.verifyEmail(email);
    
    sendSuccess(res, null, 'Email verificado com sucesso');
  } catch (error) {
    next(error);
  }
};

export const resendVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await authService.findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }
    
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email já verificado',
      });
    }
    
    // Enviar código (não aguardar para não travar)
    verificationService.createAndSendCode(email, 'email_verification', user.name)
      .catch(err => console.error('Erro ao enviar código:', err));
    
    sendSuccess(res, null, 'Código de verificação reenviado');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await authService.findUserByEmail(email);
    
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      sendSuccess(res, null, 'Se o email existir, você receberá um código de recuperação');
      return;
    }
    
    // Enviar código (não aguardar para não travar)
    verificationService.createAndSendCode(email, 'password_reset', user.name)
      .catch(err => console.error('Erro ao enviar código:', err));
    
    sendSuccess(res, null, 'Código de recuperação enviado para seu email');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code, newPassword } = req.body;
    
    const isValid = await verificationService.verifyCode(email, code, 'password_reset');
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido ou expirado',
      });
    }
    
    await authService.resetPassword(email, newPassword);
    
    sendSuccess(res, null, 'Senha redefinida com sucesso');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, result, 'Login realizado com sucesso');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, result, 'Token renovado com sucesso');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    sendSuccess(res, null, 'Logout realizado com sucesso');
  } catch (error) {
    next(error);
  }
};
