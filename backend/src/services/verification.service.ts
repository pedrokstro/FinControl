import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { VerificationCode, VerificationCodeType } from '../entities/VerificationCode';
import emailService from './email.service';

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
      console.log(`📧 [VERIFICATION] Tentando enviar email do tipo: ${type}`);
      console.log(`📧 [VERIFICATION] Email destino: ${email}`);
      console.log(`📧 [VERIFICATION] Nome do usuário: ${userName}`);
      
      if (type === 'email_verification') {
        await emailService.sendVerificationCode(email, code, userName);
      } else if (type === 'password_reset') {
        await emailService.sendPasswordResetCode(email, code, userName);
      } else if (type === 'password_change') {
        console.log(`🔑 [VERIFICATION] Chamando sendPasswordChangeCode...`);
        await emailService.sendPasswordChangeCode(email, code, userName);
        console.log(`✅ [VERIFICATION] sendPasswordChangeCode executado com sucesso`);
      } else if (type === 'email_change') {
        await emailService.sendEmailChangeCode(email, code, userName);
      }
      console.log('✅ Email enviado com sucesso via Nodemailer!');
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      console.error('❌ Stack trace:', (error as Error).stack);
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
      where: { email, code, type, isUsed: false }, // Adicionar filtro para códigos não usados
      order: { createdAt: 'DESC' },
    });

    if (!verificationCode) {
      console.log('❌ Código não encontrado ou já foi usado');
      return false;
    }

    // Verificar se o código está expirado
    if (new Date() >= verificationCode.expiresAt) {
      console.log('❌ Código expirado');
      return false;
    }

    // Marcar como usado IMEDIATAMENTE para evitar uso simultâneo
    verificationCode.isUsed = true;
    await this.repository.save(verificationCode);
    
    console.log('✅ Código validado e marcado como usado');
    return true;
  }

  /**
   * Invalidar código manualmente (marcar como usado)
   */
  async invalidateCode(
    email: string,
    code: string,
    type: VerificationCodeType
  ): Promise<void> {
    await this.repository.update(
      { email, code, type, isUsed: false },
      { isUsed: true }
    );
    console.log(`🔒 Código invalidado manualmente: ${code}`);
  }

  /**
   * Invalidar todos os códigos de um usuário por tipo
   */
  async invalidateAllCodesByType(
    email: string,
    type: VerificationCodeType
  ): Promise<void> {
    await this.repository.update(
      { email, type, isUsed: false },
      { isUsed: true }
    );
    console.log(`🔒 Todos os códigos do tipo ${type} invalidados para: ${email}`);
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
