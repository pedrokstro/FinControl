import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { VerificationCode, VerificationCodeType } from '../entities/VerificationCode';
import { resendService } from './resend.service';

class VerificationService {
  private repository: Repository<VerificationCode>;

  constructor() {
    this.repository = AppDataSource.getRepository(VerificationCode);
  }

  /**
   * Gerar código aleatório de 6 dígitos
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Criar e enviar código de verificação
   */
  async createAndSendCode(
    email: string,
    type: VerificationCodeType,
    userName: string
  ): Promise<void> {
    // Invalidar códigos anteriores do mesmo tipo para este email
    await this.repository.update(
      { email, type, isUsed: false },
      { isUsed: true }
    );

    // Gerar novo código
    const code = this.generateCode();
    
    // Calcular expiração (15 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Salvar no banco
    const verificationCode = this.repository.create({
      email,
      code,
      type,
      expiresAt,
    });

    await this.repository.save(verificationCode);

    // Logar código no console (desenvolvimento)
    console.log('\n===========================================');
    console.log('📧 CÓDIGO DE VERIFICAÇÃO');
    console.log('===========================================');
    console.log(`Tipo: ${type}`);
    console.log(`Email: ${email}`);
    console.log(`Código: ${code}`);
    console.log(`Expira em: ${expiresAt.toLocaleString('pt-BR')}`);
    console.log('===========================================\n');

    // Tentar enviar email (não bloquear se falhar)
    try {
      if (type === 'email_verification') {
        await resendService.sendVerificationEmail(email, code);
      } else if (type === 'password_reset') {
        await resendService.sendPasswordResetEmail(email, code);
      }
      console.log('✅ Email enviado com sucesso via Resend!');
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      console.log('⚠️  Email não enviado (modo desenvolvimento - use o código acima)');
    }
  }

  /**
   * Verificar código
   */
  async verifyCode(
    email: string,
    code: string,
    type: VerificationCodeType
  ): Promise<boolean> {
    const verificationCode = await this.repository.findOne({
      where: { email, code, type },
      order: { createdAt: 'DESC' },
    });

    if (!verificationCode) {
      return false;
    }

    // Verificar se o código é válido
    if (!verificationCode.isValid()) {
      return false;
    }

    // Marcar como usado
    verificationCode.isUsed = true;
    await this.repository.save(verificationCode);

    return true;
  }

  /**
   * Limpar códigos expirados (executar periodicamente)
   */
  async cleanExpiredCodes(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}

export default new VerificationService();
