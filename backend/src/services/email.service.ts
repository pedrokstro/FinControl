import nodemailer from 'nodemailer';
import { config } from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Configurar Nodemailer com Gmail
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    console.log('📧 [EmailService] Inicializando...');
    console.log('📧 [EmailService] GMAIL_USER configurado:', gmailUser ? 'SIM' : 'NÃO');
    console.log('📧 [EmailService] GMAIL_APP_PASSWORD configurado:', gmailPass ? 'SIM (caracteres: ' + gmailPass.length + ')' : 'NÃO');

    if (gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        // Aumentar o timeout para evitar erro de conexão em servidores lentos
        connectionTimeout: 10000,
        greetingTimeout: 10000,
      });
      console.log('✅ Nodemailer configurado via SMTP (smtp.gmail.com:465)');
    } else {
      console.warn('⚠️  GMAIL_USER ou GMAIL_APP_PASSWORD não configuradas no process.env. Emails não serão enviados.');
    }
  }

  /**
   * Enviar email genérico
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.transporter) {
      console.warn('⚠️  Email não enviado (Nodemailer não configurado):', options.subject);
      return;
    }

    try {
      const fromEmail = process.env.EMAIL_FROM || process.env.GMAIL_USER || 'noreply@fincontrol.com';

      console.log('📧 Enviando email de:', fromEmail, 'para:', options.to);

      const info = await this.transporter.sendMail({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log('✅ Email enviado com sucesso! ID:', info.messageId);
    } catch (error: any) {
      console.error('❌ Erro detalhado do SMTP/Nodemailer:', error);
      // Propaga a mensagem real para facilitar o diagnóstico
      throw new Error(error.message || 'Erro ao enviar email');
    }
  }

  /**
   * Enviar código de verificação de email
   */
  async sendVerificationCode(email: string, code: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
          }
          .code-box {
            background-color: #fff;
            border: 2px dashed #3b82f6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💰 FinControl</div>
          </div>
          
          <h2>Olá, ${name}!</h2>
          
          <p>Bem-vindo ao FinControl! Para completar seu cadastro, por favor verifique seu email usando o código abaixo:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p><strong>Este código expira em 15 minutos.</strong></p>
          
          <p>Se você não solicitou este código, por favor ignore este email.</p>
          
          <div class="footer">
            <p>© 2024 FinControl - Controle Financeiro Inteligente</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá, ${name}!
      
      Bem-vindo ao FinControl! Para completar seu cadastro, use o código: ${code}
      
      Este código expira em 15 minutos.
      
      Se você não solicitou este código, ignore este email.
    `;

    await this.sendEmail({
      to: email,
      subject: '🔐 Código de Verificação - FinControl',
      html,
      text,
    });
  }

  /**
   * Enviar código de recuperação de senha
   */
  async sendPasswordResetCode(email: string, code: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
          }
          .code-box {
            background-color: #fff;
            border: 2px dashed #ef4444;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #ef4444;
            letter-spacing: 8px;
          }
          .warning {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💰 FinControl</div>
          </div>
          
          <h2>Olá, ${name}!</h2>
          
          <p>Recebemos uma solicitação para redefinir a senha da sua conta. Use o código abaixo para continuar:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p><strong>Este código expira em 15 minutos.</strong></p>
          
          <div class="warning">
            <strong>⚠️ Atenção:</strong> Se você não solicitou a redefinição de senha, ignore este email e sua senha permanecerá inalterada.
          </div>
          
          <div class="footer">
            <p>© 2024 FinControl - Controle Financeiro Inteligente</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá, ${name}!
      
      Recebemos uma solicitação para redefinir sua senha. Use o código: ${code}
      
      Este código expira em 15 minutos.
      
      Se você não solicitou isto, ignore este email.
    `;

    await this.sendEmail({
      to: email,
      subject: '🔐 Código de Recuperação de Senha - FinControl',
      html,
      text,
    });
  }

  /**
   * Enviar código de alteração de email
   */
  async sendEmailChangeCode(email: string, code: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
          }
          .code-box {
            background-color: #fff;
            border: 2px dashed #f59e0b;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #f59e0b;
            letter-spacing: 8px;
          }
          .warning {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💰 FinControl</div>
          </div>
          
          <h2>Olá, ${name}!</h2>
          
          <p>Recebemos uma solicitação para alterar o email da sua conta. Para confirmar esta alteração, use o código abaixo:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p><strong>Este código expira em 15 minutos.</strong></p>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este código confirma a alteração do seu email. Se você não solicitou esta mudança, ignore este email e entre em contato conosco imediatamente.
          </div>
          
          <p>Após a confirmação, você precisará usar o novo email para fazer login.</p>
          
          <div class="footer">
            <p>© 2024 FinControl - Controle Financeiro Inteligente</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá, ${name}!
      
      Recebemos uma solicitação para alterar o email da sua conta. Use o código: ${code}
      
      Este código expira em 15 minutos.
      
      Se você não solicitou isto, ignore este email e entre em contato conosco.
    `;

    await this.sendEmail({
      to: email,
      subject: '📧 Código de Alteração de Email - FinControl',
      html,
      text,
    });
  }

  /**
   * Enviar código de alteração de senha (usuário logado)
   */
  async sendPasswordChangeCode(email: string, code: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
          }
          .code-box {
            background-color: #fff;
            border: 2px dashed #8b5cf6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #8b5cf6;
            letter-spacing: 8px;
          }
          .warning {
            background-color: #faf5ff;
            border-left: 4px solid #8b5cf6;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💰 FinControl</div>
          </div>
          
          <h2>Olá, ${name}!</h2>
          
          <p>Recebemos uma solicitação para alterar a senha da sua conta. Para confirmar esta alteração, use o código abaixo:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p><strong>Este código expira em 15 minutos.</strong></p>
          
          <div class="warning">
            <strong>🔒 Segurança:</strong> Se você não solicitou esta alteração, ignore este email. Sua senha permanecerá inalterada.
          </div>
          
          <p>Por motivos de segurança, solicitamos este código para confirmar que é realmente você fazendo a alteração.</p>
          
          <div class="footer">
            <p>© 2024 FinControl - Controle Financeiro Inteligente</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá, ${name}!
      
      Recebemos uma solicitação para alterar a senha da sua conta. Use o código: ${code}
      
      Este código expira em 15 minutos.
      
      Se você não solicitou isto, ignore este email.
    `;

    await this.sendEmail({
      to: email,
      subject: '🔒 Código de Alteração de Senha - FinControl',
      html,
      text,
    });
  }
}

export default new EmailService();
