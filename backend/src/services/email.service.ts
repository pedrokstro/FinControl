import nodemailer from 'nodemailer';
import { resendService } from './resend.service';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Configurar Nodemailer como fallback ou secundário
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const resendKey = process.env.RESEND_API_KEY;

    console.log('📧 [EmailService] Inicializando...');
    console.log('📧 [EmailService] RESEND_API_KEY configurado:', resendKey ? 'SIM' : 'NÃO');
    console.log('📧 [EmailService] GMAIL_USER configurado:', gmailUser ? 'SIM' : 'NÃO');

    if (gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
      });
      console.log('✅ Nodemailer (Gmail) pronto para uso como fallback.');
    }
  }

  /**
   * Enviar email (Tenta Resend primeiro, depois Nodemailer)
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    const resendKey = process.env.RESEND_API_KEY;

    // 1. Tentar via Resend se houver API Key
    if (resendKey) {
      try {
        console.log('🚀 [EmailService] Tentando enviar via Resend...');
        await resendService.sendEmail({
          to: options.to,
          subject: options.subject,
          html: options.html
        });
        console.log('✅ [EmailService] Email enviado com sucesso via Resend');
        return;
      } catch (error: any) {
        console.error('❌ [EmailService] Falha no Resend:', error.message);
        if (!this.transporter) throw error;
        console.log('🔄 [EmailService] Tentando fallback para Nodemailer...');
      }
    }

    // 2. Fallback para Nodemailer
    if (!this.transporter) {
      throw new Error('Serviço de email não configurado (Faltam chaves do Resend ou Gmail)');
    }

    try {
      const fromEmail = process.env.EMAIL_FROM || process.env.GMAIL_USER || 'noreply@fincontrol.com';
      console.log('📧 [EmailService] Enviando via Nodemailer de:', fromEmail);

      const info = await this.transporter.sendMail({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log('✅ [EmailService] Email enviado via Nodemailer! ID:', info.messageId);
    } catch (error: any) {
      console.error('❌ [EmailService] Falha final no envio:', error.message);
      throw new Error(error.message || 'Erro ao enviar email');
    }
  }

  /**
   * Helper para gerar o template base de email
   */
  private getBaseTemplate(title: string, content: string, footerNote: string = ''): string {
    const logoUrl = 'https://fincontrol.vercel.app/logo-full.svg';
    const primaryColor = '#0284c7';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
          .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; padding-top: 40px; }
          .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
          .header { background-color: #000000; padding: 32px; text-align: center; }
          .logo-container { background-color: #ffffff; display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .content { padding: 40px 32px; text-align: center; }
          .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; margin-top: 0; }
          .text { font-size: 16px; color: #4b5563; margin-bottom: 24px; line-height: 1.6; }
          .code-container { background-color: #f8fafc; border: 2px dashed ${primaryColor}; border-radius: 12px; padding: 24px; margin: 32px 0; }
          .code { font-size: 36px; font-weight: 800; color: ${primaryColor}; letter-spacing: 8px; font-family: 'Courier New', monospace; }
          .footer { padding: 32px; text-align: center; font-size: 14px; color: #6b7280; }
          .expiry { font-size: 14px; font-weight: 600; color: #ef4444; margin-top: 8px; }
          .divider { border-top: 1px solid #e5e7eb; margin: 32px 0; }
          .social-link { color: ${primaryColor}; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="main">
            <div class="header">
              <div class="logo-container">
                <img src="https://raw.githubusercontent.com/lucide-react/lucide/main/icons/wallet.png" width="28" height="28" style="display:block; margin: 0 auto; filter: invert(34%) sepia(91%) saturate(2321%) hue-rotate(182deg) brightness(97%) contrast(100%);" alt="L">
              </div>
              <div style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">FinControl</div>
            </div>
            
            <div class="content">
              <h1 class="title">${title}</h1>
              ${content}
              <div class="divider"></div>
              <p style="font-size: 13px; color: #9ca3af;">${footerNote}</p>
            </div>

            <div class="footer">
              <p>© ${new Date().getFullYear()} FinControl - Controle Financeiro Inteligente</p>
              <p>Gerencie suas finanças com inteligência e simplicidade.</p>
              <div style="margin-top: 16px;">
                <a href="https://fincontrolefinanceiro.com" class="social-link">Acessar Plataforma</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Enviar código de verificação de email
   */
  async sendVerificationCode(email: string, code: string, name: string): Promise<void> {
    const html = this.getBaseTemplate(
      `Olá, ${name}! 👋`,
      `
      <p class="text">Bem-vindo ao <strong>FinControl</strong>! Estamos muito felizes em ter você conosco. Para ativar sua conta e começar sua jornada financeira, use o código abaixo:</p>
      <div class="code-container">
        <div class="code">${code}</div>
        <p class="expiry">Este código expira em 15 minutos</p>
      </div>
      <p class="text">Após inserir este código, você terá acesso total ao seu dashboard e ferramentas exclusivas.</p>
      `,
      'Se você não criou uma conta no FinControl, pode ignorar este email com segurança.'
    );

    const text = `Olá, ${name}! Bem-vindo ao FinControl! Código de ativação: ${code} (Válido por 15 min)`;

    await this.sendEmail({
      to: email,
      subject: '🔐 Ative sua conta no FinControl',
      html,
      text,
    });
  }

  /**
   * Enviar código de recuperação de senha
   */
  async sendPasswordResetCode(email: string, code: string, name: string): Promise<void> {
    const html = this.getBaseTemplate(
      'Recuperação de Senha 🔒',
      `
      <p class="text">Olá, ${name}. Recebemos uma solicitação para redefinir a senha da sua conta no <strong>FinControl</strong>.</p>
      <p class="text">Use o código de segurança abaixo para prosseguir com a alteração:</p>
      <div class="code-container" style="border-color: #ef4444;">
        <div class="code" style="color: #ef4444;">${code}</div>
        <p class="expiry">Este código expira em 15 minutos</p>
      </div>
      <p class="text" style="color: #ef4444; font-weight: 600;">⚠️ Se você não solicitou isso, mude sua senha atual imediatamente ou entre em contato com o suporte.</p>
      `,
      'Este é um email automático de segurança. Não responda a este remetente.'
    );

    const text = `Olá, ${name}. Código para redefinir senha: ${code} (Válido por 15 min)`;

    await this.sendEmail({
      to: email,
      subject: '🔑 Recuperação de senha - FinControl',
      html,
      text,
    });
  }

  /**
   * Enviar código de alteração de email
   */
  async sendEmailChangeCode(email: string, code: string, name: string): Promise<void> {
    const html = this.getBaseTemplate(
      'Alteração de Email 📧',
      `
      <p class="text">Olá, ${name}. Você solicitou a alteração do endereço de email da sua conta.</p>
      <p class="text">Para confirmar que este novo endereço é seu, use o código abaixo:</p>
      <div class="code-container" style="border-color: #f59e0b;">
        <div class="code" style="color: #f59e0b;">${code}</div>
        <p class="expiry">Este código expira em 15 minutos</p>
      </div>
      <p class="text">Sua conta só será atualizada após a inserção bem-sucedida deste código.</p>
      `,
      'Se você não solicitou esta mudança, ignore este email.'
    );

    const text = `Código para alteração de email: ${code} (Válido por 15 min)`;

    await this.sendEmail({
      to: email,
      subject: '📧 Confirmação de novo email - FinControl',
      html,
      text,
    });
  }

  /**
   * Enviar código de alteração de senha (usuário logado)
   */
  async sendPasswordChangeCode(email: string, code: string, name: string): Promise<void> {
    const html = this.getBaseTemplate(
      'Confirmação de Segurança 🛡️',
      `
      <p class="text">Olá, ${name}. Por motivos de segurança, precisamos confirmar sua identidade para realizar a alteração da sua senha.</p>
      <p class="text">Insira o código abaixo no campo solicitado:</p>
      <div class="code-container" style="border-color: #8b5cf6;">
        <div class="code" style="color: #8b5cf6;">${code}</div>
        <p class="expiry">Este código expira em 15 minutos</p>
      </div>
      `,
      'Proteja seus códigos de acesso. Nunca compartilhe este código com ninguém.'
    );

    const text = `Seu código de confirmação de segurança é: ${code}`;

    await this.sendEmail({
      to: email,
      subject: '🛡️ Confirmação de Segurança - FinControl',
      html,
      text,
    });
  }
}

export default new EmailService();
