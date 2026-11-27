import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class ResendService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  RESEND_API_KEY não configurada. Emails não serão enviados.');
      this.resend = new Resend('dummy-key');
      this.fromEmail = 'onboarding@resend.dev';
      return;
    }

    this.resend = new Resend(apiKey);
    // Use o domínio verificado ou o padrão do Resend
    this.fromEmail = process.env.EMAIL_FROM || 'FinControl <onboarding@resend.dev>';
  }

  /**
   * Enviar email usando Resend
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        console.error('❌ Erro ao enviar email via Resend:', error);
        throw new Error(`Falha ao enviar email: ${error.message}`);
      }

      console.log('✅ Email enviado com sucesso via Resend:', data?.id);
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw error;
    }
  }

  /**
   * Enviar email de verificação
   */
  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo ao FinControl!</h1>
            </div>
            <div class="content">
              <p>Olá!</p>
              <p>Obrigado por se cadastrar no <strong>FinControl</strong>. Para ativar sua conta, use o código de verificação abaixo:</p>
              <div class="code">${code}</div>
              <p>Este código expira em <strong>15 minutos</strong>.</p>
              <p>Se você não solicitou este cadastro, ignore este email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FinControl - Controle Financeiro Inteligente</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Código de Verificação - FinControl',
      html,
    });
  }

  /**
   * Enviar email de recuperação de senha
   */
  async sendPasswordResetEmail(email: string, code: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { background: white; border: 2px dashed #f5576c; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperação de Senha</h1>
            </div>
            <div class="content">
              <p>Olá!</p>
              <p>Você solicitou a recuperação de senha da sua conta no <strong>FinControl</strong>. Use o código abaixo para redefinir sua senha:</p>
              <div class="code">${code}</div>
              <p>Este código expira em <strong>15 minutos</strong>.</p>
              <p>Se você não solicitou esta recuperação, ignore este email e sua senha permanecerá inalterada.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FinControl - Controle Financeiro Inteligente</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Recuperação de Senha - FinControl',
      html,
    });
  }
}

export const resendService = new ResendService();
